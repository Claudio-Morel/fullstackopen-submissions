const Blog = ({ blog, onLike, onRemove, currentUser }) => {
  if (!blog) {
    return null
  }

  const blogUserId = typeof blog.user === 'string' ? blog.user : blog.user?.id
  const canRemove = blogUserId === currentUser?.id

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
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
    <div className="blog" style={blogStyle}>
      <h2>{blog.title} {blog.author}</h2>
      <div>{blog.url}</div>
      <div>
        likes {blog.likes}
        {currentUser && (
          <>
            {' '}
            <button type="button" onClick={handleLike}>like</button>
          </>
        )}
      </div>
      <div>{blog.user?.name}</div>
      {canRemove && (
        <button type="button" onClick={handleRemove}>remove</button>
      )}
    </div>
  )
}

export default Blog
