import React from 'react';
import { Link } from 'react-router';

export default class Logout extends React.Component {
	render() { return (
		<div>
			Logged out
			<br />
			<Link to="/login">Log in</Link>
		</div>
	); }
}
