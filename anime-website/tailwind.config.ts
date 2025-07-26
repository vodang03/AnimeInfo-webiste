import type { Config } from "tailwindcss";
import scrollbar from "tailwind-scrollbar";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [scrollbar({ nocompatible: true })],

  safelist: [
    "bg-red-100",
    "text-red-800",
    "bg-amber-100",
    "text-amber-800",
    "bg-yellow-100",
    "text-yellow-800",
    "bg-gray-200",
    "text-gray-700",
    "bg-purple-200",
    "text-purple-800",
    "bg-slate-200",
    "text-slate-800",
    "bg-pink-200",
    "text-pink-800",
    "bg-violet-200",
    "text-violet-800",
    "bg-pink-300",
    "text-pink-900",
    "bg-red-200",
    "text-red-900",
    "bg-rose-200",
    "text-rose-800",
    "bg-cyan-200",
    "text-cyan-900",
    "bg-fuchsia-200",
    "text-fuchsia-900",
    "bg-indigo-200",
    "text-indigo-900",
    "bg-green-200",
    "text-green-800",
    "bg-sky-200",
    "text-sky-900",
    "bg-neutral-200",
    "text-neutral-800",
    "bg-yellow-200",
    "text-yellow-900",
    "bg-orange-200",
    "text-orange-800",
    "bg-rose-300",
    "text-rose-900",
  ],
};
export default config;
