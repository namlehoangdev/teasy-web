import {takeLatest, call, put} from 'redux-saga/effects';
import {showLoading, hideLoading} from 'react-redux-loading-bar'
import APIs from '../apis';
import {} from '../actions';
import {POST_LOGIN_BY_THIRD_PARTY,} from "../actions/action-types";
import {updateOwnedContests} from "../actions";


/*-----saga effects-----*/

export function* getOwnContestsSaga() {
    try {
        yield put(showLoading());
        const response = yield call(APIs.getOwnedContestsAPI);
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
    yield takeLatest(POST_LOGIN_BY_THIRD_PARTY, getOwnContestsSaga);
}

export default [
    getOwnContestsWatcherSaga(),
];
