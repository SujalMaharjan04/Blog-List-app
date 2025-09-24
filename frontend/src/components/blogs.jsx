import {useState} from 'react'
import { Link } from 'react-router-dom'


const Blogs = ({blog, updateBlog, deleteBlog, user}) => {
    const [view, setView] = useState(false)
 
    
    return (
        <>
            <li className = "list-style-none">
                 <div  className='blog p-2'>
                    <div className='text-black'><Link to = {`/blog/${blog.id}`} className = "fs-5 text-decoration-none text-black">{blog.title}</Link> by {blog.author}</div>  
                  </div>
            </li>
            
        </>
    )
}

export default Blogs