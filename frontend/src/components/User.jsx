import userService from '../services/user'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

const User = () => {
    const {id}= useParams()

    const getUser = useQuery({
        queryKey: ['user', id],
        queryFn: () => userService.getUserById(id)
    })

    if (getUser.isLoading) {
        return (<h2>Loading....</h2>)
    }

    const user = getUser.data
    

    return (
        <div>
            <h2>{user.username}</h2>
            <h3>added blogs</h3>
            <ul>
                {user.blogs.map(blog => (
                    <li key = {blog.id}>
                        {blog.title}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default User