import Blog from './Blog'

const BlogList = ({ blogs, onLike, onRemove, currentUser }) => {
  const blogsByLikes = [...blogs].sort((firstBlog, secondBlog) =>
    secondBlog.likes - firstBlog.likes
  )

  return (
    <div>
      {blogsByLikes.map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          onLike={onLike}
          onRemove={onRemove}
          currentUser={currentUser}
        />
      )}
    </div>
  )
}

export default BlogList
