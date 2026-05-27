import { Link } from 'react-router-dom'
import { useParams } from 'react-router-dom'

export default function Blog({ blogs, handleLike, handleDelete, loggedUsername }){
  const id = useParams().id
  const blog = blogs.find(n => n.id === id)

  if(!blog) return null

  return (
    <div>
      <h2>{blog.author}: {blog.title}</h2>
      <a href={blog.url} target="_blank" rel="noreferrer">{blog.url}</a>
      <p>likes {blog.likes} {loggedUsername && <button onClick={() => handleLike(blog)}>like</button>}</p>
      <p>Added by {blog.user.name}</p>
      {loggedUsername === blog.user.username && <button onClick={() => handleDelete(blog)}>remove</button>}
    </div>
  )
}