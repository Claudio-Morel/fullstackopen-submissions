const Notification = ({ notification }) => {
  if (notification.message === "") {
    return null
  }

  return (
    <div className={notification.className}>
      {notification.message}
    </div>
  )
}

export default Notification
