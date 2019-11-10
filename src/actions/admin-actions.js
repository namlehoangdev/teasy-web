import {
    action,
    SET_OPEN_ADMIN_FULLSCREEN_DIALOG,
    GET_OWN_CONTESTS_API,
    UPDATE_OWNED_CONTESTS,
    OPEN_CREATE_QUESTION_DIALOG,
    UPDATE_EDITING_QUESTION,
    UPDATE_EDITING_TEST,
    UPDATE_EDITING_CONTEST,
    CANCEL_CREATE_QUESTION_DIALOG, UPDATE_ADMIN_QUESTION_BY_ID, POST_TEST, GET_OWN_TESTS, UPDATE_OWN_TESTS
} from './action-types';

export const setOpenAdminFullscreenDialog = value => action(SET_OPEN_ADMIN_FULLSCREEN_DIALOG, {value});

export const getOwnContests = () => action(GET_OWN_CONTESTS_API);

export const getOwnTests = () => action(GET_OWN_TESTS);

export const updateOwnedContests = (contests) => action(UPDATE_OWNED_CONTESTS, {contests});

export const updateOwnTests = (contests) => action(UPDATE_OWN_TESTS, {contests});

export const openCreateQuestionDialog = () => action(OPEN_CREATE_QUESTION_DIALOG);

export const cancelCreateQuestionDialog = () => action(CANCEL_CREATE_QUESTION_DIALOG);

export const updateEditingQuestion = (question) => action(UPDATE_EDITING_QUESTION, question);

export const updateAdminQuestions = (questions) => action(updateEditingQuestion({questions}));

export const updateEditingTest = (test) => action(UPDATE_EDITING_TEST, test);

export const updateEditingContest = (contest) => action(UPDATE_EDITING_CONTEST, contest);

export const updateAdminQuestionById = (id, question) => action(UPDATE_ADMIN_QUESTION_BY_ID, {id, question});

export const postTest = (tests) => action(POST_TEST, tests);
