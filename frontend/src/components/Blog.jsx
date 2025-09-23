import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import blogService from '../services/blog'

const Blog = ({updateBlog}) => {
    const {id} = useParams()

    const getBlog = useQuery({
        queryKey: ['blog', id],
        queryFn: () => blogService.getBlog(id)
    })

    if (getBlog.isLoading) {
        return (<h2>Loading...</h2>)
    }

    const blog = getBlog.data
    
    return (
        <div>
            <h2>{blog.title}</h2>
            <a href = '#'>{blog.url}</a>
            <p>{blog.likes}<button onClick = {() => updateBlog({...blog, likes: blog.likes+1})}>Like</button> </p>
            <p>Added by {blog.author}</p>
        </div>
    )
}

export default Blog
