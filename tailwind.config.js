/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1200px",
      },
    },
    extend: {
      colors: {
        // databeings brand palette
        cream: "#F6E7B4",
        gold: "#EAD089",
        sand: "#F1DFA0",
        accent: {
          DEFAULT: "#F2C94C",
          dark: "#E0B43A",
        },
        navy: "#1F3A63",
        brandorange: "#E8772E",
        ink: "#1B1B1B",
        navgray: "#8C8C8C",
        border: "hsl(214 32% 91%)",
        input: "hsl(214 32% 91%)",
        ring: "#F2C94C",
        background: "#ffffff",
        foreground: "#1B1B1B",
        muted: {
          DEFAULT: "#f4f4f5",
          foreground: "#6b6b6b",
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', "Georgia", "serif"],
        sans: ['Inter', "system-ui", "sans-serif"],
      },
      borderRadius: {
        lg: "0.5rem",
        md: "0.375rem",
        sm: "0.25rem",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out both",
      },
    },
  },
  plugins: [],
};
