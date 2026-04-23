import { useState } from 'react'

const Button = ({value, setValue, text}) => {

  const setToValue = (newValue) => {
    setValue(newValue);
  }

  return <button onClick={() => setToValue(value + 1)}>{text}</button>
}

const StatisticLine = ({text, value}) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}


const Statistics = (props) => {
  const all = props.good + props.neutral + props.bad

  if (all === 0) return (
    <>
      <h1>Statistics</h1>
      <p>No feedback given</p>
    </>
  )

  return (
    <>
      <h1>Statistics</h1>
      <table>
        <tbody>
          <StatisticLine text={"good"} value={props.good} />
          <StatisticLine text={"neutral"} value={props.neutral} />
          <StatisticLine text={"bad"} value={props.bad} />
          <StatisticLine text={"all"} value={all} />
          <StatisticLine text={"average"} value={(props.good - props.bad) / all} />
          <StatisticLine text={"positive"} value={props.good * 100 / all + "%"} />
        </tbody>
      </table>
    </>
  )
}

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  return (
    <div>
      <h1>Give feedback</h1>
      <Button value={good} setValue={setGood} text={"good"}/>
      <Button value={neutral} setValue={setNeutral} text={"neutral"}/>
      <Button value={bad} setValue={setBad} text={"bad"}/>
      <Statistics good={good} neutral={neutral} bad={bad}/>
    </div>
  )
}

export default App