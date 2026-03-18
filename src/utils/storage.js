export const STORAGE_KEY = "braindump_v2";
export const loadState = () => {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    if (s) return JSON.parse(s);
  } catch {}
  return null;
};
export const saveState = (tasks) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)); } catch {}
};
