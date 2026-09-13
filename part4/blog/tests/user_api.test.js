const assert = require('node:assert')
const { test, before, beforeEach, after } = require('node:test')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const supertest = require('supertest')

const app = require('../app')
const User = require('../models/user')
const helper = require('../utils/test_helper')

const api = supertest(app)

before(async () => {
  await User.deleteMany({})
  await User.init()
})

beforeEach(async () => {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('supersecretpassword', 10)
  const user = new User({
    username: 'root',
    name: 'Jesus',
    passwordHash,
  })

  await user.save()
})

test('users are returned as JSON', async () => {
  const response = await api
    .get('/api/users')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.length, 1)
  assert.strictEqual(response.body[0].username, 'root')
  assert.strictEqual(Object.hasOwn(response.body[0], 'passwordHash'), false)
})

test('a new user is created with a password hash', async () => {
  const usersAtStart = await helper.usersInDb()
  const newUser = {
    username: 'claudio',
    name: 'Claudio Morel',
    password: 'mypasswordissecureasf**k',
  }

  const response = await api
    .post('/api/users')
    .send(newUser)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.username, newUser.username)
  assert.strictEqual(Object.hasOwn(response.body, 'password'), false)
  assert.strictEqual(Object.hasOwn(response.body, 'passwordHash'), false)

  const usersAtEnd = await helper.usersInDb()
  assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

  const storedUser = await User.findOne({ username: newUser.username })
  assert(storedUser)
  assert(await bcrypt.compare(newUser.password, storedUser.passwordHash))
})

test('creation fails when username is missing', async () => {
  const usersAtStart = await helper.usersInDb()
  const newUser = {
    name: 'No Username',
    password: 'thispasswordwillneverseethelight',
  }

  const response = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(typeof response.body.error, 'string')

  const usersAtEnd = await helper.usersInDb()
  assert.strictEqual(usersAtEnd.length, usersAtStart.length)
})

test('creation fails when username is shorter than three characters', async () => {
  const usersAtStart = await helper.usersInDb()
  const newUser = {
    username: 'ab',
    name: 'Short Username',
    password: 'thispasswordeither',
  }

  const response = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(typeof response.body.error, 'string')

  const usersAtEnd = await helper.usersInDb()
  assert.strictEqual(usersAtEnd.length, usersAtStart.length)
})

test('creation fails when password is missing', async () => {
  const usersAtStart = await helper.usersInDb()
  const newUser = {
    username: 'thistimeisnotthepasswordwhowillfail',
    name: 'No Password',
  }

  const response = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(typeof response.body.error, 'string')

  const usersAtEnd = await helper.usersInDb()
  assert.strictEqual(usersAtEnd.length, usersAtStart.length)
})

test('creation fails when password is shorter than three characters', async () => {
  const usersAtStart = await helper.usersInDb()
  const newUser = {
    username: 'shortpassworddependsonwhoyouask',
    name: 'Short Password',
    password: 'ab',
  }

  const response = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(typeof response.body.error, 'string')

  const usersAtEnd = await helper.usersInDb()
  assert.strictEqual(usersAtEnd.length, usersAtStart.length)
})

test('creation fails when username is already taken', async () => {
  const usersAtStart = await helper.usersInDb()
  const duplicateUser = {
    username: 'root',
    name: 'Believe I am The Real Root',
    password: 'backtothehidedpasswords',
  }

  const response = await api
    .post('/api/users')
    .send(duplicateUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.error, 'username must be unique')

  const usersAtEnd = await helper.usersInDb()
  assert.strictEqual(usersAtEnd.length, usersAtStart.length)
})

after(async () => {
  await mongoose.connection.close()
})
