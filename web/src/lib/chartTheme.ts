// ApexCharts 공통 테마. 값은 globals.css 토큰과 같다 (한국식: 상승 빨강 / 하락 파랑).
export const chartTheme = (isDark: boolean) => {
  const line = isDark ? "#34312f" : "#eaeaea";
  return {
    chart: {
      background: isDark ? "#1a1918" : "#fbfbfa",
      foreColor: isDark ? "#a09c94" : "#787774",
      fontFamily: "inherit",
      toolbar: { show: false },
    },
    theme: { mode: isDark ? ("dark" as const) : ("light" as const) },
    grid: { borderColor: line, strokeDashArray: 0 },
    plotOptions: {
      candlestick: {
        colors: isDark
          ? { upward: "#ef6b60", downward: "#6ea0f0" }
          : { upward: "#d24f45", downward: "#2f6fd0" },
      },
    },
    title: { color: isDark ? "#f1efea" : "#111111", fontWeight: 600, fontSize: "14px" },
    axis: { color: line },
    tooltipBorder: line,
  };
};
