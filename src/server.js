import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
const app = express();

app.use(cors());
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json())

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.get('/', (req, res) => {
    res.send({
        message: 'Welcome to API server CoderTapSu'
    })
});

import 'dotenv/config';

import router from './routes/api-routes';

app.use('/api', router);

const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 9000;

import {
    connect
} from './db/connectDb';

connect((err) => {
    if (err) {
        console.log('unable to connect to database');
        process.exit(1);
    } else {
        // app.listen(parseInt(port), host, () => {
        //     console.log(`Server is running on ${host}:${port}`)
        // })
        app.listen(parseInt(port), () => {
            console.log(`Server is running on ${port}`)
        })
    }
});