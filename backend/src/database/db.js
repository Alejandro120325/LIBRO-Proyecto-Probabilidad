import path from "node:path";
import { fileURLToPath } from "node:url";
import sqlite3 from "sqlite3";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const databasePath = path.resolve(currentDir, "../../database.sqlite");

const sqlite = sqlite3.verbose();
export const db = new sqlite.Database(databasePath);

export function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function onRun(error) {
      if (error) reject(error);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
}

export function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (error, row) => {
      if (error) reject(error);
      else resolve(row);
    });
  });
}

export function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (error, rows) => {
      if (error) reject(error);
      else resolve(rows);
    });
  });
}
