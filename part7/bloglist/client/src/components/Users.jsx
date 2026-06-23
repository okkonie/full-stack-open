import { useUsersStore } from "../store"
import { styled } from "styled-components"
import { Link } from "react-router-dom"
const Table = styled.table`
  width: 100%;
  text-align: left;
  font-size: 16px;
  border-collapse: collapse;

  th,
  td {
    border-bottom: 1px solid #ddd;
    padding: 12px;
  }

  th {
    font-weight: bold;
  }
`

export default function Users() {
  const { users } = useUsersStore()

  return (
    <>
      <h2>Users</h2>
      <Table>
        <tr>
          <th>Name</th>
          <th>Username</th>
          <th>Blogs created</th>
        </tr>

        {users.map((u) => (
          <tr key={u.id}>
            <td>
              <Link to={`/users/${u.id}`}>{u.name}</Link>
            </td>
            <td>{u.username}</td>
            <td>{u.blogs.length}</td>
          </tr>
        ))}
      </Table>
    </>
  )
}
