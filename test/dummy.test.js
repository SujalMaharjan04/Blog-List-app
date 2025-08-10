const {test, describe} = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list-helper')

test('dummy should return 1', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)

    assert.strictEqual(result, 1)
})

describe('totalLikes check', () => {
    const listWithOneBlog = [{
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
        likes: 5
    }]

    test('When only one blog equal to total like to that one', () => {
        
        const result = listHelper.totalLikes(listWithOneBlog)

        assert.strictEqual(result, 5)
    })
})

describe('favorite Blog', () => {
    test('Highest likes blog', () => {
        const listWithBlog = [{
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 5
        }, {
            title: 'The Great Gatsy',
            author: 'Me',
            url: 'www.whatever.com',
            likes: 10
        }]
         const result = listHelper.favoriteBlog(listWithBlog)
        assert.deepStrictEqual(result, {title: 'The Great Gatsy',
            author: 'Me',
            url: 'www.whatever.com',
            likes: 10
        })
    })   
})

// describe('Most blogs', () => {
//     test('checking most blogs', () => {
//         const listWithBlog1 = [{
//             title: 'Go To Statement Considered Harmful',
//             author: 'Edsger W. Dijkstra',
//             url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
//             likes: 5
//         }, {
//             title: 'The Great Gatsy',
//             author: 'Me',
//             url: 'www.whatever.com',
//             likes: 10
//         }, {
//             title: 'hellow',
//             author: 'Me',
//             url: 'www.whatever.com',
//             likes: 12
//         }]

//         const result = listHelper.mostBlogs(listWithBlog1)
//         assert.deepStrictEqual(result, {author: 'Me', blogs: 2})
//     })
// })