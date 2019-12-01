import {
    SET_OPEN_PLAYGROUND_FULLSCREEN_DIALOG,
    UPDATE_ALL_CONTEST_BY_ID, UPDATE_ALL_CONTESTS,
    UPDATE_PUBLIC_CONTESTS, UPDATE_SHARED_CONTESTS
} from '../actions/action-types';
import {addToNormalizedList, DefaultNormalizer} from "../utils/byid-utils";
import {produce} from "immer";

const initialState = {
    isOpenPlaygroundFullscreenDialog: false,
    contests: new DefaultNormalizer(),
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
                draft.isOpenPlaygroundFullscreenDialog=payload.value;
                return;

            case UPDATE_ALL_CONTESTS:
                draft.contests = payload.contests || new DefaultNormalizer();
                return;

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
            default:
                return state;
        }
    })
}
