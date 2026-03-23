import { argv } from "node:process";
import { CommandsRegistry, registerCommand, runCommand } from "./commands/commands";
import { handlerLogin, handlerRegister, handlerUsers } from "./commands/users";
import { handlerReset } from "./commands/reset";
import { handlerAgg } from "./commands/aggregate";
import { handlerAddFeed } from "./commands/feeds";
import { handlerFollow, handlerFollowing } from "./commands/follows";

async function main() {
  const registry: CommandsRegistry = {};
  await registerCommand(registry, "login", handlerLogin);
  await registerCommand(registry, "register", handlerRegister);
  await registerCommand(registry, "reset", handlerReset);
  await registerCommand(registry, "users", handlerUsers);
  await registerCommand(registry, "agg", handlerAgg);
  await registerCommand(registry, "addfeed", handlerAddFeed);
  await registerCommand(registry, "follow", handlerFollow);
  await registerCommand(registry, "following", handlerFollowing);
  const [_nodePath, _scriptPath, cmdName, ...args] = argv;
  try {
    await runCommand(registry, cmdName, ...args);
  } catch (err) {
    console.error(err instanceof Error ? err.message : err);
    process.exit(1);
  }
  process.exit(0);
}

main();