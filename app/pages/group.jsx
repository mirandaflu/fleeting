import React from 'react';

import InviteTile from '../components/invitetile.jsx';
import PhotoTaker from '../components/phototaker.jsx';

export default class Group extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			group: {
				admins: []
			},
			images: [],
			photoTakerOpen: false
		};
	}
	getGroup() {
		feathers_app.service('groups').get(this.props.params.group).then(result => {
			this.setState({ group: result });
		}).catch(console.error);
	}
	getImages() {
		feathers_app.service('images').find({query:{group:this.props.params.group}}).then(images => {
			this.setState({ images: images });
		}).catch(console.error);
	}
	openPhotoTaker() { this.setState({ photoTakerOpen: true }); }
	closePhotoTaker() { this.setState({ photoTakerOpen: false }); }
	componentDidMount() {
		this.getGroup();
		this.getImages();
	}
	render() {
		return (
			<div className="pure-g">
				<div className="pure-u-1 creamsicle">
					<h4 style={{margin:'4px 20px'}}>{this.state.group.name}</h4>
				</div>
				{this.state.images && this.state.images.map(image => {
					return (
						<div key={image._id} className="pure-u-1-2 pure-u-sm-1-3 pure-u-md-1-4 pure-u-lg-1-5 pure-u-xl-1-6">
							<img className="pure-img" src={image.path} />
						</div>
					);
				})}
				
				{this.state.group.admins.indexOf(feathers_app.get('user')._id) != -1 &&
					<InviteTile members={this.state.group.members} group={this.props.params.group} />
				}

				<button className="pure-button"
					onClick={this.openPhotoTaker.bind(this)}
					style={{position:'fixed', bottom:0, right:0}}>
					Update photo
				</button>

				{this.state.photoTakerOpen &&
					<PhotoTaker
						group={this.props.params.group}
						onFinished={this.closePhotoTaker.bind(this)} />
				}
			</div>
		);
	}
}