import React from 'react';
import { Link, withRouter } from 'react-router';

class Home extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			groups: []
		}
	}
	getGroups() {
		feathers_app.service('groups')
			.find({query:{members:feathers_app.get('user')._id, $sort:{updatedAt:-1}}})
			.then(result => { this.setState({ groups: result }); })
			.catch(console.error);
	}
	createGroup() {
		feathers_app.service('groups').create({
			name: 'New Group',
			admins: [feathers_app.get('user')._id],
			members: [feathers_app.get('user')._id]
		}).then(result => {
			this.props.router.push('/group/'+result._id);
		}).catch(console.error);
	}
	handlePatchedGroup(patchedGroup) {
		for (let i in this.state.groups) {
			if (patchedGroup._id == this.state.groups[i]._id) {
				let newGroups = this.state.groups;
				newGroups[i] = patchedGroup;
				this.setState({ groups: newGroups });
				break;
			}
		}
	}
	componentDidMount() {
		this.getGroups();
		this.groupPatchedListener = this.handlePatchedGroup.bind(this);
		feathers_app.service('groups').on('patched', this.groupPatchedListener);
	}
	componentWillUnmount() {
		feathers_app.service('groups').removeListener('patched', this.groupPatchedListener);
	}
	render() {
		return (
			<div className="sky paper-text pure-g" style={{margin:'8pt', padding:'4pt'}}>
				{this.state.groups && this.state.groups.map(group => {
					return (
						<div key={group._id}
							className="group pure-u-1-2 pure-u-sm-1-3 pure-u-md-1-4 pure-u-lg-1-5 pure-u-xl-1-6"
							style={{padding:'4pt'}}>
							<Link to={'/group/'+group._id}>
								<div className="square maroon tile paper-text"
									style={{padding:'8pt', textAlign:'right',
									backgroundImage:(group.recentImage)?'url("/s3/img/'+group.recentImage+'?token='+feathers_app.get('token')+'")': 'none'}}>
									{group.name}
								</div>
							</Link>
						</div>
					);
				})}
				<div className="group pure-u-1-2 pure-u-sm-1-3 pure-u-md-1-4 pure-u-lg-1-5 pure-u-xl-1-6">
					<div style={{padding:'8pt'}}>
						<button onClick={this.createGroup.bind(this)} className="creamsicle maroon-text pure-button button-large">
							<i className="fa fa-plus" /> <i className="fa fa-users" />
						</button>
					</div>
				</div>
			</div>
		);
	}
}

module.exports = withRouter(Home);