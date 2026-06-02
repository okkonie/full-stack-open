import { useAnecdotes, useAnecdoteActions } from "../store"

export default function AnecdoteList(){
  const anecdotes = useAnecdotes()
  const actions = useAnecdoteActions()

  const vote = id => {
    actions.vote(id)
  }

  return (
    <>
      {anecdotes.map(anecdote => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      ))}
    </>
  )
}