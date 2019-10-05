import {combineReducers} from 'redux';
import {loadingBarReducer} from 'react-redux-loading-bar'
import authReducer from './auth-reducer';
import adminReducer from './admin-reducer';
import playgroundReducer from './playground-reducer';

export default combineReducers({authReducer, adminReducer, playgroundReducer, loadingBar: loadingBarReducer});
