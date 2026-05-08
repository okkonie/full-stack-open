const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)

  if(!request.body.title || !request.body.url){
    return response.status(400).end()
  }

  const savedBlog = await blog.save()
  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
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