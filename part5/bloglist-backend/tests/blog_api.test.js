const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const api = supertest(app)

let token = null

beforeEach(async () => {
  await User.deleteMany({})

  await api.post('/api/users').send({name: 'test', username: 'test', password: 'test'})
  const login = await api.post('/api/login').send({username: 'test', password: 'test'})

  token = login.body.token

  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .set('Authorization', `Bearer ${token}`)
    .expect('Content-Type', /application\/json/)
})

test('blog has "id" instead of "_id"', async () => {
  const response = await api
    .get('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
  const blogs = response.body

  blogs.forEach((blog) => 
    assert.ok(Object.hasOwn(blog, "id"))
  )
})

test('new blog can be added', async () => {
  const newBlog = {
    title: 'Success',
    author: 'Tester',
    url: 'url',
    likes: 5,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .set('Authorization', `Bearer ${token}`)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api
    .get('/api/blogs')
    .set('Authorization', `Bearer ${token}`)

  assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)
})

test('blog without likes is set to 0 likes', async () => {
  const newBlog = {
    title: 'Blog without likes',
    author: 'Tester',
    url: 'url',
  }

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .set('Authorization', `Bearer ${token}`)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.likes, 0)
})

describe('blog without title or url responds 400', async () => {
  const noUrl = {
    title: 'No Url',
    author: 'Tester',
    likes: 5
  }

  test('No url', async () => await api
    .post('/api/blogs')
    .send(noUrl)
    .set('Authorization', `Bearer ${token}`)
    .expect(400)
  )

  const noTitle = {
    author: 'Tester',
    url: 'url',
    likes: 5
  }

  test('No title', async () => await api
    .post('/api/blogs')
    .send(noTitle)
    .set('Authorization', `Bearer ${token}`)
    .expect(400)
  )
})

test('blog can be deleted', async () => {
  const newBlog = {
    title: 'Blog to be deleted',
    author: 'Tester',
    url: 'url',
    likes: 10,
  }

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .set('Authorization', `Bearer ${token}`)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  await api
    .delete(`/api/blogs/${response.body.id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(204)

  const blogsAfterDelete = await api
    .get('/api/blogs')
    .set('Authorization', `Bearer ${token}`)

  assert.ok(!blogsAfterDelete.body.some((blog) => blog.id === response.body.id))
})

test('blog can be modified', async () => {
  const newBlog = {
    title: 'Blog to be modified',
    author: 'Tester',
    url: 'url',
    likes: 5,
  }

  const created = await api
    .post('/api/blogs')
    .send(newBlog)
    .set('Authorization', `Bearer ${token}`)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const modifiedBlog = {
    title: 'Modified blog',
    author: 'Tester',
    url: 'url',
    likes: 10,
  }

  const updated = await api
    .put(`/api/blogs/${created.body.id}`)
    .send(modifiedBlog)
    .set('Authorization', `Bearer ${token}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(updated.body.title, modifiedBlog.title)
  assert.strictEqual(updated.body.likes, modifiedBlog.likes)

  const blogsAfter = await api
    .get('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
  const stored = blogsAfter.body.find((b) => b.id === created.body.id)
  assert.strictEqual(stored.likes, modifiedBlog.likes)
})

test('blog cannot be added without token', async () => {
  const newBlog = {
    title: 'Tokenless blog',
    author: 'Tester',
    url: 'url',
    likes: 5,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)
})

after(async () => {
  await mongoose.connection.close()
})