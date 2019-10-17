import {API_STATUS, POST_LOGIN_BY_FACEBOOK, POST_REGISTER_BY_FACEBOOK, action, LOGIN} from './action-types';


export const postLoginByFacebook = (facebookData) => action(POST_LOGIN_BY_FACEBOOK, facebookData);

export const postRegisterByFacebook = (facebookData) => action(POST_REGISTER_BY_FACEBOOK, facebookData);

export const login = (payload) => action(LOGIN, payload);
