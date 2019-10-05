import axios from 'axios';

export const BASE_URL = {
    development: '',//'https://qcpromotion.zalopay.vn',
    production: 'https://promotion.zalopay.vn'
};

function getUrl(config) {
    return config.baseURL ? config.url.replace(config.baseURL, '') : config.url;
}

let instance = axios.create({
    baseURL: BASE_URL[process.env.NODE_ENV],
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

instance.interceptors.request.use(
    function (config) {
        //for development
        console.log('%c ' + config.method.toUpperCase() + ' - ' + getUrl(config), 'color: #0086b3; font-weight: bold', config);
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    function (response) {
        return response.data;
    },
    function (error) {
        return Promise.reject(error);
    }
);

export default instance;
