import {
    LOGIN, LOGOUT, UPDATE_ALL_USERS,
    UPDATE_LOGIN_MODE
} from '../actions/action-types';
import {produce} from "immer";
import {normalizer, DefaultNormalizer} from "../utils/byid-utils";


const initialState = {
    users: new DefaultNormalizer()
};

export default function userReducer(state = initialState, action) {
    return produce(state, draft => {
        const {type, payload} = action;
        switch (type) {
            case UPDATE_ALL_USERS:
                draft.users = normalizer(payload) || new DefaultNormalizer();
                return;
            case LOGOUT:
                draft = initialState;
                return;
            default:
                return draft;
        }

    })
}

