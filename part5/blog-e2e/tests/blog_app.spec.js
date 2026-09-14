const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, getBlogElement, createBlog, likeBlog } = require('./helper')

const user = {
  name: 'Claudio Morel',
  username: 'cachis',
  password: 'password'
}

const anotherUser = {
  name: 'Diego Morel',
  username: 'pigot',
  password: 'password'
}

const blog = {
  title: 'This is my first blog',
  author: 'Pigot Morel',
  url: 'www.example.com/pigot/first'
}

const blogsToOrder = [
  {
    title: 'Blog with one like',
    author: 'Lamine Yamal',
    url: 'https://example.com/lamine/one-like'
  },
  {
    title: 'Blog with two likes',
    author: 'Raphiña',
    url: 'https://example.com/raph/two-likes'
  },
  {
    title: 'Blog with three likes',
    author: 'Pau Cubarsi',
    url: 'https://example.com/cubarsi/three-likes'
  }
]

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: user
    })
    await page.goto('/')
  })

  test('login form is shown', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: 'log in to application' })
    ).toBeVisible()
    await expect(page.getByLabel('username')).toBeVisible()
    await expect(page.getByLabel('password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, user.username, user.password)

      await expect(page.getByRole('button', { name: 'logout' })).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, user.username, 'wrong password')

      const errorDiv = page.locator('.error')
      await expect(errorDiv).toContainText('invalid username or password')
      await expect(errorDiv).toHaveCSS('border-style', 'solid')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
      await expect(page.getByRole('button', { name: 'logout' })).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, user.username, user.password)
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, blog)

      await expect(getBlogElement(page, blog)).toBeVisible()
    })

    describe('and a blog exists', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, blog)
      })

      test('a blog can be liked', async ({ page }) => {
        const blogElement = getBlogElement(page, blog)

        await blogElement.getByRole('button', { name: 'view' }).click()
        await blogElement.getByRole('button', { name: 'like' }).click()

        await expect(
          blogElement.getByText('likes 1', { exact: false })
        ).toBeVisible()
      })

      test('the user who created a blog can delete it', async ({ page }) => {
        const blogElement = getBlogElement(page, blog)

        await blogElement.getByRole('button', { name: 'view' }).click()
        page.once('dialog', dialog => dialog.accept())
        await blogElement.getByRole('button', { name: 'remove' }).click()

        await expect(blogElement).not.toBeVisible()
      })

      test('only the user who created a blog sees the remove button', async ({ page, request }) => {
        await request.post('/api/users', {
          data: anotherUser
        })
        await page.getByRole('button', { name: 'logout' }).click()
        await loginWith(page, anotherUser.username, anotherUser.password)

        const blogElement = getBlogElement(page, blog)

        await blogElement.getByRole('button', { name: 'view' }).click()

        await expect(
          blogElement.getByRole('button', { name: 'remove' })
        ).not.toBeVisible()
      })
    })

    describe('and several blogs exist', () => {
      beforeEach(async ({ page }) => {
        for (const blogToOrder of blogsToOrder) {
          await createBlog(page, blogToOrder)
        }
      })

      test('blogs are ordered by likes', async ({ page }) => {
        await likeBlog(page, blogsToOrder[0], 1)
        await likeBlog(page, blogsToOrder[1], 2)
        await likeBlog(page, blogsToOrder[2], 3)

        const blogElements = page.locator('.blog')

        await expect(blogElements).toHaveCount(3)
        await expect(blogElements.nth(0)).toContainText(blogsToOrder[2].title)
        await expect(blogElements.nth(1)).toContainText(blogsToOrder[1].title)
        await expect(blogElements.nth(2)).toContainText(blogsToOrder[0].title)
      })
    })
  })
})
