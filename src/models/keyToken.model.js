const { Schema, model } = require('mongoose');
const DOCUMENT_NAME = 'Key';
const COLLECTION_NAME = 'Keys';
const keyTokenSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        require: true,
        ref: 'Shop'
    },
    publicKey: {
        type: String,
        require: true,
    },
    privateKey: {
        type: String,
        require: true,
    },
    refreshTokensUsed: {
        type: Array,
        default: [], // những RT đã được sử dụng
    },
    refreshToken: {
        type: String,
        require: true, //  RT đang được sử dụng
    },
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});
module.exports = model(DOCUMENT_NAME, keyTokenSchema);