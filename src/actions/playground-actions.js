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
    UPDATE_OWN_CONTEST_RESULT_BY_ID,
    GET_ANONYMOUS_CONTEST_METADATA_BY_CODE,
    GET_ANONYMOUS_CONTEST_BY_ID,
    POST_ANONYMOUS_CONTEST_RESULT, GET_MARKED_ANONYMOUS_CONTEST_RESULT, GET_CONTEST_METADATA, CLEAR_COMPETING_CONTEST
} from './action-types';

export const setOpenPlaygroundFullscreenDialog = (value) => action(SET_OPEN_PLAYGROUND_FULLSCREEN_DIALOG, {value});

export const getSharedContests = () => action(GET_SHARED_CONTESTS);

export const getPublicContests = () => action(GET_PUBLIC_CONTESTS);

export const getContestById = (id, params, onSuccess, onError) => action(GET_CONTEST_BY_ID, {
    id,
    params,
    onSuccess,
    onError
});

export const getAnonymousContestMetadataByCode = (code, onSuccess, onError) =>
    action(GET_ANONYMOUS_CONTEST_METADATA_BY_CODE, {code, onSuccess, onError});

export const getContestMetadata = (code, onSuccess, onError) =>
    action(GET_CONTEST_METADATA, {code, onSuccess, onError});

export const getAnonymousContestById = (id, params, onSuccess, onError) => action(GET_ANONYMOUS_CONTEST_BY_ID, {
    id,
    params,
    onSuccess,
    onError
});


export const updateSharedContests = (contests) => action(UPDATE_SHARED_CONTESTS, {contests});

export const updateCompetingContest = (contest) => action(UPDATE_COMPETING_CONTEST, contest);

export const updatePublicContests = (contests) => action(UPDATE_PUBLIC_CONTESTS, {contests});

export const updateAllContests = (contests) => action(UPDATE_ALL_CONTESTS, {contests});

export const updateAllContestById = (id, contest) => action(UPDATE_ALL_CONTEST_BY_ID, {id, contest});

export const updateCompetingResult = (result) => action(UPDATE_COMPETING_RESULT, {result});

export const postContestResult = (params, hasFullAnswers, isShownAnswers) => action(POST_CONTEST_RESULT, {
    params,
    hasFullAnswers,
    isShownAnswers
});

export const postAnonymousContestResult = (params, hasFullAnswers, isShownAnswers) => action(POST_ANONYMOUS_CONTEST_RESULT, {
    params,
    hasFullAnswers,
    isShownAnswers
});

export const getMarkedContestResult = (resultId) => action(GET_MARKED_CONTEST_RESULT, resultId);
export const getMarkedAnonymousContestResult = (resultId) => action(GET_MARKED_ANONYMOUS_CONTEST_RESULT, resultId);

export const getOwnContestResults = () => action(GET_OWN_CONTEST_RESULTS);


export const updateOwnContestResults = (results) => action(UPDATE_OWN_CONTEST_RESULTS, {results});

export const updateOwnContestResultById = (id, result) => action(UPDATE_OWN_CONTEST_RESULT_BY_ID, {id, result});

export const clearCompetingContest = () => action(CLEAR_COMPETING_CONTEST);

