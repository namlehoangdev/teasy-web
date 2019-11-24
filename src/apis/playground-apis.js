import ApiInstance from './api-config';


export const getPublicContestsAPI = () => ApiInstance.get('Competitions');

export const getSharedContestsAPI = () => ApiInstance.get('Competitions/MyShared');

// export const getOwnTestsAPI = () => ApiInstance.get('Tests/MyOwn');
//
// export const getOwnQuestionsAPI = () => ApiInstance.get('Questions/MyOwn');
//
// export const postTestAPI = (tests) => ApiInstance.post('Tests', tests);
//
// export const postContestAPI = (contest) => ApiInstance.post('Competitions', contest);



