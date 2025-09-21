const blogRouter = require('express').Router()
const { rearg } = require('lodash')
const blog = require('../models/blogs')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const { userExtractor } = require('../utils/middleware')



blogRouter.get('/', async(req, res) => {
    const result = await blog.find({}).populate('user', {username: 1, name: 1, id: 1})
    res.json(result)
})

blogRouter.get('/:id', async(req, res) => {
    const result = await blog.findById(req.params.id)
    res.json(result)
})

blogRouter.post('/', userExtractor, async(req, res) => {
    const result = req.body

    const user = req.user

    if (!result.title || !result.url) {
        return res.status(400).json({error: 'Title and URL should be inclulded'})
    }
    if (!result.likes) {
        result.likes = 0
    }
    const blogs = await new blog({
        title: result.title,
        url: result.url,
        likes: result.likes,
        author: result.author,
        user: user._id
    })

    const saved = await blogs.save()
    user.blogs = user.blogs.concat(saved._id)

    await user.save()

    const populateSaved = await blog.findById(saved._id).populate('user', {username: 1, name: 1})
    
    res.status(200).json(populateSaved)
})

blogRouter.put('/:id', async(req, res) => {
    const {title, author, url, likes} = req.body

    const blogCollection = await blog.findById(req.params.id)

    if (!blogCollection) {
        return res.status(404).end()
    }

    blogCollection.title = title
    blogCollection.author = author
    blogCollection.url = url
    blogCollection.likes = likes

    const saved = await blogCollection.save()

    res.status(200).json(saved)
})

blogRouter.delete('/:id', userExtractor, async(req, res) => {
    try {
        const user = req.user

        const result = await blog.findById(req.params.id)

        if (!result) {
            return res.status(404).json({error: "Blog not found"})
        }

        if (result.user.toString() === user.id.toString()) {
            await result.deleteOne()
            return  res.status(204).end()
        } else {
            return res.status(401).json({error: 'Invalid user'})
        }
    }
    catch(error) {
        return res.status(401).json({error: 'Invalid or expired token'})
    }

   
})
module.exports = blogRouter