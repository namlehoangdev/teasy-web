import {takeLatest, call, put} from 'redux-saga/effects';
import {showLoading, hideLoading} from 'react-redux-loading-bar'
import APIs from '../apis';
import {} from '../actions';
import {
    GET_ALL_CONTESTS, GET_SHARED_CONTESTS,
} from "../actions/action-types";
import {updateOwnContests} from "../actions";
import {normalizer} from "../utils/byid-utils";
import {updateAllContests} from "../actions";
import {updateSharedContests} from "../actions";


/*-----saga effects-----*/
export function* getAllContestsSaga() {
    try {
        yield put(showLoading());
        const response = yield call(APIs.getAllContestsAPI);
        console.log('getAllContestsSaga: ', response);
        if (response) {
            const contests = normalizer(response.data) || null;
            yield put(updateAllContests(contests));
        }
    } catch (error) {
        console.log('getAllContestsSaga failed: ', error);
    } finally {
        yield put(hideLoading());
    }
}


export function* getSharedContestsSaga() {
    try {
        yield put(showLoading());
        const response = yield call(APIs.getSharedContestsAPI());
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
function* getAllContestsWatcherSagas() {
    yield takeLatest(GET_ALL_CONTESTS, getAllContestsSaga);
}

function* getSharedContestsWatcherSaga() {
    yield takeLatest(GET_SHARED_CONTESTS, getSharedContestsSaga);
}

export default [
    getSharedContestsWatcherSaga(),
    getAllContestsWatcherSagas(),
];
