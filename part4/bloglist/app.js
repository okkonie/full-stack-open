const express = require('express')
const config = require('./utils/config')
const logger = require('./controller/logger')
const mongoose = require('mongoose')
const blogsRouter = require('./controller/blogs')

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
app.use('/api/blogs', blogsRouter)

module.exports = app