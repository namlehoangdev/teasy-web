import {takeLatest, call, put} from 'redux-saga/effects';
import {showLoading, hideLoading} from 'react-redux-loading-bar'
import {getOwnedContestsAPI} from '../apis';
import {} from '../actions';
import {POST_LOGIN_BY_FACEBOOK_API,} from "../actions/action-types";
import {updateOwnedContests} from "../actions";


/*-----saga effects-----*/

export function* getOwnContestsSaga() {
    try {
        yield put(showLoading());
        const response = yield call(getOwnedContestsAPI);
        if (!response.error) {
            yield put(updateOwnedContests(response.data));
        }
    } catch (error) {
        console.log('postRegisterByFacebook failed: ', error);
    } finally {
        yield put(hideLoading());
    }
}


/*-----saga watchers-----*/
function* getOwnContestsWatcherSaga() {
    yield takeLatest(POST_LOGIN_BY_FACEBOOK_API, getOwnContestsSaga);
}

export default [
    getOwnContestsWatcherSaga(),
];
