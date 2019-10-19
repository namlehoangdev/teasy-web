import {POST_LOGIN_BY_FACEBOOK_API, POST_REGISTER_BY_FACEBOOK_API, action, LOGIN} from './action-types';

export const postLoginByFacebook = (facebookData) => action(POST_LOGIN_BY_FACEBOOK_API, facebookData);

export const postRegisterByFacebook = (facebookData) => action(POST_REGISTER_BY_FACEBOOK_API, facebookData);

export const login = (payload) => action(LOGIN, payload);
