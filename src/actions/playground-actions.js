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
    UPDATE_ALL_CONTEST_BY_ID, SET_OPEN_PLAYGROUND_FULLSCREEN_DIALOG
} from './action-types';

export const setOpenPlaygroundFullscreenDialog = (value) => action(SET_OPEN_PLAYGROUND_FULLSCREEN_DIALOG, {value});

export const getSharedContests = () => action(GET_SHARED_CONTESTS);

export const getPublicContests = () => action(GET_PUBLIC_CONTESTS);

export const updateSharedContests = (contests) => action(UPDATE_SHARED_CONTESTS, {contests});

export const updatePublicContests = (contests) => action(UPDATE_PUBLIC_CONTESTS, {contests});

export const updateAllContests = (contests) => action(UPDATE_ALL_CONTESTS, {contests});

export const updateAllContestById = (id, contest) => action(UPDATE_ALL_CONTEST_BY_ID, {id, contest});


