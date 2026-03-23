import { eq, sql } from "drizzle-orm";
import { db } from "..";
import { feeds, users } from "../schema";

export async function createFeed(name: string, url: string, userId: string) {
  const [result] = await db.insert(feeds).values({ name, url, userId }).returning();
  return result;
}

export async function markFeedFetched(feedId: string) {
  await db.update(feeds).set({ lastFetchedAt: new Date() }).where(eq(feeds.id, feedId));
}

export async function getNextFeedToFetch() {
  const [result] = await db.select().from(feeds).orderBy(sql`${feeds.lastFetchedAt} ASC NULLS FIRST`).limit(1);
  if (!result) {
    throw new Error("Could not find a feed");
  }
  return result;
}

export async function getFeedByURL(url: string) {
  const [result] = await db.select().from(feeds).where(eq(feeds.url, url));
  if (!result) {
    throw new Error(`Could not find a feed with url=${url}`);
  }
  return result;
}

export async function getFeeds() {
  return await db
    .select({
      id: feeds.id,
      createdAt: feeds.createdAt,
      updatedAt: feeds.updatedAt,
      feedName: feeds.name,
      url: feeds.url,
      userName: users.name,
    })
    .from(feeds)
    .innerJoin(users, eq(feeds.userId, users.id));
}