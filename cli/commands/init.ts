import { Command } from "commander";
import * as fs from "fs";
import * as path from "path";

function detectFramework(cwd: string): string {
  const pkgPath = path.join(cwd, "package.json");
  if (!fs.existsSync(pkgPath)) return "unknown";

  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
  const allDeps = {
    ...pkg.dependencies,
    ...pkg.devDependencies,
  };

  if (allDeps["next"]) return "nextjs";
  if (allDeps["vite"]) return "vite";
  if (allDeps["react-scripts"]) return "cra";
  if (allDeps["react"]) return "react";
  return "unknown";
}

function hasTailwind(cwd: string): boolean {
  const pkgPath = path.join(cwd, "package.json");
  if (!fs.existsSync(pkgPath)) return false;

  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
  const allDeps = {
    ...pkg.dependencies,
    ...pkg.devDependencies,
  };

  return !!allDeps["tailwindcss"];
}

const CONFIG_TEMPLATE = `import type { SkeletonConfig } from "skelion";

const config: SkeletonConfig = {
  animation: "pulse",
  density: "medium",
  duration: 2,
  color: "#f0f0f0",
  darkColor: "rgba(255, 255, 255, 0.08)",
  shimmerAngle: 110,
};

export default config;
`;

const CONFIG_JS_TEMPLATE = `/** @type {import("skelion").SkeletonConfig} */
const config = {
  animation: "pulse",
  density: "medium",
  duration: 2,
  color: "#f0f0f0",
  darkColor: "rgba(255, 255, 255, 0.08)",
  shimmerAngle: 110,
};

module.exports = config;
`;

export const initCommand = new Command("init")
  .description("Initialize Skelion in your project")
  .option("--js", "Generate JavaScript config instead of TypeScript")
  .action((options) => {
    const cwd = process.cwd();
    const framework = detectFramework(cwd);
    const tailwind = hasTailwind(cwd);
    const useJS = options.js;

    console.log("\n  Skelion - Zero-config skeleton system\n");
    console.log(`  Detected framework: ${framework}`);

    // Create config file
    const configFileName = useJS ? "skelion.config.js" : "skelion.config.ts";
    const configContent = useJS ? CONFIG_JS_TEMPLATE : CONFIG_TEMPLATE;
    const configPath = path.join(cwd, configFileName);

    if (fs.existsSync(configPath)) {
      console.log(`  Config file already exists: ${configFileName}`);
    } else {
      fs.writeFileSync(configPath, configContent, "utf-8");
      console.log(`  Created ${configFileName}`);
    }

    // Print CSS import instructions
    console.log("\n  Next steps:\n");
    console.log("  1. Add the CSS import to your app entry point:\n");

    switch (framework) {
      case "nextjs":
        console.log('     // app/layout.tsx or pages/_app.tsx');
        console.log('     import "skelion/styles.css";\n');
        break;
      case "vite":
        console.log('     // src/main.tsx');
        console.log('     import "skelion/styles.css";\n');
        break;
      case "cra":
        console.log('     // src/index.tsx');
        console.log('     import "skelion/styles.css";\n');
        break;
      default:
        console.log('     import "skelion/styles.css";\n');
    }

    console.log("  2. Use the Skeleton component:\n");
    console.log('     import { Skeleton } from "skelion";');
    console.log("");
    console.log("     <Skeleton loading={isLoading}>");
    console.log("       <YourComponent />");
    console.log("     </Skeleton>\n");

    if (tailwind) {
      console.log("  Tailwind CSS detected! You can customize skeleton colors with CSS variables:\n");
      console.log("     /* In your global CSS */");
      console.log("     :root {");
      console.log("       --skeleton-light-color: #f0f0f0;");
      console.log("       --skeleton-radius: theme(borderRadius.md);");
      console.log("     }");
      console.log("     .dark {");
      console.log("       --skeleton-color: rgba(255, 255, 255, 0.08);");
      console.log("     }\n");
    }

    if (framework === "nextjs") {
      console.log("  Next.js tip: Use the ssr prop for SSR-safe rendering:\n");
      console.log("     <Skeleton loading={isLoading} ssr>");
      console.log("       <YourComponent />");
      console.log("     </Skeleton>\n");
    }

    console.log("  Done! Happy skeleton loading.\n");
  });
