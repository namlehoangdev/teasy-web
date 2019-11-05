import {
    LOGIN, LOGOUT, UPDATE_IS_OPEN_UNAUTHORIZED_DIALOG,
    UPDATE_LOGIN_MODE
} from '../actions/action-types';

const initialState = {
    isLogin: false,
    error: null,
    profile: null,
    token: null,
    loginMode: null,
    isOpenUnauthorizedDialog: false
};

export default function authReducer(state = initialState, action) {
    const {type, payload} = action;
    switch (type) {
        case LOGIN: {
            const {token} = payload;
            return {...state, isLogin: true, profile: payload, token};
        }
        case UPDATE_LOGIN_MODE:
            return {...state, loginMode: payload};
        case UPDATE_IS_OPEN_UNAUTHORIZED_DIALOG:
            return {...state, isOpenUnauthorizedDialog: payload};

        case LOGOUT:
            return initialState;
        default:
            return state;
    }
}
