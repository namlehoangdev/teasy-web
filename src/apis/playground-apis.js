import ApiInstance from './api-config';


export const getPublicContestsAPI = () => ApiInstance.get('Competitions');

export const getSharedContestsAPI = () => ApiInstance.get('Competitions/MyShared');

export const getContestByIdAPI = (id) => ApiInstance.get(`Competitions/${id}`);

// export const getOwnTestsAPI = () => ApiInstance.get('Tests/MyOwn');
//
// export const getOwnQuestionsAPI = () => ApiInstance.get('Questions/MyOwn');
//
// export const postTestAPI = (tests) => ApiInstance.post('Tests', tests);
//
export const postContestResultAPI = (params) => ApiInstance.post('Results', params);

export const getMarkedContestResultAPI = (id) => ApiInstance.get(`Results/MyCompetitionResult/${id}`);



