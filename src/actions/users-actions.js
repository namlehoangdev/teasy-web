import {API_STATUS, action, GET_OWN_CONTESTS_API, GET_ALL_USER_API, UPDATE_ALL_USERS} from './action-types';


export const getAllUsers = () => action(GET_ALL_USER_API);
export const updateAllUsers = (users) => action(UPDATE_ALL_USERS, users);
