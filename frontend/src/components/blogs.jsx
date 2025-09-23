import {useState} from 'react'
import { Link } from 'react-router-dom'


const Blogs = ({blog, updateBlog, deleteBlog, user}) => {
    const [view, setView] = useState(false)

    const blogStyle = {
        border: "2px solid black",
        margin: "10px",
        padding: "10px",
        width: "20%"
    }
    
   

    
    
    return (
        <>
            <li>
                 <div style = {blogStyle} className='blog'>
                    <div className = "title"><Link to = {`/blog/${blog.id}`}>{blog.title}</Link> by {blog.author}</div>  
                  </div>
            </li>
            
        </>
    )
}

export default Blogs