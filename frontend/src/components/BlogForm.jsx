import {useState} from 'react'

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
        <form onSubmit = {handleBlog}>
            <div>
            Title:
            <input type = "text" name = "Title" data-testid = "title" placeholder = "title" value = {title} onChange={({target}) => setTitle(target.value)} />
            </div>
            <div>
            Author:
            <input type = "text" name = "Author" data-testid = "author" placeholder = "author" value = {author} onChange={({target}) => setAuthor(target.value)} />
            </div>
            <div>
            Url:
            <input type = "url" name = "Url" data-testid = "url" placeholder = "url" value = {url} onChange={({target}) => setUrl(target.value)} />
            </div>
            <div>
            <button type = "submit">Add Blog</button>
            </div>
        </form>
        </div>
    )
}

export default BlogForm