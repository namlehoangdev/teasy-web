import {
    action,
    SET_OPEN_ADMIN_FULLSCREEN_DIALOG,
    GET_OWN_CONTESTS_API,
    UPDATE_OWNED_CONTESTS,
    OPEN_CREATE_QUESTION_DIALOG, UPDATE_EDITING_QUESTION, UPDATE_EDITING_TEST, UPDATE_EDITING_CONTEST
} from './action-types';

export const setOpenAdminFullscreenDialog = value => action(SET_OPEN_ADMIN_FULLSCREEN_DIALOG, {value});

export const getOwnContests = () => action(GET_OWN_CONTESTS_API);

export const updateOwnedContests = (contests) => action(UPDATE_OWNED_CONTESTS, {contests});

export const openCreateQuestionDialog = () => action(OPEN_CREATE_QUESTION_DIALOG);

export const updateEditingQuestion = (question) => action(UPDATE_EDITING_QUESTION, question);

export const updateEditingTest = (test) => action(UPDATE_EDITING_TEST, test);

export const updateEditingContest = (contest) => action(UPDATE_EDITING_CONTEST, contest);
