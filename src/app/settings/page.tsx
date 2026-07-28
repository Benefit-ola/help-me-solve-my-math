"use client";

import { useEffect, useState } from "react";
import { getSettings, updateSettings, resetSettings, AppSettings } from "@/lib/settings";
import { applyTheme } from "@/lib/theme";
import { clearHistory, getHistory } from "@/lib/history";

export default function SettingsPage() {
  const [settings, setSettings] = useState<AppSettings>({ theme: "light", precision: 4 });
  const [entryCount, setEntryCount] = useState(0);
  const [cleared, setCleared] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const current = getSettings();
    setSettings(current);
    applyTheme(current.theme);
    setEntryCount(getHistory().length);
    setLoaded(true);
  }, []);

  const handleThemeChange = (theme: "light" | "dark") => {
    const updated = updateSettings({ theme });
    setSettings(updated);
    applyTheme(theme);
  };

  const handlePrecisionChange = (precision: number) => {
    const updated = updateSettings({ precision });
    setSettings(updated);
  };

  const handleClearHistory = () => {
    if (confirm(`Delete all ${entryCount} saved history entries? This can't be undone.`)) {
      clearHistory();
      setEntryCount(0);
      setCleared(true);
      setTimeout(() => setCleared(false), 2500);
    }
  };

  const handleResetSettings = () => {
    const defaults = resetSettings();
    setSettings(defaults);
    applyTheme(defaults.theme);
  };

  if (!loaded) return null;

  return (
    <div className="px-4 py-12 md:px-8">
      <div className="max-w-2xl mx-auto">

        {/* HEADER */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <span className="h-[1px] w-8 bg-brand" />
            <span className="text-[11px] uppercase tracking-[0.18em] font-medium text-brand">
              Preferences
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
            Settings
          </h1>
        </div>

        <div className="flex flex-col gap-6">

          {/* THEME */}
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
            <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-widest mb-1">
              Theme
            </h2>
            <p className="text-xs text-gray-400 mb-4">Choose how the app looks.</p>
            <div className="flex gap-2">
              {(["light", "dark"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => handleThemeChange(t)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-semibold border capitalize transition-all ${
                    settings.theme === t
                      ? "bg-brand text-white border-brand"
                      : "bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-brand hover:text-brand"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* PRECISION */}
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
            <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-widest mb-1">
              Decimal Precision
            </h2>
            <p className="text-xs text-gray-400 mb-4">
              How many decimal places to show in results: <span className="font-semibold text-brand">{settings.precision}</span>
            </p>
            <input
              type="range"
              min={0}
              max={8}
              value={settings.precision}
              onChange={(e) => handlePrecisionChange(parseInt(e.target.value))}
              className="w-full accent-[#D63384]"
            />
            <div className="flex justify-between text-[10px] text-gray-400 mt-1">
              <span>0</span>
              <span>8</span>
            </div>
          </div>

          {/* HISTORY MANAGEMENT */}
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
            <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-widest mb-1">
              History
            </h2>
            <p className="text-xs text-gray-400 mb-4">
              You currently have <span className="font-semibold text-gray-700 dark:text-gray-300">{entryCount}</span> saved {entryCount === 1 ? "entry" : "entries"}.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={handleClearHistory}
                disabled={entryCount === 0}
                className="text-xs font-semibold text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 rounded-full px-4 py-2 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Clear All History
              </button>
              {cleared && (
                <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                  Cleared ✓
                </span>
              )}
            </div>
          </div>

          {/* RESET */}
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
            <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-widest mb-1">
              Reset
            </h2>
            <p className="text-xs text-gray-400 mb-4">
              Restore theme and precision back to defaults. Doesn&apos;t affect saved history.
            </p>
            <button
              onClick={handleResetSettings}
              className="text-xs font-semibold text-gray-500 hover:text-brand border border-gray-200 dark:border-gray-700 hover:border-brand rounded-full px-4 py-2 transition-colors"
            >
              Reset to Defaults
            </button>
          </div>
        </div>

      
      </div>
    </div>
  );
}
