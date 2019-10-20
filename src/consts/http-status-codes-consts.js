export const HTTP_STATUS_CODES = {
    accepted: 202,
    badGateway: 502,
    badRequest: 400,
    conflict: 409,
    continue: 100,
    created: 201,
    expectationFailed: 417,
    failedDependency: 424,
    forbidden: 403,
    gatewayTimeout: 504,
    gone: 410,
    httpVersionNotSupported: 505,
    imATeapot: 418,
    insufficientSpaceOnResource: 419,
    insufficientStorage: 507,
    internalServerError: 500,
    lengthRequired: 411,
    locked: 423,
    methodFailure: 420,
    methodNotAllowed: 405,
    movedPermanently: 301,
    movedTemporarily: 302,
    multiStatus: 207,
    multipleChoices: 300,
    networkAuthenticationRequired: 511,
    noContent: 204,
    nonAuthoritativeInformation: 203,
    notAcceptable: 406,
    notFound: 404,
    notImplemented: 501,
    notModified: 304,
    ok: 200,
    partialContent: 206,
    paymentRequired: 402,
    permanentRedirect: 308,
    preconditionFailed: 412,
    preconditionRequired: 428,
    processing: 102,
    proxyAuthenticationRequired: 407,
    requestHeaderFieldsTooLarge: 431,
    requestTimeout: 408,
    requestTooLong: 413,
    requestUriTooLong: 414,
    requestedRangeNotSatisfiable: 416,
    resetContent: 205,
    seeOther: 303,
    serviceUnavailable: 503,
    switchingProtocols: 101,
    temporaryRedirect: 307,
    tooManyRequests: 429,
    unauthorized: 401,
    unprocessableEntity: 422,
    unsupportedMediaType: 415,
    useProxy: 305
};
export const HTTP_STATUS_MESSAGES = {
    [HTTP_STATUS_CODES.accepted]: "Accepted",
    [HTTP_STATUS_CODES.badGateway]: "Bad Gateway",
    [HTTP_STATUS_CODES.badRequest]: "Bad Request",
    [HTTP_STATUS_CODES.conflict]: "Conflict",
    [HTTP_STATUS_CODES.continue]: "Continue",
    [HTTP_STATUS_CODES.created]: "Created",
    [HTTP_STATUS_CODES.expectationFailed]: "Expectation Failed",
    [HTTP_STATUS_CODES.failedDependency]: "Failed Dependency",
    [HTTP_STATUS_CODES.forbidden]: "Forbidden",
    [HTTP_STATUS_CODES.gatewayTimeout]: "Gateway Timeout",
    [HTTP_STATUS_CODES.gone]: "Gone",
    [HTTP_STATUS_CODES.httpVersionNotSupported]: "HTTP Version Not Supported",
    [HTTP_STATUS_CODES.imATeapot]: "I'm a teapot",
    [HTTP_STATUS_CODES.insufficientSpaceOnResource]: "Insufficient Space on Resource",
    [HTTP_STATUS_CODES.insufficientStorage]: "Insufficient Storage",
    [HTTP_STATUS_CODES.internalServerError]: "Server Error",
    [HTTP_STATUS_CODES.lengthRequired]: "Length Required",
    [HTTP_STATUS_CODES.locked]: "Locked",
    [HTTP_STATUS_CODES.methodFailure]: "Method Failure",
    [HTTP_STATUS_CODES.methodNotAllowed]: "Method Not Allowed",
    [HTTP_STATUS_CODES.movedPermanently]: "Moved Permanently",
    [HTTP_STATUS_CODES.movedTemporarily]: "Moved Temporarily",
    [HTTP_STATUS_CODES.multiStatus]: "Multi-Status",
    [HTTP_STATUS_CODES.multipleChoices]: "Multiple Choices",
    [HTTP_STATUS_CODES.networkAuthenticationRequired]: "Network Authentication Required",
    [HTTP_STATUS_CODES.noContent]: "No Content",
    [HTTP_STATUS_CODES.nonAuthoritativeInformation]: "Non Authoritative Information",
    [HTTP_STATUS_CODES.notAcceptable]: "Not Acceptable",
    [HTTP_STATUS_CODES.notFound]: "Not Found",
    [HTTP_STATUS_CODES.notImplemented]: "Not Implemented",
    [HTTP_STATUS_CODES.notModified]: "Not Modified",
    [HTTP_STATUS_CODES.ok]: "OK",
    [HTTP_STATUS_CODES.partialContent]: "Partial Content",
    [HTTP_STATUS_CODES.paymentRequired]: "Payment Required",
    [HTTP_STATUS_CODES.permanentRedirect]: "Permanent Redirect",
    [HTTP_STATUS_CODES.preconditionFailed]: "Precondition Failed",
    [HTTP_STATUS_CODES.preconditionRequired]: "Precondition Required",
    [HTTP_STATUS_CODES.processing]: "Processing",
    [HTTP_STATUS_CODES.proxyAuthenticationRequired]: "Proxy Authentication Required",
    [HTTP_STATUS_CODES.requestHeaderFieldsTooLarge]: "Request Header Fields Too Large",
    [HTTP_STATUS_CODES.requestTimeout]: "Request Timeout",
    [HTTP_STATUS_CODES.requestTooLong]: "Request Entity Too Large",
    [HTTP_STATUS_CODES.requestUriTooLong]: "Request-URI Too Long",
    [HTTP_STATUS_CODES.requestedRangeNotSatisfiable]: "Requested Range Not Satisfiable",
    [HTTP_STATUS_CODES.resetContent]: "Reset Content",
    [HTTP_STATUS_CODES.seeOther]: "See Other",
    [HTTP_STATUS_CODES.serviceUnavailable]: "Service Unavailable",
    [HTTP_STATUS_CODES.switchingProtocols]: "Switching Protocols",
    [HTTP_STATUS_CODES.temporaryRedirect]: "Temporary Redirect",
    [HTTP_STATUS_CODES.tooManyRequests]: "Too Many Requests",
    [HTTP_STATUS_CODES.unauthorized]: "Unauthorized",
    [HTTP_STATUS_CODES.unprocessableEntity]: "Unprocessable Entity",
    [HTTP_STATUS_CODES.unsupportedMediaType]: "Unsupported Media Type",
    [HTTP_STATUS_CODES.useProxy]: "Use Proxy",
};

export const HTTP_STATUS_CODES_DEFINITIONS = {
    informationalResponses: 'informationalResponses',
    successfulResponses: 'successfulResponses',
    redirects: 'redirects',
    clientErrors: 'clientErrors',
    serverErrors: 'serverErrors',
    notValidCodes: 'notValidCodes'
};




