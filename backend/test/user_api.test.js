const {test, beforeEach, describe, after} = require('node:test')
const assert = require('node:assert')
const User = require('../models/user')
const app = require('../app')
const supertest = require('supertest')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const api = supertest(app)

describe('initial inserting of user', () => {
    beforeEach(async() => {
        await User.deleteMany()

        const passwordHash = await bcrypt.hash('screct', 10)
        const user = new User({username: 'root2', passwordHash})

        await user.save()
    })

    test('invalid user are not created', async() => {
        const users = await User.find({})

        const newUser = {
            username: 'new',
            password: '12'
        }

        const result = await api.post('/api/user').send(newUser).expect(401).expect('Content-Type', /application\/json/)
        assert(result.body.error.includes('Password should be given and have length greater than 3'))

        const users2 = await User.find({})
        assert.strictEqual(users.length, users2.length)
    })
})

after(async() => {
    await mongoose.connection.close()
})