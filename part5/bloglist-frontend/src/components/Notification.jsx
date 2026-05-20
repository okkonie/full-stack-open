const Notification =({message}) => (
  message ? <p className="message">{message}</p> : null
)

export default Notification