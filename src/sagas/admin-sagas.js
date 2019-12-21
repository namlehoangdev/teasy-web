import {takeLatest, call, put} from 'redux-saga/effects';
import {showLoading, hideLoading} from 'react-redux-loading-bar'
import APIs from '../apis';
import {} from '../actions';
import {
    DELETE_OWN_CONTEST, DELETE_OWN_TEST, GET_CONTEST_RESULTS_BY_ID,
    GET_OWN_CONTESTS,
    GET_OWN_TESTS,
    POST_CONTEST, POST_QUESTION,
    POST_TEST, PUT_CONTEST, PUT_QUESTION, PUT_TEST, UPDATE_OWN_QUESTIONS,
} from "../actions/action-types";
import {updateOwnContests} from "../actions";
import {DefaultNormalizer, normalize, denormalize, normalizer} from "../utils/byid-utils";
import {convertFromEditorStateToString, convertStringToEditorState} from "../utils/editor-converter";
import {updateOwnTests} from "../actions";
import {updateOwnQuestions} from "../actions";
import {updateRemovedOwnContestById} from "../actions";
import {updateRemovedOwnTestById} from "../actions";
import {addNewOwnContest} from "../actions";
import {updateOwnContestById} from "../actions";
import {showCircleLoading} from "../actions";
import {hideCircleLoading} from "../actions";
import {updateAllContestById} from "../actions";
import {updatePartitionOfContestById} from "../actions";
import {updateOwnQuestionById} from "../actions";
import {addNewOwnQuestion} from "../actions";


const questionsSchema = {
    questions: {
        schema: {
            answers: {
                id: 'id'
            }
        }
    }
};

const testsSchema = {
    tests: {
        schema: {
            questions: {
                schema: {
                    answers: {
                        id: 'id'
                    }
                }
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


export function* getContestResultsById({payload}) {
    try {
        yield put(showCircleLoading());
        const response = yield call(APIs.getContestResultsByIdAPI, payload);
        console.log('get own contest response: ', response);
        if (response) {
            const results = normalizer(response.data) || null;
            console.log(results);
            yield put(updatePartitionOfContestById(payload, {results}));
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
            const tests = normalize({tests: response.data}, testsSchema).tests;
            tests.byId.forEach(function (testIndex, j) {
                tests.byHash[testIndex].questions.byId.forEach(function (part, index) {
                    this.questions.byHash[part].content = convertStringToEditorState(this.questions.byHash[part].content);
                }, tests.byHash[testIndex]);
            }, tests);
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

export function* postTestSaga({payload}) {
    const {test, onSuccess} = payload;
    try {
        console.log('get here: ', test);
        yield put(showCircleLoading());
        const requestParams = denormalize(test, questionsSchema);
        requestParams.questions.forEach(function (part, index) {
            this.questions[index].content = convertFromEditorStateToString(this.questions[index].content);
        }, requestParams);
        const response = yield call(APIs.postTestAPI, requestParams);
        onSuccess && onSuccess(response);
        console.log(response);
    } catch (error) {
        console.log('postTestSaga failed: ', error);
    } finally {
        yield put(hideCircleLoading());
    }
}


export function* putTestSaga({payload}) {
    const {test, onSuccess} = payload;
    try {
        console.log('putTestSaga here: ', test);
        yield put(showCircleLoading());
        const requestParams = denormalize(test, questionsSchema);
        requestParams.questions.forEach(function (part, index) {
            this.questions[index].content = convertFromEditorStateToString(this.questions[index].content);
        }, requestParams);
        const response = yield call(APIs.putTestAPI, requestParams);
        onSuccess && onSuccess(response);
        if (response && response.data) {

            yield put(updateOwnContestById(test.id, test));
        }
    } catch (error) {
        console.log('putTestSaga failed: ', error);
    } finally {
        yield put(hideCircleLoading());
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





export function* postQuestionSaga({payload}) {
    try {
        console.log('postQuestionSaga: ', payload);
        yield put(showLoading());
        const response = yield call(APIs.postQuestionAPI, payload);
        console.log('postContestSaga succeed: ', response);
        if (response && response.data) {
            yield put(addNewOwnQuestion(response.data));
        }
    } catch (error) {
        console.log('postQuestionSaga failed: ', error);
    } finally {
        yield put(hideLoading());
    }
}

export function* putQuestionSaga({payload}) {
    try {
        console.log('putQuestionSaga: ', payload);
        yield put(showLoading());
        const response = yield call(APIs.putQuestionAPI, payload);
        console.log('putQuestionSaga succeed: ', response);
        if (response && response.data) {
            const {id} = response.data;
            const contest = {...response.data};
            yield put(updateOwnQuestionById(id, contest));
        }
    } catch (error) {
        console.log('putQuestionSaga failed: ', error);
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
    takeLatest(PUT_TEST, putTestSaga),
    takeLatest(GET_OWN_CONTESTS, getOwnContestsSaga),
    takeLatest(GET_OWN_TESTS, getOwnTestsSaga),
    takeLatest(UPDATE_OWN_QUESTIONS, getOwnQuestionsSaga),
    takeLatest(POST_TEST, postTestSaga),
    takeLatest(POST_CONTEST, postContestSaga),
    takeLatest(DELETE_OWN_CONTEST, deleteOwnContestSaga),
    takeLatest(DELETE_OWN_TEST, deleteTestSaga),
    takeLatest(GET_CONTEST_RESULTS_BY_ID, getContestResultsById),
    takeLatest(POST_QUESTION,postQuestionSaga),
    takeLatest(PUT_QUESTION,putQuestionSaga),
];


