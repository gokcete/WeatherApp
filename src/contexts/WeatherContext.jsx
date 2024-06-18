import { useState, createContext, useContext, useCallback } from "react";
import { useSelectedLocation } from "./LocationContext";

const WeatherContext = createContext({});

export function useWeather() {
  return useContext(WeatherContext);
}

export const WeatherProvider = ({ children }) => {
  const selectedLocations = useSelectedLocation();
  const [weatherData, setWeatherData] = useState(null);

  const clearWeatherData = useCallback(
    () => setWeatherData(null),
    [setWeatherData]
  );

  const getWeatherData = useCallback(() => {
    const selectedLocation = selectedLocations[0];

    if (!selectedLocation) return;

    const { latitude, longitude } = selectedLocation;

    if (!latitude || !longitude) return;

    const url = new URL("/weather", "http://localhost:3000");
    url.searchParams.set("latitude", latitude);
    url.searchParams.set("longitude", longitude);

    fetch(url)
      .then((res) => res.json())
      .then((data) => ({
        ...data,
        name: selectedLocations.map((l) => l.name).join(", "),
      }))
      .then((data) => setWeatherData(data));
  }, [setWeatherData, selectedLocations]);

  return (
    <WeatherContext.Provider
      value={{ weatherData, getWeatherData, clearWeatherData }}
    >
      {children}
    </WeatherContext.Provider>
  );
};
