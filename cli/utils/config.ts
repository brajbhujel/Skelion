import * as fs from "fs";
import * as path from "path";
import type { SkeletonConfig } from "../../src/types";

export type { SkeletonConfig as SkelionConfig };

const DEFAULT_CONFIG: SkeletonConfig = {
  animation: "pulse",
  density: "medium",
  duration: 2,
  color: "#f0f0f0",
  shimmerAngle: 110,
};

export function loadConfig(): SkeletonConfig {
  const cwd = process.cwd();

  const jsConfigPath = path.join(cwd, "skelion.config.js");
  if (fs.existsSync(jsConfigPath)) {
    try {
      const config = require(jsConfigPath);
      return { ...DEFAULT_CONFIG, ...config };
    } catch {
      // Fall through to default
    }
  }

  const tsConfigPath = path.join(cwd, "skelion.config.ts");
  if (fs.existsSync(tsConfigPath)) {
    try {
      const config = require(tsConfigPath);
      return { ...DEFAULT_CONFIG, ...(config.default || config) };
    } catch {
      // TypeScript config exists but can't be loaded — use defaults
    }
  }

  return DEFAULT_CONFIG;
}
