import {takeLatest, call, put} from 'redux-saga/effects';
import {showLoading, hideLoading} from 'react-redux-loading-bar'
import APIs from '../apis';
import {} from '../actions';
import {
    GET_CONTEST_BY_ID,
    GET_PUBLIC_CONTESTS, GET_SHARED_CONTESTS,
} from "../actions/action-types";
import {normalizer} from "../utils/byid-utils";
import {updateSharedContests} from "../actions";
import {updatePublicContests} from "../actions";
import {updateCompetingContest} from "../actions";
import {fakeCompetingContest} from "../fake-data";
import {normalize, schema} from "normalizr";
import {convertStringToEditorState} from "../utils/editor-converter";
import { showCircleLoading, hideCircleLoading } from '../actions/ui-effect-actions';

const answerSchema= new schema.Entity('answers');
const questionsSchema=new schema.Entity('questions',{
    answers:[answerSchema]
});
const testSchema = new schema.Entity('test',{
    questions:[questionsSchema]
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
        //const response = yield call(APIs.getContestByIdAPI, id);
        const response = {
            data: fakeCompetingContest
        };
        //const contests = normalizer(response.data) || null;
        if (response && response.data) {
            const contest = response.data;
            contest.test.questions && contest.test.questions.forEach(function (part, index) {
                this.test.questions[index].content = convertStringToEditorState(this.test.questions[index].content);
            }, contest);
            const {entities} = normalize(contest.test, testSchema);
            yield put(updateCompetingContest({ ...contest, ...entities}));
        }
    } catch (error) {
        console.log('getContestByIdSaga failed: ', error);
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

function* getContestByIdSagaWatcher() {
    yield takeLatest(GET_CONTEST_BY_ID, getContestByIdSaga);
}

export default [
    getSharedContestsWatcherSaga(),
    getPublicContestsWatcherSagas(),
    getContestByIdSagaWatcher()
];
