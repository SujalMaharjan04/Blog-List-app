import {useState} from 'react'
import { Form, Button } from 'react-bootstrap'

const BlogForm = ({createBlog}) => {
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url , setUrl] = useState('')

    const handleBlog = (event) => {
        event.preventDefault()
        createBlog({
          title: title,
          author: author,
          url: url
        })
        setTitle('')
        setAuthor('')
        setUrl('')
    }

   
    return (
        <div>
        <Form onSubmit = {handleBlog}>
            <Form.Group>
                <Form.Label>Title:</Form.Label>
                <Form.Control type = "text" name = "Title" data-testid = "title" placeholder = "title" value = {title} onChange={({target}) => setTitle(target.value)} />
            </Form.Group>
            <Form.Group>
                <Form.Label>Author:</Form.Label>
                <Form.Control type = "text" name = "Author" data-testid = "author" placeholder = "author" value = {author} onChange={({target}) => setAuthor(target.value)} />
            </Form.Group>
            <Form.Group>
                <Form.Label> Url:</Form.Label>
                <Form.Control type = "url" name = "Url" data-testid = "url" placeholder = "url" value = {url} onChange={({target}) => setUrl(target.value)} />
                </Form.Group>
            <Form.Group>
                <Button type = "submit" className = "btn btn-success mt-2 ">Add Blog</Button>
            </Form.Group>
        </Form>
        </div>
    )
}

export default BlogForm