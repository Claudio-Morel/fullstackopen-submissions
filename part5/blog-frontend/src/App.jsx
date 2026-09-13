import { useState, useEffect } from 'react'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import BlogList from './components/BlogList'
import blogService from './services/blogs'
import loginService from './services/login'

const storageKey = 'loggedBlogappUser'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)

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
      return loggedInUser
    } catch (error) {
      console.error('login failed', error)
      return null
    }
  }

  const handleLogout = () => {
    blogService.setToken(null)
    window.localStorage.removeItem(storageKey)
    setUser(null)
  }

  const handleCreateBlog = async blog => {
    try {
      const createdBlog = await blogService.create(blog)
      setBlogs(currentBlogs => currentBlogs.concat(createdBlog))
      return createdBlog
    } catch (error) {
      console.error('blog creation failed', error)
      return null
    }
  }

  if (user === null) {
    return (
      <div>
        <h2>log in to application</h2>
        <LoginForm onLogin={handleLogin} />
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <p>
        {user.name} logged in{' '}
        <button type="button" onClick={handleLogout}>logout</button>
      </p>
      <h3>create new blog</h3>
      <BlogForm onCreate={handleCreateBlog} />
      <BlogList blogs={blogs} />
    </div>
  )
}

export default App
