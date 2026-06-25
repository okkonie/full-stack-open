import Notification from "./Notification"
import styled from "styled-components"
import { useField } from "../hooks/useField"

const Input = styled.input`
  padding: 0.5rem;
  box-sizing: border-box;
  margin: 0.1rem;
  font-size: 14px;
  width: 250px;
  outline: none;
  border: 1px solid black;
  border-radius: 4px;
  font-family: monospace;
`

const Header = styled.h2`
  font-size: 24px;
`

const Button = styled.button`
  font-family: monospace;
  box-sizing: border-box;
  padding: 0.5rem;
  width: 250px;
  font-size: 16px;
  font-weight: bold;
  background-color: #222;
  color: white;
  border: none;
  margin: 0.1rem;
  border-radius: 4px;
`

export default function Login({ handleLogin }) {
  const username = useField("text")
  const password = useField("password")

  const handleSubmit = (event) => {
    event.preventDefault()
    handleLogin({ username: username.value, password: password.value })
  }

  return (
    <div>
      <Header>Login to application</Header>
      <form onSubmit={handleSubmit}>
        <div>
          <Input {...username} placeholder="username" />
        </div>
        <div>
          <Input {...password} placeholder="password" />
        </div>
        <Button type="submit">login</Button>
      </form>
    </div>
  )
}
