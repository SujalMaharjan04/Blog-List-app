const jwt = require('jsonwebtoken')
const User = require('../models/user')

const userExtractor = async (request, response, next) => {
    try {
        const token = request.token
        if (!token) {
            request.user = null
            return response.status(401).json({error: 'Token missing'})
        }

        const decodedToken = jwt.verify(token, process.env.SECRET)
        if (!decodedToken.id) {
            return response.status(401).json({error: 'Token Invalid'})
        }

        const user = await User.findById(decodedToken.id)
        if (!user) {
            return response.status(401).json({error: 'User not found'})
        }

        request.user = user
        next()
    }
    catch (error) {
        if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
            return response.status(401).json({error: 'Invalid token or expired'})
        }
        console.error(error)
        return response.status(500).json({error: "Internal Server Error"})
       
    }
}

const getToken = (request, response, next )=> {
    const authorization = request.get('authorization')

    if (authorization && authorization.startsWith('Bearer ')) {
        request.token =  authorization.replace('Bearer ', '')
    } else {
        request.token = null
    }

    next()
}

const errorHandler = (err, req, res, next) => {
    if (err.name === 'MongoServerError' && err.message.includes('E11000 duplicate key error')) {
        return res.status(400).json({error: "expected `username` to be unique"})
    }

    next(err)
}

module.exports = {userExtractor, getToken, errorHandler}