import { createContext, useContext } from "react";

const APIContext = createContext(null);

export function useAPI() {
  const { getCountries, getStates, getCities } = useContext(APIContext);

  return [getCountries, getStates, getCities];
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

  return (
    <APIContext.Provider value={{ getCountries, getStates, getCities }}>
      {children}
    </APIContext.Provider>
  );
}
