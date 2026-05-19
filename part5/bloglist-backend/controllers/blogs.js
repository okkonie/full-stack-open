const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const config = require('../utils/config')
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {name: 1, username: 1})
  response.json(blogs)
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  if(!request.body.title || !request.body.url){
    return response.status(400).end()
  }

  const user = request.user

  const blog = new Blog(request.body)
  blog.user = user._id
  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', userExtractor,  async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (!blog) return response.status(404).end()

  if (blog.user.toString() !== request.user.id) {
    return response.status(403).end()
  }

  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', userExtractor,  async (request, response) => {
  const { title, author, url, likes } = request.body

  const blog = await Blog.findById(request.params.id)
  if(!blog) return response.status(404).end()

  if(!title  || !url) return response.status(400).end()

  blog.title = title
  blog.author = author
  blog.url = url
  blog.likes = likes

  await blog.save()
  response.json(blog)
})

module.exports = blogsRouter