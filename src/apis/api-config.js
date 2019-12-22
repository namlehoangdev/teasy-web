import axios from "axios";
import {store} from "../configurations";
import {history} from "../configurations";
import _ from "lodash";
import {logout, updateUnauthorizedDialog} from "../actions";
import {HTTP_STATUS_CODES} from "../consts/http-status-codes-consts";

export const TEASY_URL = "https://serverblockchain.azurewebsites.net/api/";
export const BASE_URL = {
    development: "https://serverblockchain.azurewebsites.net/api/",
    production: "https://google.com.vn"
};

function getUrl(config) {
    return config.baseURL ? config.url.replace(config.baseURL, "") : config.url;
}

const axiosInstance = axios.create({
    baseURL: TEASY_URL,
    timeout: 10000,
    // validateStatus: function (status) {
    //     return status >= 200 && status < 300;
    // },
    headers: {
        "Content-Type": "application/json;charset=UTF-8",
        "Access-Control-Allow-Origin": "*"
    }
});

axiosInstance.interceptors.request.use(
    function (config) {
        console.log(
            "%c " + config.method.toUpperCase() + " - " + config.baseURL + config.url,
            "color: #0086b3; font-weight: bold",
            config
        );
        const storeState = store.getState();
        const token = _.get(storeState, "authReducer.profile.token", null);
        if (token) {
            config.headers.Authorization = token;
        }
        return config;
    },
    function (error) {
        console.log(
            "%cAPI REQUEST FAILURE: ",
            "color: #ff5c20; font-weight: bold",
            error
        );

        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    function (response) {
        console.log(
            "%cAPI RESPONSE SUCCESS: ",
            "color: #2dff70; font-weight: bold",
            response
        );
        return {data: response.data};
    },
    function (error) {
        console.error(
            "%cAPI RESPONSE FAILURE: ",
            "color: #B00020; font-weight: bold",
            error.response
        );
        if (
            error.response &&
            error.response.status &&
            error.response.status === HTTP_STATUS_CODES.unauthorized
        ) {
            if (!error.response.config.url.includes("Login") || !error.response.config.url.includes('waiting')) {
                store.dispatch(updateUnauthorizedDialog(true));
            }
        }
        return Promise.reject(error.response);
    }
);

export default axiosInstance;
