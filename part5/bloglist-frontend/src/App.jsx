import { useState, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Routes, Route, Link, useNavigate
} from 'react-router-dom'
import Blogs from './components/Blogs'
import Blog from './components/Blog'
import NewBlog from './components/NewBlog'
import Login from './components/Login'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import Togglable from './components/Togglable'

const AppContent = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState('')

  const navigate = useNavigate()

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

      handleMessage(`logged in as ${user.name}`)
      navigate('/')
    } catch {
      handleMessage('wrong username or password')
    }
  }

  const handleLogout = async () => {
    try {
      setUser(null)
      window.localStorage.removeItem('user')

      handleMessage('logged out')
      navigate('/')
    } catch {
      handleMessage('failed to logout')
    }
  }

  const createBlog = async (blog) => {
    try {
      const created = await blogService.create(blog)
      setBlogs(blogs.concat(created))

      handleMessage(`a new blog ${created.title} by ${created.author} was added`)
      navigate('/')
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
        navigate('/')
      } catch {
        handleMessage('error deleting blog')
      }
    }
  }

  const sortedBlogs = blogs.sort((a,b) => b.likes - a.likes)

  return (
    <>
      <div>
        <Link style={{ padding: 5 }} to="/">blogs</Link>

        {user && <Link style={{ padding: 5 }} to="/create">new blog</Link>}

        {user
          ? <button onClick={handleLogout}>logout</button>
          : <Link style={{ padding: 5 }} to="/login">login</Link>
        }
      </div>

      <Notification message={message}/>

      <Routes>

        <Route path='/' element={<Blogs blogs={sortedBlogs}/>}/>
        <Route path='/create' element={<NewBlog createBlog={createBlog}/>}/>
        <Route path='/login' element={<Login handleLogin={handleLogin}/>}/>
        <Route path="/blogs/:id" element={
          <Blog
            blogs={blogs}
            handleLike={handleLike}
            handleDelete={handleDelete}
            loggedUsername={user && user.username}
          />
        }/>

      </Routes>
    </>

  )
}

const App = () => (
  <Router>
    <AppContent />
  </Router>
)

export default App