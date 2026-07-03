"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { HistoryEntry, ToolType } from "@/types";
import { clearHistory, deleteHistoryEntry, getHistory } from "@/lib/history";

const toolLabels: Record<ToolType, string> = {
  calculator: "Basic Calculator",
  quadratic: "Quadratic Equation",
  simultaneous: "Simultaneous Equations",
  matrix: "Matrix Calculator",
  converter: "Unit Converter",
  "times-table": "Multiplication Table",
};

const toolRoutes: Record<ToolType, string> = {
  calculator: "/calculator",
  quadratic: "/quadratic",
  simultaneous: "/simultaneous",
  matrix: "/matrix",
  converter: "/converter",
  "times-table": "/times-table",
};

function formatDate(timestamp: number) {
  const d = new Date(timestamp);
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function HistoryPage() {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [filter, setFilter] = useState<ToolType | "all">("all");
  const [loaded, setLoaded] = useState(false);

  // localStorage only exists in the browser, so we load after mount
  useEffect(() => {
    setEntries(getHistory());
    setLoaded(true);
  }, []);

  const handleDelete = (id: string) => {
    const updated = deleteHistoryEntry(id);
    setEntries(updated);
  };

  const handleClearAll = () => {
    if (confirm("Clear all history? This can't be undone.")) {
      clearHistory();
      setEntries([]);
    }
  };

  const filtered = filter === "all" ? entries : entries.filter((e) => e.tool === filter);

  const filterOptions: (ToolType | "all")[] = [
    "all",
    "calculator",
    "quadratic",
    "simultaneous",
    "matrix",
    "converter",
    "times-table",
  ];

  return (
    <div className="min-h-screen bg-[#fdfcfb] px-4 py-12 md:px-8">
      <div className="max-w-3xl mx-auto">

        {/* HEADER */}
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="h-[1px] w-8 bg-brand" />
              <span className="text-[11px] uppercase tracking-[0.18em] font-medium text-brand">
                Your Records
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
              History
            </h1>
          </div>
          {entries.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-xs font-semibold text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 rounded-full px-4 py-2 transition-colors whitespace-nowrap"
            >
              Clear All
            </button>
          )}
        </div>

        {/* FILTER PILLS */}
        {entries.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {filterOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => setFilter(opt)}
                className={`text-xs font-semibold px-3.5 py-1.5 rounded-full border transition-colors ${
                  filter === opt
                    ? "bg-brand text-white border-brand"
                    : "bg-white text-gray-500 border-gray-200 hover:border-brand hover:text-brand"
                }`}
              >
                {opt === "all" ? "All" : toolLabels[opt]}
              </button>
            ))}
          </div>
        )}

        {/* EMPTY STATE */}
        {loaded && entries.length === 0 && (
          <div className="bg-white border border-gray-100 rounded-2xl p-10 text-center shadow-sm">
            <p className="text-gray-400 text-sm mb-4">
              No history yet — solve something and it'll show up here.
            </p>
            <Link
              href="/calculator"
              className="inline-block text-sm font-semibold text-brand hover:text-brand-dark"
            >
              Try the Calculator →
            </Link>
          </div>
        )}

        {/* NO RESULTS FOR FILTER */}
        {loaded && entries.length > 0 && filtered.length === 0 && (
          <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center shadow-sm">
            <p className="text-gray-400 text-sm">No entries for this tool yet.</p>
          </div>
        )}

        {/* ENTRIES LIST */}
        <div className="flex flex-col gap-3">
          {filtered.map((entry) => (
            <div
              key={entry.id}
              className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-start justify-between gap-4"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <Link
                    href={toolRoutes[entry.tool]}
                    className="text-[11px] font-semibold text-brand bg-brand-50 px-2.5 py-1 rounded-full hover:bg-brand hover:text-white transition-colors"
                  >
                    {toolLabels[entry.tool]}
                  </Link>
                  <span className="text-[11px] text-gray-400">{formatDate(entry.timestamp)}</span>
                </div>
                <p className="text-sm font-mono text-gray-700 truncate">{entry.input}</p>
                <p className="text-sm font-mono text-gray-900 font-semibold mt-1 truncate">
                  = {entry.result}
                </p>
              </div>
              <button
                onClick={() => handleDelete(entry.id)}
                className="flex-shrink-0 text-xs text-gray-300 hover:text-red-500 transition-colors mt-1"
                aria-label="Delete entry"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
