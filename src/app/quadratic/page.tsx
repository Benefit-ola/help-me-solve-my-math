"use client";

import React, { useState } from "react";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { addHistoryEntry } from "@/lib/history";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip, Legend);

// ── helpers ──────────────────────────────────────────────────────────────────
const fmt = (n: number, d = 4) => parseFloat(n.toFixed(d));

type SolveResult =
  | { type: "invalid" }
  | { type: "two"; D: number; x1: number; x2: number }
  | { type: "one"; D: number; x1: number }
  | { type: "complex"; D: number; real: number; imag: number };

function solve(a: number, b: number, c: number): SolveResult {
  if (a === 0) return { type: "invalid" };
  const D = b * b - 4 * a * c;
  if (D > 0) {
    return {
      type: "two",
      D,
      x1: fmt((-b - Math.sqrt(D)) / (2 * a)),
      x2: fmt((-b + Math.sqrt(D)) / (2 * a)),
    };
  } else if (D === 0) {
    return { type: "one", D, x1: fmt(-b / (2 * a)) };
  } else {
    return {
      type: "complex",
      D,
      real: fmt(-b / (2 * a)),
      imag: fmt(Math.sqrt(-D) / (2 * a)),
    };
  }
}

function buildChartData(a: number, b: number, c: number) {
  const vertex = a !== 0 ? -b / (2 * a) : 0;
  const range  = Math.max(8, Math.abs(vertex) + 6);
  const xMin   = vertex - range;
  const xMax   = vertex + range;
  const points = 200;
  const xs: number[] = [], ys: number[] = [];
  for (let i = 0; i <= points; i++) {
    const x = xMin + (i / points) * (xMax - xMin);
    xs.push(fmt(x, 2));
    ys.push(fmt(a * x * x + b * x + c, 4));
  }
  return { xs, ys };
}

// ── sub-components ────────────────────────────────────────────────────────────
const InputField = ({ label, symbol, value, onChange }: { label: string; symbol: string; value: string; onChange: (v: string) => void }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-medium text-gray-500 uppercase tracking-widest">
      {label}
    </label>
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand font-bold text-sm">
        {symbol}
      </span>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        step="any"
        className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 text-gray-800 font-medium text-sm focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
      />
    </div>
  </div>
);

