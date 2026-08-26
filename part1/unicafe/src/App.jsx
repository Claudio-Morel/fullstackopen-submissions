import { useState } from 'react'

const Statistics = ({ good, neutral, bad }) => {
  if (good + neutral + bad == 0) return <p>No feedback given</p>

  var total = good + neutral + bad
  var score = good - bad
  var average = score / total
  var positivePercentage = good / total * 100

  return <div>
    <p>good { good }</p>
    <p>neutral { neutral }</p>
    <p>bad {bad}</p>
    <p>all {total}</p>
    <p>average {average}</p>
    <p>positive { positivePercentage}</p>
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
      <button onClick={updateGood}>good</button>
      <button onClick={updateNeutral}>neutral</button>
      <button onClick={updateBad}>bad</button>

      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} />

    </div>
  )
}

export default App
