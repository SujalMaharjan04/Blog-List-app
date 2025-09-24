import { QueryClient, useQuery } from "@tanstack/react-query";
import userService from '../services/user'
import { Link } from "react-router-dom";
import { Table } from "react-bootstrap";

const Users = ()  => {

    const getUser = useQuery({
        queryKey: ['user'],
        queryFn: userService.getUser
    })

    const users = getUser.data ?? []

    return (
        <div>
            <h2 className = "fs-1 fw-bold">Users</h2>
            <Table striped className = "text-center">
                <thead>
                    <tr>
                        <td></td>
                        <td className = "fs-5"><strong>blogs created</strong></td>
                    </tr>
                </thead>
                <tbody className = "fs-5">
                    {users.map(user => (
                        <tr key = {user.id}>
                            <td><Link to = {`/user/${user.id}`} className = "text-decoration-none text-black">{user.username}</Link></td>
                            <td>{user.blogs.length}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    )
}

export default Users