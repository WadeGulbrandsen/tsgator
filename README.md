# gator

Feed aggreGATOR

Repo for boot.dev [Build a Blog Aggregator in TypeScript](https://www.boot.dev/courses/build-blog-aggregator-typescript) course

Go version: https://github.com/WadeGulbrandsen/gator

## Installation

1. Install PostgreSQL
1. Create a database named `gator` on your PostgreSQL server
1. Put the connection string in `~/.gatorconfig.json` in the following format
   ```json
   {"db_url":"postgres://username:password@server:5432/gator?sslmode=disable"}
   ```
1. Install [node version manager (NVM)](https://github.com/nvm-sh/nvm)
1. Clone this repo:
   ```shell
   git clone https://github.com/WadeGulbrandsen/tsgator.git
   ```
1. Navigate to the directory created by git:
   ```shell
   cd tsgator
   ```
1. Install the node and the project requirements:
   ```shell
   nvm install
   ```
1. Configure the database:
   ```shell
   npm run migrate
   ```

## Commands
| Command                                        | Description |
| :--------------------------------------------- | :---------- |
| `npm run start register <name>`                | Register and login a user with `name` |
| `npm run start login <name>`                   | Login as user with `name` |
| `npm run start users`                          | List all users on the system |
| `npm run start addfeed <feed_name> <feed_url>` | Current user adds and follows a new feed |
| `npm run start feeds`                          | List all feeds |
| `npm run start follow <feed_url>`              | Current user follows an existing feed |
| `npm run start unfollow <feed_url>`            | Current user unfollow a feed |
| `npm run start following`                      | List the feeds that the current user is following |
| `npm run start agg <duration>`                 | Fetch posts for feeds. Waiting `duration` between fetch requests. `duration` is specified like `1m`, `5s`, etc. Press `CTRL+C` to exit |
| `npm run start browse [num_posts]`             | Current user see the `num_posts` most recent posts from the feeds they are following. `num_posts` defaults to `2` |

Options in triangular brackets are required and options in square brackets are optional.
If the value has spaces enclose the entire value in quotes For example:

```shell
npm run start addfeed "Boot.dev Blog" "https://blog.boot.dev/index.xml"
```

## Reset the Database
To delete everthing in the database without confirmation run `npm run start reset`.
This really will delete everything in the database. You have been warned.