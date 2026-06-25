import { Link } from "react-router-dom"
import { useParams } from "react-router-dom"
import styled from "styled-components"
import { useField } from "../hooks/useField"
import { useBlogActions } from "../store"

const StyledBlog = styled.div`
  margin-top: 1rem;
  padding: 1.5rem;
  width: 400px;
  box-shadow: 2px 2px 5px #999;
`

const Title = styled.h2`
  font-size: 24px;
  margin: 0;
`

const SubTitle = styled.h3`
  font-size: 16px;
  color: #777;
  margin-top: 6px;
`

const Likes = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 0.5em;
`

const Button = styled.button`
  padding: 0.2em 1.2em;
  border: 2px solid ${({ $like }) => ($like ? "#24a71b" : "#fa5252")};
  color: ${({ $like }) => ($like ? "#24a71b" : "#fa5252")};
  font-family: monospace;
  font-weight: bold;
  font-size: 14px;
  border-radius: 4px;
  background: none;
  &:hover {
    cursor: pointer;
  }
`

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

const SubmitButton = styled.button`
  font-family: monospace;
  box-sizing: border-box;
  padding: 0.5rem 1rem;
  font-size: 16px;
  font-weight: bold;
  background-color: #222;
  color: white;
  border: none;
  margin: 0.1rem;
  border-radius: 4px;
`

export default function Blog({
  blogs,
  handleLike,
  handleDelete,
  loggedUsername,
}) {
  const comment = useField("text")

  const actions = useBlogActions()

  const id = useParams().id
  const blog = blogs.find((n) => n.id === id)

  const handleSumbit = (e) => {
    e.preventDefault()
    actions.comment(id, comment.value)
  }

  if (!blog) return <h2>404 - Blog not found</h2>

  return (
    <StyledBlog>
      <Title>{blog.title}</Title>
      <SubTitle>by {blog.author}</SubTitle>
      <a href={blog.url} target="_blank" rel="noreferrer">
        {blog.url}
      </a>
      <p>Added by {blog.user.name}</p>
      <Likes>
        {blog.likes} likes
        {loggedUsername && (
          <Button $like onClick={() => handleLike(blog)}>
            like
          </Button>
        )}
        {loggedUsername === blog.user.username && (
          <Button onClick={() => handleDelete(blog)}>remove</Button>
        )}
      </Likes>

      <h2>comments</h2>

      <form onSubmit={handleSumbit}>
        <Input {...comment} placeholder="comment" />
        <SubmitButton type="submit">add comment</SubmitButton>
      </form>

      <ul>
        {blog.comments.map((c, i) => (
          <li key={i}>{c}</li>
        ))}
      </ul>
    </StyledBlog>
  )
}
