const Blog = require('../models/blog')

const initialBlog = [
    {
        title: 'The Great Gatsy',
        author: 'Me',
        URL: 'www.whatever.com',
        likes: 10
    },
    {
        title: 'The wall',
        author: 'He',
        URL: 'www.wall.com',
        likes: 5
    }
]

module.exports = {initialBlog}