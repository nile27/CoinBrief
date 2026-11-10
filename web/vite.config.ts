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
  server: { proxy: { "/api": "http://localhost:4100" } },
});
