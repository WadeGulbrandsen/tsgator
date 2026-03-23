export type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>;

export type CommandsRegistry = Record<string, CommandHandler>;

export async function registerCommand(registry: CommandsRegistry, cmdName: string, handler: CommandHandler) {
  registry[cmdName] = handler;
}

export async function runCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]) {
  if (!cmdName) {
    throw new Error(`Usage: npm run start <command>`);
  }
  const handler = registry[cmdName];
  if (!handler) {
    throw new Error(`Command not found: ${cmdName}`);
  }
  await handler(cmdName, ...args);
}