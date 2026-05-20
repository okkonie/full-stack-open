import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import NewBlog from './components/NewBlog'
import Login from './components/Login'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState('')

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('user')

    if(loggedUserJSON) {
      const loggedUser = JSON.parse(loggedUserJSON)
      blogService.setToken(loggedUser.token)
      setUser(loggedUser)
    }
  }, [])

  const handleMessage = (text) => {
    setMessage(text)
    setTimeout(() => setMessage(''), 3000)
  }

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({ username, password })
      blogService.setToken(user.token)
      setUser(user)

      window.localStorage.setItem(
        'user', JSON.stringify(user)
      )

      handleMessage(`logged in as ${username}`)

    } catch {
      handleMessage('wrong username or password')
    }
  }

  const handleLogout = async () => {
    try {
      setUser(null)
      window.localStorage.removeItem('user')

      handleMessage(`logged out`)
    } catch {
      handleMessage('failed to logout')
    }
  }

  const createBlog = async (blog) => {
    try {
      blogFormRef.current.toggleVisibility()

      const created = await blogService.create(blog)
      setBlogs(blogs.concat(created)) 

      handleMessage(`a new blog ${created.title} by ${created.author} was added`)
    } catch {
      handleMessage('error creating blog')
    }
  } 

  const handleLike = async (blog) => {
    try {
      const updated = await blogService.update({
        ...blog,
        likes: blog.likes + 1,
        user: blog.user.id
      })

      setBlogs(blogs.map(old => old.id === updated.id ? { ...updated, user: old.user } : old))
    } catch {
      handleMessage('error updating blog')
    }
  }

  const handleDelete = async (blog) => {
    if(window.confirm(`Remove blog ${blog.title} by ${blog.author}`)){
      try {
        await blogService.remove(blog.id)
        setBlogs(blogs.filter(old => old.id !== blog.id))
      } catch {
        handleMessage('error deleting blog')
      }
    }
  }

  const sortedBlogs = blogs.sort((a,b) => b.likes - a.likes)

  if (user === null) {
    return (
      <Login handleLogin={handleLogin} message={message}/>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message}/>
      <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <NewBlog createBlog={createBlog}/>
      </Togglable>
      {sortedBlogs.map(blog =>
        <Blog 
          key={blog.id} 
          blog={blog}
          loggedUsername={user.username}
          handleLike={handleLike}
          handleDelete={handleDelete}
        />
      )}
    </div>
    
  )
}

export default App