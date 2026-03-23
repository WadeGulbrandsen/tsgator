import { eq } from "drizzle-orm";
import { db } from "..";
import { users } from "../schema";

export async function createUser(name: string) {
  const [result] = await db.insert(users).values({ name: name }).returning();
  return result;
}

export async function getUsers() {
  return await db.select().from(users).orderBy(users.name);
}

export async function getUserByName(name: string) {
  const [result] = await db.select().from(users).where(eq(users.name, name));
  if (!result) {
    throw new Error(`Could not find user with name=${name}`);
  }
  return result;
}

export async function deleteUsers() {
  await db.delete(users);
}