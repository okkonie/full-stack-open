const baseUrl = 'http://localhost:3001/anecdotes'

const getId = () => (100000 * Math.random()).toFixed(0)

export const getAnecdotes = async () => {
  const res = await fetch(baseUrl)
  if (!res.ok) {
    throw new Error('Failed to fetch notes')
  }
  return await res.json()
}

export const createAnecdote = async (anecdote) => {
  const res = await fetch(baseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content: anecdote, id: getId(), votes: 0 })
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error)
  }

  return await res.json()
}

export const updateAnecdote = async (anecdote) => {
  const res = await fetch(`${baseUrl}/${anecdote.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(anecdote)
  })

  if (!res.ok) {
    throw new Error('Failed to update note')
  }

  return await res.json()
}