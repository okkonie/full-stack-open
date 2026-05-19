import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import NewBlog from './components/NewBlog'
import Login from './components/Login'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState('')

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
      const created = await blogService.create(blog)
      setBlogs(blogs.concat(created))

      handleMessage(`a new blog ${created.title} by ${created.author} was added`)
    } catch {
      handleMessage('error creating blog')
    }
  } 

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
      <NewBlog createBlog={createBlog}/>
      {blogs.map((blog, i) =>
        <Blog key={blog.id || i} blog={blog} />
      )}
    </div>
    
  )
}

export default App