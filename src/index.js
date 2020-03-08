import React, {useRef} from 'react';
import ReactDOM from 'react-dom';
import {Route, Switch} from 'react-router-dom';
import {ConnectedRouter} from "connected-react-router";
import DateFnsUtils from '@date-io/date-fns'
import {MuiPickersUtilsProvider} from '@material-ui/pickers';
import {SnackbarProvider} from 'notistack';


import {Provider, useDispatch, useSelector} from 'react-redux';
import {
    AdminHomePage,
    LandingPage,
    NotFoundPage,
    PlaygroundAnonymousWaitingRoomPage,
    PlaygroundHomePage,
    PlaygroundWaitingRoomPage
} from './pages';
import {PersistGate} from 'redux-persist/integration/react'
import {Button, MuiThemeProvider} from '@material-ui/core';
import themes from './themes';
import {history, persistor, store} from './configurations';
import * as serviceWorker from './serviceWorker';
import './index.scss';
import {PAGE_PATHS} from "./consts";
import {UnauthorizedDialog} from "./components";
import ReactAudioPlayer from 'react-audio-player';

import {logout} from "./actions";
import 'moment/locale/vi'
import {disabledStyleWrapper} from "./utils";


function App() {
    const {isDark} = useSelector(state => state.settingReducer);
    const {isOpenUnauthorizedDialog} = useSelector(state => state.authReducer);
    const dispatch = useDispatch();
    const audioRef = useRef(null);

    function handleLogout() {
        dispatch(logout());
    }

    return <MuiThemeProvider theme={isDark ? themes.dark : themes.default}>
        <div style={disabledStyleWrapper(true)}>

        </div>
        <ConnectedRouter history={history}>
            <Switch>
                <Route exact path={PAGE_PATHS.landing} component={LandingPage}/>
                <Route path={PAGE_PATHS.anonymousWaiting} component={PlaygroundAnonymousWaitingRoomPage}/>
                <Route path={PAGE_PATHS.waiting} component={PlaygroundWaitingRoomPage}/>
                <Route path={PAGE_PATHS.admin} component={AdminHomePage}/>
                <Route path={PAGE_PATHS.playground} component={PlaygroundHomePage}/>
                <Route path="*" component={NotFoundPage}/>
            </Switch>
            <UnauthorizedDialog open={isOpenUnauthorizedDialog} handleClose={handleLogout}/>
        </ConnectedRouter>
    </MuiThemeProvider>
}

ReactDOM.render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <SnackbarProvider>
                    <App/>
                </SnackbarProvider>
            </MuiPickersUtilsProvider>
        </PersistGate>
    </Provider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

