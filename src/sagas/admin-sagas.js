import {takeLatest, call, put} from 'redux-saga/effects';
import {showLoading, hideLoading} from 'react-redux-loading-bar'
import APIs from '../apis';
import {} from '../actions';
import {
    DELETE_OWN_CONTEST,
    GET_OWN_CONTESTS,
    GET_OWN_TESTS,
    POST_CONTEST,
    POST_TEST, UPDATE_OWN_QUESTIONS,
} from "../actions/action-types";
import {updateOwnContests} from "../actions";
import {DefaultNormalizer, denormalize, normalizer} from "../utils/byid-utils";
import {convertFromEditorStateToString} from "../utils/editor-converter";
import {updateOwnTests} from "../actions";
import {updateOwnQuestions} from "../actions";
import {updateRemovedOwnContestById} from "../actions";

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
        console.log('get own contest response: ', response);
        if (response) {
            const contests = normalizer(response.data) || null;
            yield put(updateOwnContests(contests));
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
        console.log('get own test response: ', response);
        if (response.data) {
            const tests = normalizer(response.data);
            yield put(updateOwnTests(tests));
        }
    } catch (error) {
        console.log('getOwnTestsSaga failed: ', error);
    } finally {
        yield put(hideLoading());
    }
}

export function* getOwnQuestionsSaga() {
    try {
        yield put(showLoading());
        const response = yield call(APIs.getOwnQuestionsAPI);
        console.log('getOwnQuestionsSaga response: ', response);
        if (response.data) {
            const questions = normalizer(response.data);
            yield put(updateOwnQuestions(questions));
        }
    } catch (error) {
        console.log('getOwnQuestionsSaga failed: ', error);
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

export function* postContestSaga({payload}) {
    try {
        console.log('post contest saga: ', payload);
        yield put(showLoading());
        const response = yield call(APIs.postContestAPI, payload);
        console.log('postContestSaga succeed: ', response);
        if (response && response.data) {
            const {id} = response.data;

        }
    } catch (error) {
        console.log('postContestSaga failed: ', error);
    } finally {
        yield put(hideLoading());
    }
}

export function* deleteOwnContestSaga({payload}) {
    try {
        console.log('deleteOwnContestSaga: ', payload);
        yield put(showLoading());
        const response = yield call(APIs.deleteOwnContestAPI, payload);
        console.log('deleteOwnContestSaga succeed: ', response);
        if (response) {
            console.log('response: ', response);
            yield put(updateRemovedOwnContestById(payload));
        }
    } catch (error) {
        console.log('deleteOwnContestSaga failed: ', error);
    } finally {
        yield put(hideLoading());
    }
}

/*-----saga watchers-----*/
function* getOwnContestsWatcherSaga() {
    yield takeLatest(GET_OWN_CONTESTS, getOwnContestsSaga);
}

function* getOwnTestsWatcherSaga() {
    yield takeLatest(GET_OWN_TESTS, getOwnTestsSaga);
}

function* getOwnQuestionsWatcherSaga() {
    yield  takeLatest(UPDATE_OWN_QUESTIONS, getOwnQuestionsSaga);
}

function* postTestSagaWatcher() {
    yield takeLatest(POST_TEST, postTestSaga);
}

function* postContestSagaWatcher() {
    yield takeLatest(POST_CONTEST, postContestSaga);
}

function* deleteOwnContestWatcherSaga() {
    yield takeLatest(DELETE_OWN_CONTEST, deleteOwnContestSaga);
}

export default [
    getOwnTestsWatcherSaga(),
    getOwnContestsWatcherSaga(),
    postTestSagaWatcher(),
    postContestSagaWatcher(),
    getOwnQuestionsWatcherSaga(),
    deleteOwnContestWatcherSaga()
];
