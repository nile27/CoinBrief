import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import path from "node:path";

export default defineConfig({
  plugins: [react(), svgr()],
  resolve: { alias: { "@": path.resolve(__dirname, "src") } },
  // shortcut: reuse NEXT_PUBLIC_ names until env is renamed to VITE_ at deploy
  envDir: "..",
  envPrefix: ["VITE_", "NEXT_PUBLIC_"],
  build: { chunkSizeWarningLimit: 600 }, // apexcharts(~570kB)는 상세/내코인 화면에서만 로드되는 별도 청크
  server: { proxy: { "/api": "http://localhost:4100" } },
});
