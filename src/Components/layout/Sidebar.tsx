// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { useState } from "react";

// const navItems = [
//   { name: "Home", href: "/", icon: "🏠" },
//   { name: "Calculator", href: "/calculator", icon: "🧮" },
//   { name: "Quadratic", href: "/quadratic", icon: "📐" },
//   { name: "Simultaneous", href: "/simultaneous", icon: "⚖️" },
//   { name: "Matrix", href: "/matrix", icon: "🔢" },
//   { name: "Converter", href: "/converter", icon: "📏" },
//   { name: "Times Table", href: "/times-table", icon: "✖️" },
// ];

// const secondaryItems = [
//   { name: "History", href: "/history", icon: "🕘" },
//   { name: "Settings", href: "/settings", icon: "⚙️" },
// ];
// const mobileItems = [
//   { name: "Home", href: "/", icon: "🏠" },
//   { name: "Calculator", href: "/calculator", icon: "🧮" },
//   { name: "Converter", href: "/converter", icon: "📏" },
//   { name: "History", href: "/history", icon: "🕘" },
// ];

// const allItems = [...navItems, ...secondaryItems];

// export default function Sidebar() {
//   const pathname = usePathname();
//   const [showMore, setShowMore] = useState(false);

//   const isActive = (href: string) =>
//     href === "/" ? pathname === "/" : pathname.startsWith(href);

//   const linkCls = (href: string) =>
//     `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
//       isActive(href)
//         ? "bg-brand text-white"
//         : "text-gray-600 dark:text-gray-300 hover:bg-brand-50 dark:hover:bg-gray-800 hover:text-brand"
//     }`;

//   return (
//     <>
//       {/* MOBILE TOP BAR */}
//       <header className="lg:hidden sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
//         <div className="px-4 py-3">
//           <Link
//             href="/"
//             className="text-base font-extrabold text-gray-900 dark:text-white"
//           >
//             Help Me Solve <span className="text-brand">My Math</span>
//           </Link>
//         </div>
//       </header>

//       {/* MOBILE BOTTOM NAV */}
//       <nav
//   aria-label="Mobile Navigation"
//   className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800"
// >
//   <div className="grid grid-cols-5 h-16">
//     {mobileItems.map((item) => (
//       <Link
//         key={item.href}
//         href={item.href}
//         className={`flex flex-col items-center justify-center text-xs transition-colors ${
//           isActive(item.href)
//             ? "text-brand"
//             : "text-gray-500 dark:text-gray-400"
//         }`}
//       >
//         <span className="text-xl">{item.icon}</span>
//         <span>{item.name}</span>
//       </Link>
//     ))}

//     <button
//       onClick={() => setShowMore(true)}
//       className="flex flex-col items-center justify-center text-xs text-gray-500 dark:text-gray-400"
//     >
//       <span className="text-xl">☰</span>
//       <span>More</span>
//     </button>
//   </div>
// </nav>
// {showMore && (
//   <>
//     <div
//       className="fixed inset-0 bg-black/40 z-40 lg:hidden"
//       onClick={() => setShowMore(false)}
//     />

//     <div className="fixed bottom-16 left-0 right-0 z-50 rounded-t-3xl bg-white dark:bg-gray-900 p-5 shadow-2xl lg:hidden">
//       <h2 className="mb-4 text-lg font-bold">More Tools</h2>

//       <div className="grid grid-cols-2 gap-3">
//         {[
//           { name: "Quadratic", href: "/quadratic", icon: "📐" },
//           { name: "Simultaneous", href: "/simultaneous", icon: "⚖️" },
//           { name: "Matrix", href: "/matrix", icon: "🔢" },
//           { name: "Times Table", href: "/times-table", icon: "✖️" },
//           { name: "Settings", href: "/settings", icon: "⚙️" },
//         ].map((item) => (
//           <Link
//             key={item.href}
//             href={item.href}
//             onClick={() => setShowMore(false)}
//             className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 text-center hover:bg-brand-50 dark:hover:bg-gray-800"
//           >
//             <div className="text-3xl mb-2">{item.icon}</div>
//             <div className="font-medium">{item.name}</div>
//           </Link>
//         ))}
//       </div>
//     </div>
//   </>
// )}

//       {/* DESKTOP SIDEBAR */}
//       <aside
//         aria-label="Sidebar Navigation"
//         className="hidden lg:flex lg:flex-col w-56 xl:w-64 h-screen sticky top-0 flex-shrink-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 px-4 py-6 overflow-y-auto"
//       >
//         <Link href="/" className="mb-8 px-2">
//           <h1 className="text-lg font-extrabold text-gray-900 dark:text-white leading-tight">
//             Help Me Solve <span className="text-brand">My Math</span>
//           </h1>
//         </Link>

