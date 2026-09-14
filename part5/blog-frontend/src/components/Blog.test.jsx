import { render, screen } from '@testing-library/react'
import Blog from './Blog'

test('shows blog information but no buttons to an unauthenticated user', () => {
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

  expect(screen.getByRole('heading', { name: blog.title })).toBeInTheDocument()
  expect(screen.getByText(`by ${blog.author}`)).toBeInTheDocument()
  expect(screen.getByText(blog.url)).toBeInTheDocument()
  expect(screen.getByText(`${blog.likes} likes`, { exact: false })).toBeInTheDocument()
  expect(screen.getByText(blog.user.name)).toBeInTheDocument()
  expect(screen.queryByRole('button')).not.toBeInTheDocument()
})

test('shows only the like button to an authenticated user who is not the creator', () => {
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
  const currentUser = {
    id: '1234',
    name: 'Claudio Morel'
  }

  render(<Blog blog={blog} currentUser={currentUser} onLike={vi.fn()} />)

  expect(screen.getByRole('button', { name: 'like' })).toBeInTheDocument()
  expect(screen.queryByRole('button', { name: 'remove' })).not.toBeInTheDocument()
  expect(screen.getAllByRole('button')).toHaveLength(1)
})

test('shows like and remove buttons to the blog creator', () => {
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
  const currentUser = {
    id: '6769',
    name: 'Diego Morel'
  }

  render(
    <Blog
      blog={blog}
      currentUser={currentUser}
      onLike={vi.fn()}
      onRemove={vi.fn()}
    />
  )

  expect(screen.getByRole('button', { name: 'like' })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'remove' })).toBeInTheDocument()
  expect(screen.getAllByRole('button')).toHaveLength(2)
})
