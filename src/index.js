import React from 'react';
import ReactDOM from 'react-dom';
import {Switch, Route} from 'react-router-dom';
import {ConnectedRouter} from "connected-react-router";

import {Provider} from 'react-redux';
import {
    LandingPage, AdminHomePage
} from './pages';
import {history, store} from './configurations';
import * as serviceWorker from './serviceWorker';
import './index.scss';


function PlayGroundSwitch() {
    return (<Switch>
        <Route path="/" component={<div/>}/>
    </Switch>)
}


ReactDOM.render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <Switch>
                <Route exact path="/" component={LandingPage}/>
                <Route path="/admin" component={AdminHomePage}/>
                <Route path="/playground" component={PlayGroundSwitch}/>
            </Switch>
        </ConnectedRouter>
    </Provider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

