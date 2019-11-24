import {takeLatest, call, put} from 'redux-saga/effects';
import {showLoading, hideLoading} from 'react-redux-loading-bar'
import APIs from '../apis';
import {} from '../actions';
import {
    GET_PUBLIC_CONTESTS, GET_SHARED_CONTESTS,
} from "../actions/action-types";
import {normalizer} from "../utils/byid-utils";
import {updateSharedContests} from "../actions";
import {updatePublicContests} from "../actions";


/*-----saga effects-----*/
export function* getPublicContestsSaga() {
    try {
        yield put(showLoading());
        const response = yield call(APIs.getPublicContestsAPI);
        console.log('getPublicContestsSaga: ', response);
        if (response) {
            const contests = normalizer(response.data) || null;
            yield put(updatePublicContests(contests));
        }
    } catch (error) {
        console.log('getPublicContestsSaga failed: ', error);
    } finally {
        yield put(hideLoading());
    }
}


export function* getSharedContestsSaga() {
    try {
        yield put(showLoading());
        const response = yield call(APIs.getSharedContestsAPI);
        console.log('getSharedContestsSaga: ', response);
        if (response) {
            const contests = normalizer(response.data) || null;
            yield put(updateSharedContests(contests));
        }
    } catch (error) {
        console.log('getSharedContestsSaga failed: ', error);
    } finally {
        yield put(hideLoading());
    }
}


/*-----saga watchers-----*/
function* getPublicContestsWatcherSagas() {
    yield takeLatest(GET_PUBLIC_CONTESTS, getPublicContestsSaga);
}

function* getSharedContestsWatcherSaga() {
    yield takeLatest(GET_SHARED_CONTESTS, getSharedContestsSaga);
}

export default [
    getSharedContestsWatcherSaga(),
    getPublicContestsWatcherSagas(),
];
