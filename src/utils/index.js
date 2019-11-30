import {HTTP_STATUS_CODES_DEFINITIONS} from "../consts/http-status-codes-consts";
export * from './time-utils';

export function disabledStyleWrapper(disabled, style) {
    return disabled ? {
        ...style,
        pointerEvents: 'none',
        opacity: 0.4
    } : style;
}

export function getHttpsResponseDefinition(statusCode) {
    switch (statusCode) {
        case (statusCode >= 100 && statusCode <= 199) :
            return HTTP_STATUS_CODES_DEFINITIONS.informationalResponses;
        case (statusCode >= 200 && statusCode <= 299) :
            return HTTP_STATUS_CODES_DEFINITIONS.successfulResponses;
        case (statusCode >= 300 && statusCode <= 399) :
            return HTTP_STATUS_CODES_DEFINITIONS.redirects;
        case (statusCode >= 400 && statusCode <= 499) :
            return HTTP_STATUS_CODES_DEFINITIONS.clientErrors;
        case (statusCode >= 500 && statusCode <= 599) :
            return HTTP_STATUS_CODES_DEFINITIONS.serverErrors;
    }
    return HTTP_STATUS_CODES_DEFINITIONS.notValidCodes;
}
