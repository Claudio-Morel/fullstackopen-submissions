import Country from './Country'

const Countries = ({ countries, filter }) => {

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
      <div>
        <Country country={filteredCountries[0]}/>
      </div>
    )
  }
  return (
    <div>
      {filteredCountries.map(country => { console.log(country.name.common); return <p key={country.name.common}>{country.name.common}</p>})}
    </div>
  )
}

export default Countries
