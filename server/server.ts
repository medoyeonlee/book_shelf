import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
const config = require('./config/config').get(process.env.NODE_ENV);
import {User} from './models/user';
import {Book} from './models/book';
import { isBuffer } from 'util';

const app = express();
const configForExpress = 
    {
        useNewUrlParser:true
    }


mongoose.Promise = global.Promise;
mongoose.connect(config.DATABASE,configForExpress);

app.use(bodyParser.json());
app.use(cookieParser());

//get

app.get('/api/getBook',(req,res)=>{
    let id = req.query.id;

    Book.findById(id,(err,doc)=>{
        if(err) return res.status(400).send(err);
        res.send(doc)
    })
})


app.get('/api/books',(req,res)=>{
    //localhost:3002/api/books?skip=3&limit=10
    let skip = parseInt(req.query.skip);
    let limit = parseInt(req.query.limit);
    let order = req.query.order;   

    //ORDER = asc || desc
    Book.find().skip(skip).sort({_id:order}).limit(limit).exec((err,doc)=>{
        if(err) return res.status(400).send(err);
        res.send(doc);
    })
})
//post

app.post('/api/book',(req,res)=>{
    const book = new Book(req.body)
    console.log(book)
    book.save((err,doc)=>{
        if(err) return res.status(400).send(err);

        res.status(200).json({
            post:true,
            bookId: doc._id
        })
    })
})

//update

app.post('/api/book_update',(req,res)=>{
    Book.findByIdAndUpdate(req.body._id,req.body,{new:true},(err,doc)=>{
        if(err) return res.status(400).send(err);
        res.json({
            success:true,
            doc
        })
    })
})
//delete

app.delete('/api/delete_book',(req,res)=>{
    let id = req.query.id;
    Book.findByIdAndRemove(id,(err,doc)=>{
        if(err) return res.status(400).send(err);
        res.json(true)

    })
})

const port = process.env.port || 3002;
app.listen(port,()=>{
    console.log('SERVER RUNNING')
})