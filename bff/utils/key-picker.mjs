export function createKeyPicker(...keys) {
  return (object) =>
    Object.fromEntries(
      keys.map((key) => {
        const [originalKey, finalKey = originalKey] = key.split(":");

        return [finalKey, object[originalKey]];
      })
    );
}
