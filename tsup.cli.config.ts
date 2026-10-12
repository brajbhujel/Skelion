import { defineConfig } from "tsup";
import { readFileSync, writeFileSync, existsSync, chmodSync } from "fs";
import { resolve } from "path";

function ensureCliBin() {
  const cliPath = resolve("dist/cli.js");
  if (!existsSync(cliPath)) return;
  const content = readFileSync(cliPath, "utf-8");
  if (!content.startsWith("#!/usr/bin/env node")) {
    writeFileSync(cliPath, `#!/usr/bin/env node\n${content}`);
  }
  try {
    chmodSync(cliPath, 0o755);
  } catch {
    // ignore
  }
}

export default defineConfig({
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
  onSuccess: async () => {
    ensureCliBin();
  },
});
