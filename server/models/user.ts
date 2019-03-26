import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { IUSerDocument } from '../server';
import { resolve } from 'dns';
import { Db } from 'mongodb';
const config = require('./../config/config').get(process.env.NODE_ENV);
const SALT_I  = 10;


const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        trim:true,
        unique:1
    },
    password:{
        type:String,
        required:true,
        minlength:6
    },
    name:{
        type:String,
        maxlength:100
    },
    lastname:{
        type:String,
        maxlength:100
    },
    role:{
        type:Number,
        default:0
    },
    token:{
        type:String
    }
})

userSchema.pre<IUSerDocument>('save',function(next){
    let user = this;
    if(user.isModified('password')){
        bcrypt.genSalt(SALT_I,(err,salt)=>{
            if(err) return next(err);

            bcrypt.hash(user.password,salt,(err,hash)=>{
                if(err) return next(err);
                user.password=hash;
                next();
            })
        })
    }else{
        next();
    }
})

userSchema.methods.comparePassword = function(candidatePassword:string,cb:Function){
    bcrypt.compare(candidatePassword,this.password,(err,isMatch)=>{
        if(err) return cb(err);
        cb(null,isMatch);
    })
}

userSchema.methods.generateToken = function(cb:Function){
    let user= this;
    console.log(config.SECRET)
    let token= jwt.sign(user._id.toHexString(),config.SECRET);

    user.token = token;
    user.save(function(err:Error,user:IUSerDocument){
        if(err) return cb(err);
        cb(null,user);
    })
}

userSchema.statics.findByToken = function(token:string,cb:Function){
    let user = this;

    jwt.verify(token,config.SECRET,function(err:Error,decode:any){
        user.findOne({"_id":decode,"token":token},function(err:Error,user:IUSerDocument){
            if(err) return cb(err);
            cb(null,user)
        })
    })
}

userSchema.methods.deleteToken = function(token:string,cb:Function){
    let user = this;

    user.update({$unset:{token:1}},(err:Error,user:IUSerDocument)=>{
        if(err) return cb(err);
        cb(null,user);
    })
}

export const User = mongoose.model<IUSerDocument>('User',userSchema);

