/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1240px",
      },
    },
    extend: {
      colors: {
        // databeings — editorial "data newsroom" palette
        paper: "#F4EFE3", // warm newsprint
        "paper-2": "#EBE3D2",
        ink: "#16130D", // warm near-black
        "ink-2": "#241F16",
        "ink-3": "#3A332650",

        // brand
        flame: { DEFAULT: "#E8772E", dark: "#CC5F1B", soft: "#F2A668" },
        amber: { DEFAULT: "#F2C94C", dark: "#D9AC2E" },
        navy: { DEFAULT: "#1F3A63", light: "#345487" },

        // legacy aliases kept so existing utility names still resolve
        cream: "#F4EFE3",
        gold: "#F2C94C",
        sand: "#EBE3D2",
        accent: { DEFAULT: "#E8772E", dark: "#CC5F1B" },
        brandorange: "#E8772E",
        navgray: "#8C8C8C",

        border: "#16130D1A",
        input: "#16130D26",
        ring: "#E8772E",
        background: "#F4EFE3",
        foreground: "#16130D",
        muted: {
          DEFAULT: "#EBE3D2",
          foreground: "#6B6256",
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ['"Space Grotesk"', "Inter", "sans-serif"],
        mono: ['"Space Mono"', "ui-monospace", "monospace"],
      },
      letterSpacing: {
        ticker: "0.22em",
      },
      borderRadius: {
        lg: "0.5rem",
        md: "0.375rem",
        sm: "0.25rem",
      },
      boxShadow: {
        editorial: "0 1px 0 0 #16130D14, 0 24px 50px -28px #16130D40",
        lift: "0 30px 60px -32px #16130D55",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "marquee-rev": {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0)" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        blink: {
          "0%,100%": { opacity: "1" },
          "50%": { opacity: "0.25" },
        },
        "grow-bar": {
          "0%": { transform: "scaleX(0)" },
          "100%": { transform: "scaleX(1)" },
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        shake: {
          "0%,100%": { transform: "translate(0,0) rotate(0deg)" },
          "20%":      { transform: "translate(-3px, 1px) rotate(-0.4deg)" },
          "40%":      { transform: "translate(3px, -1px) rotate(0.4deg)" },
          "60%":      { transform: "translate(-2px, 2px) rotate(-0.2deg)" },
          "80%":      { transform: "translate(2px, -1px) rotate(0.2deg)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(0.22,1,0.36,1) both",
        marquee: "marquee 38s linear infinite",
        "marquee-slow": "marquee 60s linear infinite",
        "marquee-rev": "marquee-rev 50s linear infinite",
        float: "float 6s ease-in-out infinite",
        blink: "blink 1.4s steps(1) infinite",
        "spin-slow": "spin-slow 22s linear infinite",
        shake: "shake 0.5s ease-in-out",
      },
    },
  },
  plugins: [],
};
