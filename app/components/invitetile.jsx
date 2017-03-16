import React from 'react';
import Select from 'react-select';

import UserSelect from './userselect.jsx';

export default class InviteTile extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			active: false,
			invitees: []
		};
	}
	activate() { this.setState({ active: true }); }
	handleInviteesChange(invitees) {
		this.setState({ invitees: invitees });
	}
	inviteSelected() {
		let invitees = this.state.invitees;
		if (!invitees || invitees.length == 0) return;
		invitees.map(invitee => {
			if (this.props.members.indexOf(invitee.value) == -1) {
				feathers_app.service('groups').patch(this.props.group, {$push:{
					members: invitee.value
				}}).catch(console.error);
			}
		});
		this.deactivate();
	}
	deactivate() { this.setState({ active: false, invitees: [] }); }
	render() {
		return (
			<div className="pure-u-1-2 pure-u-sm-1-3 pure-u-md-1-4 pure-u-lg-1-5 pure-u-xl-1-6">
				{!this.state.active &&
					<button onClick={this.activate.bind(this)} className="pure-button">Invite Someone</button>
				}
				{this.state.active &&
					<div>
						<button onClick={this.deactivate.bind(this)}>Cancel</button>
						<UserSelect
							multi={true}
							value={this.state.invitees}
							onChange={this.handleInviteesChange.bind(this)} />
						<button onClick={this.inviteSelected.bind(this)}>Add</button>
					</div>
				}
			</div>
		);
	}
}