import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('calls onCreate with the correct details when a new blog is created', async () => {
  const blogToCreate = {
    title: 'This Blog is just for testing',
    author: 'Pigot Morel',
    url: 'https://example.com/pigot/testing',
  }
  const onCreate = vi.fn().mockResolvedValue({ id: '6767' })
  const user = userEvent.setup()

  render(<BlogForm onCreate={onCreate} />)

  await user.type(screen.getByLabelText('title'), blogToCreate.title)
  await user.type(screen.getByLabelText('author'), blogToCreate.author)
  await user.type(screen.getByLabelText('url'), blogToCreate.url)
  await user.click(screen.getByRole('button', { name: 'create' }))

  expect(onCreate.mock.calls).toHaveLength(1)
  expect(onCreate.mock.calls[0][0]).toEqual(blogToCreate)
})
