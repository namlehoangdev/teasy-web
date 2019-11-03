import {
    POST_LOGIN_BY_THIRD_PARTY,
    POST_REGISTER_BY_THIRD_PARTY,
    action,
    LOGIN, UPDATE_LOGIN_MODE,
    LOGOUT
} from './action-types';

export const postLoginByThirdParty = (data) => action(POST_LOGIN_BY_THIRD_PARTY, data);

export const postRegisterThirdParty = (data) => action(POST_REGISTER_BY_THIRD_PARTY, data);

export const login = (payload) => action(LOGIN, payload);

export const logout = () => action(LOGOUT);

export const updateLoginMode = (payload) => action(UPDATE_LOGIN_MODE, payload);
