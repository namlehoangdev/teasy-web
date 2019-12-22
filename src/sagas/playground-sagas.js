import {takeLatest, call, put} from 'redux-saga/effects';
import {showLoading, hideLoading} from 'react-redux-loading-bar'
import APIs from '../apis';
import {} from '../actions';
import {
    GET_CONTEST_BY_ID,
    GET_OWN_CONTEST_RESULTS,
    GET_MARKED_CONTEST_RESULT,
    GET_PUBLIC_CONTESTS,
    GET_SHARED_CONTESTS,
    POST_CONTEST_RESULT,
    GET_ANONYMOUS_CONTEST_METADATA_BY_CODE,
    GET_ANONYMOUS_CONTEST_BY_ID,
    POST_ANONYMOUS_CONTEST_RESULT,
    GET_MARKED_ANONYMOUS_CONTEST_RESULT,
    GET_CONTEST_METADATA,
} from "../actions/action-types";
import {DefaultNormalizer, normalizer} from "../utils/byid-utils";
import {updateSharedContests} from "../actions";
import {updatePublicContests} from "../actions";
import {updateCompetingContest} from "../actions";
import {fakeCompetingContest} from "../fake-data";
import {normalize, schema} from "normalizr";
import {convertStringToEditorState} from "../utils/editor-converter";
import {showCircleLoading, hideCircleLoading} from '../actions/ui-effect-actions';
import {getMarkedContestResult} from "../actions";
import {COMPETING_CONTEST_STATE} from "../consts";
import {updateOwnContestResults} from "../actions";
import {showMiniLoading} from "../actions";
import {hideMiniLoading} from "../actions";
import {getMarkedAnonymousContestResult} from "../actions";

const answerSchema = new schema.Entity('answers');
const questionsSchema = new schema.Entity('questions', {
    answers: [answerSchema]
});
const testSchema = new schema.Entity('test', {
    questions: [questionsSchema]
});

/*-----saga effects-----*/
export function* getOwnContestResultsSaga() {
    try {
        yield put(showCircleLoading());
        const response = yield call(APIs.getOwnContestResultsAPI);
        console.log('getPublicContestsSaga: ', response);
        if (response) {
            const results = normalizer(response.data) || null;
            yield put(updateOwnContestResults(results));
        }
    } catch (error) {
        console.log('getPublicContestsSaga failed: ', error);
    } finally {
        yield put(hideCircleLoading());
    }
}


export function* getContestMetadataByCodeSaga({payload}) {
    const {code, onSuccess, onError} = payload;
    try {
        yield put(showMiniLoading());
        const response = yield call(APIs.getContestMetadataAPI, code);
        console.log('getContestMetadataByCodeSaga: ', response);
        if (response) {
            onSuccess && onSuccess(response);
            yield put(updateCompetingContest(response.data));
        }
    } catch (error) {
        console.log('getContestMetadataByCodeSaga failed: ', error);
        onError && onError(error);
    } finally {
        yield put(hideMiniLoading());
    }
}

export function* getAnonymousContestMetadataSaga({payload}) {
    const {code, onSuccess, onError} = payload;
    try {
        yield put(showMiniLoading());
        const response = yield call(APIs.getAnonymousContestMetadataByCodeAPI, code);
        console.log('getAnonymousContestMetadataByCode: ', response);
        if (response) {
            onSuccess && onSuccess(response);
            yield put(updateCompetingContest(response.data));

        }
    } catch (error) {
        console.log('getAnonymousContestMetadataByCode failed: ', error);
        onError && onError(error);
    } finally {
        yield put(hideMiniLoading());
    }
}


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
    const {id, params, onSuccess, onError} = payload;

    try {
        yield put(showCircleLoading());
        const response = yield call(APIs.getContestByIdAPI, id, params);
        console.log('getContestByIdSaga response: ', response);
        if (response && response.data) {
            const contest = response.data;
            contest.test.questions && contest.test.questions.forEach(function (part, index) {
                this.test.questions[index].content = convertStringToEditorState(this.test.questions[index].content);
            }, contest);
            const {entities} = normalize(contest.test, testSchema);
            yield put(updateCompetingContest({...contest, ...entities, state: COMPETING_CONTEST_STATE.DOING}));
            onSuccess && onSuccess();
        }
    } catch (error) {
        console.log('getContestByIdSaga failed: ', error);
        onError && onError(error);
    } finally {
        yield put(hideCircleLoading());
    }
}

