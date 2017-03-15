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
			<div style={{textAlign:'center', paddingTop:'30vh'}}>
				<MessageBanner ref="messageBanner" />
				<GoogleButton preposition="in" />
			</div>
		);
	}
}

module.exports = withRouter(Login);
