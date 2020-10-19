import { useState, useEffect } from 'react';
import { parseCookies } from 'nookies';
import baseUrl from '../helpers/baseUrl';

function UserRoles() {
    const [users, setUsers] = useState([])
    const cookies = parseCookies();
    const { token } = cookies;

    useEffect(() => {
        fetchUser()
    }, [])

    const fetchUser = async () => {
        const res = await fetch(`${baseUrl}/api/users`, {
            headers: {
                "Authorization": token
            }
        })
        const res2 = await res.json();
        console.log(res2)
        setUsers(res2)
    }

    const handleRole = async (_id, role) => {
        console.log('In UserRoles', _id, role);
        const res = await fetch(`${baseUrl}/api/users`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify({
                _id,
                role
            })
        })
        const res2 = await res.json();
        console.log(res2)

        const updatedUsers = users.map(user => {
            if (user.role != res2.role && user.email == res2.email) {
                return res2;
            } else {
                return user;
            }
        })

        setUsers(updatedUsers);
    }

    return (
        <>
            <h1>User Roles</h1>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                    </tr>
                </thead>

                <tbody>
                    {
                        users.map(user => {
                            return (
                                <tr key={user._id}>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td onClick={() => handleRole(user._id, user.role)}>{user.role}</td>
                                </tr>
                            )
                        })
                    }

                </tbody>
            </table>

        </>
    )
}

export default UserRoles;
