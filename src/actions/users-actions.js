import {API_STATUS, action, GET_OWN_CONTESTS, GET_ALL_USERS, UPDATE_ALL_USERS} from './action-types';


export const getAllUsers = () => action(GET_ALL_USERS);
export const updateAllUsers = (users) => action(UPDATE_ALL_USERS, users);
