const assert = require('node:assert')
const { test, beforeEach, after } = require('node:test')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const supertest = require('supertest')

const app = require('../app')
const User = require('../models/user')
const config = require('../utils/config')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('thispasswordgoesforallmyhomies', 10)
  const user = new User({
    username: 'root',
    name: 'Jesus',
    passwordHash,
  })

  await user.save()
})

test('login succeeds with valid credentials', async () => {
  const credentials = {
    username: 'root',
    password: 'thispasswordgoesforallmyhomies',
  }

  const response = await api
    .post('/api/login')
    .send(credentials)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.username, credentials.username)
  assert.strictEqual(response.body.name, 'Jesus')
  assert.strictEqual(typeof response.body.token, 'string')

  const decodedToken = jwt.verify(response.body.token, config.SECRET)
  assert.strictEqual(decodedToken.username, credentials.username)

  const user = await User.findOne({ username: credentials.username })
  assert.strictEqual(response.body.id, user.id)
  assert.strictEqual(decodedToken.id, user.id)
})

test('login fails with an incorrect password', async () => {
  const credentials = {
    username: 'root',
    password: 'wrongpassword',
  }

  const response = await api
    .post('/api/login')
    .send(credentials)
    .expect(401)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.error, 'invalid username or password')
})

test('login fails with an unknown username', async () => {
  const credentials = {
    username: 'Devil',
    password: 'thispasswordgoesforallmydemons',
  }

  const response = await api
    .post('/api/login')
    .send(credentials)
    .expect(401)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.error, 'invalid username or password')
})

after(async () => {
  await mongoose.connection.close()
})
