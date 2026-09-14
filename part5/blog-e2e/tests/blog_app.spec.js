const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith } = require('./helper')

const user = {
  name: 'Claudio Morel',
  username: 'cachis',
  password: 'password'
}

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
      const blog = {
        title: 'A blog created by Playwright',
        author: 'Microsoft',
        url: 'https://playwright.dev/'
      }

      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByLabel('title').fill(blog.title)
      await page.getByLabel('author').fill(blog.author)
      await page.getByLabel('url').fill(blog.url)
      await page.getByRole('button', { name: 'create' }).click()

      await expect(
        page.getByText(`${blog.title} ${blog.author}`, { exact: false })
      ).toBeVisible()
    })
  })
})
