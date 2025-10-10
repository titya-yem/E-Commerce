import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    setupFiles: ["./tests/setup.ts", "./tests/vitest.setup.ts"], 
    include: ["tests/**/*.test.ts"],
  },
});
