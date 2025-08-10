import {useState} from 'react'


const Blog = ({blog, updateBlog, deleteBlog, user}) => {
    const [view, setView] = useState(false)

    const blogStyle = {
        border: "2px solid black",
        margin: "10px",
        padding: "10px",
        width: "20%"
    }
    
    const handleView = () => {
        setView(!view)
        
    }
    const handleLike = () => {
        updateBlog({
            title: blog.title,
            author: blog.author,
            url: blog.url,
            likes: blog.likes + 1
        })
    }

    const handleDelete = () => {
        window.confirm(`Are you sure you want to delete blog ${blog.title}`)
        deleteBlog(blog.id)
    }
    
    return (
        <>
            <li>
                {view 
                ? <div style = {blogStyle} className='blog'>
                    <div>{blog.title}<button onClick={handleView}>Hide</button></div>
                    <div>url: {blog.url}</div>
                    <div>likes: {blog.likes}<button onClick={handleLike}>like</button></div>
                    <div>author: {blog.author}</div>
                    {user && blog.user && user.username === blog.user.username && (
                        <div><button onClick={handleDelete}>Delete</button></div>
                    )}
                    
                </div>
                : <div style = {blogStyle} className='blog'>
                    <div className = "title">{blog.title} by {blog.author}<button onClick={handleView}>View More</button></div>  
                  </div>}
            </li>
            
        </>
    )
}

export default Blog