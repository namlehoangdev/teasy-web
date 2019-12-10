import React, {useEffect} from 'react';
import ReactDOM from 'react-dom';
import {Switch, Route} from 'react-router-dom';
import {ConnectedRouter} from "connected-react-router";
import DateFnsUtils from '@date-io/date-fns'
import {MuiPickersUtilsProvider} from '@material-ui/pickers';

import {Provider, useDispatch} from 'react-redux';
import {LandingPage, AdminHomePage, PlaygroundHomePage, NotFoundPage} from './pages';
import {PersistGate} from 'redux-persist/integration/react'
import {MuiThemeProvider} from '@material-ui/core';
import themes from './themes';
import {history, store, persistor} from './configurations';
import * as serviceWorker from './serviceWorker';
import './index.scss';
import {PAGE_PATHS} from "./consts";
import {useSelector} from 'react-redux';
import {UnauthorizedDialog} from "./components";
import {logout} from "./actions";


function App() {
    const {isDark} = useSelector(state => state.settingReducer);
    const {isOpenUnauthorizedDialog} = useSelector(state => state.authReducer);
    const dispatch = useDispatch();

    function handleLogout() {
        dispatch(logout());
    }

    return <MuiThemeProvider theme={isDark ? themes.dark : themes.default}>
        <ConnectedRouter history={history}>
            <UnauthorizedDialog open={isOpenUnauthorizedDialog} handleClose={handleLogout}/>
            <Switch>
                <Route exact path={PAGE_PATHS.landing} component={LandingPage}/>
                <Route path={PAGE_PATHS.admin} component={AdminHomePage}/>
                <Route path={PAGE_PATHS.playground} component={PlaygroundHomePage}/>
                <Route path="*" component={NotFoundPage}/>
            </Switch>
        </ConnectedRouter>
    </MuiThemeProvider>
}

ReactDOM.render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <App/>
            </MuiPickersUtilsProvider>
        </PersistGate>
    </Provider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

