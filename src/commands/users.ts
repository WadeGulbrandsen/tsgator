import { readConfig, setUser } from "../config";
import { createUser, getUserByName, getUsers } from "../lib/db/queries/users";

export async function handlerLogin(cmdName: string, ...args: string[]) {
  const [username] = args;
  if (!username) {
    throw new Error("login requires a username");
  }
  const user = await getUserByName(username);
  setUser(user.name);
  console.log(`Set user to ${user.name}`);
}

export async function handlerRegister(cmdName: string, ...args: string[]) {
  const [username] = args;
  if (!username) {
    throw new Error("register requires a username");
  }
  try {
    const result = await createUser(username);
    setUser(result.name);
    console.log(`Created new user: ${result.name}`);
    console.debug(result);
  } catch (err) {
    throw new Error(`A user name "${username}" already exists: ${err instanceof Error ? err.message : err}`);
  }
}

export async function handlerUsers(cmdName: string, ...args: string[]) {
  const current = readConfig().currentUserName;
  try {
    const users = await getUsers();
    console.log(`Users: (${users.length})`);
    for (const user of users) {
      console.log(` * ${user.name}${user.name === current ? " (current)" : ""}`);
    }
  } catch (err) {
    throw new Error(`Unable to get users from the database: ${err instanceof Error ? err.message : err}`);
  }
}