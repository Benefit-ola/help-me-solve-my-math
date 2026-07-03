"use client";

import { useState } from "react";
import { addHistoryEntry } from "@/lib/history";

type Matrix = number[][];
type Operation = "add" | "subtract" | "multiply" | "determinant" | "inverse";

const operations: { value: Operation; label: string; needsB: boolean }[] = [
  { value: "add",         label: "A + B",       needsB: true },
  { value: "subtract",    label: "A − B",       needsB: true },
  { value: "multiply",    label: "A × B",       needsB: true },
  { value: "determinant", label: "det(A)",      needsB: false },
  { value: "inverse",     label: "A⁻¹",         needsB: false },
];

function makeEmptyMatrix(size: number): Matrix {
  return Array.from({ length: size }, () => Array.from({ length: size }, () => 0));
}

function fmt(n: number): number {
  return parseFloat(n.toFixed(4));
}

function addMatrices(a: Matrix, b: Matrix): Matrix {
  return a.map((row, i) => row.map((val, j) => fmt(val + b[i][j])));
}

function subtractMatrices(a: Matrix, b: Matrix): Matrix {
  return a.map((row, i) => row.map((val, j) => fmt(val - b[i][j])));
}

function multiplyMatrices(a: Matrix, b: Matrix): Matrix {
  const n = a.length;
  const result = makeEmptyMatrix(n);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      let sum = 0;
      for (let k = 0; k < n; k++) sum += a[i][k] * b[k][j];
      result[i][j] = fmt(sum);
    }
  }
  return result;
}

function determinant(m: Matrix): number {
  const n = m.length;
  if (n === 1) return m[0][0];
  if (n === 2) return m[0][0] * m[1][1] - m[0][1] * m[1][0];
  // 3x3 via cofactor expansion along first row
  let det = 0;
  for (let col = 0; col < n; col++) {
    const minor = m.slice(1).map((row) => row.filter((_, j) => j !== col));
    const sign = col % 2 === 0 ? 1 : -1;
    det += sign * m[0][col] * determinant(minor);
  }
  return det;
}

function inverse(m: Matrix): Matrix | null {
  const det = determinant(m);
  if (det === 0) return null;
  const n = m.length;

  if (n === 2) {
    return [
      [fmt(m[1][1] / det), fmt(-m[0][1] / det)],
      [fmt(-m[1][0] / det), fmt(m[0][0] / det)],
    ];
  }

  // 3x3 via adjugate (transpose of cofactor matrix)
  const cofactors = makeEmptyMatrix(3);
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const minor = m
        .filter((_, r) => r !== i)
        .map((row) => row.filter((_, c) => c !== j));
      const sign = (i + j) % 2 === 0 ? 1 : -1;
      cofactors[i][j] = sign * determinant(minor);
    }
  }
  // adjugate = transpose of cofactor matrix
  const adjugate = makeEmptyMatrix(3);
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      adjugate[i][j] = cofactors[j][i];
    }
  }
  return adjugate.map((row) => row.map((val) => fmt(val / det)));
}

function matrixToString(m: Matrix): string {
  return m.map((row) => `[${row.join(", ")}]`).join(" ");
}

const MatrixGrid = ({
  label,
  matrix,
  onChange,
}: {
  label: string;
  matrix: Matrix;
  onChange: (row: number, col: number, value: string) => void;
}) => (
  <div>
    <p className="text-xs font-medium text-gray-500 uppercase tracking-widest mb-2">{label}</p>
    <div
      className="grid gap-2 w-fit"
      style={{ gridTemplateColumns: `repeat(${matrix.length}, minmax(0, 1fr))` }}
    >
      {matrix.map((row, i) =>
        row.map((val, j) => (
          <input
            key={`${i}-${j}`}
            type="number"
            step="any"
            value={val}
            onChange={(e) => onChange(i, j, e.target.value)}
            className="w-16 h-16 rounded-xl border border-gray-200 text-gray-800 font-semibold text-center focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
          />
        ))
      )}
    </div>
  </div>
);

const ResultMatrixGrid = ({ matrix }: { matrix: Matrix }) => (
  <div
    className="grid gap-2 w-fit"
    style={{ gridTemplateColumns: `repeat(${matrix.length}, minmax(0, 1fr))` }}
  >
    {matrix.map((row, i) =>
      row.map((val, j) => (
        <div
          key={`${i}-${j}`}
          className="w-16 h-16 rounded-xl bg-brand-50 border border-brand/20 flex items-center justify-center text-brand font-bold"
        >
          {val}
        </div>
      ))
    )}
  </div>
);

