import { getUserByName } from "../lib/db/queries/users";
import { User } from "../lib/db/schema";
import { CommandHandler } from "./commands";
import { readConfig } from "../config";

export type UserCommandHandler = (
  cmdName: string,
  user: User,
  ...args: string[]
) => Promise<void>;

export function middlewareLoggedIn(handler: UserCommandHandler): CommandHandler {
  return async (cmdName, ...args) => {
    const username = readConfig().currentUserName;
    const user: User = await getUserByName(username);
    if (!user) {
      throw new Error(`User ${username} not found`);
    }
    return await handler(cmdName, user, ...args);
  };
}

