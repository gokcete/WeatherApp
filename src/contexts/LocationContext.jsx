import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAPI } from "./APIContext";

const LocationContext = createContext({});

export function useSelectedLocation() {
  const { selectedCity, selectedState, selectedCountry } =
    useContext(LocationContext);

  const selectedLocation = useMemo(
    () => [selectedCity, selectedState, selectedCountry].filter(Boolean),
    [selectedCity, selectedState, selectedCountry]
  );

  return selectedLocation;
}

export function useCountries() {
  const { countries, selectCountry } = useContext(LocationContext);

  return [countries, selectCountry];
}

export function useStates() {
  const { states, selectState } = useContext(LocationContext);

  return [states, selectState];
}

export function useCities() {
  const { cities, selectCity } = useContext(LocationContext);

  return [cities, selectCity];
}

export function LocationProvider({ children }) {
  const [getCountries, getStates, getCities] = useAPI();

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  useEffect(() => {
    getCountries(setCountries);
  }, []);

  function selectCountry(country) {
    setSelectedCity(null);
    setCities([]);
    setSelectedState(null);
    setStates([]);
    setSelectedCountry(country);

    getStates(country.code, setStates);
  }

  function selectState(state) {
    setSelectedCity(null);
    setCities([]);
    setSelectedState(state);

    getCities(selectedCountry.code, state.code, setCities);
  }

  function selectCity(city) {
    setSelectedCity(city);
  }

  return (
    <LocationContext.Provider
      value={{
        countries,
        selectCountry,
        states,
        selectState,
        cities,
        selectCity,
        selectedCountry,
        selectedState,
        selectedCity,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

async function getDataFromBFF(path) {
  const url = new URL(path, import.meta.env.VITE_BFF_BASE_URL);
  return fetch(url).then((res) => res.json());
}
