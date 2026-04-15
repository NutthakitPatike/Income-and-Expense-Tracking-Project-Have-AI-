import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        sakura: "#F4C0D1",
        lavender: "#CECBF6",
        mint: "#9FE1CB",
        peach: "#FAC775",
        cream: "#F1EFE8",
        ink: "#444441",
        "sakura-dark": "#E8A0B8",
        "cream-dark": "#2A2A28",
        "ink-dark": "#E8E8E4",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
    },
  },
  plugins: [],
};
export default config;
