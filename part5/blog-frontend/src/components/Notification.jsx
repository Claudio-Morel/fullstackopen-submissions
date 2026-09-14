import { Alert } from '@mui/material'

const Notification = ({ notification }) => {
  if (notification.message === '') {
    return null
  }

  const severity = notification.className === 'error' ? 'error' : 'success'

  return (
    <Alert className={notification.className} severity={severity} sx={{ mb: 2 }}>
      {notification.message}
    </Alert>
  )
}

export default Notification
