const bcrypt = require('bcrypt')
const userRouter = require('express').Router()
const User = require('../models/user')

userRouter.get('/', async(request, response) => {
    const user = await User.find({}).populate('blogs', {title: 1, author: 1, url: 1, likes: 1})

    response.status(200).json(user)
})

userRouter.get('/:id', async(request, response) => {
    const user = await User.findById(request.params.id).populate('blogs',{title: 1, author: 1, url: 1, likes: 1})

    response.status(200).json(user)
})

userRouter.post('/', async(request, response, next) => {
    try {
        const {username, name, password} = request.body

        if (!(password && password.length > 3)) {
            return response.status(401).json({error: "Password should be given and have length greater than 3"})
        }
    
        saltRound = 10

        const passwordHash = await bcrypt.hash(password, saltRound)

        const newUser = new User ({
            username,
            name,
            passwordHash,
        })

        const result = await newUser.save()

        return response.status(201).json(result)
    }
    catch (error) {
        next(error)
    }
})

module.exports = userRouter