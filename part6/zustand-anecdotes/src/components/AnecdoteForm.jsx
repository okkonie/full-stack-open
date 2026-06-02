import { useAnecdoteActions } from "../store"

export default function AnecdoteForm(){
  const actions = useAnecdoteActions()

  const addAnecdote = (e) => {
    e.preventDefault()
    const anecdote = e.target.anecdote.value
    actions.add(anecdote)
    e.target.reset()
  }

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <div>
          <input name="anecdote"/>
        </div>
        <button type="submit">create</button>
      </form>
    </>
  )
}