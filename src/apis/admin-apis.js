import ApiInstance from './api-config';

export const getOwnedContestsAPI = () => ApiInstance.get('Contests/MyOwn');

export const postTestAPI = (tests) => ApiInstance.post('Tests', tests);


