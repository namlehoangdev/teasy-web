import ApiInstance from './api-config';
import {userData} from "../fake-data";

export const getAllUsers = () => ApiInstance.get('Users');
//export const getAllUsers = () => new Promise(resolve => resolve(userData));

