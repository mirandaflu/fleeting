import React from 'react';
import { Link } from 'react-router';

import ReactS3Uploader from 'react-s3-uploader';
import axios from 'axios';

export default class PhotoTaker extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			photoTaken: false
		}
	}
	startViewfinder() {
		let video = this.refs.video;
		if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
			navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
				this._stream = stream;
				video.src = window.URL.createObjectURL(stream);
				video.play();
				let canvas = this.refs.canvas;
				video.addEventListener('playing', () => {
					setTimeout(function () {
						canvas.width = video.videoWidth;
						canvas.height = video.videoHeight;
						console.log("Stream dimensions: " + video.videoWidth + "x" + video.videoHeight);
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
				console.log(result);
				let image = {
					user: feathers_app.get('user')._id,
					group: this.props.group,
					path: result.request.responseURL.split('?')[0]
				};
				console.log(image);
				feathers_app.service('images').create(image).catch(console.error);
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
			<div style={{height:'100vh',width:'100vw'}}>

				<video ref="video"
					onClick={this.snapPhoto.bind(this)}
					width="640" height="480" autoPlay
					style={{width:'100vw', height:'100vh', display:(this.state.photoTaken)?'none':'inherit'}} />

				<canvas ref="canvas"
					width="640" height="480"
					style={{display:(this.state.photoTaken)?'inherit':'none'}} />

				{this.state.photoTaken &&
					<div>
						<button onClick={this.uploadPhoto.bind(this)}>Accept</button>
						<button onClick={this.clearPhoto.bind(this)}>Retake</button>
					</div>
				}

			</div>
		);
	}
}
