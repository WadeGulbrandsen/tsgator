import { argv } from "node:process";
import { CommandsRegistry, registerCommand, runCommand } from "./commands";
import { handlerLogin } from "./handlers";

function main() {
  const registry: CommandsRegistry = {};
  registerCommand(registry, "login", handlerLogin);
  const [_nodePath, _scriptPath, cmdName, ...args] = argv;
  try {
    runCommand(registry, cmdName, ...args);
  } catch (err) {
    console.error(err instanceof Error ? err.message : err);
    process.exit(1);
  }
}

main();