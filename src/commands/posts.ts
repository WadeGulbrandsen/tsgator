import { getPostsForUser } from "../lib/db/queries/posts";
import { User } from "../lib/db/schema";

export async function handlerBrowse(cmdName: string, user: User, ...args: string[]) {
  const limit = Math.trunc(Number(args[0] ?? 2));
  if (!limit || limit <= 0) {
    throw new Error(`Usage: ${cmdName} [limit]\n       limit must be a number greater than zero`);
  }
  const posts = await getPostsForUser(user.id, limit);
  console.log(`Posts: (${posts.length})`);
  for (const post of posts) {
    console.log(` * ${post.publishedAt.toISOString()}: ${post.feedName} - ${post.title} (${post.url})`);
  }
}