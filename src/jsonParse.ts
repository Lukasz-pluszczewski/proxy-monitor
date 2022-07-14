export const jsonParse = (json: string) => {
  try {
    return JSON.parse(json);
  } catch {
    return {};
  }
};
