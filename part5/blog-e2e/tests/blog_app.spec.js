const { test, expect, beforeEach, describe } = require('@playwright/test')

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
      await page.getByLabel('username').fill(user.username)
      await page.getByLabel('password').fill(user.password)
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByRole('button', { name: 'logout' })).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByLabel('username').fill(user.username)
      await page.getByLabel('password').fill('wrong password')
      await page.getByRole('button', { name: 'login' }).click()

      const errorDiv = page.locator('.error')
      await expect(errorDiv).toContainText('invalid username or password')
      await expect(errorDiv).toHaveCSS('border-style', 'solid')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
      await expect(page.getByRole('button', { name: 'logout' })).not.toBeVisible()
    })
  })
})
