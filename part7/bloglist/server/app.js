const express = require("express")
const path = require("path")
const config = require("./utils/config")
const logger = require("./utils/logger")
const mongoose = require("mongoose")
const blogsRouter = require("./controllers/blogs")
const usersRouter = require("./controllers/users")
const loginRouter = require("./controllers/login")
const testingRouter = require("./controllers/testing")
const { errorHandler, tokenExtractor } = require("./utils/middleware")

const app = express()
const mongoUrl = config.MONGODB_URI

mongoose
  .connect(mongoUrl, { family: 4 })
  .then(() => logger.info("connected to MongoDB"))
  .catch((error) => logger.error("error connecting to MongoDB: ", error))

app.use(express.json())
app.use(tokenExtractor)
app.use(express.static(path.join(__dirname, "../client/dist")))
app.use("/api/login", loginRouter)
app.use("/api/blogs", blogsRouter)
app.use("/api/users", usersRouter)

if (process.env.NODE_ENV === "test") {
  const testingRouter = require("./controllers/testing")
  app.use("/api/testing", testingRouter)
}

app.use(errorHandler)

module.exports = app
