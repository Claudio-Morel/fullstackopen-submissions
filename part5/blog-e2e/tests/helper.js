const loginWith = async (page, username, password) => {
  await page.getByRole('link', { name: 'login' }).click()
  await page.getByLabel('username').fill(username)
  await page.getByLabel('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const getBlogLink = (page, blog) => {
  return page.getByRole('link', {
    name: `${blog.title} ${blog.author}`
  })
}

const createBlog = async (page, blog) => {
  await page.getByRole('link', { name: 'new blog' }).click()
  await page.getByLabel('title').fill(blog.title)
  await page.getByLabel('author').fill(blog.author)
  await page.getByLabel('url').fill(blog.url)
  await page.getByRole('button', { name: 'create' }).click()
  await page.waitForURL('/')
  await getBlogLink(page, blog).waitFor()
}

module.exports = { loginWith, getBlogLink, createBlog }
