const baseUrl = 'http://localhost:3001/anecdotes'

const getId = () => (100000 * Math.random()).toFixed(0)

const getAll = async () => {
  const res = await fetch(baseUrl)

  if(!res.ok){
    throw new Error('Failed to fetch anecdotes')
  }

  const data = await res.json()
  return data
}

const create = async (content) => {
  const res = await fetch(baseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, id: getId(),  votes: 0 }),
  })

  if (!res.ok) {
    throw new Error('Failed to create note')
  }
  
  return await res.json()
}

const update = async (anecdote) => {
  const res = await fetch(`${baseUrl}/${anecdote.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(anecdote),
  })

  if (!res.ok) {
    throw new Error('Failed to update note')
  }
  
  return await res.json()
}

const remove = async (id) => {
  const res = await fetch(`${baseUrl}/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  })

  if (!res.ok) {
    throw new Error('Failed to delete note')
  }

  return await res.json()
}

export default { getAll, create, update, remove }