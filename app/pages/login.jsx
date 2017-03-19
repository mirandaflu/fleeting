import React from 'react';
import { Link, withRouter } from 'react-router';

import GoogleButton from '../components/googlebutton.jsx';
import MessageBanner from '../components/messagebanner.jsx';

class Login extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			email: '',
			password: ''
		};
	}
	componentDidMount() {
		if (this.props.location.query.error == 'auth') {
			this.refs.messageBanner.showMessage('Error authenticating');
		}
	}
	render() {
		return (
			<div>
				<div style={{position:'fixed', top:0, left:'15vw', width:'70vw', textAlign:'center', paddingTop:'20vh'}}>
					<div className="eightpoint dark paper-text">Fleeting is a messaging app</div>
					<div className="eightpoint maroon paper-text">where you communicate with only photos</div>
					<div className="eightpoint sky paper-text">and you see only the most recent ones</div>
				</div>
				<div style={{position:'fixed', bottom:0, width:'100%', textAlign:'center', paddingBottom:'20vh'}}>
					<MessageBanner ref="messageBanner" />
					<GoogleButton preposition="in" />
				</div>
			</div>
		);
	}
}

module.exports = withRouter(Login);
