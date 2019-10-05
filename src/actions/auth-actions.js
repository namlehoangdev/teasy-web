import {ACTION_STATE, POST_LOGIN, POST_REGISTER} from './action-types';

function action(type, payload = {}) {
    return {type, ...payload};
}

export const postLogin = {
    request: () => action(POST_LOGIN[ACTION_STATE.request]),
    success: (response) => action(POST_LOGIN[ACTION_STATE.success], response),
    failure: (error) => action(POST_LOGIN[ACTION_STATE.failure], {error})
};

export const postRegister = {
    request: () => action(POST_REGISTER[ACTION_STATE.request]),
    success: (response) => action(POST_REGISTER[ACTION_STATE.success], response),
    failure: (error) => action(POST_REGISTER[ACTION_STATE.failure], {error})
};
