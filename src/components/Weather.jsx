import { useWeather } from "../contexts/WeatherContext";

import styles from "./Weather.module.css";

const Weather = () => {
  const { weatherData } = useWeather();

  if (!weatherData) return <p></p>;

  return (
    <div className={styles.weathercontainer}>
      <h2 className={styles.location}>{weatherData.name}</h2>

      <img src={weatherData.icon} alt={weatherData.description} />

      <p className={styles.temp}>
        <span className={styles.number}>
          {Math.round(weatherData.temperature)}
        </span>
        <span className={styles.unit}>°C</span>
      </p>
      <p className={styles.description}>{weatherData.description}</p>
      <div className={styles.weatherdetails}>
        <p>Wind: {weatherData.windSpeed} m/s</p>
        <p>Clouds: {weatherData.clouds}%</p>
        <p>Humidity: {weatherData.humidity}%</p>
        <p>Pressure: {weatherData.pressure} hpa</p>
        <p>Visibility: {weatherData.visibility} meter(s)</p>
        {weatherData.rain ? <p>`Rain: ${weatherData.rain} mm`</p> : ""}
      </div>
    </div>
  );
};

export default Weather;

/* 
temperature: weatherData.main.temp,
description: weather.description,
windSpeed: weatherData.wind.speed,
clouds: weatherData.clouds.all,
humidity: weatherData.main.humidity,
pressure: weatherData.main.pressure,
visibility: weatherData.visibility,
rain: weatherData.rain["1h"],
icon: weatherIcons.find((icon) => icon.id === weather.id), */
