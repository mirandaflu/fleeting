import React from 'react';
import Modal from 'react-modal';
import { Link } from 'react-router';

import MessageBanner from '../components/messagebanner.jsx';

export default class Account extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			username: null,
			border: 'lightgreen',
			modalOpen: false
		};
	}
	explainUsername() { this.setState({ modalOpen: true }); }
	closeModal() { this.setState({ modalOpen: false }); }
	handleUsernameChange() {
		this.setState({
			username: this.refs.username.value,
			border: 'orange'
		});
	}
	updateUserName(event) {
		event.preventDefault();
		if (this.refs.username.value == '') {
			feathers_app.service('users').patch(feathers_app.get('user')._id, { $unset: { username: 1 } })
				.then(result => {
					this.setState({ username: result.username, border: 'lightgrey' });
					this.refs.messageBanner.clearMessage();
				})
				.catch(error => {
					this.setState({ border: 'red' });
					if (error.message.indexOf('duplicate') != -1) error.message = 'That username is taken'
					this.refs.messageBanner.showMessage('Error: '+error.message);
				});
		}
	}
	componentDidMount() {
		feathers_app.service('users').get(feathers_app.get('user')._id)
			.then(result => {
				this.setState({
					username: result.username,
					border: (result.username == null)? 'lightgrey': 'lightgreen'
				});
			})
			.catch(console.error);
	}
	render() {
		return (
			<div className="eightpoint">
				<MessageBanner ref="messageBanner" />
				<form className="pure-form pure-form-aligned" onSubmit={this.updateUserName.bind(this)}>
					<legend>
						Set your username
						&nbsp;<i className="fa fa-question-circle-o" onClick={this.explainUsername.bind(this)} />
					</legend>
					<fieldset>
						<div className="pure-control-group">
							<label htmlFor="username">Username</label>
							<input ref="username" type="text" placeholder="Username"
								style={{border:'1px solid '+this.state.border}}
								value={this.state.username}
								onChange={this.handleUsernameChange.bind(this)} />
						</div>
						<div className="pure-controls" style={{marginTop:0}}>
							<button type="submit" className="pure-button button-secondary">Set</button>
						</div>
					</fieldset>
				</form>
				<Link to="/logout" className="pure-button button-error">Log out</Link>
				<Modal contentLabel="explainUsername" isOpen={this.state.modalOpen}>
					<div className="modalContent">
						<button style={{float:'right'}}
							className="pure-button button-small"
							onClick={this.closeModal.bind(this)}>
							<i className="fa fa-close" />
						</button>
						<h3>About Usernames</h3>
						<ul>
							<li>You must have a username to be added to a group</li>
							<li>Usernames are searchable by all users</li>
							<li>You may change your username at any time, provided the new name is not taken</li>
							<li>Groups will switch to showing your new name right after you make the change</li>
						</ul>
					</div>
				</Modal>
			</div>
		);
	}
}