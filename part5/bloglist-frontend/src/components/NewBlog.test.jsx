import { render, screen } from '@testing-library/react'
import NewBlog from './NewBlog'
import userEvent from '@testing-library/user-event'

test('blog calls createBlog onSumbit', async () => {
  const user = userEvent.setup()
  const createBlog = vi.fn()

  render(<NewBlog createBlog={createBlog} />)

  const titleInput = screen.getByLabelText('title')
  const authorInput = screen.getByLabelText('author')
  const urlInput = screen.getByLabelText('url')

  await user.type(titleInput, 'Testing title')
  await user.type(authorInput, 'Tester')
  await user.type(urlInput, 'testing.com')


  const createButton = screen.getByText('create')
  await user.click(createButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0]).toStrictEqual({
    title: 'Testing title',
    author: 'Tester',
    url: 'testing.com'
  })
})