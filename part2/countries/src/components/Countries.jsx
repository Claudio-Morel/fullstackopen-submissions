import Country from './Country'

const Countries = ({ countries, filter, setFilterString }) => {

  if (countries.lenght === 0) {
    return <></>
  }
  const filteredCountries = countries.filter(entry =>
    entry.name.common.toLowerCase().includes(filter.toLowerCase())
  );

  if (filteredCountries.length > 10) {
    return (
      <div>
        <p>too many matches</p>
      </div>
    )
  }
  if (filteredCountries.length === 1) {
    return (
      <Country
        country={filteredCountries[0]}
      />
    )
  }
  return (
    <div>
      {filteredCountries.map(country =>
      {
        return (
          <div key={country.name.common}>
            <p>{country.name.common}</p>
            <button onClick={() => setFilterString(country.name.common)}>Show</button>
          </div>
        )
      })}
    </div>
  )
}

export default Countries
