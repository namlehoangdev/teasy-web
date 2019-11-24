import {
    API_STATUS,
    action,
    GET_SHARED_CONTESTS,
    GET_ALL_CONTESTS,
    UPDATE_OWN_TESTS,
    UPDATE_SHARED_CONTESTS, UPDATE_ALL_CONTESTS
} from './action-types';


export const getSharedContests = () => action(GET_SHARED_CONTESTS);

export const getAllContests = () => action(GET_ALL_CONTESTS);

export const updateSharedContests = (contests) => action(UPDATE_SHARED_CONTESTS, {contests});

export const updateAllContests = (contests) => action(UPDATE_ALL_CONTESTS, {contests});


