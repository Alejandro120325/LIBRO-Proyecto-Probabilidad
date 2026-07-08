import bcrypt from "bcryptjs";
import { all, get, run } from "./db.js";

async function ensureUserColumn(name, definition) {
  const columns = await all("PRAGMA table_info(users)");
  if (!columns.some((column) => column.name === name)) {
    await run(`ALTER TABLE users ADD COLUMN ${name} ${definition}`);
  }
}

export async function initializeDatabase() {
  await run("PRAGMA foreign_keys = ON");
  await run("PRAGMA journal_mode = WAL");

  await run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE COLLATE NOCASE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin')),
      status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended')),
      phone TEXT,
      national_id TEXT,
      city TEXT,
      university TEXT,
      career TEXT,
      semester TEXT,
      birth_date TEXT,
      bio TEXT,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await ensureUserColumn("role", "TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin'))");
  await ensureUserColumn("status", "TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended'))");
  await ensureUserColumn("updated_at", "DATETIME");
  await ensureUserColumn("phone", "TEXT");
  await ensureUserColumn("national_id", "TEXT");
  await ensureUserColumn("city", "TEXT");
  await ensureUserColumn("university", "TEXT");
  await ensureUserColumn("career", "TEXT");
  await ensureUserColumn("semester", "TEXT");
  await ensureUserColumn("birth_date", "TEXT");
  await ensureUserColumn("bio", "TEXT");
  await run("UPDATE users SET updated_at = COALESCE(updated_at, created_at, CURRENT_TIMESTAMP)");

  await run(`
    CREATE TABLE IF NOT EXISTS results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      unit_id INTEGER NOT NULL CHECK (unit_id BETWEEN 1 AND 3),
      topic TEXT NOT NULL,
      game_type TEXT NOT NULL,
      score INTEGER NOT NULL CHECK (score >= 0),
      total_questions INTEGER NOT NULL CHECK (total_questions > 0),
      percentage REAL NOT NULL CHECK (percentage BETWEEN 0 AND 100),
      time_seconds INTEGER NOT NULL CHECK (time_seconds >= 0),
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  await run("CREATE INDEX IF NOT EXISTS idx_results_user_id ON results(user_id)");
  await run("CREATE INDEX IF NOT EXISTS idx_results_unit_id ON results(unit_id)");

  await run(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      action TEXT NOT NULL,
      entity TEXT NOT NULL,
      entity_id INTEGER,
      description TEXT NOT NULL,
      ip_address TEXT,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    )
  `);
  await run("CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id)");
  await run("CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action)");
  await run("CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at)");

  const demoPasswordHash = await bcrypt.hash("123456", 12);
  const demoUser = await get("SELECT id FROM users WHERE email = ?", ["demo@libro.com"]);
  if (!demoUser) {
    await run(
      "INSERT INTO users (name, email, password_hash, role, status) VALUES (?, ?, ?, 'student', 'active')",
      ["Estudiante Demo", "demo@libro.com", demoPasswordHash],
    );
  } else {
    await run(
      "UPDATE users SET password_hash = ?, role = 'student', status = 'active', updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [demoPasswordHash, demoUser.id],
    );
  }

  const adminUser = await get("SELECT id FROM users WHERE email = ?", ["admin@libro.com"]);
  if (!adminUser) {
    await run(
      "INSERT INTO users (name, email, password_hash, role, status) VALUES (?, ?, ?, 'admin', 'active')",
      ["Administrador", "admin@libro.com", demoPasswordHash],
    );
  } else {
    await run(
      "UPDATE users SET password_hash = ?, role = 'admin', status = 'active', updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [demoPasswordHash, adminUser.id],
    );
  }
}
