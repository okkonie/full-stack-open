import { useEffect } from "react"
import { useAnecdotes, useAnecdotesFilter, useAnecdoteActions, useSetNotification } from "../store"

export default function AnecdoteList(){
  const anecdotes = useAnecdotes()
  const filter = useAnecdotesFilter()
  const actions = useAnecdoteActions()
  const setNotification = useSetNotification()

  useEffect(() => {
    actions.initialize()
  }, [actions])

  const vote = anecdote => {
    actions.vote(anecdote.id)
    setNotification(`You voted '${anecdote.content}'`)
  }
  
  const remove = anecdote => {
    actions.remove(anecdote.id)
    setNotification(`'${anecdote.content}' deleted`)
  }

  const anecdotesToShow = anecdotes.filter(anecdote =>
    anecdote && anecdote.content.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <>
      {anecdotesToShow.map(anecdote => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote)}>vote</button>
            {anecdote.votes < 1 && <button onClick={() => remove(anecdote)}>delete</button>}
          </div>
        </div>
      ))}
    </>
  )
}