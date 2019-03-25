const config = {
    production:{
        SECRET:process.env.SECRET,
        DATABASE:process.env.MONGODB_URI

    },
    default:{
        SECRET:process.env.SECRET,
        DATABASE:'mongodb://localhost:27017/books_shelf'
    }
}

exports.get = function get(env:string){
    return (<any>config)[env] || config.default
}