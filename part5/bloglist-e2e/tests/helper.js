const createBlog = async (page, title, author, url) => {
  await page.getByRole('button', { name: 'create new blog' }).click()

  await page.getByLabel('title').fill(title)
  await page.getByLabel('author').fill(author)
  await page.getByLabel('url').fill(url)

  await page.getByRole('button', { name: 'create' }).click()
}

module.exports = createBlog