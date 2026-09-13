const Blog = require('../models/blog')
const User = require('../models/user')

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
  return blogs.map(blog => JSON.parse(JSON.stringify(blog)))
}

const nonExistingId = async () => {
  const blog = new Blog({
    title: 'willremovethissoon',
    url: 'https://example.com/willremovethissoon',
  })

  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => JSON.parse(JSON.stringify(user)))
}

module.exports = {
  initialBlogs,
  blogsInDb,
  nonExistingId,
  usersInDb,
}
