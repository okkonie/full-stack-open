import useCounterStore from "../store"

const Buttons = () => {
  const counter = useCounterStore(state => state.actions)

  return (
    <div>
      <h2>give feedback</h2>
      <button onClick = {counter.incrementGood}>good</button>
      <button onClick = {counter.incrementNeutral}>neutral</button>
      <button onClick = {counter.incrementBad}>bad</button>
    </div>
  )
}

export default Buttons
