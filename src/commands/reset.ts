import { deleteUsers } from "../lib/db/queries/users";

export async function handlerReset(cmdName: string, ...args: string[]) {
  try {
    await deleteUsers();
    console.log("Database reset");
  } catch (err) {
    throw new Error(`Unable to reset database: ${err instanceof Error ? err.message : err}`);
  }
}