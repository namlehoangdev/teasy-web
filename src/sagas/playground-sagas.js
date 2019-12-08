import {takeLatest, call, put} from 'redux-saga/effects';
import {showLoading, hideLoading} from 'react-redux-loading-bar'
import APIs from '../apis';
import {} from '../actions';
import {
    GET_CONTEST_BY_ID, GET_MARKED_CONTEST_RESULT,
    GET_PUBLIC_CONTESTS, GET_SHARED_CONTESTS, POST_CONTEST_RESULT,
} from "../actions/action-types";
import {normalizer} from "../utils/byid-utils";
import {updateSharedContests} from "../actions";
import {updatePublicContests} from "../actions";
import {updateCompetingContest} from "../actions";
import {fakeCompetingContest} from "../fake-data";
import {normalize, schema} from "normalizr";
import {convertStringToEditorState} from "../utils/editor-converter";
import {showCircleLoading, hideCircleLoading} from '../actions/ui-effect-actions';
import {getMarkedContestResult} from "../actions";
import {COMPETING_CONTEST_STATE} from "../consts";

const answerSchema = new schema.Entity('answers');
const questionsSchema = new schema.Entity('questions', {
    answers: [answerSchema]
});
const testSchema = new schema.Entity('test', {
    questions: [questionsSchema]
});

/*-----saga effects-----*/
export function* getPublicContestsSaga() {
    try {
        yield put(showCircleLoading());
        const response = yield call(APIs.getPublicContestsAPI);
        console.log('getPublicContestsSaga: ', response);
        if (response) {
            const contests = normalizer(response.data) || null;
            yield put(updatePublicContests(contests));
        }
    } catch (error) {
        console.log('getPublicContestsSaga failed: ', error);
    } finally {
        yield put(hideCircleLoading());
    }
}


export function* getSharedContestsSaga() {
    try {
        yield put(showCircleLoading());
        const response = yield call(APIs.getSharedContestsAPI);
        console.log('getSharedContestsSaga: ', response);
        if (response) {
            const contests = normalizer(response.data) || null;
            yield put(updateSharedContests(contests));
        }
    } catch (error) {
        console.log('getSharedContestsSaga failed: ', error);
    } finally {
        yield put(hideCircleLoading());
    }
}

export function* getContestByIdSaga({payload}) {
    try {
        yield put(showCircleLoading());
        const {id} = payload;
        const response = yield call(APIs.getContestByIdAPI, id);
        console.log('getContestByIdSaga response: ', response);
        if (response && response.data) {
            const contest = response.data;
            contest.test.questions && contest.test.questions.forEach(function (part, index) {
                this.test.questions[index].content = convertStringToEditorState(this.test.questions[index].content);
            }, contest);
            const {entities} = normalize(contest.test, testSchema);
            yield put(updateCompetingContest({...contest, ...entities, state: COMPETING_CONTEST_STATE.DOING}));
        }
    } catch (error) {
        console.log('getContestByIdSaga failed: ', error);
    } finally {
        yield put(hideCircleLoading());
    }
}

export function* postContestResultSaga({payload}) {
    try {
        yield put(updateCompetingContest({state: COMPETING_CONTEST_STATE.SUBMIT}));
        const {params, hasFullAnswers} = payload;

        console.log('payload: ', payload);
        yield put(showCircleLoading());
        const response = yield call(APIs.postContestResultAPI, params);
        console.log('postContestResultAPI succeed: ', response);
        if (response && response.data) {
            if (hasFullAnswers) {
                yield put(getMarkedContestResult(response.data.id));
            } else {
                yield put(updateCompetingContest({state: COMPETING_CONTEST_STATE.RESPONSE_OF_NOT_FULL_ANSWER}));
            }
        }
    } catch (error) {
        console.log('postContestResultAPI failed: ', error);
    } finally {
        yield put(hideCircleLoading());
    }
}

export function* getMarkedContestResultSaga({payload}) {
    try {
        const resultId = payload;
        console.log('payload: ', payload);
        yield put(showCircleLoading());
        const response = yield call(APIs.getMarkedContestResultAPI, resultId);
        console.log('getMarkedContestResultSaga succeed: ', response);
        if (response && response.data) {
            const {testRightAnswerIds, rightAnswerIds} = response.data;
            const newTestRightAnswerIds = {};
            testRightAnswerIds.forEach((item) => {
                newTestRightAnswerIds[item] = true;
            });

            const newRightAnswerIds = {};
            rightAnswerIds.forEach((item) => {
                newRightAnswerIds[item] = true;
            });

            yield put(updateCompetingContest({
                markedResults: {
                    ...response.data,
                    testRightAnswerIds: newTestRightAnswerIds,
                    rightAnswerIds: newRightAnswerIds
                },
                state: COMPETING_CONTEST_STATE.RESPONSE_OF_HAS_FULL_ANSWER
            }));
        }
    } catch (error) {
        console.log('getMarkedContestResultSaga failed: ', error);
    } finally {
        yield put(hideCircleLoading());
    }
}


/*-----saga watchers-----*/
function* getPublicContestsWatcherSagas() {
    yield takeLatest(GET_PUBLIC_CONTESTS, getPublicContestsSaga);
}

function* getSharedContestsWatcherSaga() {
    yield takeLatest(GET_SHARED_CONTESTS, getSharedContestsSaga);
}

function* postContestResultWatcherSaga() {
    yield takeLatest(POST_CONTEST_RESULT, postContestResultSaga);
}

function* getContestByIdWatcherSaga() {
    yield takeLatest(GET_CONTEST_BY_ID, getContestByIdSaga);
}

function* getMarkedContestResultWatcherSaga() {
    yield  takeLatest(GET_MARKED_CONTEST_RESULT, getMarkedContestResultSaga);
}

export default [
    getSharedContestsWatcherSaga(),
    getPublicContestsWatcherSagas(),
    getContestByIdWatcherSaga(),
    postContestResultWatcherSaga(),
    getMarkedContestResultWatcherSaga()
]
;
