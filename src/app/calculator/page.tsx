"use client";

import { useState } from "react";
import { addHistoryEntry } from "@/lib/history";

const buttons = [
  { label: "C",   action: "clear",  cls: "bg-red-50 text-red-500 border-red-200 hover:bg-red-100" },
  { label: "DEL", action: "delete", cls: "bg-red-50 text-red-500 border-red-200 hover:bg-red-100" },
  { label: "%",   action: "%",      cls: "bg-brand-50 text-brand border-pink-200 hover:bg-pink-100" },
  { label: "÷",   action: "/",      cls: "bg-brand-50 text-brand border-pink-200 hover:bg-pink-100" },
  { label: "7",   action: "7",      cls: "bg-white text-gray-800 border-gray-200 hover:bg-gray-50" },
  { label: "8",   action: "8",      cls: "bg-white text-gray-800 border-gray-200 hover:bg-gray-50" },
  { label: "9",   action: "9",      cls: "bg-white text-gray-800 border-gray-200 hover:bg-gray-50" },
  { label: "×",   action: "*",      cls: "bg-brand-50 text-brand border-pink-200 hover:bg-pink-100" },
  { label: "4",   action: "4",      cls: "bg-white text-gray-800 border-gray-200 hover:bg-gray-50" },
  { label: "5",   action: "5",      cls: "bg-white text-gray-800 border-gray-200 hover:bg-gray-50" },
  { label: "6",   action: "6",      cls: "bg-white text-gray-800 border-gray-200 hover:bg-gray-50" },
  { label: "−",   action: "-",      cls: "bg-brand-50 text-brand border-pink-200 hover:bg-pink-100" },
  { label: "1",   action: "1",      cls: "bg-white text-gray-800 border-gray-200 hover:bg-gray-50" },
  { label: "2",   action: "2",      cls: "bg-white text-gray-800 border-gray-200 hover:bg-gray-50" },
  { label: "3",   action: "3",      cls: "bg-white text-gray-800 border-gray-200 hover:bg-gray-50" },
  { label: "+",   action: "+",      cls: "bg-brand-50 text-brand border-pink-200 hover:bg-pink-100" },
  { label: "0",   action: "0",      cls: "bg-white text-gray-800 border-gray-200 hover:bg-gray-50 col-span-2" },
  { label: ".",   action: ".",      cls: "bg-white text-gray-800 border-gray-200 hover:bg-gray-50" },
  { label: "=",   action: "equal",  cls: "bg-brand text-white border-brand hover:bg-brand-dark shadow-md shadow-brand/30" },
];

export default function Calculator() {
  const [input, setInput]       = useState("");
  const [result, setResult]     = useState("");
  const [hasError, setHasError] = useState(false);

  const handle = (action: string) => {
    setHasError(false);

    if (action === "clear")  { setInput(""); setResult(""); return; }
    if (action === "delete") { setInput((p) => p.slice(0, -1)); return; }

    if (action === "equal") {
      if (!input) return;
      try {
        // eslint-disable-next-line no-eval
        const res = eval(input);
        const rounded = parseFloat(res.toFixed(10)).toString();
        setResult(rounded);

        addHistoryEntry({
          tool: "calculator",
          input: input,
          result: rounded,
        });

        setInput(rounded);
      } catch {
        setHasError(true);
        setResult("Error");
        setInput("");
      }
      return;
    }

    const lastChar = input.slice(-1);
    const isOperator = (ch: string) => ["+", "-", "*", "/", "%"].includes(ch);
    if (isOperator(action) && isOperator(lastChar)) {
      setInput((p) => p.slice(0, -1) + action);
      return;
    }
    setInput((p) => p + action);
    setResult("");
  };

  const displayValue = input || "0";

  return (
    <div className="min-h-screen bg-[#fdfcfb] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">

        {/* header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="h-[1px] w-6 bg-brand" />
            <span className="text-[10px] uppercase tracking-[0.18em] font-medium text-brand">
              JS Project
            </span>
            <span className="h-[1px] w-6 bg-brand" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Calcu<span className="text-brand">lator</span>
          </h1>
        </div>

        {/* calculator body */}
        <div className="bg-white border border-gray-100 rounded-3xl shadow-xl overflow-hidden">

          {/* display */}
          <div className="bg-gray-950 px-6 py-6 text-right min-h-[110px] flex flex-col justify-end">
            <p className="text-gray-500 text-sm font-mono min-h-[20px] truncate">
              {input || ""}
            </p>
            <p className={`text-4xl font-bold font-mono mt-1 truncate ${
              hasError ? "text-red-400" : result ? "text-brand" : "text-white"
            }`}>
              {result || displayValue}
            </p>
          </div>

          {/* buttons */}
          <div className="grid grid-cols-4 gap-3 p-5">
            {buttons.map((btn, i) => (
              <button
                key={i}
                onClick={() => handle(btn.action)}
                className={`${btn.cls} border rounded-2xl py-4 text-base font-semibold transition-all duration-150 active:scale-95 ${
                  btn.action === "0" ? "col-span-2" : ""
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Built by <span className="text-brand font-medium">Faidat Olawuyi</span> · JS Projects
        </p>
      </div>
    </div>
  );
}