const ResultBadge = ({ type }: { type: SolveResult["type"] }) => {
  const config = {
    two:     { label: "Two real roots",    cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    one:     { label: "One repeated root", cls: "bg-amber-50 text-amber-700 border-amber-200" },
    complex: { label: "Complex roots",     cls: "bg-blue-50 text-blue-700 border-blue-200" },
    invalid: { label: "a cannot be zero",  cls: "bg-red-50 text-red-700 border-red-200" },
  };
  const { label, cls } = config[type] || config.invalid;
  return (
    <span className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${cls}`}>
      {label}
    </span>
  );
};

const RootCard = ({ label, value }: { label: string; value: string | number }) => (
  <div className="flex-1 min-w-[120px] bg-gray-50 rounded-xl p-4 text-center border border-gray-100">
    <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">{label}</p>
    <p className="text-xl font-bold text-brand">{value}</p>
  </div>
);

const StepCard = ({ step, title, content }: { step: string | number; title: string; content: string }) => (
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

// ── main component ────────────────────────────────────────────────────────────
export default function QuadraticSolver() {
  const [a, setA] = useState("1");
  const [b, setB] = useState("-3");
  const [c, setC] = useState("2");
  const [saved, setSaved] = useState(false);

  const av = parseFloat(a) || 0;
  const bv = parseFloat(b) || 0;
  const cv = parseFloat(c) || 0;

  const result = solve(av, bv, cv);
  const { xs, ys } = buildChartData(av, bv, cv);

  const formatEq = () => {
    const bSign = bv >= 0 ? `+ ${bv}` : `− ${Math.abs(bv)}`;
    const cSign = cv >= 0 ? `+ ${cv}` : `− ${Math.abs(cv)}`;
    return `${av}x² ${bSign}x ${cSign} = 0`;
  };

  const D = av !== 0 ? fmt(bv * bv - 4 * av * cv, 4) : null;

  const saveToHistory = () => {
    if (result.type === "invalid") return;
    const resultText =
      result.type === "two" ? `x₁ = ${result.x1}, x₂ = ${result.x2}` :
      result.type === "one" ? `x = ${result.x1} (repeated)` :
      `x = ${result.real} ± ${result.imag}i`;

    addHistoryEntry({
      tool: "quadratic",
      input: formatEq(),
      result: resultText,
    });
    setSaved(true);
  };

  // chart config
  const chartData = {
    labels: xs,
    datasets: [
      {
        label: "f(x)",
        data: ys,
        borderColor: "#D63384",
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.4,
        fill: {
          target: { value: 0 },
          above: "rgba(214,51,132,0.07)",
          below: "rgba(214,51,132,0.07)",
        },
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { callbacks: {
      label: (ctx: { parsed: { x: number | null; y: number | null } }) => `f(${ctx.parsed.x ?? 0}) = ${ctx.parsed.y ?? 0}`,
    }}},
    scales: {
      x: {
        type: "linear" as const,
        ticks: {
          color: "#9ca3af",
          maxTicksLimit: 8,
          callback: (v: string | number) => (typeof v === "number" ? v.toFixed(1) : v),
        },
        grid: { color: "rgba(0,0,0,0.05)" },
      },
      y: {
        ticks: {
          color: "#9ca3af",
          maxTicksLimit: 6,
          callback: (v: string | number) => (typeof v === "number" ? v.toFixed(1) : v),
        },
        grid: { color: "rgba(0,0,0,0.05)" },
      },
    },
  };

  return (
    <div className="min-h-screen bg-[#fdfcfb] px-4 py-12 md:px-8">
      <div className="max-w-4xl mx-auto">

        {/* ── HEADER ── */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <span className="h-[1px] w-8 bg-brand" />
            <span className="text-[11px] uppercase tracking-[0.18em] font-medium text-brand">
              C → React Project
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-3">
            Quadratic <span className="text-brand">Solver</span>
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed max-w-lg">
            Originally written in C using <code className="text-brand bg-brand-50 px-1.5 py-0.5 rounded text-xs">printf</code> / <code className="text-brand bg-brand-50 px-1.5 py-0.5 rounded text-xs">scanf</code> and <code className="text-brand bg-brand-50 px-1.5 py-0.5 rounded text-xs">math.h</code>.
            Reimagined as an interactive web app with a live parabola graph and step-by-step solution.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* ── LEFT COLUMN ── */}
          <div className="flex flex-col gap-6">

            {/* inputs */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <h2 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-widest">
                Enter Coefficients
              </h2>
              <p className="text-xs text-gray-400 mb-5 font-mono">
                ax² + bx + c = 0
              </p>
              <div className="grid grid-cols-3 gap-3 mb-5">
                <InputField label="a  (x²)"     symbol="a" value={a} onChange={(v) => { setA(v); setSaved(false); }} />
                <InputField label="b  (x)"      symbol="b" value={b} onChange={(v) => { setB(v); setSaved(false); }} />
                <InputField label="c  (const)"  symbol="c" value={c} onChange={(v) => { setC(v); setSaved(false); }} />
              </div>

              {/* live equation */}
              <div className="bg-gray-50 rounded-xl px-4 py-3 border-l-4 border-brand font-mono text-sm text-gray-700">
                {formatEq()}
              </div>
            </div>

            {/* result */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Result</h2>
                <ResultBadge type={result.type} />
              </div>

              <div className="flex gap-3 flex-wrap mb-4">
                {result.type === "two" && (
                  <>
                    <RootCard label="Root 1 (x₁)" value={result.x1} />
                    <RootCard label="Root 2 (x₂)" value={result.x2} />
                  </>
                )}
                {result.type === "one" && (
                  <RootCard label="Repeated root" value={result.x1} />
                )}
                {result.type === "complex" && (
                  <>
                    <RootCard label="Root 1" value={`${result.real} + ${result.imag}i`} />
                    <RootCard label="Root 2" value={`${result.real} − ${result.imag}i`} />
                  </>
                )}
                {result.type === "invalid" && (
                  <p className="text-sm text-red-500">Please set a value other than 0 for a.</p>
                )}
              </div>

              {D !== null && (
                <div className="text-xs text-gray-400 font-mono border-t border-gray-100 pt-3 mb-3">
                  Discriminant: D = b²−4ac = {bv}²−4({av})({cv}) = <span className="text-gray-700 font-semibold">{D}</span>
                </div>
              )}

              {result.type !== "invalid" && (
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

            {/* step by step */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-5">
                Step-by-step
              </h2>
              <div className="flex flex-col gap-5">
                <StepCard step="1" title="Write the equation"   content={formatEq()} />
                <StepCard step="2" title="Calculate discriminant" content={`D = (${bv})² − 4(${av})(${cv}) = ${D}`} />
                <StepCard step="3" title="Apply quadratic formula"
                  content={result.type === "two"
                    ? `x = (−(${bv}) ± √${D}) / (2×${av})`
                    : result.type === "one"
                    ? `x = −(${bv}) / (2×${av}) = ${result.x1}`
                    : result.type === "complex"
                    ? `x = ${result.real} ± ${result.imag}i`
                    : "a must not be 0"
                  }
                />
                <StepCard step="4" title="Conclusion"
                  content={result.type === "two"
                    ? `x₁ = ${result.x1},  x₂ = ${result.x2}`
                    : result.type === "one"
                    ? `x = ${result.x1}  (repeated)`
                    : result.type === "complex"
                    ? "No real roots — complex conjugate pair"
                    : "Invalid input"
                  }
                />
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="flex flex-col gap-6">

            {/* parabola graph */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-1">
                Parabola Graph
              </h2>
              <p className="text-xs text-gray-400 mb-5">
                {result.type === "two"
                  ? `Crosses x-axis at x = ${result.x1} and x = ${result.x2}`
                  : result.type === "one"
                  ? `Touches x-axis at x = ${result.x1}`
                  : "Does not cross the x-axis"}
              </p>
              <div style={{ height: "280px" }}>
                <Line data={chartData} options={chartOptions} />
              </div>
            </div>

            {/* c code reference */}
            <div className="bg-gray-950 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                  Original C code
                </h2>
                <span className="text-[10px] px-2.5 py-1 rounded-full bg-gray-800 text-gray-400 border border-gray-700">
                  C language
                </span>
              </div>
              <pre className="text-xs text-gray-300 leading-relaxed overflow-x-auto font-mono">
{`#include <stdio.h>
#include <math.h>

int main() {
  double a, b, c, D, x1, x2;

  printf("Enter a, b and c: ");
  scanf("%lf %lf %lf", &a, &b, &c);

  D = (b * b) - (4 * a * c);

  if (D > 0) {
    x1 = (-b - sqrt(D)) / (2 * a);
    x2 = (-b + sqrt(D)) / (2 * a);
    printf("root 1 = %.2lf\\n", x1);
    printf("root 2 = %.2lf\\n", x2);
  } else if (D == 0) {
    x1 = -b / (2 * a);
    printf("Both roots equal: %.2lf\\n", x1);
  } else {
    printf("No real roots\\n");
  }
  return 0;
}`}
              </pre>
            </div>

            {/* what i learned */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4">
                What this demonstrates
              </h2>
              <div className="flex flex-col gap-3">
                {[
                  { icon: "⚙️", text: "C programming — data types, math.h, printf/scanf" },
                  { icon: "🧮", text: "Mathematical logic — discriminant analysis" },
                  { icon: "⚛️", text: "React — controlled inputs, live state updates" },
                  { icon: "📊", text: "Data visualisation — Chart.js parabola graph" },
                  { icon: "🎨", text: "UI design — Tailwind CSS, responsive layout" },
                ].map((item) => (
                  <div key={item.text} className="flex items-start gap-3 text-sm text-gray-500">
                    <span>{item.icon}</span>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        
      </div>
    </div>
  );
}
