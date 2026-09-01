const Country = ({ country }) => {
  console.log(country)
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
    </div>
  )
}

export default Country
