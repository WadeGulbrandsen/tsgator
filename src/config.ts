import fs from "fs";
import os from "os";
import path from "path";

const configFileName = ".gatorconfig.json";

type Config = {
  dbUrl: string;
  currentUserName: string;
};

export function setUser(username: string) {
  const config = readConfig();
  config.currentUserName = username;
  writeConfig(config);
}

export function readConfig(): Config {
  const json = fs.readFileSync(getConfigFilePath(), { encoding: "utf-8" });
  const parsed = JSON.parse(json);
  return validateConfig(parsed);
}

function getConfigFilePath(): string {
  return path.join(os.homedir(), configFileName);
}

function writeConfig(config: Config) {
  const data = {
    db_url: config.dbUrl,
    current_user_name: config.currentUserName,
  };
  const json = JSON.stringify(data);
  fs.writeFileSync(getConfigFilePath(), json);
}

function validateConfig(rawConfig: any): Config {
  if (typeof rawConfig !== "object" || rawConfig === null || Array.isArray(rawConfig)) {
    throw new Error("Config must be an object");
  }
  const { db_url, current_user_name } = rawConfig;
  if (typeof db_url !== "string") {
    throw new Error("db_url must be a string");
  }
  if (typeof current_user_name !== "string" && current_user_name !== undefined) {
    throw new Error("current_user_name must be a string");
  }
  return {
    dbUrl: db_url,
    currentUserName: current_user_name ?? "",
  };
}