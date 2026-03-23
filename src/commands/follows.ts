import { getFeedByURL } from "../lib/db/queries/feeds";
import { Feed, User } from "../lib/db/schema";
import { createFeedFollow, deleteFeedFollow, getFeedFollowsForUser } from "../lib/db/queries/follows";

export async function handlerFollow(cmdName: string, user: User, ...args: string[]) {
  const [url] = args;
  if (!url) {
    throw new Error(`Usage: ${cmdName} <url>`);
  }
  const feed: Feed = await getFeedByURL(url);
  const follow = await createFeedFollow(user.id, feed.id);
  console.log(`${follow.userName} is now following ${follow.feedName}`);
}

export async function handlerUnfollow(cmdName: string, user: User, ...args: string[]) {
  const [url] = args;
  if (!url) {
    throw new Error(`Usage: ${cmdName} <url>`);
  }
  await deleteFeedFollow(user.id, url);
}

export async function handlerFollowing(cmdName: string, user: User, ...args: string[]) {
  const follows = await getFeedFollowsForUser(user.id);
  console.log(`${user.name} is following: (${follows.length})`);
  for (const follow of follows) {
    console.log(` * ${follow.feedName} (${follow.url})`);
  }
}