const loginWith = async (page, username, password) => {
  await page.getByLabel('username').fill(username)
  await page.getByLabel('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const getBlogElement = (page, blog) => {
  return page.locator('.blog').filter({
    hasText: `${blog.title} ${blog.author}`
  })
}

const createBlog = async (page, blog) => {
  await page.getByRole('button', { name: 'create new blog' }).click()
  await page.getByLabel('title').fill(blog.title)
  await page.getByLabel('author').fill(blog.author)
  await page.getByLabel('url').fill(blog.url)
  await page.getByRole('button', { name: 'create' }).click()
  await getBlogElement(page, blog).waitFor()
}

const likeBlog = async (page, blog, numberOfLikes) => {
  const blogElement = getBlogElement(page, blog)

  await blogElement.getByRole('button', { name: 'view' }).click()

  for (let likes = 1; likes <= numberOfLikes; likes += 1) {
    await blogElement.getByRole('button', { name: 'like' }).click()
    await blogElement.getByText(`likes ${likes}`, { exact: false }).waitFor()
  }
}

module.exports = { loginWith, getBlogElement, createBlog, likeBlog }
