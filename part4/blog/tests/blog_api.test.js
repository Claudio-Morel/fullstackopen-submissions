const assert = require('node:assert')
const { test, beforeEach, after } = require('node:test')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const supertest = require('supertest')

const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('../utils/test_helper')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('thispasswordisgonamakeittotestdbyei!!', 10)
  const user = new User({
    username: 'root',
    name: 'Jesus',
    passwordHash,
  })
  const savedUser = await user.save()

  const savedBlogs = await Blog.insertMany(
    helper.initialBlogs.map(blog => ({
      ...blog,
      user: savedUser._id,
    }))
  )

  savedUser.blogs = savedBlogs.map(blog => blog._id)
  await savedUser.save()
})

test('blogs are returned as JSON', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('blogs are identified by id JSON field', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  for (const blog of response.body) {
    assert.strictEqual(blog.hasOwnProperty('id'), true)
    assert.strictEqual(blog._id, undefined)
  }
})

test('blogs include the creator information', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  for (const blog of response.body) {
    assert(blog.user)
    assert.strictEqual(blog.user.username, 'root')
    assert.strictEqual(blog.user.name, 'Jesus')
    assert.strictEqual(Object.hasOwn(blog.user, 'passwordHash'), false)
  }
})

test('users include the blogs they created', async () => {
  const response = await api
    .get('/api/users')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const root = response.body.find(user => user.username === 'root')

  assert(root)
  assert.strictEqual(root.blogs.length, helper.initialBlogs.length)
  assert(root.blogs.some(blog => blog.title === helper.initialBlogs[0].title))
})

test('create a new blog by sending a POST request', async () => {
  const newBlog =   {
    title: 'Tercer blog',
    author: 'Agustin Morel',
    url: 'https://example.com/abustin',
    likes: 9,
  }

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()

  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

  const savedBlog = blogsAtEnd.find(blog => blog.title === newBlog.title)
  assert(savedBlog)
  assert.strictEqual(savedBlog.url, newBlog.url)
  assert.deepStrictEqual(response.body, savedBlog)
})

test('a created blog is associated with an existing user', async () => {
  const user = await User.findOne({ username: 'root' })
  const newBlog = {
    title: 'Blog with a creator',
    author: 'Claudio Morel',
    url: 'https://example.com/blog-with-creator',
    likes: 3,
  }

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)

  const savedBlog = await Blog.findById(response.body.id)
  assert(savedBlog)
  assert.strictEqual(savedBlog.user.toString(), user._id.toString())

  const savedUser = await User.findById(user._id)
  const blogIds = savedUser.blogs.map(blogId => blogId.toString())
  assert(blogIds.includes(savedBlog._id.toString()))
})

test('likes defaults to zero when missing', async () => {
  const newBlog = {
    title: 'Nobody likes this post yet',
    author: 'Claudio Morel',
    url: 'https://example.com/cachis/no-likes',
  }

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.likes, 0)

  const blogsAtEnd = await helper.blogsInDb()
  const savedBlog = blogsAtEnd.find(blog => blog.id === response.body.id)
  assert(savedBlog)
  assert.strictEqual(savedBlog.likes, 0)
})

test('blog without title return 400', async () => {
  const newBlog = {
    author: 'Claudio Morel',
    url: 'https://example.com/cachis/without-title',
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

test('blog without url returns 400', async () => {
  const newBlog = {
    title: 'A blog without URL',
    author: 'Claudio Morel',
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

test('a blog can be deleted', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]
  const deletedId = blogToDelete.id

  await api
    .delete(`/api/blogs/${deletedId}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()
  const idsAtEnd = blogsAtEnd.map(blog => blog.id)

  assert(!idsAtEnd.includes(deletedId))
  assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)
})

test('deleting a nonexisting blog fails with 404', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const nonExistingId = await helper.nonExistingId()

  await api
    .delete(`/api/blogs/${nonExistingId}`)
    .expect(404)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
})

test('likes of a blog can be updated', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToUpdate = blogsAtStart[0]
  const updatedLikes = blogToUpdate.likes + 1

  const response = await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send({ likes: updatedLikes })
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.id, blogToUpdate.id)
  assert.strictEqual(response.body.likes, updatedLikes)

  const blogsAtEnd = await helper.blogsInDb()
  const updatedBlog = blogsAtEnd.find(blog => blog.id === blogToUpdate.id)

  assert(updatedBlog)
  assert.strictEqual(updatedBlog.likes, updatedLikes)
  assert.strictEqual(updatedBlog.title, blogToUpdate.title)
  assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
})

test('updating a nonexisting blog fails with 404', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const nonExistingId = await helper.nonExistingId()

  await api
    .put(`/api/blogs/${nonExistingId}`)
    .send({ likes: 10 })
    .expect(404)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
})


after(async () => {
  await mongoose.connection.close()
})
