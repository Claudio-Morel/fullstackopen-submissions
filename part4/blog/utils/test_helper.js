const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: 'Primer blog',
    author: 'Claudio Morel',
    url: 'https://example.com/cachis',
    likes: 6,
  },
  {
    title: 'Segundo blog',
    author: 'Diego Morel',
    url: 'https://example.com/pigot',
    likes: 7,
  },
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs, blogsInDb
}
