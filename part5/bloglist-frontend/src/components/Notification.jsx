import styled from 'styled-components'

const StyledNotification = styled.div`
  background-color: ${({ $success }) => ($success ? '#62f958' : 'rgb(250, 87, 87)')};
  font-size: 16px;
  font-weight: bold;
  margin-top: 1em;
  margin-bottom: 1em;
  padding: 1em;
`

const Notification = ({ notification }) => {
  return notification
    ? <StyledNotification $success={notification.success}>{notification.message}</StyledNotification>
    : null
}

export default Notification