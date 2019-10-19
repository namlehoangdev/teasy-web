import axios from 'axios';
import {store} from '../configurations';

export const TEASY_URL = 'https://serverblockchain.azurewebsites.net/api/';
export const BASE_URL = {
    development: 'https://serverblockchain.azurewebsites.net/api/',
    production: 'https://google.com.vn'
};

function getUrl(config) {
    return config.baseURL ? config.url.replace(config.baseURL, '') : config.url;
}

let instance = axios.create({
    baseURL: TEASY_URL,
    timeout: 10000,
    // validateStatus: function (status) {
    //     return status >= 200 && status < 300;
    // },
    headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        "Access-Control-Allow-Origin": "*",
    }
});

instance.interceptors.request.use(
    function (config) {
        console.log('%c ' + config.method.toUpperCase() + ' - ' + config.baseURL + config.url, 'color: #0086b3; font-weight: bold', config);
        const storeState = store.getState();
        const {token} = storeState.authReducer && storeState.authReducer.profile;
        config.headers.Authorization = token;
        return config;
    },
    function (error) {
        console.log('%cAPI REQUEST FAILED: ', 'color: #ff5c20; font-weight: bold', error);
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(function (response) {
    // Do something with response data
    console.log(response.data);
    return {data: response.data};
}, function (error) {
    // Do something with response error
    return Promise.reject(err => {
        console.log(err);
        return {error: {...err.response.data}};
    });
});

// instance.interceptors.response.use(
//     function (response) {
//         console.log('%cAPI SUCCESS: ', 'color: #2dff70; font-weight: bold', response);
//         return response.data;
//     },
//     function (error) {
//         console.log('%cAPI FAILURE: ', 'color: #B00020; font-weight: bold', error);
//         return Promise.reject(error);
//     }
// );

export default instance;
