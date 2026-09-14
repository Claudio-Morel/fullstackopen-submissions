import { Link } from 'react-router-dom'

const BlogList = ({ blogs }) => {
  const blogsByLikes = [...blogs].sort((firstBlog, secondBlog) =>
    secondBlog.likes - firstBlog.likes
  )

  return (
    <ul>
      {blogsByLikes.map(blog =>
        <li key={blog.id}>
          <Link to={`/blogs/${blog.id}`}>
            {blog.title} {blog.author}
          </Link>
        </li>
      )}
    </ul>
  )
}

export default BlogList
