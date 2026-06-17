const blog = require("../models/blog")

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null

  return blogs.reduce((max, blog) => (blog.likes > max.likes ? blog : max))
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  const blogStats = {}

  blogs.forEach((blog) => {
    blogStats[blog.author] = (blogStats[blog.author] || 0) + 1
  })

  const topAuthor = Object.keys(blogStats).reduce((maxAuthor, author) =>
    blogStats[author] > blogStats[maxAuthor] ? author : maxAuthor,
  )

  return { author: topAuthor, blogs: blogStats[topAuthor] }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null

  const blogLikes = {}

  blogs.forEach((blog) => {
    blogLikes[blog.author] = (blogLikes[blog.author] || 0) + blog.likes
  })

  const mostLiked = Object.keys(blogLikes).reduce((mostLiked, author) =>
    blogLikes[author] > blogLikes[mostLiked] ? author : mostLiked,
  )

  return { author: mostLiked, likes: blogLikes[mostLiked] }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
