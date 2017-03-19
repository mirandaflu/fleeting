import React from 'react';
import Modal from 'react-modal';
import { Link, withRouter } from 'react-router';

import ReactS3Uploader from 'react-s3-uploader';
import axios from 'axios';

class PhotoTaker extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			photoTaken: false
		}
	}
	startViewfinder() {
		if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
			navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
				let video = this.refs.video;
				this._stream = stream;
				video.src = window.URL.createObjectURL(stream);
				video.play();
				let canvas = this.refs.canvas;
				video.addEventListener('playing', () => {
					setTimeout(function () {
						canvas.width = video.videoWidth;
						canvas.height = video.videoHeight;
					}, 500);
				});
			});
		}
	}
	snapPhoto() {
		let canvas = this.refs.canvas,
			context = canvas.getContext('2d'),
			video = this.refs.video;
		context.drawImage(video, 0, 0, 640, 480);
		this._stream.getTracks().forEach(track => { track.stop(); });
		this.setState({ photoTaken: true });
	}
	clearPhoto() {
		this.setState({ photoTaken: false });
		this.startViewfinder();
	}
	uploadPhoto() {
		let canvas = this.refs.canvas,
			fileType = 'image/jpeg';
		canvas.toBlob(blob => {
			axios.get('/s3/sign', {params: {
				objectName: '.jpg',
				contentType: fileType
			}}).then(result => {
				let signedUrl = result.data.signedUrl,
					options = {
						headers: {
							'Content-Type': fileType
						}
					};
				return axios.put(signedUrl, blob, options);
			}).then(result => {
				let query = {
					user: feathers_app.get('user')._id,
					group: this.props.params.group
				};
				feathers_app.service('images').find({query:query})
					.then(images => {
						let path = result.request.responseURL.split('?')[0];
						if (images.length == 0) {
							let image = {
								user: feathers_app.get('user')._id,
								group: this.props.params.group,
								path: path
							};
							feathers_app.service('images').create(image).then(result => {
								this.props.router.push('/group/'+this.props.params.group);
							}).catch(console.error);
						}
						else {
							// TODO: delete old image from S3
							feathers_app.service('images').patch(images[0]._id, {
								path: path
							}).then(result => {
								this.props.router.push('/group/'+this.props.params.group);
							}).catch(console.error);	
						}
					}).catch(console.error);
			}).catch(console.error);
		});
	}
	componentDidMount() {
		this.startViewfinder();
	}
	componentWillUnmount() {
		this._stream.getTracks().forEach(track => { track.stop(); });
	}
	render() {
		return (
			<Modal isOpen={true} contentLabel="phototaker">
				<Link to={'/group/'+this.props.params.group}
					className="pure-button"
					style={{float:'right'}}>
					<i className="fa fa-close" />
				</Link>

				Tap image to take a photo
				<video ref="video"
					onClick={this.snapPhoto.bind(this)}
					width="640" height="480" autoPlay
					style={{width:'100%', height:'auto',
					display:(this.state.photoTaken)?'none':'inherit'}} />

				<canvas ref="canvas"
					width="640" height="480"
					style={{width:'100%', height:'auto', 
					display:(this.state.photoTaken)?'inherit':'none'}} />

				{this.state.photoTaken &&
					<div>
						<button className="pure-button button-secondary" onClick={this.uploadPhoto.bind(this)}>Accept</button>
						<button className="pure-button button-error" onClick={this.clearPhoto.bind(this)}>Retake</button>
					</div>
				}

			</Modal>
		);
	}
}

module.exports = withRouter(PhotoTaker);
