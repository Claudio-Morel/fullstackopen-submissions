const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const middleware = require('../utils/middleware')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogRouter.post('/', middleware.userExtractor, async (request, response) => {
  const user = request.user

  const newBlog = new Blog({
    ...request.body,
    user: user._id,
  })

  const savedBlog = await newBlog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  const populatedBlog = await savedBlog.populate('user', { username: 1, name: 1 })

  response
    .status(201)
    .json(populatedBlog)
})

blogRouter.put('/:id', async (request, response) => {
  const blog = { ...request.body }

  if (blog.user && typeof blog.user === 'object') {
    blog.user = blog.user.id
  }

  const updatedBlog = await Blog
    .findByIdAndUpdate(
      request.params.id,
      blog,
      { returnDocument: 'after', runValidators: true }
    )
    .populate('user', { username: 1, name: 1 })

  if (!updatedBlog) {
    return response.status(404).end()
  }

  response.json(updatedBlog)
})

blogRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    return response.status(404).end()
  }

  if (!blog.user || blog.user.toString() !== request.user._id.toString()) {
    return response.status(403).json({
      error: 'only the creator can delete a blog',
    })
  }

  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

module.exports = blogRouter
