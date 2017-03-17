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
			<div>
				{!this.state.active &&
					<button onClick={this.activate.bind(this)} className="pure-button">Invite Someone</button>
				}
				{this.state.active &&
					<div style={{minWidth:'300px'}}>
						<UserSelect
							multi={true}
							value={this.state.invitees}
							onChange={this.handleInviteesChange.bind(this)} />
						<button onClick={this.inviteSelected.bind(this)} className="pure-button button-secondary">Add</button>
						<button onClick={this.deactivate.bind(this)} className="pure-button">Cancel</button>
					</div>
				}
			</div>
		);
	}
}