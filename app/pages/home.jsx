import React from 'react';
import { Link } from 'react-router';

export default class Home extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			groups: ['a','b','c']
		}
	}
	render() {
		return (
			<div className="sky paper-text pure-g" style={{padding:'4pt'}}>
				{this.state.groups.map(group => {
					return (
						<div className="group pure-u-1-2 pure-u-sm-1-3 pure-u-md-1-4 pure-u-lg-1-5 pure-u-xl-1-6">
							<div className="square maroon" style={{border:'4pt solid #609099'}}>
								<div style={{padding:'8pt'}}>
									{group}
								</div>
							</div>
						</div>
					);
				})}
			</div>
		);
	}
}
