import ApiInstance from './api-config';


export const getOwnedContestsAPI = () => ApiInstance.get('Competitions/MyOwn');

export const getOwnTestsAPI = () => ApiInstance.get('Tests/MyOwn');

export const getOwnQuestionsAPI = () => ApiInstance.get('Questions/MyOwn');

export const postTestAPI = (tests) => ApiInstance.post('Tests', tests);

export const postContestAPI = (contest) => ApiInstance.post('Competitions', contest);

export const deleteOwnContestAPI = (contestId) => ApiInstance.delete(`Competitions/${contestId}`);

