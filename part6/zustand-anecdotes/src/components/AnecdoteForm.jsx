import { useAnecdoteActions, useSetNotification } from "../store"

export default function AnecdoteForm(){
  const actions = useAnecdoteActions()
  const setNotification = useSetNotification()

  const addAnecdote = (e) => {
    e.preventDefault()
    const anecdote = e.target.anecdote.value
    actions.add(anecdote)

    setNotification(`Added anecdote '${anecdote}'`)
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