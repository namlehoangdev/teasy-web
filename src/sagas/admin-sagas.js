import {takeLatest, call, put} from 'redux-saga/effects';
import {showLoading, hideLoading} from 'react-redux-loading-bar'
import APIs from '../apis';
import {} from '../actions';
import {GET_OWN_CONTESTS_API, GET_OWN_TESTS, POST_LOGIN_BY_THIRD_PARTY, POST_TEST,} from "../actions/action-types";
import {history} from "../configurations";
import {updateOwnedContests} from "../actions";
import {denormalize, denormalizer} from "../utils/byid-utils";
import {convertFromEditorStateToString} from "../utils/editor-converter";
import {updateOwnTests} from "../actions";

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
        if (response) {
            yield put(updateOwnedContests(response.data));
        }
    } catch (error) {
        console.log('getOwnContestsSaga failed: ', error);
    } finally {
        yield put(hideLoading());
    }
}

export function* getOwnTestsSaga() {
    try {
        yield put(showLoading());
        const response = yield call(APIs.getOwnTestsAPI);
        if (response) {
            console.log('getOwnTestsSaga', response);
            //yield put(updateOwnTests(response.data));
        }
    } catch (error) {
        console.log('getOwnTestsSaga failed: ', error);
    } finally {
        yield put(hideLoading());
    }
}

export function* postTestSaga(action) {
    const {payload} = action;
    try {
        console.log('get here: ', payload);
        yield put(showLoading());
        const requestParams = denormalize(payload, questionsSchema);
        requestParams.questions.forEach(function (part, index) {
            this.questions[index].content = convertFromEditorStateToString(this.questions[index].content);
        }, requestParams);
        const response = yield call(APIs.postTestAPI, requestParams);
        console.log(response);
    } catch (error) {
        console.log('postTestSaga failed: ', error);
    } finally {
        yield put(hideLoading());
    }
}

/*-----saga watchers-----*/
function* getOwnContestsWatcherSaga() {
    yield takeLatest(GET_OWN_CONTESTS_API, getOwnContestsSaga);
}

function* getOwnTestsWatcherSaga() {
    yield takeLatest(GET_OWN_TESTS, getOwnTestsSaga);
}

function* postTestSagaWatcher() {
    yield takeLatest(POST_TEST, postTestSaga);
}

export default [
    getOwnContestsWatcherSaga(),
    postTestSagaWatcher(),
    getOwnTestsWatcherSaga()
];
