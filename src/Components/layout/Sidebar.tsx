"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { name: "Home", href: "/", icon: "🏠" },
  { name: "Calculator", href: "/calculator", icon: "🧮" },
  { name: "Quadratic", href: "/quadratic", icon: "📐" },
  { name: "Simultaneous", href: "/simultaneous", icon: "⚖️" },
  { name: "Matrix", href: "/matrix", icon: "🔢" },
  { name: "Converter", href: "/converter", icon: "📏" },
  { name: "Times Table", href: "/times-table", icon: "✖️" },
];

const secondaryItems = [
  { name: "History", href: "/history", icon: "🕘" },
  { name: "Settings", href: "/settings", icon: "⚙️" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  const linkCls = (href: string) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
      isActive(href)
        ? "bg-brand text-white"
        : "text-gray-600 hover:bg-brand-50 hover:text-brand"
    }`;

  return (
    <>
      {/* MOBILE TOP BAR */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 sticky top-0 z-30">
        <Link href="/" className="text-sm font-extrabold text-gray-900">
          Help Me Solve <span className="text-brand">My Math</span>
        </Link>
        <button
          onClick={() => setOpen(!open)}
          className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600"
          aria-label="Toggle menu"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* MOBILE DROPDOWN MENU */}
      {open && (
        <div className="md:hidden bg-white border-b border-gray-100 px-4 py-4 sticky top-[53px] z-20">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className={linkCls(item.href)} onClick={() => setOpen(false)}>
                <span>{item.icon}</span>
                {item.name}
              </Link>
            ))}
            <div className="h-px bg-gray-100 my-2" />
            {secondaryItems.map((item) => (
              <Link key={item.href} href={item.href} className={linkCls(item.href)} onClick={() => setOpen(false)}>
                <span>{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      )}

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col w-64 flex-shrink-0 h-screen sticky top-0 bg-white border-r border-gray-100 px-4 py-6">
        <Link href="/" className="px-2 mb-8">
          <p className="text-lg font-extrabold text-gray-900 leading-tight">
            Help Me Solve <span className="text-brand">My Math</span>
          </p>
        </Link>

        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={linkCls(item.href)}>
              <span>{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="h-px bg-gray-100 my-4" />

        <nav className="flex flex-col gap-1">
          {secondaryItems.map((item) => (
            <Link key={item.href} href={item.href} className={linkCls(item.href)}>
              <span>{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="mt-auto px-2 pt-6 text-[11px] text-gray-400">
          Built by <span className="text-brand font-medium">Faidat Olawuyi</span>
        </div>
      </aside>
    </>
  );
}
