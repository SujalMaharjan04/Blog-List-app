const express = require('express')
const middleware = require('./utils/middleware')
const blogRouter = require('./controllers/blog')
const userRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const cors = require('cors')
const app = express()

app.use(cors())

app.use(express.json())

app.use(middleware.getToken)

app.use('/api/blog', blogRouter)
app.use('/api/user', userRouter)
app.use('/api/login', loginRouter)

if (process.env.NODE_ENV === 'test') {
    const router = require('./controllers/testing')
    app.use('/api/testing', router)
}

app.use(middleware.errorHandler)

module.exports = app