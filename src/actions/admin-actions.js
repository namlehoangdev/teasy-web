import {
    API_STATUS,
    action,
    SET_OPEN_ADMIN_FULLSCREEN_DIALOG,
    GET_OWN_CONTESTS_API,
    UPDATE_OWNED_CONTESTS
} from './action-types';

export const setOpenAdminFullscreenDialog = value => action(SET_OPEN_ADMIN_FULLSCREEN_DIALOG, {value});

export const getOwnContests = () => action(GET_OWN_CONTESTS_API);

export const updateOwnedContests = (contests) => action(UPDATE_OWNED_CONTESTS, {contests});
