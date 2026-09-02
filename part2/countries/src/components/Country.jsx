import weatherService from '../services/weather'
import WeatherInfo from './WeatherInfo'
import { useState, useEffect } from 'react'

const Country = ({ country }) => {
  const [capitalWeather, setCapitalWeather] = useState(null)
  let capitalInfo = country.capitalInfo.latlng

  useEffect(() => {
    weatherService
      .getWeather(capitalInfo[0], capitalInfo[1])
      .then(weather => {
        setCapitalWeather(weather)
      })
  }, [capitalInfo])

  return (
    <div>
      <h1>{country.name.common}</h1>
      <h2>Official name: {country.name.official}</h2>
      <p>Capital: {country.capital}</p>
      <p>Area: {country.area}</p>

      <h3>Languages</h3>

      <div>
        <ul>
          {Object.values(country.languages).map((language, i) => <li key={i}>{language}</li>)}
        </ul>
      </div>

      <img src={country.flags.svg}></img>

      <h3>Weather in {country.capital}</h3>

      <WeatherInfo
        weather={capitalWeather}
      />
    </div>
  )
}

export default Country
