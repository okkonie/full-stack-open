const { test, expect, beforeEach, describe } = require('@playwright/test')
const createBlog = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'user',
        username: 'username',
        password: 'secret'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByLabel('username')).toBeDefined()
    await expect(page.getByLabel('password')).toBeDefined()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByLabel('username').fill('username')
      await page.getByLabel('password').fill('secret')
      await page.getByRole('button', { type: 'submit' }).click()

      await expect(page.getByText('logged in as user')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByLabel('username').fill('username')
      await page.getByLabel('password').fill('wrong password')
      await page.getByRole('button', { type: 'submit' }).click()

      await expect(page.getByText('wrong username or password')).toBeVisible()
    })
  })


  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByLabel('username').fill('username')
      await page.getByLabel('password').fill('secret')
      await page.getByRole('button', { type: 'submit' }).click()
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'test title', 'test author', 'test.url')

      await expect(page.getByText('a new blog test title by test author was added'))
    })
  })
})