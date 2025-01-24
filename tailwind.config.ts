import { Container } from "postcss";
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: {
          DEFAULT: "#F8F9FA",
          dark: "#181820",
        },
        text: {
          DEFAULT: "#2A2A3A",
          dark: "#E4E4EB",
        },
        primary: {
          DEFAULT: "#6A5EA3",
          dark: "#8E7CC3",
        },
        secondary: {
          DEFAULT: "#87C5CC",
          dark: "#A593E0",
        },
        accent: {
          DEFAULT: "#E0A3C8",
          dark: "#F3D1F4",
        },
        btn: {
          DEFAULT: "#E662A8",
          dark: "#6E62A8",
        },
        hover: {
          DEFAULT: "#E0A3C8",
          dark: "#8E7CC3",
        },
        container: {
          DEFAULT: "#FFFFFF",
          dark: "#252735",
        },
        border: {
          DEFAULT: "#E4E4EB",
          dark: "#404458",
        },
        green: {
          DEFAULT: "#28A745",
        },
        red: {
          DEFAULT: "#DF4646",
        },
      },
      fontSize: {
        DEFAULT: "16px",
        extra: "50px",
        header: "36px",
        smallHeader: "20px",
        medium: "16px",
        small: "12px",
      },
      screens: {
        mobile: { max: "600px" },
        tablet: { max: "800px" },
        tablet900: { max: "900px" },
        textBoxHalf: { max: "1170px" },
      },
    },
    keyframes: {
      blur: {
        "0%": { filter: "blur(0)" },
        "25%": { filter: "blur(2px)" },
        "50%": { filter: "blur(5px)" },
        "75%": { filter: "blur(2px)" },
        "100%": { filter: "blur(0)" },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
