import React from 'react';

export default class Skeleton extends React.Component {
	componentWillUpdate() {
		window.scrollTo(0, 0);
	}
	render() { return (
		<div>
			<div></div>
			{this.props.children}
			<div></div>
		</div>
	); }
}
