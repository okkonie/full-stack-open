export default function Weather({title, weather}){

  return weather ? (
    <>
      <h2>{title}</h2>

      <p>Temperature: {(weather.main.temp - 273.15).toFixed(2)} Celsius</p>

      <img src={`https://openweathermap.org/payload/api/media/file/${weather.weather[0].icon}.png`} alt="weather icon" />

      <p>Wind: {weather.wind.speed} m/s</p>
    </>
  ) : null
}