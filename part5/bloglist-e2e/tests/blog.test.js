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

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByLabel('username')).toBeDefined()
    await expect(page.getByLabel('password')).toBeDefined()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await login(page, 'username', 'secret')

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
      await expect(page.getByText('test title test author'))
    })

    test('a  blog can be deleted', async ({ page }) => {
      await createBlog(page, 'blog to delete', 'test author', 'test.url')

      const blog = await page.getByText('blog to delete test author')

      await blog.getByRole('button', { name: 'view' }).click()

      page.on('dialog', dialog => dialog.accept())
      await blog.getByRole('button', { name: 'delete' }).click()

      await expect(blog).not.toBeVisible()
    })

    test('only the creator can delete blog', async ({request, page}) => {
      await createBlog(page, 'only I can delete this', 'test author', 'test.url')

      await page.getByRole('button', { name: 'logout' }).click()

      await request.post('http://localhost:3003/api/users', {
        data: {
          name: 'user2',
          username: 'username2',
          password: 'secret2'
        }
      })

      await login(page, 'username2', 'secret2')

      const blog = page.getByText('only I can delete this test author')
      await blog.getByRole('button', { name: 'view' }).click()
      await expect(blog.getByRole('button', { name: 'delete' })).not.toBeAttached()
    })

    test('blogs are sorted by most likes', async ({page}) => {
      await createBlog(page, 'blog #1', 'tester', 'test.url')
      await createBlog(page, 'blog #2', 'tester', 'test.url')
      await createBlog(page, 'blog #3', 'tester', 'test.url')

      const blog1 = page.getByText('blog #1 tester')
      const blog2 = page.getByText('blog #2 tester')
      const blog3 = page.getByText('blog #3 tester')

      await blog1.getByRole('button', { name: 'view' }).click()
      await blog2.getByRole('button', { name: 'view' }).click()
      await blog3.getByRole('button', { name: 'view' }).click()

      await blog3.getByRole('button', { name: 'like' }).click()
      await expect(blog3).toContainText('likes 1')

      await blog3.getByRole('button', { name: 'like' }).click()
      await expect(blog3).toContainText('likes 2')

      await blog1.getByRole('button', { name: 'like' }).click()
      await expect(blog1).toContainText('likes 1')

      await expect(page.locator('.blog').first()).toContainText('blog #3 tester')
      await expect(page.locator('.blog').last()).toContainText('blog #2 tester')
    })
  })
})