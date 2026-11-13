import { defineConfig } from "vitest/config";

// Firestore 에뮬레이터 전용. .env 를 로드하지 않는다.
export default defineConfig({
  test: { include: ["src/__tests__/emu/**/*.emu.test.ts"], testTimeout: 30_000 },
});
