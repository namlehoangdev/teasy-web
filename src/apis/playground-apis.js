import ApiInstance from './api-config';


export const getPublicContestsAPI = () => ApiInstance.get('Competitions');

export const getSharedContestsAPI = () => ApiInstance.get('Competitions/MyShared');

export const getContestMetadataAPI = (code) => ApiInstance.get(`Competitions/Metadata/${code}`);

export const getContestByIdAPI = (id, {password}) => ApiInstance.get(`Competitions/${id}?password=${password}`);


export const getAnonymousContestByIdAPI = (id, {password}) => ApiInstance.get(`Competitions/Anonymous/${id}?password=${password}`);

export const getAnonymousContestMetadataByCodeAPI = (code) => ApiInstance.get(`Competitions/Metadata/Anonymous/${code}`);

// export const getOwnTestsAPI = () => ApiInstance.get('Tests/MyOwn');
//
// export const getOwnQuestionsAPI = () => ApiInstance.get('Questions/MyOwn');
//
// export const postTestAPI = (tests) => ApiInstance.post('Tests', tests);
//
export const postContestResultAPI = (params) => ApiInstance.post('Results', params);

export const postAnonymousContestResultAPI = (params) => ApiInstance.post('Results/Anonymous', params);

export const getMarkedContestResultAPI = (id) => ApiInstance.get(`Results/MyCompetitionResult/${id}`);

export const getMarkedAnonymousContestResultAPI = (id) => ApiInstance.get(`Results/MyCompetitionResult/Anonymous/${id}`);

export const getOwnContestResultsAPI = () => ApiInstance.get('Results/MyOwn');



