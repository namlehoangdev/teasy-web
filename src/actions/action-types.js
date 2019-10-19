/*-----actions util functions and variables-----*/
const REQUEST = "REQUEST";
const SUCCESS = "SUCCESS";
const FAILURE = "FAILURE";

export const API_STATUS = {
    request: REQUEST,
    success: SUCCESS,
    failure: FAILURE
};

function createRequestType(base) {
    return [REQUEST, SUCCESS, FAILURE].reduce((accumulator, currentActionState) => {
        accumulator[currentActionState] = `${base}_${currentActionState}`;
        return accumulator;
    }, {});
}

export function action(type, payload = {}) {
    return {type, payload};
}

/*------------------------------------------------AUTHENTICATION------------------------------------------------*/
export const POST_LOGIN_BY_FACEBOOK_API = 'POST_LOGIN_BY_FACEBOOK_API';
export const POST_REGISTER_BY_FACEBOOK_API = 'POST_REGISTER_BY_FACEBOOK_API';
export const LOGIN = 'LOGIN';

/*------------------------------------------------USERS------------------------------------------------*/
export const GET_ALL_USERS = createRequestType('GET_ALL_USERS');
export const GET_USER_BY_ID = createRequestType('GET_USER_BY_ID');


/*------------------------------------------------ADMIN------------------------------------------------*/
export const GET_OWN_CONTESTS_API = 'GET_OWN_CONTESTS_API';
export const UPDATE_OWNED_CONTESTS = 'UPDATE_OWNED_CONTESTS';
export const POST_OWN_CONTEST = createRequestType('POST_OWN_CONTEST');
export const PUT_OWN_CONTEST = createRequestType('PUT_OWN_CONTEST');

export const GET_OWN_TESTS = createRequestType('GET_OWN_TESTS');
export const POST_OWN_TESTS = createRequestType('POST_OWN_TESTS');
export const PUT_OWN_TESTS = createRequestType('PUT_OWN_TESTS');

export const GET_OWN_QUESTIONS = createRequestType('GET_OWN_QUESTIONS');
export const POST_OWN_QUESTIONS = createRequestType('POST_OWN_QUESTIONS');
export const PUT_OWN_QUESTIONS = createRequestType('PUT_OWN_QUESTIONS');

export const SET_OPEN_ADMIN_FULLSCREEN_DIALOG = 'SET_OPEN_CREATE_SWITCH_DIALOG';


/*------------------------------------------------PLAYGROUND------------------------------------------------*/




