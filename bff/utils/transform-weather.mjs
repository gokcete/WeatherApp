export function createWeatherTransformer(weatherIcons) {
  return (weatherData) => {
    const weather = weatherData.weather[0];
    let icon = weatherIcons.find(
      (icon) => String(icon.id) === String(weather.id)
    )?.daycode;

    icon = `https://openweathermap.org/img/wn/${icon}@4x.png`;

    return {
      temperature: weatherData.main.temp,
      description: weather.description,
      windSpeed: weatherData.wind.speed,
      clouds: weatherData.clouds.all,
      humidity: weatherData.main.humidity,
      pressure: weatherData.main.pressure,
      visibility: weatherData.visibility,
      rain: weatherData.rain?.["1h"],
      icon,
    };
  };
}
