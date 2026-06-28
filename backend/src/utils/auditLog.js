import { run } from "../database/db.js";

export async function createAuditLog({
  userId = null,
  action,
  entity,
  entityId = null,
  description,
  ipAddress = null,
}) {
  try {
    await run(
      `INSERT INTO audit_logs
        (user_id, action, entity, entity_id, description, ip_address)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, action, entity, entityId, description, ipAddress],
    );
  } catch (error) {
    console.error("No fue posible registrar la bitácora:", error.message);
  }
}
