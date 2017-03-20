import React from 'react';
import { Link, withRouter } from 'react-router';

import InviteTile from '../components/invitetile.jsx';
import PhotoTaker from '../components/phototaker.jsx';

class Group extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			name: '',
			group: {
				admins: [],
				members: []
			},
			images: [],
			editingName: false
		};
	}
	getGroup() {
		feathers_app.service('groups').get(this.props.params.group).then(result => {
			this.setState({ group: result, name: result.name });
		}).catch(console.error);
	}
	getImages() {
		feathers_app.service('images').find({query:{group:this.props.params.group}}).then(images => {
			this.setState({ images: images });
		}).catch(console.error);
	}
	handlePatchedGroup(patchedGroup) {
		if (patchedGroup._id == this.props.params.group) {
			this.setState({ group: patchedGroup, name: patchedGroup.name });
		}
	}
	handleCreatedImage(createdImage) {
		this.setState({ images: this.state.images.concat(createdImage) });
	}
	handlePatchedImage(patchedImage) {
		for (let i in this.state.images) {
			if (patchedImage._id == this.state.images[i]._id) {
				let newImages = this.state.images;
				newImages[i] = patchedImage;
				this.setState({ images: newImages });
				break;
			}
		}
	}
	editName() {
		if (this.state.group.admins.indexOf(feathers_app.get('user')._id) != -1) {
			this.setState({ editingName: true });
		}
	}
	handleNameChange(event) { this.setState({ name: event.target.value }); }
	commitNameChange() {
		this.setState({ editingName: false });
		feathers_app.service('groups').patch(this.props.params.group, {
			name: this.state.name
		}).catch(console.error);
	}
	deleteGroup() {
		if (!confirm('Are you sure?')) return;
		feathers_app.service('groups').remove(this.props.params.group)
			.then(result => { this.props.router.push('/'); })
			.catch(console.error);
	}
	updateDimensions() {
		this.setState({
			tileContainerHeight: window.innerHeight - 40 - 35,
			aspectRatio: window.innerWidth / (window.innerHeight - 40 - 35)
		});
    }
	componentDidMount() {
		this.getGroup();
		this.getImages();
		this.imagePatchedListener = this.handlePatchedImage.bind(this);
		this.imageCreatedListener = this.handleCreatedImage.bind(this);
		this.groupPatchedListener = this.handlePatchedGroup.bind(this);
		this.dimensionListener = this.updateDimensions.bind(this);
		feathers_app.service('images').on('patched', this.imagePatchedListener);
		feathers_app.service('images').on('created', this.imageCreatedListener);
		feathers_app.service('groups').on('patched', this.groupPatchedListener);
		window.addEventListener('resize', this.dimensionListener);
		this.updateDimensions();
	}
	componentWillUnmount() {
		feathers_app.service('images').removeListener('patched', this.imagePatchedListener);
		feathers_app.service('images').removeListener('created', this.imageCreatedListener);
		feathers_app.service('groups').removeListener('patched', this.groupPatchedListener);
		window.removeEventListener('resize', this.dimensionListener);
	}
	render() {
		let membersWithImages = {},
			userIsAdmin = this.state.group.admins.indexOf(feathers_app.get('user')._id) != -1;

		let numTiles = this.state.group.members.length,
			rows = 1,
			cols = 1;

		while (rows * cols < numTiles) {
			if (rows == cols) {
				if (this.state.aspectRatio > 1) {
					cols += 1;
				}
				else {
					rows += 1;
				}
			}
			else if (rows > cols) {
				if (this.state.aspectRatio < 0.5) {
					rows += 1;
				}
				else {
					cols += 1;
				}
			}
			else if (cols > rows) {
				if (this.state.aspectRatio > 1.5) {
					cols += 1;
				}
				else {
					rows += 1;
				}
			}
		}

		let tileHeight = this.state.tileContainerHeight / rows;
		let tileWidth = window.innerWidth / cols;

		let images = this.state.images.slice();
		let rowArray = [];
		for (let i = 0; i < rows; i++) {
			rowArray.push(images.splice(0, cols));
		}

		let rowNum = 0;

		return (
			<div>
				<div className="pure-g">
					<div className="pure-u-1 creamsicle" style={{height:'35px'}}>
						{this.state.editingName &&
							<div>
								<button className='pure-button button-error'
									onClick={this.deleteGroup.bind(this)}
									style={{float:'right'}}>
									Delete Group
								</button>
								<button className='pure-button button-danger'
									onClick={this.commitNameChange.bind(this)}
									style={{float:'right'}}>
									Done
								</button>
							</div>
						}
						<h4 style={{margin:'5pt 20pt', display:(this.state.editingName)?'none':'inline-block'}}
							onClick={this.editName.bind(this)}>
							{this.state.name}&nbsp;
							{userIsAdmin && <i className="fa fa-pencil" />}
						</h4>
						<input ref={(input) => { this.nameInput = input; }} value={this.state.name}
							onChange={this.handleNameChange.bind(this)}
							style={{display:(this.state.editingName)?'inline-block':'none', height:'35px'}} />
					</div>
					<div className="pure-u-1 maroon"
						style={{height:this.state.tileContainerHeight+'px', overflow:'hidden', display:'table'}}>

						{rowArray.map(row => {
							rowNum += 1;
							return (
								<div key={rowNum} style={{display:'table-row'}}>
									{row.map(cell => {
										let cellWidth = (1/row.length*100) + '%';
										return (
											<Link key={cell._id}
												className="tile paper-text eightpoint"
												to={'/group/'+this.props.params.group+'/image/'+cell._id}
												style={{display:'table-cell', width:cellWidth,
												backgroundImage:'url("/s3/img/'+cell.key+'?token='+feathers_app.get('token')+'")'}}>
												{cell.username}
											</Link>
										);
									})}
								</div>
							);
						})}

					</div>
				</div>

				{userIsAdmin &&
					<div className="paper" style={{position:'fixed', top:'75px', right:0}}>
						<InviteTile members={this.state.group.members} group={this.props.params.group} />
					</div>
				}

				<Link to={'/group/'+this.props.params.group+'/takephoto'} className="pure-button button-secondary button-large"
					style={{position:'fixed', bottom:0, right:0}}>
					<i className="fa fa-camera" />
				</Link>

				{this.props.children}

			</div>
		);
	}
}

module.exports = withRouter(Group);
