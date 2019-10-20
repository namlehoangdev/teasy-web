import ApiInstance from './api-config';

const getOwnedContestsAPI = () => ApiInstance.get('Contests/MyOwn');

export default [getOwnedContestsAPI];


