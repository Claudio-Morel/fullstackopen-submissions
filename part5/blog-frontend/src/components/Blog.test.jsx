import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders title and author but not URL or likes by default', () => {
  const blog = {
    title: 'This Blog is just for testing',
    author: 'Pigot Morel',
    url: 'https://example.com/pigot/testing',
    likes: 67,
    user: {
      id: '6769',
      name: 'Diego Morel'
    }
  }

  render(<Blog blog={blog} />)

  expect(
    screen.getByText(`${blog.title} ${blog.author}`, { exact: false })
  ).toBeInTheDocument()
  expect(screen.queryByText(blog.url)).not.toBeInTheDocument()
  expect(screen.queryByText(`likes ${blog.likes}`)).not.toBeInTheDocument()
})

test('shows URL and likes after clicking the view button', async () => {
  const blog = {
    title: 'This Blog is just for testing',
    author: 'Pigot Morel',
    url: 'https://example.com/pigot/testing',
    likes: 67,
    user: {
      id: '6769',
      name: 'Diego Morel'
    }
  }
  const user = userEvent.setup()

  render(<Blog blog={blog} />)

  await user.click(screen.getByRole('button', { name: 'view' }))

  expect(screen.getByText(blog.url)).toBeInTheDocument()
  expect(screen.getByText(`likes ${blog.likes}`, { exact: false })).toBeInTheDocument()
})
