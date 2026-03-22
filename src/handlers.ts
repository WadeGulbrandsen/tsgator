import { setUser } from "./config";

export function handlerLogin(cmdName: string, ...args: string[]) {
  const [username] = args;
  if (!username) {
    throw new Error("login requires a username");
  }
  setUser(username);
  console.log(`Set user to ${username}`);
}