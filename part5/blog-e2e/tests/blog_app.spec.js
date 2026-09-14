const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, getBlogLink, createBlog } = require('./helper')

const user = {
  name: 'Claudio Morel',
  username: 'cachis',
  password: 'password'
}

const blog = {
  title: 'This is my first blog',
  author: 'Pigot Morel',
  url: 'www.example.com/pigot/first'
}

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: user
    })
    await page.goto('/')
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, user.username, user.password)

      await expect(page).toHaveURL('/')
      await expect(page.getByRole('button', { name: 'logout' })).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, user.username, 'wrong password')

      const errorDiv = page.locator('.error')
      await expect(errorDiv).toContainText('invalid username or password')
      await expect(errorDiv).toHaveCSS('border-style', 'solid')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
      await expect(page).toHaveURL('/login')
      await expect(page.getByRole('button', { name: 'logout' })).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, user.username, user.password)
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, blog)

      await expect(page).toHaveURL('/')
      await expect(getBlogLink(page, blog)).toBeVisible()
    })

    describe('and a blog exists', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, blog)
      })

      test('a blog can be liked', async ({ page }) => {
        await getBlogLink(page, blog).click()
        const blogElement = page.locator('.blog')

        await blogElement.getByRole('button', { name: 'like' }).click()

        await expect(
          blogElement.getByText('likes 1', { exact: false })
        ).toBeVisible()
      })

      test('the user who created a blog can delete it', async ({ page }) => {
        await getBlogLink(page, blog).click()
        page.once('dialog', dialog => dialog.accept())
        await page.getByRole('button', { name: 'remove' }).click()

        await expect(page).toHaveURL('/')
        await expect(getBlogLink(page, blog)).toHaveCount(0)
      })
    })
  })
})
