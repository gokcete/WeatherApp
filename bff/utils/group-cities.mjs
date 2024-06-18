export function groupCitiesByCountryAndState(cities) {
  const citiesByCountryAndState = new Map();

  for (const { countryCode, stateCode, ...city } of cities) {
    const code = `${countryCode}:${stateCode}`;
    if (!citiesByCountryAndState.has(code))
      citiesByCountryAndState.set(code, []);

    const group = citiesByCountryAndState.get(code);

    group.push(city);
  }

  return citiesByCountryAndState;
}
