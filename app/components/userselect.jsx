import React from 'react';
import Select from 'react-select';

export default class UserSelect extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			value: this.props.value
		};
	}
	loadUsers(input, callback) {
		if (!input) return Promise.resolve({ options: [] });
		let query = {
			username: {$regex: input, $options: 'i'},
			_id: {$ne: feathers_app.get('user')._id}
		};
		return feathers_app.service('users').find({query:query}).then(result => {
			let options = result.map(function(user) {
				return { label: user.username, value: user._id };
			});
			return { options: options };
		}).catch(console.error);
	}
	handleChange(value) {
		this.setState({ value: value });
		this.props.onChange(value);
	}
	componentWillReceiveProps(nextProps) {
		this.setState({ value: nextProps.value });
	}
	render() {
		return (
			<Select.Async
				value={this.state.value}
				multi={this.props.multi}
				loadOptions={this.loadUsers}
				onChange={this.handleChange.bind(this)} />
		);
	}
}