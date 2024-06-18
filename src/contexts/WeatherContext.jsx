import { useState, createContext, useContext, useCallback } from "react";
import { useSelectedLocation } from "./LocationContext";
import { useAPI } from "./APIContext";

const WeatherContext = createContext({});

export function useWeather() {
  return useContext(WeatherContext);
}

export const WeatherProvider = ({ children }) => {
  const [, , , getWeather] = useAPI();
  const selectedLocations = useSelectedLocation();
  const [weatherData, setWeatherData] = useState(null);

  const clearWeatherData = useCallback(
    () => setWeatherData(null),
    [setWeatherData]
  );

  const getWeatherData = useCallback(() => {
    getWeather(selectedLocations, setWeatherData);
  }, [setWeatherData, selectedLocations, getWeather]);

  return (
    <WeatherContext.Provider
      value={{ weatherData, getWeatherData, clearWeatherData }}
    >
      {children}
    </WeatherContext.Provider>
  );
};
