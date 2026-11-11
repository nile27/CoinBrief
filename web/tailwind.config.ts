import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
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
      // 랜딩 토큰을 앱 전역으로 승격. 기존 토큰 이름(DEFAULT / dark)은 유지한다.
      // 같은 값이 globals.css 의 CSS 변수(--bg, --ink ...)에도 정의되어 있다.
      colors: {
        background: { DEFAULT: "#fbfbfa", dark: "#1a1918" },
        text: { DEFAULT: "#2f3437", dark: "#d6d3cc" },
        ink: { DEFAULT: "#111111", dark: "#f1efea" },
        muted: { DEFAULT: "#787774", dark: "#a09c94" },
        primary: { DEFAULT: "#111111", dark: "#f1efea" },
        secondary: { DEFAULT: "#f7f6f3", dark: "#262423" },
        accent: { DEFAULT: "#f1efea", dark: "#2d2a28" },
        btn: { DEFAULT: "#111111", dark: "#f1efea" },
        "btn-ink": { DEFAULT: "#ffffff", dark: "#1a1918" },
        "btn-hover": { DEFAULT: "#333333", dark: "#d6d3cc" },
        hover: { DEFAULT: "#f1efea", dark: "#2d2a28" },
        container: { DEFAULT: "#ffffff", dark: "#211f1e" },
        border: { DEFAULT: "#eaeaea", dark: "#34312f" },
        // 가격 방향 (한국식: 상승 = 빨강, 하락 = 파랑). 다크 모드는 CSS 변수가 처리한다
        up: "var(--up)",
        down: "var(--down)",
        // 상태 색 (성공 / 오류). 가격 방향에는 쓰지 않는다.
        green: "var(--ok)",
        red: "var(--danger)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Apple SD Gothic Neo", "sans-serif"],
        serif: ["var(--font-serif)", "Nanum Myeongjo", "serif"],
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
        mobile: { max: "690px" },
        onlyMobile: { max: "690px", min: "450px" },
        iphone: { max: "450px" },
        tablet: { max: "840px" },
        onlyTablet: { max: "840px", min: "690px" },
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
