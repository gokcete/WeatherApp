export function groupStatesByCountry(states) {
  const statesByCountry = new Map();

  for (const { countryCode, ...state } of states) {
    if (!statesByCountry.has(countryCode)) statesByCountry.set(countryCode, []);

    const group = statesByCountry.get(countryCode);

    group.push(state);
  }

  return statesByCountry;
}
