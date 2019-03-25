import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
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


export const User = mongoose.model('User',userSchema);

