import axios from 'axios'

const baseUrl = 'https://api.openweathermap.org/data/2.5/weather'
const apiKey = import.meta.env.VITE_WEATHER_API_KEY

const getWeather = (lat, lon) =>
  axios.get(baseUrl, {
    params: {
      lon: lon,
      lat: lat,
      appid: apiKey,
      units: 'metric',
    },
  }).then(response => response.data)

export default { getWeather }
