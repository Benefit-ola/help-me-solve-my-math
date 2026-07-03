import Link from "next/link";

const tools = [
  { name: "Basic Calculator", href: "/calculator", icon: "🧮", desc: "Add, subtract, multiply, divide" },
  { name: "Quadratic Equation Solver", href: "/quadratic", icon: "📐", desc: "Find roots with step-by-step working" },
  { name: "Simultaneous Equation Solver", href: "/simultaneous", icon: "⚖️", desc: "Solve two equations, two unknowns" },
  { name: "Matrix Calculator", href: "/matrix", icon: "🔢", desc: "Add, multiply, find determinants" },
  { name: "Unit Converter", href: "/converter", icon: "📏", desc: "Length, weight, temperature & more" },
  { name: "Multiplication Table", href: "/times-table", icon: "✖️", desc: "Generate tables for any number" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#fdfcfb] px-4 py-12 md:px-8">
      <div className="max-w-4xl mx-auto">

        {/* HEADER */}
        <div className="mb-10 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="h-[1px] w-8 bg-brand" />
            <span className="text-[11px] uppercase tracking-[0.18em] font-medium text-brand">
              Your Math Toolkit
            </span>
            <span className="h-[1px] w-8 bg-brand" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-3">
            Help Me Solve <span className="text-brand">My Math</span>
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed max-w-lg mx-auto">
            Pick a tool below — every solution comes with clear step-by-step
            working, and gets saved to your history automatically.
          </p>
        </div>

        {/* TOOLS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {tools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="group bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:border-brand hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start gap-4">
                <span className="text-2xl flex-shrink-0 w-11 h-11 rounded-xl bg-brand-50 flex items-center justify-center">
                  {tool.icon}
                </span>
                <div className="min-w-0">
                  <h2 className="text-sm font-bold text-gray-900 group-hover:text-brand transition-colors mb-1">
                    {tool.name}
                  </h2>
                  <p className="text-xs text-gray-400 leading-relaxed">{tool.desc}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* SECONDARY LINKS */}
        <div className="mt-8 flex items-center justify-center gap-6">
          <Link
            href="/history"
            className="text-xs font-semibold text-gray-400 hover:text-brand transition-colors"
          >
            View History →
          </Link>
          <Link
            href="/settings"
            className="text-xs font-semibold text-gray-400 hover:text-brand transition-colors"
          >
            Settings →
          </Link>
        </div>

        {/* FOOTER */}
        <div className="mt-10 text-center text-xs text-gray-400">
          Built by <span className="text-brand font-medium">Faidat Olawuyi</span>
        </div>
      </div>
    </div>
  );
}