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
	render() { return (
		<div>
			<MessageBanner ref="messageBanner" />

			<div style={{textAlign:'center'}}>
				<GoogleButton preposition="in" />
			</div>

		</div>
	); }
}

module.exports = withRouter(Login);
