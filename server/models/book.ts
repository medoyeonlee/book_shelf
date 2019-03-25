import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    author:{
        type:String,
        required:true
    },
    review:{
        type:String,
        default:'n/a'
    },
    pages:{
        type:String,
        default:'n/a'
    },
    rating:{
        type:Number,
        required:true,
        min:1,
        max:5
    },
    price:{
        type:Number,
        default:0
    },
    ownerId:{
        type:String,
        required:true
    }
},{timestamps:true})

export const Book = mongoose.model('Book',bookSchema);

