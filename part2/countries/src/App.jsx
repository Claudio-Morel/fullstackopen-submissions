import { useState, useEffect } from 'react'
import countriesService from './services/countries'
import Filter from './components/Filter'
import Countries from './components/Countries'

function App() {
  const [countries, setCountries] = useState([])
  const [filterString, setFilterString] = useState('')

  useEffect(() => {
    countriesService.getAll()
      .then(response => {
      setCountries(response)
      })
    }, [])

  const handleFilterChange = (event) => {
    setFilterString(event.target.value)
  }

  return (
    <div>
      < Filter filterString={filterString} handleFilterChange={handleFilterChange} />

      < Countries
        countries={countries}
        filter={filterString}
        setFilterString={setFilterString}
      />

    </div>
  )

}

export default App
