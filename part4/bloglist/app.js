const express = require('express')
const config = require('./utils/config')
const logger = require('./utils/logger')
const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const { errorHandler, tokenExtractor, userExtractor } = require('./utils/middleware')

const app = express()

const mongoUrl = config.MONGODB_URI

mongoose
  .connect(mongoUrl, { family: 4 })
  .then(() => 
    logger.info('connected to MongoDB')
  )
  .catch(error => 
    logger.error('error connecting to MongoDB: ', error)
  )

app.use(express.json())
app.use(tokenExtractor)
app.use('/api/login', loginRouter)
app.use('/api/blogs', userExtractor, blogsRouter)
app.use('/api/users', usersRouter)
app.use(errorHandler)

module.exports = app