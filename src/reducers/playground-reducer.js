import {
    API_STATUS,
    GET_ALL_CONTESTS,
    GET_SHARED_CONTESTS,
    LOGOUT, UPDATE_ALL_CONTESTS,
    UPDATE_OWN_CONTESTS,
    UPDATE_OWN_TESTS
} from '../actions/action-types';
import {DefaultNormalizer} from "../utils/byid-utils";
import {produce} from "immer";

const initialState = {
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
            case UPDATE_OWN_TESTS:
                draft.tests = payload.tests || new DefaultNormalizer();
                return;

            default:
                return state;
        }
    })
}
