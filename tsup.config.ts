import { defineConfig } from "tsup";
import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

function prependUseClient() {
  const files = ["dist/index.mjs", "dist/index.js"];
  for (const file of files) {
    const path = resolve(file);
    const content = readFileSync(path, "utf-8");
    if (!content.startsWith('"use client"')) {
      writeFileSync(path, `"use client";\n${content}`);
    }
  }
}

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  splitting: false,
  external: ["react", "react-dom"],
  injectStyle: false,
  onSuccess: async () => {
    prependUseClient();
  },
});
