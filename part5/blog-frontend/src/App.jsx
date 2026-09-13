import { useState, useEffect } from 'react'
import LoginForm from './components/LoginForm'
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
  }

  const handleCreateBlog = async blog => {
    try {
      const createdBlog = await blogService.create(blog)
      setBlogs(currentBlogs => currentBlogs.concat(createdBlog))
      showNotification({
        message: `a new blog ${createdBlog.title} added`,
        className: 'success',
      })
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

  return (
    <div>
      {user === null ? (
        <div>
          <h2>log in to application</h2>
          <Notification notification={notification} />
          <LoginForm onLogin={handleLogin} />
        </div>
      ) : (
        <div>
            <h2>blogs</h2>
            <Notification notification={notification} />
          <p>
            {user.name} logged in{' '}
            <button type="button" onClick={handleLogout}>logout</button>
          </p>
          <h3>create new blog</h3>
          <BlogForm onCreate={handleCreateBlog} />
          <BlogList blogs={blogs} />
        </div>
      )}
    </div>
  )
}

export default App
