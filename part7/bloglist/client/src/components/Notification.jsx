import styled from "styled-components"
import { useNotificationMessage, useNotificationError } from "../store"

const StyledNotification = styled.div`
  background-color: ${({ $success }) => ($success ? "#62f958" : "#ff5656")};
  font-size: 16px;
  font-weight: bold;
  margin-top: 1em;
  margin-bottom: 1em;
  padding: 1em;
`

const Notification = () => {
  const message = useNotificationMessage()
  const error = useNotificationError()

  return message ? (
    <StyledNotification $success={!error}>{message}</StyledNotification>
  ) : null
}

export default Notification
