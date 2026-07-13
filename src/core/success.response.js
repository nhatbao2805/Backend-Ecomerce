const httpStatusCode = require('../httpStatusCode/httpStatusCode')
//super này sẽ được truy cập vào trong class cha 
// đối với việc truyền tham số thì phải cẩn thận giữa việc truyền lên 1 object hay việc truyền trực tiếp các giá trị lên dựa theo vị trí
class SuccessResponse {

    constructor({ message, statusCode = httpStatusCode.StatusCodes.OK, reasonStatusCode = httpStatusCode.ReasonPhrases.OK, metaData = {} }) {
        this.message = !message ? reasonStatusCode : message;
        this.status = statusCode;
        this.metaData = metaData
    }
    send(res, headers = {}) {
        return res.status(this.status).json(this)
    }

}

class OK extends SuccessResponse {
    constructor({ message, metaData }) {
        super({ message, metaData })
    }
}

class CREATED extends SuccessResponse {
    constructor({ message, statusCode = httpStatusCode.StatusCodes.CREATED, reasonStatusCode = httpStatusCode.ReasonPhrases.CREATED, metaData }) {
        super({ message, statusCode, reasonStatusCode, metaData })
    }
}


module.exports = {
    OK,
    CREATED,
    SuccessResponse
}