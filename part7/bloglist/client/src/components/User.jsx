import { useParams } from "react-router-dom"
import { useUsersStore } from "../store"

export default function User() {
  const { users } = useUsersStore()

  const id = useParams().id
  const user = users.find((n) => n.id === id)

  return (
    <div>
      <h1>{user.name}</h1>
      <h2>added blogs</h2>
      <ul>
        {user.blogs.map((b) => (
          <li>{b.title}</li>
        ))}
      </ul>
    </div>
  )
}
