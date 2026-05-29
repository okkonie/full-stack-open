import { useState } from 'react'
import Notification from './Notification'
import styled from 'styled-components'

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
  box-sizing: border-box;
  font-family: monospace;
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

export default function Login({ handleLogin }){
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = event => {
    event.preventDefault()
    handleLogin(username, password)
    setUsername('')
    setPassword('')
  }

  return (
    <div>
      <Header>Login to application</Header>
      <form onSubmit={handleSubmit}>
        <div>
          <Input
            type="text"
            value={username}
            placeholder='username'
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          <Input
            type="password"
            value={password}
            placeholder='password'
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <Button type="submit">login</Button>
      </form>
    </div>
  )
}