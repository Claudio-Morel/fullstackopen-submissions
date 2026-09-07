const Blog = require('../models/blog')
const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return (
    blogs.reduce(
      (acc, curr) => acc + curr.likes,
      0
    )
  )
}


const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }
  if (blogs.length === 1) {
    return blogs[0]
  }

  return (
    blogs.reduce(
      (acc, curr) => (acc.likes > curr.likes) ? acc : curr,
      blogs[0]
    )
  )
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) { return null }

  const [author, blogCount] = _.chain(blogs)
    .countBy('author')
    .toPairs()
    .maxBy(pair => pair[1])
    .value()

  return {
    author,
    blogs: blogCount
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs
}
