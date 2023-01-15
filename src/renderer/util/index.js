export const isEmptyString = (str) => {
  if (typeof str !== 'string') return false;
  if (!str) return false;
  if (str !== '' || str.length !== 0) return false;
  return true;
}

export const isStringValue = (str) => {
  if (isEmptyString(str)) return false;
  return true;
}
