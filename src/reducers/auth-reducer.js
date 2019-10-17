import {LOGIN} from '../actions/action-types';

const initialState = {
    isLogin: false,
    error: null,
    profile: null,
    token: null
};

export default function authReducer(state = initialState, action) {
    const {type, payload} = action;
    switch (type) {
        case LOGIN:
            return {...state, isLogin: true, profile: payload, token: payload.token};
        default:
            return state;
    }
}
