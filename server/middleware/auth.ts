import {User} from '../models/user';
import { json } from 'body-parser';
import { Document } from 'mongoose';
import { NextFunction } from 'connect';
import { IUSerDocument } from '../server';


export let auth = (req:any,res:any,next:NextFunction)=>{
    let token = req.cookies.auth;


    User.findByToken(token,(err:Error,user:IUSerDocument)=>{
        if(err) throw err;
        if(!user) return res.json({
            error:true
        })

        req.token = token;
        req.user = user;
        next();
    })
}