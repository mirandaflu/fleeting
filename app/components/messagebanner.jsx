import React from 'react';

class Banner extends React.Component {
	componentDidMount() {
		this.refs.banner.className = "alert creamsicle maroon-text animated shake";
	}
	componentWillUnmount() {
		this.refs.banner.className = "alert creamsicle maroon-text";
	}
	render() {
		return (
			<div ref="banner" style={{width:'70%',margin:'0 auto', padding:'8pt'}}>
				<button type="button" className="pure-button" style={{float:'right'}} onClick={this.props.closeClick}>
					<i className="fa fa-close" />
				</button>
				<p>
					{this.props.text}
				</p>
			</div>
		);
	}
}

export default class MessageBanner extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			messageText: null
		};
	}
	clearMessage() { this.setState({messageText:null}); }
	showMessage(message) {
		this.clearMessage();
		this.setState({messageText:message});
	}
	render() {
		return (
			<div className="messagebanner" style={{textAlign:'center', margin:'8pt'}}>
				{this.state.messageText && <Banner text={this.state.messageText} closeClick={this.clearMessage.bind(this)} />}
			</div>
		);
	}
}
