"use client";

import { useState } from "react";
import { addHistoryEntry } from "@/lib/history";

const fmt = (n: number, d = 4) => parseFloat(n.toFixed(d));

type SolveResult =
  | { type: "unique"; x: number; y: number }
  | { type: "none" }
  | { type: "infinite" };

function solve(a1: number, b1: number, c1: number, a2: number, b2: number, c2: number): SolveResult {
  const D  = a1 * b2 - a2 * b1;
  const Dx = c1 * b2 - c2 * b1;
  const Dy = a1 * c2 - a2 * c1;

  if (D === 0) {
    if (Dx === 0 && Dy === 0) return { type: "infinite" };
    return { type: "none" };
  }

  return { type: "unique", x: fmt(Dx / D), y: fmt(Dy / D) };
}

const InputField = ({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) => (
  <input
    type="number"
    step="any"
    value={value}
    placeholder={placeholder}
    onChange={(e) => onChange(e.target.value)}
    className="w-16 px-2 py-2 rounded-lg border border-gray-200 text-gray-800 font-medium text-sm text-center focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
  />
);

const StepCard = ({ step, title, content }: { step: number; title: string; content: string }) => (
  <div className="flex gap-4">
    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-brand text-white text-xs font-bold flex items-center justify-center mt-0.5">
      {step}
    </div>
    <div>
      <p className="text-sm font-semibold text-gray-800 mb-1">{title}</p>
      <p className="text-sm text-gray-500 leading-relaxed font-mono">{content}</p>
    </div>
  </div>
);

export default function SimultaneousSolver() {
  const [a1, setA1] = useState("2");
  const [b1, setB1] = useState("3");
  const [c1, setC1] = useState("13");
  const [a2, setA2] = useState("5");
  const [b2, setB2] = useState("-1");
  const [c2, setC2] = useState("7");
  const [saved, setSaved] = useState(false);

  const a1v = parseFloat(a1) || 0, b1v = parseFloat(b1) || 0, c1v = parseFloat(c1) || 0;
  const a2v = parseFloat(a2) || 0, b2v = parseFloat(b2) || 0, c2v = parseFloat(c2) || 0;

  const result = solve(a1v, b1v, c1v, a2v, b2v, c2v);
  const D  = fmt(a1v * b2v - a2v * b1v);
  const Dx = fmt(c1v * b2v - c2v * b1v);
  const Dy = fmt(a1v * c2v - a2v * c1v);

  const eq1 = `${a1v}x ${b1v >= 0 ? "+" : "−"} ${Math.abs(b1v)}y = ${c1v}`;
  const eq2 = `${a2v}x ${b2v >= 0 ? "+" : "−"} ${Math.abs(b2v)}y = ${c2v}`;

  const resetSaved = () => setSaved(false);

  const saveToHistory = () => {
    if (result.type !== "unique") return;
    addHistoryEntry({
      tool: "simultaneous",
      input: `${eq1}, ${eq2}`,
      result: `x = ${result.x}, y = ${result.y}`,
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
              Linear Algebra
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-3">
            Simultaneous <span className="text-brand">Equations</span>
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed max-w-lg">
            Solves two linear equations in x and y using Cramer&apos;s rule, with full working shown.
          </p>
        </div>

        {/* INPUTS */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-6">
          <h2 className="text-sm font-bold text-gray-900 mb-5 uppercase tracking-widest">
            Enter the System
          </h2>

          <div className="flex flex-col gap-4">
            {/* Equation 1 */}
            <div className="flex items-center gap-2 flex-wrap font-mono text-sm text-gray-700">
              <InputField value={a1} onChange={(v) => { setA1(v); resetSaved(); }} placeholder="a₁" />
              <span>x +</span>
              <InputField value={b1} onChange={(v) => { setB1(v); resetSaved(); }} placeholder="b₁" />
              <span>y =</span>
              <InputField value={c1} onChange={(v) => { setC1(v); resetSaved(); }} placeholder="c₁" />
            </div>

            {/* Equation 2 */}
            <div className="flex items-center gap-2 flex-wrap font-mono text-sm text-gray-700">
              <InputField value={a2} onChange={(v) => { setA2(v); resetSaved(); }} placeholder="a₂" />
              <span>x +</span>
              <InputField value={b2} onChange={(v) => { setB2(v); resetSaved(); }} placeholder="b₂" />
              <span>y =</span>
              <InputField value={c2} onChange={(v) => { setC2(v); resetSaved(); }} placeholder="c₂" />
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl px-4 py-3 border-l-4 border-brand font-mono text-sm text-gray-700 mt-5 space-y-1">
            <p>{eq1}</p>
            <p>{eq2}</p>
          </div>
        </div>

        {/* RESULT */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-6">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4">
            Result
          </h2>

          {result.type === "unique" && (
            <div className="flex gap-3 flex-wrap mb-4">
              <div className="flex-1 min-w-[120px] bg-gray-50 rounded-xl p-4 text-center border border-gray-100">
                <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">x</p>
                <p className="text-xl font-bold text-brand">{result.x}</p>
              </div>
              <div className="flex-1 min-w-[120px] bg-gray-50 rounded-xl p-4 text-center border border-gray-100">
                <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">y</p>
                <p className="text-xl font-bold text-brand">{result.y}</p>
              </div>
            </div>
          )}

          {result.type === "none" && (
            <p className="text-sm text-red-500 mb-4">No solution — the lines are parallel and never meet.</p>
          )}

          {result.type === "infinite" && (
            <p className="text-sm text-amber-600 mb-4">Infinite solutions — both equations describe the same line.</p>
          )}

          {result.type === "unique" && (
            <div className="flex items-center gap-3 border-t border-gray-100 pt-4">
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
          )}
        </div>

        {/* STEPS */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-5">
            Step-by-step (Cramer&apos;s Rule)
          </h2>
          <div className="flex flex-col gap-5">
            <StepCard step={1} title="Write the system" content={`${eq1}\n${eq2}`} />
            <StepCard step={2} title="Compute the main determinant"
              content={`D = a₁b₂ − a₂b₁ = (${a1v}×${b2v}) − (${a2v}×${b1v}) = ${D}`} />
            {result.type === "unique" && (
              <>
                <StepCard step={3} title="Compute Dx and Dy"
                  content={`Dx = c₁b₂ − c₂b₁ = ${Dx}\nDy = a₁c₂ − a₂c₁ = ${Dy}`} />
                <StepCard step={4} title="Solve for x and y"
                  content={`x = Dx / D = ${Dx} / ${D} = ${result.x}\ny = Dy / D = ${Dy} / ${D} = ${result.y}`} />
              </>
            )}
            {result.type !== "unique" && (
              <StepCard step={3} title="Interpret D = 0"
                content={result.type === "none"
                  ? "D = 0 and Dx or Dy ≠ 0 → no solution exists"
                  : "D = 0 and Dx = Dy = 0 → infinitely many solutions"} />
            )}
          </div>
        </div>

        <div className="mt-10 text-center text-xs text-gray-400">
          Built by <span className="text-brand font-medium">Faidat Olawuyi</span>
        </div>
      </div>
    </div>
  );
}