import { useContext, useState } from "react";
import {  QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import blogService from '../services/blog'
import { NotificationContext } from "../context";

const Blog = ({updateBlog}) => {
    const query = useQueryClient()
    const {id} = useParams()
    const [comments, setComments] = useState('')
    const [notification, dispatch ]= useContext(NotificationContext)

    //Comment Query
    const getComment = useQuery({
        queryKey: ['comments', id],
        queryFn: () => blogService.getComment(id)
    })

    //Add Comment Mutate
    const uploadComment = useMutation({
        mutationFn: async({id, newComment}) => {
            
            return await blogService.setComment(id, newComment)},
        onSuccess: (_, blog) => {
            query.invalidateQueries({queryKey: ['comments', blog.id]})
            dispatch({
                type: 'SET_NOTIFICATION',
                payload: {
                    text: 'A new comment is added',
                    type: 'success'
                }
            })

            setTimeout(() => {
                dispatch({
                    type: 'CLEAR_NOTIFICATION'
                })
            }, 5000)
            }
    })

    // Blog Query
    const getBlog = useQuery({
        queryKey: ['blog', id],
        queryFn: () => blogService.getBlog(id)
    })

    if (getBlog.isLoading) {
        return (<h2>Loading...</h2>)
    }

    if (getComment.isLoading) {
        return (<h2>Loading...</h2>)
    }

    const blog = getBlog.data
    let comment = getComment.data
   
    
    
    
    const handleComment = (id, newComment) => {
        if (!newComment) {
            dispatch({
                type: 'SET_NOTIFICATION',
                payload: {
                    text: 'No Comment Present',
                    type: 'error'
                }
            })

            setTimeout(() => {
                dispatch({
                    type: 'CLEAR_NOTIFICATION'
                })
            }, 5000)

            return null
        }
        uploadComment.mutate({id: blog.id, newComment})
        setComments('')
        
    }
    return (
        <div>
            <h2>{blog.title}</h2>
            <a href = '#'>{blog.url}</a>
            <p>{blog.likes}<button onClick = {() => updateBlog({...blog, likes: blog.likes+1})}>Like</button> </p>
            <p>Added by {blog.author}</p>

            <h2>Comment</h2>
            <input type = "text" value = {comments} onChange = {(event) => setComments(event.target.value)} />
            <button onClick={() => handleComment(blog.id, comments)}>Add Comment</button>
            <ul>
                
                {comment.map((c, index) => (
                    <li key = {index}>
                        {c}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Blog
