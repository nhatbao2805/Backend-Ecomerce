const _ = require('lodash');

const getInforData = ({ fields = [], object = {} }) => {
    return _.pick(object, fields)
}

const getSelectData = (select = []) => {
    return Object.fromEntries(select.map((el) => [el, 1]))
}

const getUnselectData = (select = []) => {
    return Object.fromEntries(select.map((el) => [el, 0]))
}

const removeUndefinedObject = (obj) => {
    Object.keys(obj).forEach(k => {
        if (obj[k] == null) {
            delete obj[k]
        }
    })
    return obj
}

const removeNestedObjectParser = (obj) => {
    const final = {}
    Object.keys(final).forEach(k => {
        if (typeof obj[k] === "Object" && !Array.isArray(obj[k])) {
            const response = removeNestedObjectParser(obj[k])
            Object.keys(response).forEach(k => {
                final[`${k}.${a}`] = res[a]
            })
        } else {
            final[k] = obj[k]
        }
    })
    return final
}

module.exports = {
    getInforData,
    getSelectData,
    getUnselectData,
    removeUndefinedObject,
    removeNestedObjectParser
}