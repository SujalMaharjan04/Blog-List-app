const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    blogs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog'
    }],
    username: {
        type: String,
        unique: true,
        required: true,
        minLength: 3
    },
    name: String,
    passwordHash: {
        type: String,
        required: true
    }

})

userSchema.set('toJSON', {
    transform: (document, requestedObject) => {
        requestedObject.id = requestedObject._id.toString()
        delete requestedObject._id
        delete requestedObject.__v
        delete requestedObject.passwordHash
    }
})

const User = mongoose.model('User', userSchema)

module.exports = User