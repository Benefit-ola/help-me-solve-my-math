export interface AppSettings {
  theme: "light" | "dark";
  precision: number; // decimal places shown in results
}

const STORAGE_KEY = "hmsm_settings";

const DEFAULT_SETTINGS: AppSettings = {
  theme: "light",
  precision: 4,
};

export function getSettings(): AppSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function updateSettings(partial: Partial<AppSettings>): AppSettings {
  const current = getSettings();
  const updated = { ...current, ...partial };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function resetSettings(): AppSettings {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS));
  return DEFAULT_SETTINGS;
}
