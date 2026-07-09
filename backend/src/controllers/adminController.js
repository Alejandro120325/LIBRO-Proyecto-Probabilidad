import { all, get, run } from "../database/db.js";
import { createAuditLog } from "../utils/auditLog.js";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const roles = new Set(["student", "admin"]);
const statuses = new Set(["active", "suspended"]);

function normalizeResult(row) {
  return {
    id: row.id,
    userId: row.user_id,
    userName: row.user_name,
    email: row.email,
    unitId: row.unit_id,
    topic: row.topic,
    gameType: row.game_type,
    score: row.score,
    totalQuestions: row.total_questions,
    percentage: Number(row.percentage),
    timeSeconds: row.time_seconds,
    createdAt: row.created_at,
  };
}

function normalizeAuditLog(row) {
  return {
    id: row.id,
    userId: row.user_id,
    userName: row.user_name || "Sistema / usuario eliminado",
    userEmail: row.user_email || null,
    action: row.action,
    entity: row.entity,
    entityId: row.entity_id,
    description: row.description,
    ipAddress: row.ip_address,
    createdAt: row.created_at,
  };
}

const resultSelect = `
  SELECT r.*, u.name AS user_name, u.email
    FROM results r
    JOIN users u ON u.id = r.user_id
`;

const auditSelect = `
  SELECT a.*, u.name AS user_name, u.email AS user_email
    FROM audit_logs a
    LEFT JOIN users u ON u.id = a.user_id
`;

export async function getDashboard(request, response) {
  const userStats = await get(`
    SELECT COUNT(*) AS totalUsers,
           SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) AS activeUsers,
           SUM(CASE WHEN status = 'suspended' THEN 1 ELSE 0 END) AS suspendedUsers
      FROM users
  `);
  const resultStats = await get(`
    SELECT COUNT(*) AS totalResults,
           COALESCE(ROUND(AVG(percentage), 2), 0) AS globalAverage
      FROM results
  `);
  const latestUsers = await all(`
    SELECT id, name, email, role, status, created_at AS createdAt, updated_at AS updatedAt
      FROM users ORDER BY datetime(created_at) DESC, id DESC LIMIT 5
  `);
  const latestResults = await all(`${resultSelect} ORDER BY datetime(r.created_at) DESC, r.id DESC LIMIT 5`);

  await createAuditLog({
    userId: request.user.id,
    action: "ADMIN_DASHBOARD_VIEWED",
    entity: "admin_dashboard",
    description: "Acceso al dashboard administrativo.",
    ipAddress: request.ip,
  });
  const latestAuditLogs = await all(`${auditSelect} ORDER BY datetime(a.created_at) DESC, a.id DESC LIMIT 8`);

  return response.json({
    dashboard: {
      totalUsers: Number(userStats.totalUsers || 0),
      activeUsers: Number(userStats.activeUsers || 0),
      suspendedUsers: Number(userStats.suspendedUsers || 0),
      totalResults: Number(resultStats.totalResults || 0),
      globalAverage: Number(resultStats.globalAverage || 0),
      completedGames: Number(resultStats.totalResults || 0),
      latestUsers,
      latestResults: latestResults.map(normalizeResult),
      latestAuditLogs: latestAuditLogs.map(normalizeAuditLog),
    },
  });
}

export async function getUsers(request, response) {
  const search = String(request.query.search || "").trim();
  const role = String(request.query.role || "").trim();
  const status = String(request.query.status || "").trim();
  const clauses = [];
  const params = [];

  if (search) {
    clauses.push("(u.name LIKE ? OR u.email LIKE ?)");
    params.push(`%${search}%`, `%${search}%`);
  }
  if (roles.has(role)) {
    clauses.push("u.role = ?");
    params.push(role);
  }
  if (statuses.has(status)) {
    clauses.push("u.status = ?");
    params.push(status);
  }

  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  const users = await all(`
    SELECT u.id, u.name, u.email, u.role, u.status,
           u.created_at AS createdAt, u.updated_at AS updatedAt,
           COUNT(r.id) AS resultCount,
           COALESCE(ROUND(AVG(r.percentage), 2), 0) AS averagePercentage,
           COALESCE(MAX(r.percentage), 0) AS bestPercentage
      FROM users u
      LEFT JOIN results r ON r.user_id = u.id
      ${where}
     GROUP BY u.id
     ORDER BY datetime(u.created_at) DESC, u.id DESC
  `, params);

  return response.json({
    users: users.map((user) => ({
      ...user,
      resultCount: Number(user.resultCount),
      averagePercentage: Number(user.averagePercentage),
      bestPercentage: Number(user.bestPercentage),
    })),
  });
}

