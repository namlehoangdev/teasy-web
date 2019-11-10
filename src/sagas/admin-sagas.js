import {takeLatest, call, put} from 'redux-saga/effects';
import {showLoading, hideLoading} from 'react-redux-loading-bar'
import APIs from '../apis';
import {} from '../actions';
import {POST_LOGIN_BY_THIRD_PARTY, POST_TEST,} from "../actions/action-types";
import {history} from "../configurations";
import {updateOwnedContests} from "../actions";
import {denormalize, denormalizer} from "../utils/byid-utils";

const questionsSchema = {
    questions: {
        schema: {
            answers: {
                id: 'uuid'
            }
        }
    }
};

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

export function* postTestSaga(action) {
    const {payload} = action;
    try {
        console.log('get here: ', payload);
        yield put(showLoading());
        console.log('payload: ', payload);
        const requestParams = denormalize(payload, questionsSchema);
        const response = yield call(APIs.postTestAPI, requestParams);
        console.log('response', response);
    } catch (error) {
        console.log('postTestSaga failed: ', error);
    } finally {
        yield put(hideLoading());
    }
}

/*-----saga watchers-----*/
function* getOwnContestsWatcherSaga() {
    yield takeLatest(POST_LOGIN_BY_THIRD_PARTY, getOwnContestsSaga);
}

function* postTestSagaWatcher() {
    yield takeLatest(POST_TEST, postTestSaga);
}

export default [
    getOwnContestsWatcherSaga(),
    postTestSagaWatcher()
];
