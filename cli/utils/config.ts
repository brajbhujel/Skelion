import * as fs from "fs";
import * as path from "path";

export interface SkelionConfig {
  animation?: "pulse" | "shimmer" | "wave" | "solid";
  density?: "low" | "medium" | "high";
  duration?: number;
}

const DEFAULT_CONFIG: SkelionConfig = {
  animation: "pulse",
  density: "medium",
  duration: 1.5,
};

export function loadConfig(): SkelionConfig {
  const cwd = process.cwd();

  // Try skelion.config.js first (works without TypeScript compilation)
  const jsConfigPath = path.join(cwd, "skelion.config.js");
  if (fs.existsSync(jsConfigPath)) {
    try {
      const config = require(jsConfigPath);
      return { ...DEFAULT_CONFIG, ...config };
    } catch {
      // Fall through to default
    }
  }

  // Try skelion.config.ts (requires ts-node or similar)
  const tsConfigPath = path.join(cwd, "skelion.config.ts");
  if (fs.existsSync(tsConfigPath)) {
    try {
      // Attempt direct require (works if ts-node is registered)
      const config = require(tsConfigPath);
      return { ...DEFAULT_CONFIG, ...(config.default || config) };
    } catch {
      // TypeScript config exists but can't be loaded — use defaults
    }
  }

  return DEFAULT_CONFIG;
}