export async function getUserById(request, response) {
  const userId = Number(request.params.id);
  if (!Number.isInteger(userId)) return response.status(400).json({ message: "Identificador de usuario inválido." });

  const user = await get(`
    SELECT u.id, u.name, u.email, u.role, u.status,
           u.created_at AS createdAt, u.updated_at AS updatedAt,
           COUNT(r.id) AS completedGames,
           COALESCE(ROUND(AVG(r.percentage), 2), 0) AS averagePercentage,
           COALESCE(MAX(r.percentage), 0) AS bestPercentage,
           MAX(r.created_at) AS lastActivity
      FROM users u
      LEFT JOIN results r ON r.user_id = u.id
     WHERE u.id = ?
     GROUP BY u.id
  `, [userId]);
  if (!user) return response.status(404).json({ message: "Usuario no encontrado." });

  const history = await all(`
    SELECT r.*, u.name AS user_name, u.email
      FROM results r JOIN users u ON u.id = r.user_id
     WHERE r.user_id = ? ORDER BY datetime(r.created_at) DESC, r.id DESC
  `, [userId]);

  return response.json({
    user: {
      ...user,
      completedGames: Number(user.completedGames),
      averagePercentage: Number(user.averagePercentage),
      bestPercentage: Number(user.bestPercentage),
    },
    results: history.map(normalizeResult),
  });
}

export async function updateUser(request, response) {
  const userId = Number(request.params.id);
  const current = await get("SELECT * FROM users WHERE id = ?", [userId]);
  if (!current) return response.status(404).json({ message: "Usuario no encontrado." });

  const name = request.body.name === undefined ? current.name : String(request.body.name).trim();
  const email = request.body.email === undefined ? current.email : String(request.body.email).trim().toLowerCase();
  const role = request.body.role === undefined ? current.role : String(request.body.role);
  const status = request.body.status === undefined ? current.status : String(request.body.status);

  if (name.length < 2 || name.length > 80) return response.status(400).json({ message: "El nombre debe tener entre 2 y 80 caracteres." });
  if (!emailPattern.test(email) || email.length > 120) return response.status(400).json({ message: "Ingresa un correo electrónico válido." });
  if (!roles.has(role)) return response.status(400).json({ message: "Rol de usuario inválido." });
  if (!statuses.has(status)) return response.status(400).json({ message: "Estado de usuario inválido." });
  if (userId === request.user.id && (role !== "admin" || status !== "active")) {
    return response.status(400).json({ message: "No puedes quitar tu propio acceso administrativo." });
  }

  const duplicate = await get("SELECT id FROM users WHERE email = ? AND id <> ?", [email, userId]);
  if (duplicate) return response.status(409).json({ message: "Ya existe una cuenta con este correo." });

  await run(
    "UPDATE users SET name = ?, email = ?, role = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
    [name, email, role, status, userId],
  );
  await createAuditLog({
    userId: request.user.id,
    action: "USER_UPDATED",
    entity: "user",
    entityId: userId,
    description: `Usuario ${email} actualizado por ${request.user.email}.`,
    ipAddress: request.ip,
  });
  if (current.role !== role) {
    await createAuditLog({
      userId: request.user.id,
      action: "ROLE_CHANGED",
      entity: "user",
      entityId: userId,
      description: `Rol de ${email} cambiado de ${current.role} a ${role}.`,
      ipAddress: request.ip,
    });
  }

  const updated = await get(
    "SELECT id, name, email, role, status, created_at AS createdAt, updated_at AS updatedAt FROM users WHERE id = ?",
    [userId],
  );
  return response.json({ user: updated, message: "Usuario actualizado correctamente." });
}

