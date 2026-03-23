import { and, eq } from "drizzle-orm";
import { db } from "..";
import { feedFollows, feeds, users } from "../schema";
import { getFeedByURL } from "./feeds";

export async function createFeedFollow(userId: string, feedId: string) {
  const [result] = await db.insert(feedFollows).values({ userId, feedId }).returning();
  if (!result) {
    throw new Error("Could not create feed follow");
  }
  return await getFeedFollow(result.id);
}

export async function deleteFeedFollow(userId: string, url: string) {
  const feed = await getFeedByURL(url);
  await db
    .delete(feedFollows)
    .where(
      and(
        eq(feedFollows.userId, userId),
        eq(feedFollows.feedId, feed.id),
      ));
}

export async function getFeedFollowsForUser(userId: string) {
  return await db
    .select({
      id: feedFollows.id,
      createdAt: feedFollows.createdAt,
      updatedAt: feedFollows.updatedAt,
      userName: users.name,
      feedName: feeds.name,
      url: feeds.url,
    })
    .from(feedFollows)
    .innerJoin(users, eq(feedFollows.userId, users.id))
    .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
    .where(eq(users.id, userId));
}

async function getFeedFollow(id: string) {
  const [follow] = await db
    .select({
      id: feedFollows.id,
      createdAt: feedFollows.createdAt,
      updatedAt: feedFollows.updatedAt,
      userName: users.name,
      feedName: feeds.name,
      url: feeds.url,
    })
    .from(feedFollows)
    .innerJoin(users, eq(feedFollows.userId, users.id))
    .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
    .where(eq(feedFollows.id, id));
  if (!follow) {
    throw new Error("Could not read feed follow");
  }
  return follow;
}