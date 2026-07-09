import bcrypt from "bcryptjs";
import { all, get, run } from "./db.js";

async function ensureColumn(table, name, definition) {
  const columns = await all(`PRAGMA table_info(${table})`);
  if (!columns.some((column) => column.name === name)) {
    await run(`ALTER TABLE ${table} ADD COLUMN ${name} ${definition}`);
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

  await ensureColumn("users", "name", "TEXT NOT NULL DEFAULT 'Usuario'");
  await ensureColumn("users", "email", "TEXT");
  await ensureColumn("users", "password_hash", "TEXT NOT NULL DEFAULT ''");
  await ensureColumn("users", "role", "TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin'))");
  await ensureColumn("users", "status", "TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended'))");
  await ensureColumn("users", "created_at", "DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP");
  await ensureColumn("users", "updated_at", "DATETIME");
  await ensureColumn("users", "phone", "TEXT");
  await ensureColumn("users", "national_id", "TEXT");
  await ensureColumn("users", "city", "TEXT");
  await ensureColumn("users", "university", "TEXT");
  await ensureColumn("users", "career", "TEXT");
  await ensureColumn("users", "semester", "TEXT");
  await ensureColumn("users", "birth_date", "TEXT");
  await ensureColumn("users", "bio", "TEXT");
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

  await ensureColumn("results", "user_id", "INTEGER");
  await ensureColumn("results", "unit_id", "INTEGER NOT NULL DEFAULT 1 CHECK (unit_id BETWEEN 1 AND 3)");
  await ensureColumn("results", "topic", "TEXT NOT NULL DEFAULT 'General'");
  await ensureColumn("results", "game_type", "TEXT NOT NULL DEFAULT 'Juego'");
  await ensureColumn("results", "score", "INTEGER NOT NULL DEFAULT 0 CHECK (score >= 0)");
  await ensureColumn("results", "total_questions", "INTEGER NOT NULL DEFAULT 1 CHECK (total_questions > 0)");
  await ensureColumn("results", "percentage", "REAL NOT NULL DEFAULT 0 CHECK (percentage BETWEEN 0 AND 100)");
  await ensureColumn("results", "time_seconds", "INTEGER NOT NULL DEFAULT 0 CHECK (time_seconds >= 0)");
  await ensureColumn("results", "created_at", "DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP");
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
  await ensureColumn("audit_logs", "user_id", "INTEGER");
  await ensureColumn("audit_logs", "action", "TEXT NOT NULL DEFAULT 'UNKNOWN'");
  await ensureColumn("audit_logs", "entity", "TEXT NOT NULL DEFAULT 'system'");
  await ensureColumn("audit_logs", "entity_id", "INTEGER");
  await ensureColumn("audit_logs", "description", "TEXT NOT NULL DEFAULT ''");
  await ensureColumn("audit_logs", "ip_address", "TEXT");
  await ensureColumn("audit_logs", "created_at", "DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP");
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
