import {
    LOGIN, LOGOUT, UPDATE_ALL_USERS,
    UPDATE_LOGIN_MODE
} from '../actions/action-types';
import {produce} from "immer";
import {normalizer, defaultNormalizer} from "../utils/byid-utils";


const initialState = {
    users: defaultNormalizer
};

export default function userReducer(state = initialState, action) {
    return produce(state, draft => {
        const {type, payload} = action;
        switch (type) {
            case UPDATE_ALL_USERS:
                draft.users = normalizer(payload) || defaultNormalizer;
                return;
            case LOGOUT:
                draft = initialState;
                return;
            default:
                return draft;
        }

    })
}

