"use client";

import { useState } from "react";
import { addHistoryEntry } from "@/lib/history";

export default function TimesTable() {
  const [number, setNumber] = useState("1");
  const [range, setRange]   = useState(12);
  const [saved, setSaved]   = useState(false);

  const n = parseFloat(number) || 0;

  const rows = Array.from({ length: range }, (_, i) => {
    const multiplier = i + 1;
    return { multiplier, result: n * multiplier };
  });

  const saveToHistory = () => {
    addHistoryEntry({
      tool: "times-table",
      input: `Table of ${n} (1–${range})`,
      result: `${n} × 1 = ${n}  …  ${n} × ${range} = ${n * range}`,
    });
    setSaved(true);
  };

  return (
    <div className="min-h-screen bg-[#fdfcfb] px-4 py-12 md:px-8">
      <div className="max-w-3xl mx-auto">

        {/* HEADER */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <span className="h-[1px] w-8 bg-brand" />
            <span className="text-[11px] uppercase tracking-[0.18em] font-medium text-brand">
              Quick Reference
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-3">
            Multiplication <span className="text-brand">Table</span>
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed max-w-lg">
            Enter any number and see its full multiplication table, instantly.
          </p>
        </div>

        {/* CONTROLS */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-widest">
                Number
              </label>
              <input
                type="number"
                value={number}
                onChange={(e) => { setNumber(e.target.value); setSaved(false); }}
                step="any"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-800 font-medium text-sm focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-widest">
                Up to (× range): {range}
              </label>
              <input
                type="range"
                min={5}
                max={20}
                value={range}
                onChange={(e) => { setRange(parseInt(e.target.value)); setSaved(false); }}
                className="w-full accent-[#D63384] mt-3"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
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

        {/* TABLE */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-5">
            Table of {n || 0}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {rows.map((row) => (
              <div
                key={row.multiplier}
                className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 hover:border-brand hover:bg-brand-50 transition-colors"
              >
                <span className="text-xs text-gray-400 font-mono">
                  {n} × {row.multiplier}
                </span>
                <span className="text-sm font-bold text-brand">{row.result}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 text-center text-xs text-gray-400">
          Built by <span className="text-brand font-medium">Faidat Olawuyi</span>
        </div>
      </div>
    </div>
  );
}