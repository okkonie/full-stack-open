const bcrypt = require("bcrypt")
const usersRouter = require("express").Router()
const User = require("../models/user")
const Blog = require("../models/blog")

usersRouter.post("/", async (request, response) => {
  const { name, username, password } = request.body

  if (!username || !password) {
    return response.status(400).send({ error: "content missing" })
  }

  if (password.length < 3) {
    return response.status(400).send({ error: "password is too short" })
  }

  const passwordHash = await bcrypt.hash(password, 10) // 10 salt rounds

  const user = new User({
    name,
    username,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

usersRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("blogs", {
    title: 1,
    author: 1,
    url: 1,
    likes: 1,
  })
  response.json(users)
})

module.exports = usersRouter
