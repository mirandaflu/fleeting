import React from 'react';
import { Link, withRouter } from 'react-router';

export default class Navbar extends React.Component {
	render() {
		let user = feathers_app.get('user');
		return (
			<div className="navbar-container">
				<div className="navbar paper withdarkshadow pure-menu pure-menu-horizontal">
					{!user && ['/login'].indexOf(this.props.path) == -1 &&
						<Link to="/login" className="pure-menu-heading pure-menu-link" style={{float:'right'}}>
							Sign in
						</Link>
					}
					{user &&
						<Link to="/account" className="pure-menu-heading pure-menu-link" style={{float:'right'}}>
							{user.username}&nbsp;<i className="fa fa-user" />
						</Link>
					}
					<Link to="/" className="pure-menu-heading pure-menu-link">Fleeting</Link>
				</div>
			</div>
		);
	}
}