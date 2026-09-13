const assert = require('node:assert')
const { test, beforeEach, after } = require('node:test')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const supertest = require('supertest')

const app = require('../app')
const User = require('../models/user')
const helper = require('../utils/test_helper')

const api = supertest(app)

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

after(async () => {
  await mongoose.connection.close()
})
