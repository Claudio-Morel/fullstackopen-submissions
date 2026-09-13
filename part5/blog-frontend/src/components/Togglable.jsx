import { useImperativeHandle, useState } from 'react'

const Togglable = ({ buttonLabel, children, ref }) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const show = () => setVisible(true)
  const hide = () => setVisible(false)

  useImperativeHandle(ref, () => ({ hide }))

  return (
    <div>
      <div style={hideWhenVisible}>
        <button type="button" onClick={show}>{buttonLabel}</button>
      </div>
      <div style={showWhenVisible}>
        {children}
        <button type="button" onClick={hide}>cancel</button>
      </div>
    </div>
  )
}

export default Togglable