export function* getAnonymousContestBydIdSaga({payload}) {
    const {id, params, onSuccess, onError} = payload;
    try {
        yield put(showCircleLoading());
        const response = yield call(APIs.getAnonymousContestByIdAPI, id, params);
        console.log('getAnonymousContestBydIdSaga response: ', response);
        if (response && response.data) {
            const contest = response.data;
            contest.test.questions && contest.test.questions.forEach(function (part, index) {
                this.test.questions[index].content = convertStringToEditorState(this.test.questions[index].content);
            }, contest);
            const {entities} = normalize(contest.test, testSchema);
            yield put(updateCompetingContest({...contest, ...entities, state: COMPETING_CONTEST_STATE.DOING}));
            onSuccess && onSuccess();
        }
    } catch (error) {
        console.log('getAnonymousContestBydIdSaga failed: ', error);
        onError && onError(error);
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


export function* postAnonymousContestResultSaga({payload}) {
    try {
        yield put(updateCompetingContest({state: COMPETING_CONTEST_STATE.SUBMIT}));
        const {params, hasFullAnswers} = payload;

        console.log('payload: ', payload);
        yield put(showCircleLoading());
        const response = yield call(APIs.postAnonymousContestResultAPI, params);
        console.log('postAnonymousContestResultAPI succeed: ', response);
        if (response && response.data) {
            if (hasFullAnswers) {
                yield put(getMarkedAnonymousContestResult(response.data.id));
            } else {
                yield put(updateCompetingContest({state: COMPETING_CONTEST_STATE.RESPONSE_OF_NOT_FULL_ANSWER}));
            }
        }
    } catch (error) {
        console.log('postAnonymousContestResultAPI failed: ', error);
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
            const {testRightAnswerIds, rightAnswerIds, fillBlankRightAnswers} = response.data;
            const newTestRightAnswerIds = {};
            testRightAnswerIds.forEach((item) => {
                newTestRightAnswerIds[item] = true;
            });

            const newRightAnswerIds = {};
            rightAnswerIds.forEach((item) => {
                newRightAnswerIds[item] = true;
            });
            let newFillBlankRightAnswers = new DefaultNormalizer();
            if (fillBlankRightAnswers) {
                newFillBlankRightAnswers = normalizer(fillBlankRightAnswers, 'questionId');
            }
            console.log('newFillBlankRightAnswers', newFillBlankRightAnswers);

            yield put(updateCompetingContest({
                markedResults: {
                    ...response.data,
                    testRightAnswerIds: newTestRightAnswerIds,
                    rightAnswerIds: newRightAnswerIds,
                    fillBlankRightAnswers: newFillBlankRightAnswers
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

export function* getMarkedAnonymousContestResultSaga({payload}) {
    try {
        const resultId = payload;
        console.log('payload: ', payload);
        yield put(showCircleLoading());
        const response = yield call(APIs.getMarkedAnonymousContestResultAPI, resultId);
        console.log('getMarkedAnonymousContestResultSaga succeed: ', response);
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
        console.log('getMarkedAnonymousContestResultSaga failed: ', error);
    } finally {
        yield put(hideCircleLoading());
    }
}


/*-----saga watchers-----*/

export default [
    takeLatest(GET_PUBLIC_CONTESTS, getPublicContestsSaga),
    takeLatest(GET_SHARED_CONTESTS, getSharedContestsSaga),
    takeLatest(POST_CONTEST_RESULT, postContestResultSaga),
    takeLatest(POST_ANONYMOUS_CONTEST_RESULT, postAnonymousContestResultSaga),
    takeLatest(GET_CONTEST_BY_ID, getContestByIdSaga),
    takeLatest(GET_MARKED_CONTEST_RESULT, getMarkedContestResultSaga),
    takeLatest(GET_MARKED_ANONYMOUS_CONTEST_RESULT, getMarkedAnonymousContestResultSaga),
    takeLatest(GET_OWN_CONTEST_RESULTS, getOwnContestResultsSaga),
    takeLatest(GET_CONTEST_METADATA, getContestMetadataByCodeSaga),
    takeLatest(GET_ANONYMOUS_CONTEST_METADATA_BY_CODE, getAnonymousContestMetadataSaga),
    takeLatest(GET_ANONYMOUS_CONTEST_BY_ID, getAnonymousContestBydIdSaga)
];
