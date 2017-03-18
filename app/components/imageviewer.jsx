import React from 'react'
import Modal from 'react-modal';
import { Link, withRouter } from 'react-router';

class ImageViewer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	componentDidMount() {
		feathers_app.service('images').get(this.props.params.image).then(image => {
			this.setState(image);
		});
	}
	render() {
		return (
			<Modal isOpen={true} contentLabel="imageviewer">
				<Link to={'/group/'+this.props.params.group}
					className="pure-button button-dark"
					style={{float:'right'}}>
					<i className="fa fa-close" />
				</Link>

				<img src={this.state.path} />

			</Modal>
		);
	}
}

module.exports = withRouter(ImageViewer);
