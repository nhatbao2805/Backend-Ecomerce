const httpStatusCode = require('../httpStatusCode/httpStatusCode')
//super này sẽ được truy cập vào trong class cha 
// đối với việc truyền tham số thì phải cẩn thận giữa việc truyền lên 1 object hay việc truyền trực tiếp các giá trị lên dựa theo vị trí
class ErrorResponse extends Error {

    constructor(message, status) {
        super(message);
        this.status = status;
    }

}

class ConflictRequestError extends ErrorResponse {

    constructor(message = httpStatusCode.ReasonPhrases.CONFLICT, status = httpStatusCode.StatusCodes.CONFLICT) {
        super(message, status);
    }

}

class BadRequestError extends ErrorResponse {

    constructor(message = httpStatusCode.ReasonPhrases.BAD_REQUEST, status = httpStatusCode.StatusCodes.BAD_REQUEST) {
        super(message, status);
    }

}

class AuthFailureError extends ErrorResponse {

    constructor(message = httpStatusCode.ReasonPhrases.UNAUTHORIZED, status = httpStatusCode.StatusCodes.UNAUTHORIZED) {
        super(message, status);
    }

}

class NotFoundError extends ErrorResponse {

    constructor(message = httpStatusCode.ReasonPhrases.NOT_FOUND, status = httpStatusCode.StatusCodes.NOT_FOUND) {
        super(message, status);
    }
}

class ForbiddenError extends ErrorResponse {

    constructor(message = httpStatusCode.ReasonPhrases.FORBIDDEN, status = httpStatusCode.StatusCodes.FORBIDDEN) {
        super(message, status);
    }
}


module.exports = {
    ConflictRequestError,
    BadRequestError,
    AuthFailureError,
    NotFoundError,
    ForbiddenError
}