//         <nav
//           aria-label="Primary Navigation"
//           className="flex flex-col gap-1"
//         >
//           {navItems.map((item) => (
//             <Link
//               key={item.href}
//               href={item.href}
//               className={linkCls(item.href)}
//             >
//               <span>{item.icon}</span>
//               <span>{item.name}</span>
//             </Link>
//           ))}
//         </nav>

//         <div className="my-4 h-px bg-gray-200 dark:bg-gray-800" />

//         <nav
//           aria-label="Secondary Navigation"
//           className="flex flex-col gap-1"
//         >
//           {secondaryItems.map((item) => (
//             <Link
//               key={item.href}
//               href={item.href}
//               className={linkCls(item.href)}
//             >
//               <span>{item.icon}</span>
//               <span>{item.name}</span>
//             </Link>
//           ))}
//         </nav>

//         <div className="mt-auto pt-6 px-2 text-xs text-gray-400">
//           Built by{" "}
//           <span className="text-brand font-semibold">
//             Faidat Olawuyi
//           </span>
//         </div>
//       </aside>
//     </>
//   );
// }

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

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

const mobileItems = [
  { name: "Home", href: "/", icon: "🏠" },
  { name: "Calculator", href: "/calculator", icon: "🧮" },
  { name: "Converter", href: "/converter", icon: "📏" },
  { name: "History", href: "/history", icon: "🕘" },
];

const moreItems = [
  { name: "Quadratic", href: "/quadratic", icon: "📐" },
  { name: "Simultaneous", href: "/simultaneous", icon: "⚖️" },
  { name: "Matrix", href: "/matrix", icon: "🔢" },
  { name: "Times Table", href: "/times-table", icon: "✖️" },
  { name: "Settings", href: "/settings", icon: "⚙️" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    document.body.style.overflow = showMore ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [showMore]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const desktopLinkClass = (href: string) =>
    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
      isActive(href)
        ? "bg-brand text-white"
        : "text-gray-600 dark:text-gray-300 hover:bg-brand-50 dark:hover:bg-gray-800 hover:text-brand"
    }`;

  return (
    <>
      {/* Mobile Header */}
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 lg:hidden">
        <div className="px-4 py-3">
          <Link
            href="/"
            className="text-base font-extrabold text-gray-900 dark:text-white"
          >
            Help Me Solve <span className="text-brand">My Math</span>
          </Link>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 lg:hidden">
        <div className="grid h-16 grid-cols-5">
          {mobileItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center transition-colors ${
                isActive(item.href)
                  ? "text-brand"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-[11px] font-medium">{item.name}</span>
            </Link>
          ))}

          <button
            onClick={() => setShowMore(true)}
            className={`flex flex-col items-center justify-center transition-colors ${
              showMore
                ? "text-brand"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            <span className="text-xl">☰</span>
            <span className="text-[11px] font-medium">More</span>
          </button>
        </div>
      </nav>

      {/* More Sheet */}
      {showMore && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            onClick={() => setShowMore(false)}
          />

          <div className="fixed bottom-16 left-0 right-0 z-50 rounded-t-3xl bg-white p-6 shadow-2xl dark:bg-gray-900 lg:hidden">
            <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-gray-300 dark:bg-gray-700" />

            <h2 className="mb-5 text-lg font-bold text-gray-900 dark:text-white">
              More Tools
            </h2>

            <div className="grid grid-cols-2 gap-4">
              {moreItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setShowMore(false)}
                  className={`rounded-xl border p-4 text-center transition-colors ${
                    isActive(item.href)
                      ? "border-brand bg-brand-50 text-brand"
                      : "border-gray-200 hover:bg-brand-50 dark:border-gray-700 dark:hover:bg-gray-800"
                  }`}
                >
                  <div className="mb-2 text-3xl">{item.icon}</div>
                  <div className="font-medium">{item.name}</div>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Desktop Sidebar */}
            <aside
        aria-label="Sidebar Navigation"
        className="hidden lg:flex lg:flex-col w-56 xl:w-64 h-screen sticky top-0 flex-shrink-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 px-4 py-6 overflow-y-auto"
      >
        <Link href="/" className="mb-8 px-2">
          <h1 className="text-lg font-extrabold leading-tight text-gray-900 dark:text-white">
            Help Me Solve <span className="text-brand">My Math</span>
          </h1>
        </Link>

        <nav
          aria-label="Primary Navigation"
          className="flex flex-col gap-1"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={desktopLinkClass(item.href)}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="my-4 h-px bg-gray-200 dark:bg-gray-800" />

        <nav
          aria-label="Secondary Navigation"
          className="flex flex-col gap-1"
        >
          {secondaryItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={desktopLinkClass(item.href)}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="mt-auto px-2 pt-6 text-xs text-gray-400">
          Built by{" "}
          <span className="font-semibold text-brand">
            Faidat Olawuyi
          </span>
        </div>
      </aside>
    </>
  );
}