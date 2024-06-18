import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { fileURLToPath } from "node:url";
import { createCSVParser } from "./utils/csv-parser.mjs";
import { groupCitiesByCountryAndState } from "./utils/group-cities.mjs";
import { groupStatesByCountry } from "./utils/group-states.mjs";
import { createKeyPicker } from "./utils/key-picker.mjs";
import { createWeatherTransformer } from "./utils/transform-weather.mjs";

dotenv.config();

const openWeatherMap = {
  baseUrl: "https://api.openweathermap.org",
  weatherPath: "/data/2.5/weather",
  apiKey: process.env.OPEN_WEATHER_MAP_API_KEY,
};
const port = process.env.BFF_PORT;
const origin = process.env.ALLOWED_ORIGIN;

function run({ initialData }) {
  const { countries, cities, states, weatherIcons } = initialData;
  const statesByCountry = groupStatesByCountry(states);
  const citiesByCountryAndState = groupCitiesByCountryAndState(cities);

  const app = express();

  app.use(helmet());
  app.use(cors({ origin }));

  app.get("/weather", async (req, res) => {
    const { latitude, longitude } = req.query;

    const url = new URL(openWeatherMap.weatherPath, openWeatherMap.baseUrl);
    url.searchParams.set("lat", latitude);
    url.searchParams.set("lon", longitude);
    url.searchParams.set("appId", openWeatherMap.apiKey);
    url.searchParams.set("units", "metric");

    const weather = await fetch(url)
      .then((response) => response.json())
      .then(createWeatherTransformer(weatherIcons))
      .catch(console.error);

    res.send(weather);
  });

  app.get("/countries/:countryCode/states/:stateCode/cities", (req, res) => {
    const { countryCode, stateCode } = req.params;
    const country = countries.find(({ code }) => code === countryCode);

    if (!country) res.status(404).send(`Invalid country code "${countryCode}"`); // use middleware instead

    const statesOfCountry = statesByCountry.get(countryCode) ?? [];

    const state = statesOfCountry.find(({ code }) => code === stateCode);

    if (!state) res.status(404).send(`Invalid state code "${stateCode}"`); // use middleware instead

    const citiesOfCountryAndState =
      citiesByCountryAndState.get(`${countryCode}:${stateCode}`) ?? [];

    res.send(citiesOfCountryAndState);
  });

  app.get("/countries/:countryCode/states/:stateCode", (req, res) => {
    const { countryCode, stateCode } = req.params;
    const country = countries.find(({ code }) => code === countryCode);

    if (!country) res.status(404).send(`Invalid country code "${countryCode}"`); // use middleware instead

    const statesOfCountry = statesByCountry.get(countryCode) ?? [];

    const state = statesOfCountry.find(({ code }) => code === stateCode);

    if (!state) res.status(404).send(`Invalid state code "${stateCode}"`); // use middleware instead

    res.send(state);
  });

  app.get("/countries/:countryCode/states", (req, res) => {
    const { countryCode } = req.params;
    const country = countries.find(({ code }) => code === countryCode);

    if (!country) res.status(404).send(`Invalid country code "${countryCode}"`); // use middleware instead

    const statesOfCountry = statesByCountry.get(countryCode) ?? [];

    res.send(statesOfCountry);
  });

  app.get("/countries/:countryCode", (req, res) => {
    const { countryCode } = req.params;
    const country = countries.find(({ code }) => code === countryCode);

    if (!country) res.status(404).send(`Invalid country code "${countryCode}"`); // use middleware instead

    res.send(country);
  });

  app.get("/countries", (_req, res) => {
    res.send(countries);
  });

  app.get("/", (_req, res) => {
    res.send("Hello World!");
  });

  app.listen(port, () => {
    console.log(`BFF listening on port ${port}`);
  });
}

const [countries, cities, states, weatherIcons] = await Promise.all(
  ["countries", "cities", "states", "weatherIcons"]
    .map(resolveCSVPath)
    .map(createCSVParser())
);

run({
  initialData: {
    countries: countries.map(
      createKeyPicker("id", "name", "latitude", "longitude", "iso2:code")
    ),
    cities: cities.map(
      createKeyPicker(
        "id",
        "name",
        "latitude",
        "longitude",
        "country_code:countryCode",
        "state_code:stateCode"
      )
    ),
    states: states.map(
      createKeyPicker(
        "id",
        "name",
        "latitude",
        "longitude",
        "state_code:code",
        "country_code:countryCode"
      )
    ),
    weatherIcons,
  },
});

function resolveCSVPath(filename) {
  const csvURL = import.meta.resolve(`./data/${filename}.csv`);
  return fileURLToPath(csvURL);
}
