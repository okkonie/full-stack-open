import { useState } from 'react'
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

export default function NewBlog({ createBlog }){
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleSubmit = event => {
    event.preventDefault()
    createBlog({ title, author, url })

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <Header>create new</Header>
      <div>
        <Input
          type="text"
          value={title}
          placeholder='title'
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>
      <div>
        <Input
          type="text"
          value={author}
          placeholder='author'
          onChange={({ target }) => setAuthor(target.value)}
        />
      </div>
      <div>
        <Input
          type="text"
          value={url}
          placeholder='url'
          onChange={({ target }) => setUrl(target.value)}
        />
      </div>
      <Button type="submit">create</Button>
    </form>
  )
}