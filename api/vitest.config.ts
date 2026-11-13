import { defineConfig } from "vitest/config";

// 일반 단위 테스트: Firestore 에뮬레이터가 필요한 *.emu.test.ts 는 제외 (npm run test:emu 로 실행)
export default defineConfig({
  test: { exclude: ["**/node_modules/**", "**/*.emu.test.ts"] },
});
