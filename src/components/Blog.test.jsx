import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './blogs'
import BlogForm from './BlogForm'

describe('Blog component test', () => {
    let container
    let mockhandle
    beforeEach(() => {
        mockhandle = vi.fn()
        const blog = {
            title: "testing",
            author: "test",
            url: "www.test.com",
            likes: 10
        }
        

        container = render(<Blog blog = {blog} updateBlog={mockhandle}/>).container
    })
    
    test('checking if blog displays url and likes by default', () => {

        const title = screen.getByText(/testing by test/i)

        expect(title).toBeInTheDocument()

        const url = screen.queryByText('www.test.com')
        const likes = screen.queryByText('10')

        expect(url).not.toBeInTheDocument()
        expect(likes).not.toBeInTheDocument()
    })

    test('clicking a button shows url and likes', async() => {
        const user = userEvent.setup()

        const beforeClickUrl = screen.queryByText('url: www.test.com')
        const beforeClickLikes = screen.queryByText(`likes: 10`)
        
        expect(beforeClickUrl).not.toBeInTheDocument()
        expect(beforeClickLikes).not.toBeInTheDocument()

        const button = screen.getByText('View More')
        await user.click(button)

        const title = screen.getByText('testing')
        const author = screen.getByText('author: test')

        expect(title).toBeInTheDocument()
        

        const url = screen.getByText('url: www.test.com')
        const likes = screen.getByText(`likes: ${10}`)

        expect(url).toBeInTheDocument()
        expect(likes).toBeInTheDocument()
        expect(author).toBeInTheDocument()
    })

    test('when like button is clicked twice, the event handler is called twice', async() => {
        const user = userEvent.setup()

        const view = screen.getByText('View More')
        await user.click(view)

        const button = screen.getByText('like')

        await user.click(button)
        await user.click(button)

        expect(mockhandle.mock.calls).toHaveLength(2)
    })
})

describe('<BlogForm test', () => {
    test('testing if the form sends the entered blog', async() => {
        const createBlogs = vi.fn()

        const user = userEvent.setup()

        render(<BlogForm createBlog = {createBlogs} />)

        const title = screen.getByPlaceholderText('title')
        const author = screen.getByPlaceholderText('author')
        const url = screen.getByPlaceholderText('url')

        const submit = screen.getByRole('button', {name: /Add Blog/i})

        await user.type(title, 'The Great')
        await user.type(author, 'Me')
        await user.type(url, 'http://www.me.com')

        await user.click(submit)

        screen.debug()
        console.log(createBlogs.mock.calls)

        expect(createBlogs).toHaveBeenCalledTimes(1)
        
        expect(createBlogs).toHaveBeenCalledWith({
            title: 'The Great',
            author: 'Me',
            url: 'http://www.me.com'
        })

    })
})