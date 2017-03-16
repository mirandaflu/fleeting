import React from 'react';

import PhotoTaker from '../components/phototaker.jsx';

export default class Group extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			group: {},
			images: []
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
	componentDidMount() {
		this.getGroup();
		this.getImages();
	}
	render() {
		return (
			<div>
				<h3>{this.state.group.name}</h3>
				{this.state.images && this.state.images.map(image => {
					return (
						<img src={image.path} />
					);
				})}
				{false && <PhotoTaker group={this.props.params.group} />}
			</div>
		);
	}
}