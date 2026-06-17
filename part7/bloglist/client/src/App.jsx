import { useState, useEffect } from "react"
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom"
import Blogs from "./components/Blogs"
import Blog from "./components/Blog"
import NewBlog from "./components/NewBlog"
import Login from "./components/Login"
import blogService from "./services/blogs"
import loginService from "./services/login"
import Notification from "./components/Notification"
import Togglable from "./components/Togglable"
import styled from "styled-components"
import ErrorBoundary from "./components/ErrorBoundary"

const Page = styled.div`
  padding: 1em;
  font-family: monospace;
`

const Nav = styled.div`
  background-color: #222;
  color: white;
  padding: 1em;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const NavLink = styled(Link)`
  padding: 1em;
  margin: 0.5em;
  text-decoration: none;
  color: #eee;
  font-weight: bold;
  font-size: 18px;

  &:hover {
    text-decoration: underline;
  }
`

const AppContent = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("user")

    if (loggedUserJSON) {
      const loggedUser = JSON.parse(loggedUserJSON)
      blogService.setToken(loggedUser.token)
      setUser(loggedUser)
    }
  }, [])

  const handleMessage = (text, success) => {
    setMessage({ message: text, success: success })
    setTimeout(() => setMessage(null), 3000)
  }

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({ username, password })
      blogService.setToken(user.token)
      setUser(user)

      window.localStorage.setItem("user", JSON.stringify(user))

      handleMessage(`logged in as ${user.name}`, true)
      navigate("/")
    } catch {
      handleMessage("wrong username or password", false)
    }
  }

  const handleLogout = async () => {
    try {
      setUser(null)
      window.localStorage.removeItem("user")

      handleMessage("logged out", true)
      navigate("/")
    } catch {
      handleMessage("failed to logout", false)
    }
  }

  const createBlog = async (blog) => {
    try {
      const created = await blogService.create(blog)
      setBlogs(blogs.concat(created))

      handleMessage(
        `a new blog ${created.title} by ${created.author} was added`,
        true,
      )
      navigate("/")
    } catch {
      handleMessage("error creating blog", false)
    }
  }

  const handleLike = async (blog) => {
    try {
      const updated = await blogService.update({
        ...blog,
        likes: blog.likes + 1,
        user: blog.user.id,
      })

      setBlogs(
        blogs.map((old) =>
          old.id === updated.id ? { ...updated, user: old.user } : old,
        ),
      )
    } catch {
      handleMessage("error updating blog", false)
    }
  }

  const handleDelete = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`, true)) {
      try {
        await blogService.remove(blog.id)
        setBlogs(blogs.filter((old) => old.id !== blog.id))
        navigate("/")
      } catch {
        handleMessage("error deleting blog", false)
      }
    }
  }

  const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes)

  return (
    <Page>
      <Nav>
        <h1>Blog app</h1>
        <div>
          <NavLink to="/">blogs</NavLink>
          {user && <NavLink to="/create">new blog</NavLink>}
          {user ? (
            <NavLink to="/" onClick={handleLogout}>
              logout
            </NavLink>
          ) : (
            <NavLink to="/login">login</NavLink>
          )}
        </div>
      </Nav>
      <ErrorBoundary>
        <Notification notification={message} />
        <Routes>
          <Route path="/" element={<Blogs blogs={sortedBlogs} />} />
          <Route path="/create" element={<NewBlog createBlog={createBlog} />} />
          <Route path="/login" element={<Login handleLogin={handleLogin} />} />
          <Route
            path="/blogs/:id"
            element={
              <Blog
                blogs={blogs}
                handleLike={handleLike}
                handleDelete={handleDelete}
                loggedUsername={user && user.username}
              />
            }
          />
          <Route path="*" element={<h2>404 - Page not found</h2>} />
        </Routes>
      </ErrorBoundary>
    </Page>
  )
}

const App = () => (
  <Router>
    <AppContent />
  </Router>
)

export default App
