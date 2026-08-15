const STORAGE_KEY = 'stampquest-travel-data';

export function loadTravelData() {
  if (typeof window === 'undefined') return null;

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;

  try {
    return JSON.parse(stored);
  } catch (error) {
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function saveTravelData(data) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
