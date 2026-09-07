const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {
  const listWithNoBlog = []

  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    }
  ]

  const listWithTwoBlogs = [
    {
        title: "My first Blog",
        author: "Claudio Morel",
        url: "www.blogs.com/1",
        likes: 1256,
        id: "6a9db2e1cb2dbeb1088c5c0f"
    },
    {
        title: "My second Blog",
        author: "Diego Morel",
        url: "www.blogs.com/2",
        likes: 5511,
        id: "6a9ded2d0b853aa2632f06f4"
    }
  ]

  test('when list doesnt have blogs, equals to 0', () => {
    const result = listHelper.totalLikes(listWithNoBlog)
    assert.strictEqual(result, 0)
  })

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })

  test('when list has only two blogs, equals to the sum of each individual blog likes', () => {
    const result = listHelper.totalLikes(listWithTwoBlogs)
    assert.strictEqual(result, 6767)
  })
})
