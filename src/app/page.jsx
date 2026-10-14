
"use client";

import { useState } from "react";

const buttons = [
  { label: "AC", type: "utility" },
  { label: "±", type: "utility" },
  { label: "%", type: "utility" },
  { label: "÷", type: "operator" },
  { label: "7", type: "number" },
  { label: "8", type: "number" },
  { label: "9", type: "number" },
  { label: "×", type: "operator" },
  { label: "4", type: "number" },
  { label: "5", type: "number" },
  { label: "6", type: "number" },
  { label: "−", type: "operator" },
  { label: "1", type: "number" },
  { label: "2", type: "number" },
  { label: "3", type: "number" },
  { label: "+", type: "operator" },
  { label: "0", type: "number", wide: true },
  { label: ".", type: "number" },
  { label: "=", type: "equals" },
];

export default function Calculator() {
  const [display, setDisplay] = useState("0");
  const [previous, setPrevious] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waiting, setWaiting] = useState(false);
  const [history, setHistory] = useState("");
  const [dark, setDark] = useState(true);

  function calculate(a, b, op) {
    switch (op) {
      case "+": return a + b;
      case "−": return a - b;
      case "×": return a * b;
      case "÷": return b === 0 ? null : a / b;
      default: return b;
    }
  }

  function format(value) {
    if (value === null || !Number.isFinite(value)) return "Error";
    return String(Number(value.toPrecision(12)));
  }

  function handleClick(label) {
    if (label === "AC") {
      setDisplay("0");
      setPrevious(null);
      setOperator(null);
      setWaiting(false);
      setHistory("");
      return;
    }

    if (label === "±") {
      if (display !== "Error") {
        setDisplay(format(-Number(display)));
      }
      return;
    }

    if (label === "%") {
      if (display !== "Error") {
        setDisplay(format(Number(display) / 100));
      }
      return;
    }

    if (label === ".") {
      if (waiting || display === "Error") {
        setDisplay("0.");
        setWaiting(false);
      } else if (!display.includes(".")) {
        setDisplay(display + ".");
      }
      return;
    }

    if (["+", "−", "×", "÷"].includes(label)) {
      if (display === "Error") return;

      const current = Number(display);

      if (operator && !waiting && previous !== null) {
        const result = calculate(previous, current, operator);
        const formatted = format(result);
        setDisplay(formatted);
        setPrevious(result);
        setHistory(`${formatted} ${label}`);
      } else {
        setPrevious(current);
        setHistory(`${display} ${label}`);
      }

      setOperator(label);
      setWaiting(true);
      return;
    }

    if (label === "=") {
      if (operator && previous !== null && !waiting) {
        const current = Number(display);
        const result = calculate(previous, current, operator);

        setHistory(`${format(previous)} ${operator} ${display} =`);
        setDisplay(format(result));
        setPrevious(null);
        setOperator(null);
        setWaiting(true);
      }
      return;
    }

    if (/^\d$/.test(label)) {
      if (display === "Error" || waiting) {
        setDisplay(label);
        setWaiting(false);
      } else {
        setDisplay(display === "0" ? label : display + label);
      }
    }
  }

  const bg = dark
    ? "bg-[#090b16] text-white"
    : "bg-slate-100 text-slate-900";

  const card = dark
    ? "border-white/10 bg-white/[0.055] shadow-black/30"
    : "border-slate-200 bg-white shadow-slate-300/40";

  return (
    <main className={`relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10 transition-colors duration-500 ${bg}`}>
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-violet-600/20 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-24 h-96 w-96 rounded-full bg-blue-500/20 blur-[120px]" />

      <section className={`relative w-full max-w-[390px] rounded-[32px] border p-5 backdrop-blur-2xl sm:p-7 ${card}`}>
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 text-xl font-bold shadow-lg shadow-violet-600/30">
              N
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-[0.2em]">NOVA</h1>
              <p className={`text-[10px] tracking-[0.22em] ${dark ? "text-slate-400" : "text-slate-500"}`}>
                SMART CALCULATOR
              </p>
            </div>
          </div>

          <button
            onClick={() => setDark(!dark)}
            aria-label="Toggle theme"
            className={`flex h-10 w-10 items-center justify-center rounded-full border transition hover:scale-105 ${dark ? "border-white/10 bg-white/10" : "border-slate-200 bg-slate-100"}`}
          >
            {dark ? "☀" : "☾"}
          </button>
        </header>

        <div className={`mb-6 flex min-h-[150px] flex-col items-end justify-end overflow-hidden rounded-3xl border p-5 ${dark ? "border-white/5 bg-black/20" : "border-slate-200 bg-slate-50"}`}>
          <p className={`mb-3 min-h-5 max-w-full truncate text-sm ${dark ? "text-slate-400" : "text-slate-500"}`}>
            {history || "Ready for your next calculation"}
          </p>
          <div
            aria-live="polite"
            className="max-w-full  whitespace-nowrap text-right text-4xl font-light tracking-tight sm:text-5xl"
          >
            {display}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {buttons.map(({ label, type, wide }) => {
            let style = "";

            if (type === "utility") {
              style = dark
                ? "bg-white/10 text-slate-200 hover:bg-white/20"
                : "bg-slate-200 text-slate-700 hover:bg-slate-300";
            } else if (type === "operator") {
              style = "bg-violet-500/15 text-violet-400 hover:bg-violet-500/25";
              if (operator === label && waiting) {
                style = "bg-violet-500 text-white shadow-lg shadow-violet-500/20";
              }
            } else if (type === "equals") {
              style = "bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-lg shadow-violet-600/25 hover:brightness-110";
            } else {
              style = dark
                ? "bg-white/[0.065] text-white hover:bg-white/[0.14]"
                : "bg-white text-slate-800 shadow-sm hover:bg-slate-50";
            }

            return (
              <button
                key={label}
                onClick={() => handleClick(label)}
                className={`flex h-[58px] items-center justify-center rounded-2xl text-lg font-medium transition duration-150 hover:-translate-y-0.5 active:scale-95 sm:h-[62px] ${style} ${wide ? "col-span-2" : ""}`}
              >
                {label}
              </button>
            );
          })}
        </div>

        <footer className={`mt-7 flex items-center justify-center gap-2 text-[10px] tracking-[0.18em] ${dark ? "text-slate-500" : "text-slate-400"}`}>
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          BUILT WITH NEXT.JS & TAILWIND
        </footer>
      </section>
    </main>
  );
}


