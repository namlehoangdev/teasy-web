import {
    API_STATUS,
    action,
    GET_SHARED_CONTESTS,
    GET_PUBLIC_CONTESTS,
    UPDATE_OWN_TESTS,
    UPDATE_SHARED_CONTESTS,
    UPDATE_ALL_CONTESTS,
    UPDATE_PUBLIC_CONTESTS,
    UPDATE_OWN_CONTEST_BY_ID,
    UPDATE_ALL_CONTEST_BY_ID,
    SET_OPEN_PLAYGROUND_FULLSCREEN_DIALOG,
    GET_CONTEST_BY_ID,
    UPDATE_COMPETING_CONTEST,
    UPDATE_COMPETING_RESULT,
    POST_CONTEST_RESULT,
    GET_MARKED_CONTEST_RESULT,
    GET_OWN_CONTEST_RESULTS,
    UPDATE_OWN_CONTEST_RESULTS,
    UPDATE_OWN_CONTEST_RESULT_BY_ID
} from './action-types';

export const setOpenPlaygroundFullscreenDialog = (value) => action(SET_OPEN_PLAYGROUND_FULLSCREEN_DIALOG, {value});

export const getSharedContests = () => action(GET_SHARED_CONTESTS);

export const getPublicContests = () => action(GET_PUBLIC_CONTESTS);

export const getContestById = (id) => action(GET_CONTEST_BY_ID, {id});

export const updateSharedContests = (contests) => action(UPDATE_SHARED_CONTESTS, {contests});

export const updateCompetingContest = (contest) => action(UPDATE_COMPETING_CONTEST, contest);

export const updatePublicContests = (contests) => action(UPDATE_PUBLIC_CONTESTS, {contests});

export const updateAllContests = (contests) => action(UPDATE_ALL_CONTESTS, {contests});

export const updateAllContestById = (id, contest) => action(UPDATE_ALL_CONTEST_BY_ID, {id, contest});

export const updateCompetingResult = (result) => action(UPDATE_COMPETING_RESULT, {result});

export const postContestResult = (params, hasFullAnswers) => action(POST_CONTEST_RESULT, {params, hasFullAnswers});

export const getMarkedContestResult = (resultId) => action(GET_MARKED_CONTEST_RESULT, resultId);

export const getOwnContestResults = () => action(GET_OWN_CONTEST_RESULTS);


export const updateOwnContestResults = (results) => action(UPDATE_OWN_CONTEST_RESULTS, {results});

export const updateOwnContestResultById = (id, result) => action(UPDATE_OWN_CONTEST_RESULT_BY_ID, {id, result});