async function changeUserStatus(request, response, status) {
  const userId = Number(request.params.id);
  const target = await get("SELECT id, email, status FROM users WHERE id = ?", [userId]);
  if (!target) return response.status(404).json({ message: "Usuario no encontrado." });
  if (userId === request.user.id && status === "suspended") {
    return response.status(400).json({ message: "No puedes suspender tu propia cuenta." });
  }

  await run("UPDATE users SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?", [status, userId]);
  const activated = status === "active";
  await createAuditLog({
    userId: request.user.id,
    action: activated ? "USER_ACTIVATED" : "USER_SUSPENDED",
    entity: "user",
    entityId: userId,
    description: `${target.email} fue ${activated ? "activado" : "suspendido"} por ${request.user.email}.`,
    ipAddress: request.ip,
  });
  return response.json({ message: `Usuario ${activated ? "activado" : "suspendido"} correctamente.` });
}

export function suspendUser(request, response) {
  return changeUserStatus(request, response, "suspended");
}

export function activateUser(request, response) {
  return changeUserStatus(request, response, "active");
}

export async function deleteUser(request, response) {
  const userId = Number(request.params.id);
  if (userId === request.user.id) {
    return response.status(400).json({ message: "No puedes eliminar tu propia cuenta administrativa." });
  }
  const target = await get("SELECT id, email FROM users WHERE id = ?", [userId]);
  if (!target) return response.status(404).json({ message: "Usuario no encontrado." });

  await run("DELETE FROM users WHERE id = ?", [userId]);
  await createAuditLog({
    userId: request.user.id,
    action: "USER_DELETED",
    entity: "user",
    entityId: userId,
    description: `Usuario ${target.email} eliminado por ${request.user.email}.`,
    ipAddress: request.ip,
  });
  return response.json({ message: "Usuario eliminado correctamente." });
}

export async function getAllResults(request, response) {
  const unitId = Number(request.query.unitId || 0);
  const search = String(request.query.search || "").trim();
  const clauses = [];
  const params = [];
  if ([1, 2, 3].includes(unitId)) {
    clauses.push("r.unit_id = ?");
    params.push(unitId);
  }
  if (search) {
    clauses.push("(u.name LIKE ? OR u.email LIKE ?)");
    params.push(`%${search}%`, `%${search}%`);
  }
  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  const rows = await all(`${resultSelect} ${where} ORDER BY datetime(r.created_at) DESC, r.id DESC`, params);
  return response.json({ results: rows.map(normalizeResult) });
}

export async function deleteResult(request, response) {
  const resultId = Number(request.params.id);
  const result = await get(`${resultSelect} WHERE r.id = ?`, [resultId]);
  if (!result) return response.status(404).json({ message: "Resultado no encontrado." });

  await run("DELETE FROM results WHERE id = ?", [resultId]);
  await createAuditLog({
    userId: request.user.id,
    action: "RESULT_DELETED",
    entity: "result",
    entityId: resultId,
    description: `Resultado ${result.game_type} de ${result.email} eliminado.`,
    ipAddress: request.ip,
  });
  return response.json({ message: "Resultado eliminado correctamente." });
}

export async function getAdminLeaderboard(request, response) {
  const rows = await all(`
    SELECT u.id, u.name, u.email,
           ROUND(AVG(r.percentage), 2) AS averagePercentage,
           ROUND(MAX(r.percentage), 2) AS bestPercentage,
           COUNT(r.id) AS completedGames,
           MAX(r.created_at) AS lastActivity
      FROM users u
      JOIN results r ON r.user_id = u.id
     WHERE u.status = 'active'
     GROUP BY u.id
     ORDER BY averagePercentage DESC, bestPercentage DESC, completedGames DESC, u.name ASC
  `);
  return response.json({
    leaderboard: rows.map((row, index) => ({
      ...row,
      position: index + 1,
      averagePercentage: Number(row.averagePercentage),
      bestPercentage: Number(row.bestPercentage),
      completedGames: Number(row.completedGames),
    })),
  });
}

export async function getAuditLogs(request, response) {
  const action = String(request.query.action || "").trim();
  const rows = action
    ? await all(`${auditSelect} WHERE a.action = ? ORDER BY datetime(a.created_at) DESC, a.id DESC LIMIT 500`, [action])
    : await all(`${auditSelect} ORDER BY datetime(a.created_at) DESC, a.id DESC LIMIT 500`);
  return response.json({ auditLogs: rows.map(normalizeAuditLog) });
}
