import { QueryClient, useQuery } from "@tanstack/react-query";
import userService from '../services/user'

const User = ()  => {

    const getUser = useQuery({
        queryKey: ['user'],
        queryFn: userService.getUser
    })

    const users = getUser.data ?? []

    return (
        <div>
            <h2>Users</h2>
            <table>
                <thead>
                    <tr>
                        <td></td>
                        <td><strong>blogs created</strong></td>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key = {user.id}>
                            <td>{user.username}</td>
                            <td>{user.blogs.length}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default User