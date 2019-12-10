import {takeLatest, call, put} from 'redux-saga/effects';
import {showLoading, hideLoading} from 'react-redux-loading-bar'
import APIs from '../apis';
import {} from '../actions';
import {
    DELETE_OWN_CONTEST, DELETE_OWN_TEST,
    GET_OWN_CONTESTS,
    GET_OWN_TESTS,
    POST_CONTEST,
    POST_TEST, PUT_CONTEST, UPDATE_OWN_QUESTIONS,
} from "../actions/action-types";
import {updateOwnContests} from "../actions";
import {DefaultNormalizer, denormalize, normalizer} from "../utils/byid-utils";
import {convertFromEditorStateToString} from "../utils/editor-converter";
import {updateOwnTests} from "../actions";
import {updateOwnQuestions} from "../actions";
import {updateRemovedOwnContestById} from "../actions";
import {updateRemovedOwnTestById} from "../actions";
import {addNewOwnContest} from "../actions";
import {updateOwnContestById} from "../actions";
import {showCircleLoading} from "../actions";
import {hideCircleLoading} from "../actions";

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
        yield put(showCircleLoading());
        const response = yield call(APIs.getOwnedContestsAPI);
        console.log('get own contest response: ', response);
        if (response) {
            const contests = normalizer(response.data) || null;
            yield put(updateOwnContests(contests));
        }
    } catch (error) {
        console.log('getOwnContestsSaga failed: ', error);
    } finally {
        yield put(hideCircleLoading());
    }
}

export function* getOwnTestsSaga() {
    try {
        yield put(showCircleLoading());
        const response = yield call(APIs.getOwnTestsAPI);
        console.log('get own test response: ', response);
        if (response.data) {
            const tests = normalizer(response.data);
            yield put(updateOwnTests(tests));
        }
    } catch (error) {
        console.log('getOwnTestsSaga failed: ', error);
    } finally {
        yield put(hideCircleLoading());
    }
}

export function* getOwnQuestionsSaga() {
    try {
        yield put(showCircleLoading());
        const response = yield call(APIs.getOwnQuestionsAPI);
        console.log('getOwnQuestionsSaga response: ', response);
        if (response.data) {
            const questions = normalizer(response.data);
            yield put(updateOwnQuestions(questions));
        }
    } catch (error) {
        console.log('getOwnQuestionsSaga failed: ', error);
    } finally {
        yield put(hideCircleLoading());
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
            yield put(addNewOwnContest(response.data));
        }
    } catch (error) {
        console.log('postContestSaga failed: ', error);
    } finally {
        yield put(hideLoading());
    }
}

export function* putContestSaga({payload}) {
    try {
        console.log('putContestSaga: ', payload);
        yield put(showLoading());
        const response = yield call(APIs.putContestAPI, payload);
        console.log('putContestSaga succeed: ', response);
        if (response && response.data) {
            const {id} = response.data;
            const contest = {...response.data};
            yield put(updateOwnContestById(id, contest));
        }
    } catch (error) {
        console.log('putContestSaga failed: ', error);
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

export function* deleteTestSaga({payload}) {
    try {
        console.log('deleteOwnTestSaga: ', payload);
        yield put(showLoading());
        const response = yield call(APIs.deleteOwnTestAPI, payload);
        console.log('deleteOwnTestSaga succeed: ', response);
        if (response) {
            console.log('response: ', response);
            yield put(updateRemovedOwnTestById(payload));
        }
    } catch (error) {
        console.log('deleteOwnTestSaga failed: ', error);
    } finally {
        yield put(hideLoading());
    }
}

/*-----saga watchers-----*/
export default [
    takeLatest(PUT_CONTEST, putContestSaga),
    takeLatest(GET_OWN_CONTESTS, getOwnContestsSaga),
    takeLatest(GET_OWN_TESTS, getOwnTestsSaga),
    takeLatest(UPDATE_OWN_QUESTIONS, getOwnQuestionsSaga),
    takeLatest(POST_TEST, postTestSaga),
    takeLatest(POST_CONTEST, postContestSaga),
    takeLatest(DELETE_OWN_CONTEST, deleteOwnContestSaga),
    takeLatest(DELETE_OWN_TEST, deleteTestSaga)
]


