import { useEffect } from "react"
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
import Notification from "./components/Notification"
import Togglable from "./components/Togglable"
import styled from "styled-components"
import ErrorBoundary from "./components/ErrorBoundary"
import {
  useBlogs,
  useBlogActions,
  useSetNotification,
  useUser,
  useUserActions,
} from "./store"

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
  const user = useUser()
  const userActions = useUserActions()
  const blogs = useBlogs()
  const blogActions = useBlogActions()
  const setNotification = useSetNotification()
  const navigate = useNavigate()

  useEffect(() => {
    blogActions.initialize()
  }, [blogActions])

  useEffect(() => {
    userActions.initialize()
  }, [userActions])

  const handleNotification = (text, error) => {
    setNotification(text, error)
  }

  const handleLogin = async (credentials) => {
    try {
      const loggedInUser = await userActions.login(credentials)

      handleNotification(`logged in as ${loggedInUser.name}`, false)
      navigate("/")
    } catch {
      handleNotification("wrong username or password", true)
    }
  }

  const handleLogout = async () => {
    try {
      userActions.logout()
      handleNotification("logged out", false)
      navigate("/")
    } catch {
      handleNotification("failed to logout", true)
    }
  }

  const createBlog = async (blog) => {
    try {
      await blogActions.create(blog)
      handleNotification(
        `a new blog ${blog.title} by ${blog.author} was added`,
        false,
      )
      navigate("/")
    } catch {
      handleNotification("error creating blog", true)
    }
  }

  const handleLike = async (blog) => {
    try {
      await blogActions.like(blog.id)
    } catch {
      handleNotification("error updating blog", true)
    }
  }

  const handleDelete = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`, false)) {
      try {
        await blogActions.remove(blog.id)
        navigate("/")
      } catch {
        handleNotification("error deleting blog", true)
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
        <Notification />
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
