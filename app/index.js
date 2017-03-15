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
import Error from './pages/error.jsx';

import { base, buttons, forms, grids, menus, tables } from 'pure-css';

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
});

