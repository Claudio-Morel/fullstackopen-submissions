import { Button, Card, CardContent, Link, Stack, Typography } from '@mui/material'

const Blog = ({ blog, onLike, onRemove, currentUser }) => {
  if (!blog) {
    return null
  }

  const blogUserId = typeof blog.user === 'string' ? blog.user : blog.user?.id
  const canRemove = blogUserId === currentUser?.id

  const handleLike = () => {
    onLike(blog)
  }

  const handleRemove = async () => {
    const confirmed = window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)

    if (confirmed) {
      await onRemove(blog)
    }
  }

  return (
    <Card className="blog" elevation={2} sx={{ mt: 2, maxWidth: 720 }}>
      <CardContent>
        <Typography variant="h4" component="h2" gutterBottom>
          {blog.title}
        </Typography>
        <Typography variant="h6" component="p" color="text.secondary">
          by {blog.author}
        </Typography>
        <Link
          href={blog.url}
          target="_blank"
          rel="noreferrer"
          sx={{ display: 'block', mt: 1 }}
        >
          {blog.url}
        </Link>
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          Added by <span>{blog.user?.name}</span>
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
          <Typography variant="h6" component="span">
            {blog.likes} likes
          </Typography>
          {currentUser && (
            <Button variant="outlined" onClick={handleLike}>like</Button>
          )}
          {canRemove && (
            <Button color="error" variant="outlined" onClick={handleRemove}>
              remove
            </Button>
          )}
        </Stack>
      </CardContent>
    </Card>
  )
}

export default Blog
