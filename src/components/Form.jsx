import { useCallback } from "react";
import {
  useCountries,
  useStates,
  useCities,
  useSelectedLocation,
} from "../contexts/LocationContext";
import styles from "./Form.module.css";

import { useWeather } from "../contexts/WeatherContext";

const Form = () => {
  const selectedLocations = useSelectedLocation();
  const [countries, selectCountry] = useCountries();
  const [states, selectState] = useStates();
  const [cities, selectCity] = useCities();
  const { getWeatherData } = useWeather();

  const handleCountrySelect = useCallback(
    (e) => {
      const country = countries.find(({ id }) => id === e.target.value);
      selectCountry(country);
    },
    [selectCountry]
  );

  const handleStateSelect = useCallback(
    (e) => {
      const state = states.find(({ id }) => id === e.target.value);
      selectState(state);
    },
    [selectState]
  );

  const handleCitySelect = useCallback(
    (e) => {
      const city = cities.find(({ id }) => id === e.target.value);
      selectCity(city);
    },
    [selectCity]
  );

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      getWeatherData();
    },
    [getWeatherData]
  );

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <select className={styles.select} onChange={handleCountrySelect} required>
        <option value="">Select a country</option>

        {countries.map((country) => (
          <option key={country.id} value={country.id}>
            {country.name}
          </option>
        ))}
      </select>
      <select
        className={states.length > 0 ? styles.select : styles.hidden}
        onChange={handleStateSelect}
      >
        <option value="">
          {states.length > 0 ? "Select a state" : "No selection possible"}
        </option>

        {states.map((state) => {
          return (
            <option key={state.id} value={state.id}>
              {state.name}
            </option>
          );
        })}
      </select>
      <select
        className={cities.length > 0 ? styles.select : styles.hidden}
        onChange={handleCitySelect}
      >
        <option value="">
          {cities.length > 0 ? "Select a city" : "No selection possible"}
        </option>

        {cities.map((city) => {
          return (
            <option key={city.id} value={city.id}>
              {city.name}
            </option>
          );
        })}
      </select>
      <button
        className={selectedLocations.length > 0 ? styles.button : styles.hidden}
      >
        GET WEATHER
      </button>
    </form>
  );
};

export default Form;
