import React from 'react';

import Navbar from '../components/navbar.jsx';

export default class Skeleton extends React.Component {
	componentWillUpdate() {
		window.scrollTo(0, 0);
	}
	render() { return (
		<div style={{height:'100vh', width:'100vw', padding:0, margin:0}} className="paper">
			<Navbar path={this.props.location.pathname} />
			<div style={{padding:'8pt'}}>
				{this.props.children}
			</div>
		</div>
	); }
}