export default function MatrixCalculator() {
  const [size, setSize] = useState<2 | 3>(2);
  const [matrixA, setMatrixA] = useState<Matrix>(makeEmptyMatrix(2));
  const [matrixB, setMatrixB] = useState<Matrix>(makeEmptyMatrix(2));
  const [operation, setOperation] = useState<Operation>("add");
  const [saved, setSaved] = useState(false);

  const opObj = operations.find((o) => o.value === operation)!;

  const changeSize = (newSize: 2 | 3) => {
    setSize(newSize);
    setMatrixA(makeEmptyMatrix(newSize));
    setMatrixB(makeEmptyMatrix(newSize));
    setSaved(false);
  };

  const updateCell = (matrix: "A" | "B", row: number, col: number, value: string) => {
    const num = parseFloat(value) || 0;
    const setter = matrix === "A" ? setMatrixA : setMatrixB;
    const current = matrix === "A" ? matrixA : matrixB;
    const updated = current.map((r, i) =>
      r.map((c, j) => (i === row && j === col ? num : c))
    );
    setter(updated);
    setSaved(false);
  };

  // compute result
  let matrixResult: Matrix | null = null;
  let scalarResult: number | null = null;
  let errorMsg: string | null = null;

  try {
    if (operation === "add") matrixResult = addMatrices(matrixA, matrixB);
    else if (operation === "subtract") matrixResult = subtractMatrices(matrixA, matrixB);
    else if (operation === "multiply") matrixResult = multiplyMatrices(matrixA, matrixB);
    else if (operation === "determinant") scalarResult = fmt(determinant(matrixA));
    else if (operation === "inverse") {
      const inv = inverse(matrixA);
      if (inv === null) errorMsg = "Matrix is singular (det = 0) — inverse doesn't exist.";
      else matrixResult = inv;
    }
  } catch {
    errorMsg = "Could not compute — check your inputs.";
  }

  const saveToHistory = () => {
    const inputStr = opObj.needsB
      ? `A=${matrixToString(matrixA)}, B=${matrixToString(matrixB)}, op=${opObj.label}`
      : `A=${matrixToString(matrixA)}, op=${opObj.label}`;
    const resultStr = matrixResult
      ? matrixToString(matrixResult)
      : scalarResult !== null
      ? `${scalarResult}`
      : "N/A";

    addHistoryEntry({ tool: "matrix", input: inputStr, result: resultStr });
    setSaved(true);
  };

  return (
    <div className="min-h-screen bg-[#fdfcfb] px-4 py-12 md:px-8">
      <div className="max-w-4xl mx-auto">

        {/* HEADER */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <span className="h-[1px] w-8 bg-brand" />
            <span className="text-[11px] uppercase tracking-[0.18em] font-medium text-brand">
              Linear Algebra
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-3">
            Matrix <span className="text-brand">Calculator</span>
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed max-w-lg">
            Add, subtract, multiply, and find determinants or inverses for 2×2 and 3×3 matrices.
          </p>
        </div>

        {/* SIZE + OPERATION SELECT */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-6">
          <div className="flex flex-wrap gap-6 mb-5">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-widest mb-2">Matrix Size</p>
              <div className="flex gap-2">
                {[2, 3].map((s) => (
                  <button
                    key={s}
                    onClick={() => changeSize(s as 2 | 3)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                      size === s
                        ? "bg-brand text-white border-brand"
                        : "bg-gray-50 text-gray-600 border-gray-200 hover:border-brand hover:text-brand"
                    }`}
                  >
                    {s}×{s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-widest mb-2">Operation</p>
              <div className="flex flex-wrap gap-2">
                {operations.map((op) => (
                  <button
                    key={op.value}
                    onClick={() => { setOperation(op.value); setSaved(false); }}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                      operation === op.value
                        ? "bg-brand text-white border-brand"
                        : "bg-gray-50 text-gray-600 border-gray-200 hover:border-brand hover:text-brand"
                    }`}
                  >
                    {op.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* MATRIX INPUTS */}
          <div className="flex flex-wrap gap-8">
            <MatrixGrid label="Matrix A" matrix={matrixA} onChange={(r, c, v) => updateCell("A", r, c, v)} />
            {opObj.needsB && (
              <MatrixGrid label="Matrix B" matrix={matrixB} onChange={(r, c, v) => updateCell("B", r, c, v)} />
            )}
          </div>
        </div>

        {/* RESULT */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest">
              Result: {opObj.label}
            </h2>
            {saved && (
              <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                Saved ✓
              </span>
            )}
          </div>

          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">
              {errorMsg}
            </div>
          )}

          {!errorMsg && matrixResult && (
            <div className="mb-4">
              <ResultMatrixGrid matrix={matrixResult} />
            </div>
          )}

          {!errorMsg && scalarResult !== null && (
            <div className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-100 mb-4 w-fit">
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">det(A)</p>
              <p className="text-4xl font-extrabold text-brand">{scalarResult}</p>
            </div>
          )}

          {!errorMsg && (
            <button
              onClick={saveToHistory}
              className="text-xs font-semibold text-brand hover:text-brand-dark transition-colors"
            >
              + Save to History
            </button>
          )}
        </div>

        <div className="mt-10 text-center text-xs text-gray-400">
          Built by <span className="text-brand font-medium">Faidat Olawuyi</span>
        </div>
      </div>
    </div>
  );
}