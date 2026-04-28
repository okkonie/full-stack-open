import axios from 'axios'
import { useState, useEffect } from 'react'
import Weather from './Weather'

export default function Countryinfo({country}){
  const [weather, setWeather] = useState(null)

  const weather_api_key = import.meta.env.VITE_WEATHER_API_KEY

  useEffect(() => {
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?lat=${country.capitalInfo.latlng[0]}&lon=${country.capitalInfo.latlng[1]}&appid=${weather_api_key}`)
      .then(res => setWeather(res.data))
  }, [country])

  return (  
    <div>
      <h1>{country.name.common}</h1>
      <p>
        {country.capital.length > 1 ? 'Capitals: ' : 'Capital: '}
        {country.capital.join(', ')}
      </p>

      <p>Area: {country.area}</p>

      <h2>Languages</h2>

      <ul>
        {Object.values(country.languages).map((language, i) => <li key={i}>{language}</li>)}
      </ul>

      <img src={country.flags.png} alt="flag" />

      <Weather title={`Weather in ${country.capital[0]}`} weather={weather}/>
    </div>
  )
}