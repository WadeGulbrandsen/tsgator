import { getNextFeedToFetch, markFeedFetched } from "../lib/db/queries/feeds";
import { fetchFeed } from "../lib/rss";
import { createPost } from "../lib/db/queries/posts";
import postgres from "postgres";


export async function handlerAgg(cmdName: string, ...args: string[]) {
  const [timeBetweenReqs] = args;
  if (!timeBetweenReqs) {
    throw new Error(`Usage: ${cmdName} <time_between_reqs>`);
  }
  const duration = await parseDuration(timeBetweenReqs);
  console.log(`Collecting feeds every ${durationToStr(duration)}`);
  scrapeFeeds().catch(handleError);

  const interval = setInterval(() => {
    scrapeFeeds().catch(handleError);
  }, duration);

  await new Promise<void>((resolve) => {
    process.on("SIGINT", () => {
      console.log("Shutting down feed aggregator...");
      clearInterval(interval);
      resolve();
    });
  });
}

async function scrapeFeeds() {
  const feed = await getNextFeedToFetch();
  await markFeedFetched(feed.id);
  console.log(`Fetching ${feed.name} (${feed.url})`);
  const rss = await fetchFeed(feed.url);
  console.log(`Posts: (${rss.channel.item.length})`);
  for (const post of rss.channel.item) {
    try {
      const publishedAt = await parseDate(post.pubDate);
      await createPost(post.title, post.link, post.description, publishedAt, feed.id);
    } catch (err) {
      if (
        err instanceof Error
        && err.cause instanceof postgres.PostgresError
        && err.cause.code === "23505" // Code 23505 is unique_violation
        && err.cause.constraint_name === "posts_url_unique"
      ) {
        // Ignore unique_violation errors
        // console.error(err.cause.detail);
        continue;
      }
      console.error(`Error saving post: ${err instanceof Error ? err.message : err}`);
    }
  }
}

async function parseDate(dateStr: string) {
  const timestamp = Date.parse(dateStr);
  if (!timestamp) {
    throw new Error(`Unable to parse date: ${dateStr}`);
  }
  return new Date(timestamp);
}

function handleError(reason: any) {
  console.error(`Error scraping feed: ${reason instanceof Error ? reason.message : reason}`);
}

async function parseDuration(durationStr: string) {
  const regex = /^(\d+)(ms|s|m|h)$/;
  const match = durationStr.match(regex);
  if (!match) {
    throw new Error("duration must be in the format of <number><unit> where unit is ms|s|m|h. e.g. 1h");
  }
  const [_, timeStr, unit] = match;
  const baseNum = Number(timeStr);
  if (!baseNum) {
    throw new Error(`Invalid duration: ${durationStr}`)
  }
  switch (unit) {
    case "s":
      return baseNum * 1000;
    case "m":
      return baseNum * 1000 * 60;
    case "h":
      return baseNum * 1000 * 60 * 60;
  }
  return baseNum;
}

function durationToStr(duration: number) {
  const ms = duration % 1000;
  const s = Math.trunc(duration / 1000) % 60;
  const m = Math.trunc(duration / (1000 * 60)) % 60;
  const h = Math.trunc(duration / (1000 * 60 * 60));
  if (h) {
    return `${h}h${m}m${s}s${ms ? `${ms}ms` : ""}`;
  }
  if (m) {
    return `${m}m${s}s${ms ? `${ms}ms` : ""}`;
  }
  if (s) {
    return `${s}s${ms ? `${ms}ms` : ""}`;
  }
  return `${ms}ms`;
}