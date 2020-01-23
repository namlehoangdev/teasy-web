import {
    CLEAR_COMPETING_CONTEST,
    SET_OPEN_PLAYGROUND_FULLSCREEN_DIALOG,
    UPDATE_ALL_CONTEST_BY_ID,
    UPDATE_ALL_CONTESTS,
    UPDATE_COMPETING_CONTEST,
    UPDATE_COMPETING_RESULT, UPDATE_OWN_CONTEST_RESULT_BY_ID,
    UPDATE_OWN_CONTEST_RESULTS,
    UPDATE_PUBLIC_CONTESTS,
    UPDATE_SHARED_CONTESTS
} from '../actions/action-types';
import {addToNormalizedList, DefaultNormalizer} from "../utils/byid-utils";
import {normalize, schema} from 'normalizr';
import {produce} from "immer";
import {fakePlaygroundContests} from "../fake-data";

const initialState = {
    isOpenPlaygroundFullscreenDialog: false,
    competingContest: {},
    contests: new DefaultNormalizer(),
    results: new DefaultNormalizer(),
    sharedContestIds: [],
    publicContestIds: [],
    isLoading: false,
    error: null,
};


export default function playgroundReducer(state = initialState, action) {
    return produce(state, draft => {
        const {type, payload} = action;
        switch (type) {
            case SET_OPEN_PLAYGROUND_FULLSCREEN_DIALOG:
                draft.isOpenPlaygroundFullscreenDialog = payload.value;
                return;

            case UPDATE_ALL_CONTESTS:
                draft.contests = payload.contests || new DefaultNormalizer();
                return;

            case UPDATE_OWN_CONTEST_RESULTS: {
                draft.results = payload.results || new DefaultNormalizer();
                return;
            }

            case UPDATE_PUBLIC_CONTESTS: {
                if (payload.contests && payload.contests.byId) {
                    let newContests = {};
                    Object.assign(newContests, draft.contests);
                    draft.publicContestIds = payload.contests.byId;
                    payload.contests && payload.contests.byId && payload.contests.byId.forEach(id => {
                        addToNormalizedList(newContests, payload.contests.byHash[id] || new DefaultNormalizer())
                    });
                    draft.contests = newContests;
                }
                return;
            }
            case UPDATE_SHARED_CONTESTS: {
                if (payload.contests && payload.contests.byId) {
                    let newContests = {};
                    Object.assign(newContests, draft.contests);
                    draft.sharedContestIds = payload.contests.byId;
                    payload.contests.byId.forEach(id => {
                        addToNormalizedList(newContests, payload.contests.byHash[id] || new DefaultNormalizer())
                    });
                    draft.contests = newContests;
                }
                return;
            }
            case UPDATE_ALL_CONTEST_BY_ID: {
                const {id, contest} = payload;
                draft.contests.byHash[id] = contest;
                return;
            }
            case UPDATE_COMPETING_CONTEST: {
                draft.competingContest = {...draft.competingContest, ...payload};
                return;
            }
            case CLEAR_COMPETING_CONTEST: {
                draft.competingContest = initialState.competingContest;
                return;
            }
            case UPDATE_OWN_CONTEST_RESULT_BY_ID: {

                draft.results = {...draft.results, ...payload};
                return;
            }

            case UPDATE_COMPETING_RESULT: {
                const {result} = payload;
                let questionId = result.questionId;
                let newResults = {...draft.competingContest.results} || new DefaultNormalizer();
                if (!draft.competingContest.results) {
                    const obj = new DefaultNormalizer();
                    addToNormalizedList(obj, result, 'questionId');
                    draft.competingContest.results = obj;
                } else {
                    if (!draft.competingContest.results.byHash[questionId]) {
                        addToNormalizedList(newResults, result, 'questionId');
                        draft.competingContest.results = newResults;
                    } else {
                        newResults.byHash[questionId] = result;
                        draft.competingContest.results = newResults;
                    }
                }
                return;
            }

            default:
                return state;
        }
    })
}
