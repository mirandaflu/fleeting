import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import feathers from 'feathers-client';
import io from 'socket.io-client';
import localstorage from 'feathers-localstorage';

import Skeleton from './components/skeleton.jsx';

import Login from './pages/login.jsx';
import Logout from './pages/logout.jsx';
import Home from './pages/home.jsx';
import Group from './pages/group.jsx';
import Account from './pages/account.jsx';
import Error from './pages/error.jsx';

import { base, buttons, forms, grids, menus, tables } from 'pure-css';
import 'animate.css/animate.min.css';
import './css/custom.css';
import './css/colors.css';
import './css/buttons.css';

if (module.hot) {
	module.hot.accept();
}

const socket = io();
window.feathers_app = feathers()
	.configure(feathers.socketio(socket))
	.configure(feathers.hooks())
	.configure(feathers.authentication({ storage: window.localStorage }))
	.use('localdata', localstorage({ storage: window.localStorage }));

function requireAuth(nextState, replace, callback) {
	if (!feathers_app.get('user')) {
		replace('/login');
		callback();
	}
	else { callback(); }
}

class Root extends React.Component {
	render() {
		return (
			<Router history={browserHistory}>
				<Route path="/" component={Skeleton}>
					<IndexRoute component={Home} onEnter={requireAuth}></IndexRoute>
					<Route path="group/:group" component={Group} onEnter={requireAuth} />
					<Route path="account" component={Account} onEnter={requireAuth} />
					<Route path="login" component={Login}></Route>
					<Route path="logout" component={Logout} onEnter={feathers_app.logout}></Route>
					<Route path="*" component={Error} />
				</Route>
			</Router>
		);
	}
}

// authenticate user and start the app
feathers_app.authenticate().catch(error => {
	console.error('Error authenticating!', error);
}).then(result => {
	render( <Root />, document.getElementById('app') );
	feathers_app.service('users').on('patched', function(user) {
		if (user._id == feathers_app.get('user')._id) {
			feathers_app.set('user', user);
		}
	});
});

