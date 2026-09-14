import { useState } from 'react'
import { Button, Stack, TextField } from '@mui/material'

const BlogForm = ({ onCreate }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleSubmit = async event => {
    event.preventDefault()

    const createdBlog = await onCreate({ title, author, url })

    if (createdBlog) {
      setTitle('')
      setAuthor('')
      setUrl('')
    }
  }

  return (
    <Stack
      component="form"
      spacing={2}
      sx={{ maxWidth: 380, mt: 2 }}
      onSubmit={handleSubmit}
    >
      <TextField
        label="title"
        type="text"
        value={title}
        onChange={({ target }) => setTitle(target.value)}
        fullWidth
      />
      <TextField
        label="author"
        type="text"
        value={author}
        onChange={({ target }) => setAuthor(target.value)}
        fullWidth
      />
      <TextField
        label="url"
        type="text"
        value={url}
        onChange={({ target }) => setUrl(target.value)}
        fullWidth
      />
      <Button type="submit" variant="contained" sx={{ alignSelf: 'flex-start' }}>
        create
      </Button>
    </Stack>
  )
}

export default BlogForm
