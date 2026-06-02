import useCounterStore from "../store"

const Statistics = () => {
  const counter = useCounterStore()

  const good = counter.good
  const neutral = counter.neutral
  const bad = counter.bad
  const all = counter.all
  const average = all === 0 ? 0 : ((good - bad) / all).toFixed(2)
  const positive = all === 0 ? 0 : `${(good / all * 100).toFixed(2)} %`
  
  return (
    <div>
      <h2>statistics</h2>
      <table>
        <tbody>
          <tr><td>good</td><td>{good}</td></tr>
          <tr><td>neutral</td><td>{neutral}</td></tr>
          <tr><td>bad</td><td>{bad}</td></tr>
          <tr><td>all</td><td>{all}</td></tr>
          <tr><td>average</td><td>{average}</td></tr>
          <tr><td>positive</td><td>{positive}</td></tr>
        </tbody>
      </table>
    </div>
  )
}

export default Statistics
