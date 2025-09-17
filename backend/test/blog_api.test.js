const supertest = require('supertest')
const mongoose = require('mongoose')
const {test, beforeEach, after, describe} = require('node:test')
const assert = require('node:assert')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')
const User = require('../models/user')
const bcrypt = require('bcrypt')

const api = supertest(app)

beforeEach(async() => {
    await User.deleteMany({})
    await Blog.deleteMany({})

    const passwordHash = await bcrypt.hash('1234', 10)

    const user = new User({username: 'testuser', passwordHash})
    await user.save()

    const blogWithUser = helper.initialBlog.map(blog => ({
        ...blog,
        user: user._id
    }))


    await Blog.insertMany(blogWithUser)

   
})

test('returns all blog in JSON format', async() => {
    const result = await api.get('/api/blog').expect(200).expect('Content-type', /application\/json/)

    assert.strictEqual(result.body.length, helper.initialBlog.length)
})

test('default id', async() => {
    const result = await api.get('/api/blog')

    result.body.forEach(blog => {
        assert.strictEqual(typeof blog.id !== 'undefined' , true)
    })
    
})

test('adding a new blog', async() => {
    const login = await api
        .post('/api/login')
        .send({username: 'testuser', password: '1234'})
    
    const token = login.body.token

    const newBlog = {
        title: 'New',
        author: 'You',
        url: 'www.you.com',
        likes: 1
    }
    await api
        .post('/api/blog')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(200)
        .expect('Content-type', /application\/json/)
    
    const result = await api.get('/api/blog')
    
    assert.strictEqual(result.body.length, helper.initialBlog.length + 1)

    assert.deepStrictEqual(result.body.some(blog => blog.title === 'New'&& blog.author === 'You'&& blog.url=== 'www.you.com' && blog.likes === 1), true)
})

test('changing the value of likes to 0 if not given', async() => {
    const login = await api.post('/api/login').send({username: 'testuser', password: '1234'})

    const token = login.body.token

    const newBlog = {
        title: 'New',
        author: 'You',
        url: 'www.you.com',
    }

    const result = await api.post('/api/blog').set('Authorization', `Bearer ${token}`).send(newBlog).expect(200).expect('Content-type', /application\/json/)

    assert.deepStrictEqual(result.body.likes, 0)

})

test('new note should have both title and url', async() => {
    const login = await api.post('/api/login').send({username: 'testuser', password: '1234'})
    const token = login.body.token
    const newBlog = {
        author: 'You',
        likes: 3
    }

    await api.post('/api/blog').set('Authorization', `Bearer ${token}`).send(newBlog).expect(400).expect('Content-type', /application\/json/)


})

describe('deleting a blog', () => {
    test('deleting a blog', async() => {
        const login = await api.post('/api/login').send({username: 'testuser', password: '1234'})
        const token = login.body.token

        const blogsCollection = await api.get('/api/blog')
        let blogAtFirst = blogsCollection.body[0]

        await api
            .delete(`/api/blog/${blogAtFirst.id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(204)
        
        const remainingBlog = await api.get('/api/blog')
        
        const bl = remainingBlog.body.map(b => b.title)
        assert.strictEqual(!bl.includes(blogAtFirst.title), true)

        assert.strictEqual(remainingBlog.body.length, blogsCollection.body.length - 1)
    })
})

test('updating the information of a blog post', async() => {
    const newLikes = {
        likes: 100
    }

    const result = await api.get('/api/blog')
    const blogAtFirst = result.body[0]

    const update = await api    
            .put(`/api/blog/${blogAtFirst.id}`)
            .send(newLikes)
            .expect(200)
            .expect('Content-type', /application\/json/)
    
    assert.strictEqual(update.body.likes, newLikes.likes)

    const newResult = await api.get(`/api/blog/${blogAtFirst.id}`)
    assert.strictEqual(newResult.body.likes, 100)
})

after(async() => {
    await mongoose.connection.close()
})
