const { test, expect, beforeEach, describe } = require('@playwright/test')
const { createBlog, login } = require('./helper')

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

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await login(page, 'username', 'secret')
      await expect(page.getByText('logged in as user')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await login(page, 'a', 'b')
      await expect(page.getByText('wrong username or password')).toBeVisible()
    })
  })


  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await login(page, 'username', 'secret')
      await createBlog(page, 'test title', 'test author', 'test.url')
    })

    test('a new blog can be created', async ({ page }) => {
      await expect(page.getByText('a new blog test title by test author was added')).toBeDefined()
      await expect(page.getByText('test title by test author')).toBeDefined()
    })

    test('a blog can be liked', async ({ page }) => {
      await page.getByRole('link', { name: 'test title by test author' }).click()
      await page.getByRole('button', { name: 'like' }).click()

      await expect(page.getByText('likes 1')).toBeDefined()
    })

    test('a blog can be deleted', async ({ page }) => {
      await page.getByRole('link', { name: 'test title by test author' }).click()

      page.on('dialog', dialog => dialog.accept())
      await page.getByRole('button', { name: 'remove' }).click()

      await expect(page.getByRole('link', { name: 'test title by test author' })).not.toBeVisible()
    })
  })

})