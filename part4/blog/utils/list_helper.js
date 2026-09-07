const Blog = require('../models/blog')

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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}
