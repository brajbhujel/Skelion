import { Command } from "commander";
import { initCommand } from "./commands/init";
import { generateCommand } from "./commands/generate";

const program = new Command();

program
  .name("skelion")
  .description("Skelion — Zero-config, DOM-aware skeleton system for React & Next.js")
  .version("3.0.0");

program.addCommand(initCommand);
program.addCommand(generateCommand);

program.parse();
