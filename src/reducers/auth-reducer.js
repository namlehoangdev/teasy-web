import {
    LOGIN,
    UPDATE_LOGIN_MODE
} from '../actions/action-types';

const initialState = {
    isLogin: false,
    error: null,
    profile: null,
    token: null,
    loginMode: null
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
        default:
            return state;
    }
}
