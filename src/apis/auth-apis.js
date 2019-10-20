import ApiInstance from './api-config';

export const postLoginByThirdParty = (params) => ApiInstance.post('Users/Login', params);

export const postRegisterByThirdPartyAPI = (params) => ApiInstance.post('Users/Register', params);





