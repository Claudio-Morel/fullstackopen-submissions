import { useState } from 'react'

const Button = ({ text, onClick }) => {
  return (
    <button onClick={onClick}>
      {text}
    </button>
  )
}

const StatisticsLine = ({ text, value }) => {
  return <p>{text} { value }</p>
}

const Statistics = ({ good, neutral, bad }) => {
  if (good + neutral + bad == 0) return <p>No feedback given</p>

  var total = good + neutral + bad
  var score = good - bad
  var average = score / total
  var positivePercentage = good / total * 100

  return <div>
    <StatisticsLine text="good" value={good} />
    <StatisticsLine text="neutral" value={neutral} />
    <StatisticsLine text="bad" value={bad} />
    <StatisticsLine text="all" value={total} />
    <StatisticsLine text="average" value={average} />
    <StatisticsLine text="positive" value={positivePercentage} />
  </div>
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const updateCount = (count, adder) => {
    adder(count + 1)
  }

  const updateGood = () => updateCount(good, setGood)
  const updateNeutral = () => updateCount(neutral, setNeutral)
  const updateBad = () => updateCount(bad, setBad)

  return (
    <div>
      <h1>give feedback</h1>
      <Button text="good" onClick={updateGood} />
      <Button text="neutral" onClick={updateNeutral} />
      <Button text="bad" onClick={updateBad}/>

      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} />

    </div>
  )
}

export default App
