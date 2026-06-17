const { test, describe } = require("node:test")
const assert = require("node:assert")
const helper = require("./test_helper")
const listHelper = require("../utils/list_helper")

test("dummy returns one", () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe("total likes", () => {
  test("when list has only one blog equals the likes of that", () => {
    const result = listHelper.totalLikes(helper.oneBlog)
    assert.strictEqual(result, 5)
  })

  test("when list is empty likes equal 0", () => {
    const result = listHelper.totalLikes([])
    assert.strictEqual(result, 0)
  })

  test("when list has multiple blogs equals sum of those", () => {
    const result = listHelper.totalLikes(helper.initialBlogs)
    assert.strictEqual(result, 36)
  })
})

describe("most liked blog", () => {
  test("when list has only one blog equal that", () => {
    const result = listHelper.favoriteBlog(helper.oneBlog)
    assert.deepStrictEqual(result, {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
      __v: 0,
    })
  })

  test("when list is empty equals null", () => {
    const result = listHelper.favoriteBlog([])
    assert.deepStrictEqual(result, null)
  })

  test("when list has multiple blogs equals the most liked", () => {
    const result = listHelper.favoriteBlog(helper.initialBlogs)
    assert.deepStrictEqual(result, {
      _id: "5a422b3a1b54a676234d17f9",
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
      __v: 0,
    })
  })
})

describe("most blogs per author", () => {
  test("when list has only one blog", () => {
    const result = listHelper.mostBlogs(helper.oneBlog)
    assert.deepStrictEqual(result, {
      author: "Edsger W. Dijkstra",
      blogs: 1,
    })
  })

  test("when list is empty equals null", () => {
    const result = listHelper.mostBlogs([])
    assert.deepStrictEqual(result, null)
  })

  test("when list has multiple blogs", () => {
    const result = listHelper.mostBlogs(helper.initialBlogs)
    assert.deepStrictEqual(result, {
      author: "Robert C. Martin",
      blogs: 3,
    })
  })
})

describe("most likes per author", () => {
  test("when list has only one blog", () => {
    const result = listHelper.mostLikes(helper.oneBlog)
    assert.deepStrictEqual(result, {
      author: "Edsger W. Dijkstra",
      likes: 5,
    })
  })

  test("when list is empty equals null", () => {
    const result = listHelper.mostLikes([])
    assert.deepStrictEqual(result, null)
  })

  test("when list has multiple blogs", () => {
    const result = listHelper.mostLikes(helper.initialBlogs)
    assert.deepStrictEqual(result, {
      author: "Edsger W. Dijkstra",
      likes: 17,
    })
  })
})
