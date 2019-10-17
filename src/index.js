import React from 'react';
import ReactDOM from 'react-dom';
import {Switch, Route} from 'react-router-dom';
import {ConnectedRouter} from "connected-react-router";

import {Provider} from 'react-redux';
import {LandingPage, AdminHomePage, PlaygroundHomePage} from './pages';
import {MuiThemeProvider} from '@material-ui/core';
import themes from './themes';
import {history, store} from './configurations';
import * as serviceWorker from './serviceWorker';
import './index.scss';


ReactDOM.render(
    <Provider store={store}>
        <MuiThemeProvider theme={themes.default}>
            <ConnectedRouter history={history}>
                <Switch>
                    <Route exact path="/" component={LandingPage}/>
                    <Route path="/admin" component={AdminHomePage}/>
                    <Route path="/playground" component={PlaygroundHomePage}/>
                </Switch>
            </ConnectedRouter>
        </MuiThemeProvider>
    </Provider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

