export const STORAGE_KEYS = {
  tableFontSize: "tableFontSize",
};
export function initStorage(key, defaultValue = "") {
  const val = getStorage(key);
  if (val) return val;
  else {
    setStorage(key, defaultValue);
    return defaultValue;
  }
}
export function setStorage(key, value) {
  localStorage.setItem(key, value);
}
export function getStorage(key) {
  return localStorage.getItem(key);
}
