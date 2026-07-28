"use client";

import { useState } from "react";
import { addHistoryEntry } from "@/lib/history";

type Category = "length" | "weight" | "temperature" | "volume";

// factors are relative to a base unit per category (meters, kilograms, liters)
const units: Record<Category, { label: string; factor: number }[]> = {
  length: [
    { label: "Millimeters (mm)", factor: 0.001 },
    { label: "Centimeters (cm)", factor: 0.01 },
    { label: "Meters (m)", factor: 1 },
    { label: "Kilometers (km)", factor: 1000 },
    { label: "Inches (in)", factor: 0.0254 },
    { label: "Feet (ft)", factor: 0.3048 },
    { label: "Miles (mi)", factor: 1609.344 },
  ],
  weight: [
    { label: "Grams (g)", factor: 0.001 },
    { label: "Kilograms (kg)", factor: 1 },
    { label: "Pounds (lb)", factor: 0.453592 },
    { label: "Ounces (oz)", factor: 0.0283495 },
    { label: "Tonnes (t)", factor: 1000 },
  ],
  volume: [
    { label: "Milliliters (ml)", factor: 0.001 },
    { label: "Liters (l)", factor: 1 },
    { label: "US Gallons (gal)", factor: 3.78541 },
    { label: "Cups", factor: 0.236588 },
    { label: "Fluid Ounces (fl oz)", factor: 0.0295735 },
  ],
  temperature: [
    { label: "Celsius (°C)", factor: 0 },
    { label: "Fahrenheit (°F)", factor: 1 },
    { label: "Kelvin (K)", factor: 2 },
  ],
};

const categoryLabels: Record<Category, string> = {
  length: "Length",
  weight: "Weight",
  temperature: "Temperature",
  volume: "Volume",
};

function fmt(n: number) {
  return parseFloat(n.toFixed(6));
}

function convertTemperature(value: number, fromIdx: number, toIdx: number): number {
  // 0 = Celsius, 1 = Fahrenheit, 2 = Kelvin — convert via Celsius as base
  let celsius: number;
  if (fromIdx === 0) celsius = value;
  else if (fromIdx === 1) celsius = (value - 32) * (5 / 9);
  else celsius = value - 273.15;

  if (toIdx === 0) return celsius;
  if (toIdx === 1) return celsius * (9 / 5) + 32;
  return celsius + 273.15;
}

export default function UnitConverter() {
  const [category, setCategory] = useState<Category>("length");
  const [fromIdx, setFromIdx] = useState(0);
  const [toIdx, setToIdx] = useState(1);
  const [value, setValue] = useState("1");
  const [saved, setSaved] = useState(false);

  const list = units[category];
  const inputValue = parseFloat(value) || 0;

  const result =
    category === "temperature"
      ? fmt(convertTemperature(inputValue, fromIdx, toIdx))
      : fmt((inputValue * list[fromIdx].factor) / list[toIdx].factor);

  const changeCategory = (cat: Category) => {
    setCategory(cat);
    setFromIdx(0);
    setToIdx(1);
    setSaved(false);
  };

  const swap = () => {
    setFromIdx(toIdx);
    setToIdx(fromIdx);
    setSaved(false);
  };

  const saveToHistory = () => {
    addHistoryEntry({
      tool: "converter",
      input: `${inputValue} ${list[fromIdx].label}`,
      result: `${result} ${list[toIdx].label}`,
    });
    setSaved(true);
  };

  return (
    <div className="min-h-screen bg-[#fdfcfb] px-4 py-12 md:px-8">
      <div className="max-w-2xl mx-auto">

        {/* HEADER */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <span className="h-[1px] w-8 bg-brand" />
            <span className="text-[11px] uppercase tracking-[0.18em] font-medium text-brand">
              Quick Conversion
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-3">
            Unit <span className="text-brand">Converter</span>
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed max-w-lg">
            Convert between length, weight, temperature, and volume units instantly.
          </p>
        </div>

        {/* CATEGORY TABS */}
        <div className="flex flex-wrap gap-2 mb-6">
          {(Object.keys(units) as Category[]).map((cat) => (
            <button
              key={cat}
              onClick={() => changeCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                category === cat
                  ? "bg-brand text-white border-brand"
                  : "bg-white text-gray-600 border-gray-200 hover:border-brand hover:text-brand"
              }`}
            >
              {categoryLabels[cat]}
            </button>
          ))}
        </div>

        {/* CONVERTER CARD */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-6">

          {/* VALUE INPUT */}
          <div className="flex flex-col gap-1.5 mb-5">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-widest">
              Value
            </label>
            <input
              type="number"
              step="any"
              value={value}
              onChange={(e) => { setValue(e.target.value); setSaved(false); }}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-800 font-medium text-sm focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
            />
          </div>

          {/* FROM / SWAP / TO */}
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-3 items-end mb-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-widest">From</label>
              <select
                value={fromIdx}
                onChange={(e) => { setFromIdx(parseInt(e.target.value)); setSaved(false); }}
                className="w-full px-3 py-3 rounded-xl border border-gray-200 text-gray-800 text-sm font-medium focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
              >
                {list.map((u, i) => (
                  <option key={u.label} value={i}>{u.label}</option>
                ))}
              </select>
            </div>

            <button
              onClick={swap}
              className="h-11 w-11 mx-auto rounded-full border border-gray-200 hover:border-brand hover:text-brand text-gray-400 flex items-center justify-center transition-all"
              aria-label="Swap units"
              title="Swap units"
            >
              ⇄
            </button>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-widest">To</label>
              <select
                value={toIdx}
                onChange={(e) => { setToIdx(parseInt(e.target.value)); setSaved(false); }}
                className="w-full px-3 py-3 rounded-xl border border-gray-200 text-gray-800 text-sm font-medium focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
              >
                {list.map((u, i) => (
                  <option key={u.label} value={i}>{u.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* RESULT */}
          <div className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-100">
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">Result</p>
            <p className="text-4xl font-extrabold text-brand mb-2">{result}</p>
            <p className="text-xs text-gray-400 font-mono">
              {inputValue} {list[fromIdx].label} = {result} {list[toIdx].label}
            </p>
          </div>

          <div className="flex items-center gap-3 mt-5">
            <button
              onClick={saveToHistory}
              className="text-xs font-semibold text-brand hover:text-brand-dark transition-colors"
            >
              + Save to History
            </button>
            {saved && (
              <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                Saved ✓
              </span>
            )}
          </div>
        </div>

       
      </div>
    </div>
  );
}