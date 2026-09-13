import { useState } from 'react'

const Blog = ({ blog, onLike, onRemove, currentUser }) => {
  const [detailsVisible, setDetailsVisible] = useState(false)
  const blogUserId = typeof blog.user === 'string' ? blog.user : blog.user?.id
  const canRemove = blogUserId === currentUser?.id

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const toggleDetailsVisibility = () => {
    setDetailsVisible(currentlyVisible => !currentlyVisible)
  }

  const handleLike = () => {
    onLike(blog)
  }

  const handleRemove = async () => {
    const confirmed = window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)

    if (confirmed) {
      await onRemove(blog)
    }
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}{' '}
        <button type="button" onClick={toggleDetailsVisibility}>
          {detailsVisible ? 'hide' : 'view'}
        </button>
      </div>
      {detailsVisible && (
        <div>
          <div>{blog.url}</div>
          <div>
            likes {blog.likes}{' '}
            <button type="button" onClick={handleLike}>like</button>
          </div>
          <div>{blog.user?.name}</div>
          {canRemove && (
            <button type="button" onClick={handleRemove}>remove</button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog
