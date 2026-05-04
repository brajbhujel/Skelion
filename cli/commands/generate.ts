import { Command } from "commander";
import * as fs from "fs";
import * as path from "path";
import { loadConfig } from "../utils/config";

const AVAILABLE_TEMPLATES = ["card", "list", "profile", "table"];

function getTemplatePath(templateName: string): string {
  // In the built output (dist/cli.js), __dirname is dist/
  // Templates are in cli/templates/ relative to the package root
  const packageRoot = path.resolve(__dirname, "..");
  return path.join(packageRoot, "cli", "templates", `${templateName}.tsx.tpl`);
}

function applyTemplate(
  template: string,
  vars: Record<string, string>
): string {
  let result = template;
  for (const [key, value] of Object.entries(vars)) {
    result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), value);
  }
  return result;
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const generateCommand = new Command("generate")
  .description("Generate a skeleton component from a template")
  .argument("<template>", `Template name (${AVAILABLE_TEMPLATES.join(", ")})`)
  .option("-n, --name <name>", "Component name (default: derived from template)")
  .option("-o, --output <dir>", "Output directory", "./components/skeletons")
  .option("-a, --animation <type>", "Animation style (pulse, shimmer, wave, solid)")
  .action((template, options) => {
    if (!AVAILABLE_TEMPLATES.includes(template)) {
      console.error(
        `\n  Error: Unknown template "${template}".` +
        `\n  Available templates: ${AVAILABLE_TEMPLATES.join(", ")}\n`
      );
      process.exit(1);
    }

    const config = loadConfig();
    const animation = options.animation || config.animation || "pulse";
    const name = options.name || capitalize(template);
    const outputDir = options.output;

    // Read template
    const templatePath = getTemplatePath(template);
    if (!fs.existsSync(templatePath)) {
      console.error(`\n  Error: Template file not found: ${templatePath}\n`);
      process.exit(1);
    }

    const templateContent = fs.readFileSync(templatePath, "utf-8");
    const output = applyTemplate(templateContent, {
      name,
      animation,
    });

    // Write output
    const outputPath = path.join(outputDir, `${name}Skeleton.tsx`);
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(outputPath, output, "utf-8");

    console.log(`\n  Generated: ${outputPath}`);
    console.log(`  Template:  ${template}`);
    console.log(`  Animation: ${animation}`);
    console.log(`  Component: ${name}Skeleton\n`);
  });
