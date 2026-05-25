import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('blog', () => {

  const blog = {
    title: 'Test blog',
    author: 'Tester',
    likes: 999,
    url: 'imaginary.url',
    user: {
      name: 'Mr. Test',
      username: 'tester'
    }
  }

  const mockHandler = vi.fn()

  beforeEach(() => {
    render(<Blog blog={blog} handleLike={mockHandler}/>)
  })

  test('blog title renders', () => {
    const element = screen.getByText('Test blog', { exact: false })
    expect(element).toBeDefined()
  })

  test('url and likes are shown when expanded', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    expect(screen.getByText('imaginary.url', { exact: false })).toBeDefined()
    expect(screen.getByText('likes', { exact: false })).toBeDefined()
  })

  test('like button pressed twice calls function twice', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})
