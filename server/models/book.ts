import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
    name:{},
    author:{},
    review:{

    },
    pages:{

    },
    rating:{

    },
    price:{

    },
    ownerId:{

    }
},{timestamps:true})

export const Book = mongoose.model('Book',bookSchema);

