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

/*------------------------------------------------UI-EFFECTS------------------------------------------------*/
export const UPDATE_SHOW_LOADING_BAR = 'UPDATE_SHOW_LOADING_BAR';
export const UPDATE_SHOW_MINI_LOADING = 'UPDATE_SHOW_MINI_LOADING';


/*------------------------------------------------AUTHENTICATION------------------------------------------------*/
export const POST_LOGIN_BY_THIRD_PARTY = 'POST_LOGIN_BY_FACEBOOK';
export const POST_REGISTER_BY_THIRD_PARTY = 'POST_REGISTER_BY_FACEBOOK';
export const LOGIN = 'LOGIN';
export const UPDATE_LOGIN_MODE = 'UPDATE_LOGIN_MODE';
export const LOGOUT = 'LOGOUT';
export const UPDATE_IS_OPEN_UNAUTHORIZED_DIALOG = 'UPDATE_IS_OPEN_UNAUTHORIZED_DIALOG';

/*------------------------------------------------USERS------------------------------------------------*/
export const GET_ALL_USER_API = 'GET_ALL_USER_API';
export const UPDATE_ALL_USERS = 'UPDATE_ALL_USER';
export const GET_ALL_USERS = createRequestType('GET_ALL_USERS');
export const GET_USER_BY_ID = createRequestType('GET_USER_BY_ID');


/*------------------------------------------------ADMIN------------------------------------------------*/
export const GET_OWN_CONTESTS_API = 'GET_OWN_CONTESTS_API';
export const POST_TEST = 'POST_TEST';
export const UPDATE_OWNED_CONTESTS = 'UPDATE_OWNED_CONTESTS';
export const UPDATE_OWN_TESTS = 'UPDATE_OWN_TESTS';
export const OPEN_CREATE_QUESTION_DIALOG = 'OPEN_CREATE_QUESTION_DIALOG';
export const CANCEL_CREATE_QUESTION_DIALOG = 'CANCEL_CREATE_QUESTION_DIALOG';
export const UPDATE_EDITING_QUESTION = 'UPDATE_EDITING_QUESTION';
export const UPDATE_EDITING_TEST = 'UPDATE_EDITING_TEST';
export const UPDATE_EDITING_CONTEST = 'UPDATE_EDITING_CONTEST';
export const UPDATE_ADMIN_QUESTIONS = 'UPDATE_ADMIN_QUESTIONS';
export const UPDATE_ADMIN_QUESTION_BY_ID = 'UPDATE_ADMIN_QUESTION_BY_ID';
export const UPDATE_ADMIN_QUESTION = 'UPDATE_ADMIN_QUESTION';

export const POST_OWN_CONTEST = createRequestType('POST_OWN_CONTEST');
export const PUT_OWN_CONTEST = createRequestType('PUT_OWN_CONTEST');

export const GET_OWN_TESTS = createRequestType('GET_OWN_TESTS');
export const POST_OWN_TESTS = createRequestType('POST_OWN_TESTS');
export const PUT_OWN_TESTS = createRequestType('PUT_OWN_TESTS');

export const GET_OWN_QUESTIONS = createRequestType('GET_OWN_QUESTIONS');
export const POST_OWN_QUESTIONS = createRequestType('POST_OWN_QUESTIONS');
export const PUT_OWN_QUESTIONS = createRequestType('PUT_OWN_QUESTIONS');

export const SET_OPEN_ADMIN_FULLSCREEN_DIALOG = 'SET_OPEN_CREATE_SWITCH_DIALOG';


/*------------------------------------------------SETTING------------------------------------------------*/

export const UPDATE_THEME_MODE = 'UPDATE_THEME_MODE';
export const UPDATE_LANGUAGE_MODE = 'UPDATE_LANGUAGE_MODE';

