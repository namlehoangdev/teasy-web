import {combineReducers} from 'redux';
import {loadingBarReducer} from 'react-redux-loading-bar'
import authReducer from './auth-reducer';
import adminReducer from './admin-reducer';
import playgroundReducer from './playground-reducer';
import uiEffectReducer from './ui-effect-reducer';
import {connectRouter} from 'connected-react-router';

export default function createRootReducer(history) {
    return combineReducers({
        router: connectRouter(history),
        authReducer,
        adminReducer,
        playgroundReducer,
        uiEffectReducer,
        loadingBar: loadingBarReducer
    });
}
