import {
    action,
    SET_OPEN_ADMIN_FULLSCREEN_DIALOG,
    GET_OWN_CONTESTS,
    UPDATE_OWN_CONTESTS,
    OPEN_CREATE_QUESTION_DIALOG,
    UPDATE_EDITING_QUESTION,
    UPDATE_EDITING_TEST,
    UPDATE_EDITING_CONTEST,
    CANCEL_CREATE_QUESTION_DIALOG,
    UPDATE_OWN_QUESTION_BY_ID,
    POST_TEST,
    GET_OWN_TESTS,
    UPDATE_OWN_TESTS,
    UPDATE_OWN_QUESTIONS,
    UPDATE_OWN_TEST_BY_ID,
    POST_CONTEST, UPDATE_OWN_CONTEST_BY_ID, GET_OWN_QUESTIONS
} from './action-types';

export const setOpenAdminFullscreenDialog = value => action(SET_OPEN_ADMIN_FULLSCREEN_DIALOG, {value});

export const getOwnContests = () => action(GET_OWN_CONTESTS);

export const getOwnTests = () => action(GET_OWN_TESTS);

export const getOwnQuestions = () => action(GET_OWN_QUESTIONS);

export const updateOwnTests = (tests) => action(UPDATE_OWN_TESTS, {tests});

export const openCreateQuestionDialog = () => action(OPEN_CREATE_QUESTION_DIALOG);

export const cancelCreateQuestionDialog = () => action(CANCEL_CREATE_QUESTION_DIALOG);

export const updateEditingQuestion = (question) => action(UPDATE_EDITING_QUESTION, question);

export const updateEditingTest = (test) => action(UPDATE_EDITING_TEST, test);

export const updateEditingContest = (contest) => action(UPDATE_EDITING_CONTEST, contest);

export const updateOwnQuestions = (questions) => action(UPDATE_OWN_QUESTIONS, {questions});

export const updateOwnQuestionById = (id, question) => action(UPDATE_OWN_QUESTION_BY_ID, {id, question});


export const updateOwnTestById = (id, test) => action(UPDATE_OWN_TEST_BY_ID, {id, test});

export const updateOwnContests = (contests) => action(UPDATE_OWN_CONTESTS, {contests});

export const updateOwnContestById = (id, contest) => action(UPDATE_OWN_CONTEST_BY_ID, {id, contest});

export const postTest = (tests) => action(POST_TEST, tests);

export const postContest = (contest) => action(POST_CONTEST, contest);
