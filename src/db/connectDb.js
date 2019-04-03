import {
    MongoClient,
    ObjectID
} from 'mongodb';
import 'dotenv/config';
const dbName = process.env.DB_NAME || 'learning';
const dbHost = process.env.DB_HOST || 'mongodb://127.0.0.1:27017';
const mongoOptions = {
    useNewUrlParser: true
};
const state = {
    db: null
};
export const connect = (cb) => {
    if (state.db) {
        cb();
    } else {
        MongoClient.connect(dbHost, mongoOptions, (err, client) => {
            if (err) {
                cb(err);
            } else {
                state.db = client.db(dbName);
                cb();
            }
        })
    }
}
export const getPrimaryKey = (_id) => ObjectID(_id);
export const getDb = () => state.db;