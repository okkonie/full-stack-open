import { Link } from "react-router-dom"
import { useParams } from "react-router-dom"
import styled from "styled-components"

const StyledBlog = styled.div`
  margin-top: 1em;
  padding: 1em;
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

export default function Blog({
  blogs,
  handleLike,
  handleDelete,
  loggedUsername,
}) {
  const id = useParams().id
  const blog = blogs.find((n) => n.id === id)

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
    </StyledBlog>
  )
}
