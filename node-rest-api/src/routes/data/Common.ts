import sqlite3 from "sqlite3";

// Open SQLite database
export async function getDb() {
  const path = require("path");
  const dbPath = path.resolve(__dirname, "HealthSurvey.db");

  return new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE);
}
