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
export default function NewBlog({ createBlog }) {
  const title = useField("text")
  const author = useField("text")
  const url = useField("text")

  const handleSubmit = (event) => {
    event.preventDefault()
    createBlog({
      title: title.value,
      author: author.value,
      url: url.value,
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <Header>create new</Header>
      <div>
        <Input {...title} placeholder="title" />
      </div>
      <div>
        <Input {...author} placeholder="author" />
      </div>
      <div>
        <Input {...url} placeholder="url" />
      </div>
      <Button type="submit">create</Button>
    </form>
  )
}
