import { createFeed, getFeeds } from "../lib/db/queries/feeds";
import { Feed, User } from "../lib/db/schema";
import { createFeedFollow } from "../lib/db/queries/follows";

export async function handlerAddFeed(cmdName: string, user: User, ...args: string[]) {
  const [name, url] = args;
  if (!name || !url) {
    throw new Error(`Usage: ${cmdName} <name> <url>`);
  }
  const feed: Feed = await createFeed(name, url, user.id);

  console.log("Feed created successfully:");
  printFeed(feed, user);

  const follow = await createFeedFollow(user.id, feed.id);
  console.log(`${follow.userName} is now following ${follow.feedName}`);
}

export async function handlerFeeds(cmdName: string, ...args: string[]) {
  const feeds = await getFeeds();
  console.log(`Feeds: (${feeds.length})`);
  for (const feed of feeds) {
    console.log(` * ${feed.feedName} (${feed.url}): ${feed.userName}`);
  }
}

function printFeed(feed: Feed, user: User) {
  console.log(`* ID:            ${feed.id}`);
  console.log(`* Created:       ${feed.createdAt}`);
  console.log(`* Updated:       ${feed.updatedAt}`);
  console.log(`* name:          ${feed.name}`);
  console.log(`* URL:           ${feed.url}`);
  console.log(`* User:          ${user.name}`);
}