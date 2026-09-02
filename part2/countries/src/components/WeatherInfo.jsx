const WeatherInfo = ({ weather }) => {
  if (weather) {
    return (
      <div>
        <p>Temperature: {weather.main.temp} Celcius</p>
        <img src={`https://openweathermap.org/payload/api/media/file/${weather.weather[0].icon}.png`}></img>
        <p>Wind: {weather.wind.speed} m/s</p>
      </div>
    )
  }
}


export default WeatherInfo
