import {
    UPDATE_ALL_CONTEST_BY_ID, UPDATE_ALL_CONTESTS,
    UPDATE_PUBLIC_CONTESTS, UPDATE_SHARED_CONTESTS
} from '../actions/action-types';
import {addToNormalizedList, DefaultNormalizer} from "../utils/byid-utils";
import {produce} from "immer";

const initialState = {
    contests: new DefaultNormalizer(),
    isLoading: false,
    error: null,
};

export default function playgroundReducer(state = initialState, action) {
    return produce(state, draft => {
        const {type, payload} = action;
        switch (type) {
            case UPDATE_ALL_CONTESTS:
                draft.contests = payload.contests || new DefaultNormalizer();
                return;

            case UPDATE_PUBLIC_CONTESTS:
                console.log('public: ', payload);
                payload.contests && payload.contests.byId && payload.contests.byId.forEach(id => {
                    addToNormalizedList(draft.contests, payload.contests.byHash[id] || new DefaultNormalizer())
                });
                return;

            case UPDATE_SHARED_CONTESTS:
                console.log('shared: ', payload);
                payload.contests && payload.contests.byId && payload.contests.byId.forEach(id => {
                    addToNormalizedList(draft.contests, payload.contests.byHash[id] || new DefaultNormalizer())
                });
                return;

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
