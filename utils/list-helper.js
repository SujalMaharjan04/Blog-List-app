const _ = require('lodash')
const object = require('lodash/fp/object')


const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((sum, blogs) => {
        return sum + blogs.likes
    }, 0)
}

const favoriteBlog = (blogs) => {
    return blogs.reduce((max, blogs) => {
        return blogs.likes > max.likes ? blogs : max
    }, blogs[0])
}

const mostBlogs = (blogs) => {
    const nums = _.countBy(blogs, 'author')
    const maxNums = Math.max(...Object.values(nums))
    const author = blogs.reduce((max, curr) => {
        max = max[author]
        curr = curr[author]

        if (curr > max) {
            return curr
        } else {
            return max
        }
    })

    return {author, maxNums}
}

module.exports = {dummy, totalLikes, favoriteBlog, mostBlogs}