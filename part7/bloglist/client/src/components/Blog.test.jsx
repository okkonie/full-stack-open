import { render, screen } from "@testing-library/react"
import Blog from "./Blog"

describe("blog", () => {
  const blogs = [
    {
      title: "Test blog",
      author: "Tester",
      likes: 999,
      url: "imaginary.url",
      user: {
        name: "Mr. Test",
        username: "tester",
      },
    },
  ]

  test("blog is but buttons are not visible when not logged in", () => {
    render(<Blog blogs={blogs} loggedUsername={null} />)

    expect(screen.getByText("Tester: Test blog")).toBeDefined()
    expect(screen.getByText("imaginary.url")).toBeDefined()
    expect(screen.getByText("likes 999")).toBeDefined()
    expect(
      screen.queryByRole("button", { name: "like" }),
    ).not.toBeInTheDocument()
    expect(screen.getByText("Added by Mr. Test")).toBeDefined()
    expect(
      screen.queryByRole("button", { name: "remove" }),
    ).not.toBeInTheDocument()
  })

  test("logged in user who didn't create the blog sees only like button", () => {
    render(<Blog blogs={blogs} loggedUsername={"not-the-creator"} />)

    expect(screen.queryByRole("button", { name: "like" })).toBeInTheDocument()
    expect(
      screen.queryByRole("button", { name: "remove" }),
    ).not.toBeInTheDocument()
  })

  test("logged in user who created the blog sees delete button", () => {
    render(<Blog blogs={blogs} loggedUsername={"tester"} />)
    expect(screen.queryByRole("button", { name: "remove" })).toBeInTheDocument()
  })
})
