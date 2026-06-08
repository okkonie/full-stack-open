import NotificationContext from '../NotificationContext'
import { useContext } from 'react'

export const useNotification = () => {
  const { notification, setNotification } = useContext(NotificationContext)

  const handleNotification = (notification) => {
    setNotification(notification)
    setTimeout(() => setNotification(''), 5000)
  }

  return { notification, handleNotification }
}