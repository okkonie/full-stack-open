import { useState } from 'react'

export default function Blog({ blog, handleLike, handleDelete, loggedUsername }){
  const [expanded, setExpanded] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 5,
    border: 'solid',
    borderWidth: 1,
    marginTop: 5
  }

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author} <button onClick={() => setExpanded(!expanded)}>{expanded ? 'hide' : 'view'}</button>

      {expanded &&
        <>
          <br/>{blog.url}
          <br/>likes {blog.likes} <button onClick={() => handleLike(blog)}>like</button>
          <br/>{blog.user.name}

          {loggedUsername === blog.user.username &&
            <><br/><button onClick={() => handleDelete(blog)}>delete</button></>
          }
        </>
      }
    </div>
  )
}