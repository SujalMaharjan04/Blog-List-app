import { QueryClient, useQuery } from "@tanstack/react-query";
import userService from '../services/user'
import { Link } from "react-router-dom";

const Users = ()  => {

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
                            <td><Link to = {`/user/${user.id}`}>{user.username}</Link></td>
                            <td>{user.blogs.length}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Users