import { useState, useEffect } from 'react'
import { Container } from '@mui/material'
import {
  Link, Navigate, Route, Routes, useMatch, useNavigate
} from 'react-router-dom'
import LoginForm from './components/LoginForm'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import BlogList from './components/BlogList'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const storageKey = 'loggedBlogappUser'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState({ message: '', className: '' })
  const navigate = useNavigate()
  const match = useMatch('/blogs/:id')
  const blog = match
    ? blogs.find(currentBlog => currentBlog.id === match.params.id)
    : null

  const timeoutNotificationHandler = originalNotificationMessage => {
    return () => {
      setNotification(currentNotification => {
        if (currentNotification.message === originalNotificationMessage) {
          return { message: '', className: '' }
        }

        return currentNotification
      })
    }
  }

  const showNotification = newNotification => {
    setNotification(newNotification)
    setTimeout(timeoutNotificationHandler(newNotification.message), 5000)
  }

  useEffect(() => {
    const fetchBlogs = async () => {
      const initialBlogs = await blogService.getAll()
      setBlogs(initialBlogs)
    }

    fetchBlogs()
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem(storageKey)

    if (loggedUserJSON) {
      const loggedUser = JSON.parse(loggedUserJSON)
      blogService.setToken(loggedUser.token)
      setUser(loggedUser)
    }
  }, [])

  const handleLogin = async credentials => {
    try {
      const loggedInUser = await loginService.login(credentials)
      blogService.setToken(loggedInUser.token)
      window.localStorage.setItem(storageKey, JSON.stringify(loggedInUser))
      setUser(loggedInUser)
      showNotification({
        message: `${loggedInUser.name} logged in`,
        className: 'success',
      })
      navigate('/')
      return loggedInUser
    } catch (error) {
      console.error('login failed', error)
      showNotification({
        message: error.response?.data?.error || 'login failed',
        className: 'error',
      })
      return null
    }
  }

  const handleLogout = () => {
    const loggedOutUserName = user.name

    blogService.setToken(null)
    window.localStorage.removeItem(storageKey)
    setUser(null)
    showNotification({
      message: `${loggedOutUserName} logged out`,
      className: 'success',
    })
    navigate('/')
  }

  const handleCreateBlog = async blog => {
    try {
      const createdBlog = await blogService.create(blog)
      setBlogs(currentBlogs => currentBlogs.concat(createdBlog))
      showNotification({
        message: `a new blog ${createdBlog.title} added`,
        className: 'success',
      })
      navigate('/')
      return createdBlog
    } catch (error) {
      console.error('blog creation failed', error)
      showNotification({
        message: error.response?.data?.error || 'blog creation failed',
        className: 'error',
      })
      return null
    }
  }

  const handleLike = async blog => {
    try {
      const userId = typeof blog.user === 'string' ? blog.user : blog.user?.id
      const blogToUpdate = {
        title: blog.title,
        author: blog.author,
        url: blog.url,
        likes: blog.likes + 1,
        user: userId,
      }
      const updatedBlog = await blogService.update(blog.id, blogToUpdate)

      setBlogs(currentBlogs =>
        currentBlogs.map(currentBlog =>
          currentBlog.id === updatedBlog.id ? updatedBlog : currentBlog
        )
      )
    } catch (error) {
      console.error('blog like failed', error)
      showNotification({
        message: error.response?.data?.error || 'blog like failed',
        className: 'error',
      })
    }
  }

  const handleRemoveBlog = async blog => {
    try {
      await blogService.remove(blog.id)
      setBlogs(currentBlogs =>
        currentBlogs.filter(currentBlog => currentBlog.id !== blog.id)
      )
      showNotification({
        message: `blog ${blog.title} removed`,
        className: 'success',
      })
      navigate('/')
    } catch (error) {
      console.error('blog removal failed', error)
      showNotification({
        message: error.response?.data?.error || 'blog removal failed',
        className: 'error',
      })
    }
  }

  return (
    <Container>
      <nav>
        <Link to="/">blogs</Link>{' '}
        {user ? (
          <>
            <Link to="/create">create new blog</Link>{' '}
            <span>{user.name} logged in </span>
            <button type="button" onClick={handleLogout}>logout</button>
          </>
        ) : (
          <Link to="/login">login</Link>
        )}
      </nav>

      <Notification notification={notification} />

      <Routes>
        <Route
          path="/"
          element={
            <>
              <h2>blogs</h2>
              <BlogList blogs={blogs} />
            </>
          }
        />
        <Route
          path="/create"
          element={user ? (
            <>
              <h2>create new blog</h2>
              <BlogForm onCreate={handleCreateBlog} />
            </>
          ) : (
            <Navigate to="/login" replace />
          )}
        />
        <Route
          path="/blogs/:id"
          element={
            <Blog
              blog={blog}
              onLike={handleLike}
              onRemove={handleRemoveBlog}
              currentUser={user}
            />
          }
        />
        <Route
          path="/login"
          element={user ? (
            <Navigate to="/" replace />
          ) : (
            <>
              <h2>log in to application</h2>
              <LoginForm onLogin={handleLogin} />
            </>
          )}
        />
      </Routes>
    </Container>
  )
}

export default App
