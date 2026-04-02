import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          pink:       "#D4698A",
          "pink-light": "#F2A8C0",
          "pink-pale": "#FCE7F0",
          purple:     "#A78BCA",
          "purple-light": "#C4B5DC",
          "purple-pale":  "#F3F0FA",
        },
        primary: {
          50:  "#f0fdf4",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "hero-gradient":
          "linear-gradient(120deg, #fce7f0 0%, #f3eaf8 45%, #e8e6f2 100%)",
        "icon-gradient":
          "linear-gradient(135deg, #c084fc 0%, #a855f7 100%)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};

export default config;
