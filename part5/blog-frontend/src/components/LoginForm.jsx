import { useState } from 'react'
import { Button, Stack, TextField } from '@mui/material'

const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async event => {
    event.preventDefault()

    const loggedInUser = await onLogin({ username, password })

    if (loggedInUser) {
      setUsername('')
      setPassword('')
    }
  }

  return (
    <Stack
      component="form"
      spacing={1}
      sx={{ maxWidth: 210, mt: 3 }}
      onSubmit={handleSubmit}
    >
      <TextField
        label="username"
        type="text"
        variant="standard"
        value={username}
        onChange={({ target }) => setUsername(target.value)}
        fullWidth
      />
      <TextField
        label="password"
        type="password"
        variant="standard"
        value={password}
        onChange={({ target }) => setPassword(target.value)}
        fullWidth
      />
      <Button type="submit" variant="contained" sx={{ alignSelf: 'flex-start' }}>
        login
      </Button>
    </Stack>
  )
}

export default LoginForm
