import {takeLatest, takeEvery, call, put} from 'redux-saga/effects';
import {showLoading, hideLoading} from 'react-redux-loading-bar'
import {postLoginRequest} from '../apis';
import {postLogin} from '../actions';
import {ACTION_STATE, LOGIN, POST_LOGIN} from "../actions/action-types";

/*-----saga effects-----*/
function* postLoginEffectSaga() {
    try {
        yield put(showLoading());
        const response = yield call(postLoginRequest);
        if (response) {
            yield put(postLogin.success(response));
        }
    } catch (err) {
        yield put(postLogin.failure(err));
    } finally {
        yield put(hideLoading());
    }
}


/*-----saga watchers-----*/
function* postLoginWatcherSaga() {
    yield takeLatest(POST_LOGIN[ACTION_STATE.request], postLoginEffectSaga);
}

export default [
    takeEvery(LOGIN, postLoginWatcherSaga),
];
