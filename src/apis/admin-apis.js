import ApiInstance from './api-config';

export const getOwnedContestsAPI = () => ApiInstance.get('Contests/MyOwn');

export const getOwnTestsAPI = () => ApiInstance.get('Tests/MyOwn');

export const postTestAPI = (tests) => ApiInstance.post('Tests', tests);


