import { createContext, useContext } from "react";

const APIContext = createContext(null);

export function useAPI() {
  const { getCountries, getStates, getCities, getWeather } =
    useContext(APIContext);

  return [getCountries, getStates, getCities, getWeather];
}

async function getDataFromBFF(path) {
  const url = new URL(path, import.meta.env.VITE_BFF_BASE_URL);
  return fetch(url).then((res) => res.json());
}

export function APIProvider({ children }) {
  function getCountries(setCountries) {
    getDataFromBFF("/countries").then((data) => setCountries(data));
  }

  function getStates(countrycode, setStates) {
    getDataFromBFF(`/countries/${countrycode}/states`).then((data) =>
      setStates(data)
    );
  }

  function getCities(countrycode, statecode, setCities) {
    getDataFromBFF(`/countries/${countrycode}/states/${statecode}/cities`).then(
      (data) => setCities(data)
    );
  }

  function getWeather(selectedLocations, setWeatherData) {
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
  }

  return (
    <APIContext.Provider
      value={{ getCountries, getStates, getCities, getWeather }}
    >
      {children}
    </APIContext.Provider>
  );
}
