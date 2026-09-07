const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

describe('most likes', () => {
  const listWithNoBlog = []

  const listWithOneBlog = [
    {
      id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
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

  const listWithManyBlogs = [
    {
      id: "5a422a851b54a676234d17f7",
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 7,
    },
    {
      id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
    },
    {
      id: "5a422b3a1b54a676234d17f9",
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
    },
    {
      id: "5a422b891b54a676234d17fa",
      title: "First class tests",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
      likes: 10,
    },
    {
      id: "5a422ba71b54a676234d17fb",
      title: "TDD harms architecture",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
      likes: 0,
    },
    {
      id: "5a422bc61b54a676234d17fc",
      title: "Type wars",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
      likes: 2,
    }
  ]

  test('when list doesnt have blogs, returns null', () => {
    const result = listHelper.mostLikes(listWithNoBlog)
    assert.deepStrictEqual(result, null)
  })

  test('when list has only one blog, return his autor', () => {
    const result = listHelper.mostLikes(listWithOneBlog)
    assert.deepStrictEqual(result, { author: 'Edsger W. Dijkstra', likes:5})
  })

  test('when list has only two blogs, returns the one wich blog has more likes', () => {
    const result = listHelper.mostLikes(listWithTwoBlogs)
    assert.deepStrictEqual(result, { author: 'Diego Morel', likes:5511})
  })

  test('when list has many blogs, returns the one with more accumulated likes', () => {
    const result = listHelper.mostLikes(listWithManyBlogs)
    assert.deepStrictEqual(result, { author: 'Edsger W. Dijkstra', likes:17})
  })
})
