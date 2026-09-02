import { defineConfig } from "tsup";
import { readFileSync, writeFileSync, existsSync, copyFileSync } from "fs";
import { resolve } from "path";

function prependUseClient() {
  const files = ["dist/index.mjs", "dist/index.js"];
  for (const file of files) {
    const filePath = resolve(file);
    if (!existsSync(filePath)) continue;
    const content = readFileSync(filePath, "utf-8");
    if (!content.startsWith('"use client"')) {
      writeFileSync(filePath, `"use client";\n${content}`);
    }
  }
}

export default defineConfig([
  // Library build
  {
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
      const cssSrc = resolve("src/styles/skeleton.css");
      if (existsSync(cssSrc)) {
        copyFileSync(cssSrc, resolve("dist/skeleton.css"));
      }
    },
  },
  // CLI build
  {
    entry: { cli: "cli/index.ts" },
    format: ["cjs"],
    platform: "node",
    target: "node18",
    outDir: "dist",
    sourcemap: false,
    dts: false,
    clean: false,
    splitting: false,
    external: ["commander"],
    banner: {
      js: "#!/usr/bin/env node",
    },
  },
]);
