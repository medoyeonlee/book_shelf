import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
const config = require('./config/config').get(process.env.NODE_ENV);

const app = express();


mongoose.Promise = global.Promise;
mongoose.connect(config.DATABASE);

app.use(bodyParser.json());
app.use(cookieParser());



const port = process.env.port || 3002;
app.listen(port,()=>{
    console.log('SERVER RUNNING')
})