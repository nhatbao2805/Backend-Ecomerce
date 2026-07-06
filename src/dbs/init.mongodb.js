const mongoose = require('mongoose')
const { db: { name, port, host } } = require('../configs/config.mongodb')
const connectString = `mongodb://${host}:${port}/${name}`
class Database {

    constructor() {
        this.connect()
    }

    connect() {

        if (1 === 1) {
            mongoose.set('debug', true);
            mongoose.set('debug', { color: true });
        }

        mongoose.connect(connectString, {
            maxPoolSize: 10 // setting limit connections to mongoDB
        })
            .then(() => console.log('Connected to MongoDB'))
            .catch(err => console.log(err));
    }

    static getInstance() {

        if (!Database.instance) {
            Database.instance = new Database()
        }
        return Database.instance

    }

}

const instanceMongoDb = Database.getInstance()
module.exports = instanceMongoDb
