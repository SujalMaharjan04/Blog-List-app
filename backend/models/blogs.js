const mongoose = require('mongoose')
require('dotenv').config()
const logger = require('../utils/logger')
const config = require('../utils/config')

const blogSchema = mongoose.Schema({
    title: String,
    author: String,
    url: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    likes: Number,
    comments: {
        type: [String],
        default: []
    }
})

blogSchema.set('toJSON', {
    transform : (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
}
)

const Blog = mongoose.model('Blog', blogSchema)

const url = config.MONGODB_URI;

if (mongoose.connect(url)) {
    logger.info('Connect to the database')
} else {
    logger.info('Connection to DB failed')
}


module.exports = Blog
