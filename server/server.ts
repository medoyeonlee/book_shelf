import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import mongoose,{Document} from 'mongoose';
const config = require('./config/config').get(process.env.NODE_ENV);
import {User} from './models/user';
import {Book} from './models/book';
import { isBuffer } from 'util';
import { Hash } from 'crypto';
import {auth} from './middleware/auth';

export interface IUSerDocument extends Document {
    
    email:string;
    password:string;
    name:string;
    lastname:string;
    role:number;
    token:string;
    comparePassword:Function;
    generateToken:Function;
    findByToken:Function;
    deleteToken:Function;
}
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


app.get('/api/auth',auth,(req,res)=>{
    res.json({
        isAuth:true,
        id:req.user._id,
        email:req.user.email,
        name:req.user.name,
        lastname:req.user.lastname
    })
})
//유저 로그아웃
app.get('/api/logout',auth,(req,res)=>{
    req.user.deleteToken(req.token,(err:Error,user:IUSerDocument)=>{
        if(err) return res.status(400).send(err);

        res.sendStatus(200);

    })
})



//책 검색 (아이디로)
app.get('/api/getBook',(req,res)=>{
    let id = req.query.id;

    Book.findById(id,(err,doc)=>{
        if(err) return res.status(400).send(err);
        res.send(doc)
    })
})

//모든 책 검색
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

//리뷰어 검색(아이디로)
app.get('/api/getReviewer',(req,res)=>{
    let id = req.query.id;

    User.findById(id,(err,doc)=>{
        if(err) return res.status(400).send(err);
        //res.send와 같음
        res.json({
            name:doc!.name,
            lastname:doc!.lastname
        })
    })
})

//모든 유저 검색
app.get('/api/users',(req,res)=>{
    User.find({},(err,users)=>{
        res.status(200).send(users)
    })
})

app.get('/api/user_posts',(req,res)=>{
    Book.find({ownerId:req.query.user}).exec((err,docs)=>{
        if(err) return res.status(400).send(err);
        res.send(200)
    })
})
//post

//책 등록
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

//유저 가입
app.post('/api/register',(req,res)=>{
    const user = new User(req.body);
    user.save((err,doc)=>{
        if(err) return res.status(400).send(err);

        res.status(200).json({
            success:true,
            user:doc
        })
    })
})

//유저 로그인
app.post('/api/login',(req,res)=>{
    User.findOne({'email':req.body.email},(err,user)=>{
        if(!user) return res.json({isAuth:false,message:'email not found'})

        user.comparePassword(req.body.password,(err:Error,isMatch:Boolean)=>{
            if(!isMatch) return res.json({
                isAuth:false,
                message:'wrong password'
            });
            user.generateToken((err:Error,user:IUSerDocument)=>{
                if(err) return res.status(400).send(err)

                res.cookie('auth',user.token).json({
                    isAuth:true,
                    id:user._id,
                    email:user.email
                });
            })
        })
    })
})

//update

//책 수정(아이디로))
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


//책 삭제(아이디로))
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