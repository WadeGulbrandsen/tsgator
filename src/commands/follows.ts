import { getUserByName } from "../lib/db/queries/users";
import { readConfig } from "../config";
import { getFeedByURL } from "../lib/db/queries/feeds";
import { Feed, User } from "../lib/db/schema";
import { createFeedFollow, getFeedFollowsForUser } from "../lib/db/queries/follows";

export async function handlerFollow(cmdName: string, ...args: string[]) {
  const [url] = args;
  if (!url) {
    throw new Error(`Usage: ${cmdName} <url>`);
  }
  const username = readConfig().currentUserName;
  const user: User = await getUserByName(username);
  const feed: Feed = await getFeedByURL(url);
  const follow = await createFeedFollow(user.id, feed.id);
  console.log(`${follow.userName} is now following ${follow.feedName}`);
}

export async function handlerFollowing(cmdName: string, ...args: string[]) {
  const username = readConfig().currentUserName;
  const user: User = await getUserByName(username);
  const follows = await getFeedFollowsForUser(user.id);
  console.log(`${user.name} is following: (${follows.length})`);
  for (const follow of follows) {
    console.log(` * ${follow.feedName} (${follow.url})`);
  }
}