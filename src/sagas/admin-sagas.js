import {takeLatest, call, put} from 'redux-saga/effects';
import {showLoading, hideLoading} from 'react-redux-loading-bar'
import APIs from '../apis';
import {} from '../actions';
import {
    DELETE_OWN_CONTEST, DELETE_OWN_QUESTION, DELETE_OWN_TEST, GET_CONTEST_RESULTS_BY_ID,
    GET_OWN_CONTESTS, GET_OWN_QUESTIONS,
    GET_OWN_TESTS,
    POST_CONTEST, POST_QUESTION,
    POST_TEST, PUT_CONTEST, PUT_QUESTION, PUT_TEST,
} from "../actions/action-types";
import {updateOwnContests} from "../actions";
import {  normalize, denormalize, normalizer, denormalizer} from "../utils/byid-utils";
import {convertFromEditorStateToString, convertStringToEditorState} from "../utils/editor-converter";
import {updateOwnTests} from "../actions";
import {updateOwnQuestions} from "../actions";
import {updateRemovedOwnContestById} from "../actions";
import {updateRemovedOwnTestById} from "../actions";
import {addNewOwnContest} from "../actions";
import {updateOwnContestById} from "../actions";
import {showCircleLoading} from "../actions";
import {hideCircleLoading} from "../actions";
import {updatePartitionOfContestById} from "../actions";
import {updateOwnQuestionById} from "../actions";
import {addNewOwnQuestion} from "../actions";
import {updateRemovedOwnQuestionById} from "../actions";
import {updateEditingContest} from "../actions";
import {showMiniLoading} from "../actions";
import {hideMiniLoading} from "../actions";

const answerSchema = {
    answers: {
        id: 'id'
    }
};


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
        if (response) {
            const results = normalizer(response.data) || null;
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
        if (response.data) {
            const {questions} = normalize({questions: response.data}, questionsSchema);
            questions.byId.forEach(function (part, index) {
                this.byHash[part].content = convertStringToEditorState(this.byHash[part].content);
            }, questions);
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
        yield put(showCircleLoading());
        const requestParams = denormalize(test, questionsSchema);
        requestParams.questions.forEach(function (part, index) {
            this.questions[index].content = convertFromEditorStateToString(this.questions[index].content);
        }, requestParams);
        const response = yield call(APIs.postTestAPI, requestParams);
        onSuccess && onSuccess(response);
    } catch (error) {
        console.log('postTestSaga failed: ', error);
    } finally {
        yield put(hideCircleLoading());
    }
}


export function* putTestSaga({payload}) {
    const {test, onSuccess} = payload;
    try {
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
        yield put(showCircleLoading());
        const response = yield call(APIs.postContestAPI, payload);
        if (response && response.data) {
            yield put(updateEditingContest({code: response.data.code}));
            yield put(addNewOwnContest(response.data));
        }
    } catch (error) {
        console.log('postContestSaga failed: ', error);
    } finally {
        yield put(hideCircleLoading());
    }
}

export function* putContestSaga({payload}) {
    try {
        yield put(showCircleLoading());
        const response = yield call(APIs.putContestAPI, payload);
        if (response && response.data) {
            const {id} = response.data;
            const contest = {...response.data};
            yield put(updateOwnContestById(id, contest));
        }
    } catch (error) {
        console.log('putContestSaga failed: ', error);
    } finally {
        yield put(hideCircleLoading());
    }
}


export function* postQuestionSaga({payload}) {
    const {question, onSuccess, onError} = payload;
    try {
        yield put(showMiniLoading());
        let requestParams = denormalize(question, answerSchema);
        requestParams.content = convertFromEditorStateToString(question.content);
        const response = yield call(APIs.postQuestionAPI, requestParams);
        if (response && response.data) {
            onSuccess && onSuccess(response.data);
            yield put(addNewOwnQuestion({
                ...response.data,
                content: convertStringToEditorState(response.data.content),
                answers: normalizer(response.data.answers)
            }));
        }
    } catch
        (error) {
        console.log('postQuestionSaga failed: ', error);
        onError && onError(error);
    } finally {
        yield put(hideMiniLoading());
    }
}

export function* putQuestionSaga({payload}) {
    const {question, onSuccess, onError} = payload;
    try {
        yield put(showMiniLoading());
        const requestParams = {
            ...question,
            content: convertFromEditorStateToString(question.content),
            answers: question.answers ? denormalizer(question.answers) : [],
        };
        const response = yield call(APIs.putQuestionAPI, requestParams);
        if (response && response.data) {
            onSuccess && onSuccess(response.data);
            const {id} = response.data;
            const question = {
                ...response.data,
                content: convertStringToEditorState(response.data.content),
                answers: normalizer(response.data.answers)
            };
            yield put(updateOwnQuestionById(id, question));
        }
    } catch (error) {
        onError && onError(error);
        console.log('putQuestionSaga failed: ', error);
    } finally {
        yield put(hideMiniLoading());
    }
}

export function* deleteOwnContestSaga({payload}) {
    try {
        yield put(showLoading());
        const response = yield call(APIs.deleteOwnContestAPI, payload);
        if (response) {
            yield put(updateRemovedOwnContestById(payload));
        }
    } catch (error) {
        console.log('deleteOwnContestSaga failed: ', error);
    } finally {
        yield put(hideLoading());
    }
}

export function* deleteOwnQuestionSaga({payload}) {
    const {questionId, onSuccess, onError} = payload;
    try {
        yield put(showLoading());
        const response = yield call(APIs.deleteOwnQuestionAPI, questionId);
        if (response) {
            onSuccess && onSuccess();
            yield put(updateRemovedOwnQuestionById(questionId));
        }
    } catch (error) {
        onError && onError();
        console.log('deleteOwnQuestionSaga failed: ', error);
    } finally {
        yield put(hideLoading());
    }
}

export function* deleteTestSaga({payload}) {
    try {
        yield put(showLoading());
        const response = yield call(APIs.deleteOwnTestAPI, payload);
        if (response) {
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
    takeLatest(GET_OWN_QUESTIONS, getOwnQuestionsSaga),
    takeLatest(POST_TEST, postTestSaga),
    takeLatest(POST_CONTEST, postContestSaga),
    takeLatest(DELETE_OWN_CONTEST, deleteOwnContestSaga),
    takeLatest(DELETE_OWN_TEST, deleteTestSaga),
    takeLatest(GET_CONTEST_RESULTS_BY_ID, getContestResultsById),
    takeLatest(POST_QUESTION, postQuestionSaga),
    takeLatest(PUT_QUESTION, putQuestionSaga),
    takeLatest(DELETE_OWN_QUESTION, deleteOwnQuestionSaga)
];


