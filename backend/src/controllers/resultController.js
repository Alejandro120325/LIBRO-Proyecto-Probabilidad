import { all, get, run } from "../database/db.js";
import { createAuditLog } from "../utils/auditLog.js";

function normalizeResult(row) {
  return {
    id: row.id,
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

export async function saveResult(request, response) {
  const unitId = Number(request.body.unitId ?? request.body.unit_id);
  const topic = String(request.body.topic || "").trim();
  const gameType = String(request.body.gameType ?? request.body.game_type ?? "").trim();
  const score = Number(request.body.score);
  const totalQuestions = Number(request.body.totalQuestions ?? request.body.total_questions);
  const rawTimeSeconds = Number(request.body.timeSeconds ?? request.body.time_seconds ?? 0);
  const timeSeconds = Math.round(rawTimeSeconds);

  if (![1, 2, 3].includes(unitId)) {
    return response.status(400).json({ message: "La unidad seleccionada no es válida." });
  }
  if (!topic || topic.length > 120 || !gameType || gameType.length > 80) {
    return response.status(400).json({ message: "El tema y el tipo de juego son obligatorios." });
  }
  if (!Number.isInteger(score) || !Number.isInteger(totalQuestions) || totalQuestions < 1 || score < 0 || score > totalQuestions) {
    return response.status(400).json({ message: "El puntaje recibido no es válido." });
  }

  if (!Number.isFinite(rawTimeSeconds) || timeSeconds < 0) {
    return response.status(400).json({ message: "El tiempo recibido no es válido." });
  }

  const percentage = Number(((score / totalQuestions) * 100).toFixed(2));
  const inserted = await run(
    `INSERT INTO results
      (user_id, unit_id, topic, game_type, score, total_questions, percentage, time_seconds)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [request.user.id, unitId, topic, gameType, score, totalQuestions, percentage, timeSeconds],
  );
  const result = await get("SELECT * FROM results WHERE id = ?", [inserted.id]);

  await createAuditLog({
    userId: request.user.id,
    action: "RESULT_CREATED",
    entity: "result",
    entityId: result.id,
    description: `Resultado guardado: ${gameType}, ${score}/${totalQuestions}.`,
    ipAddress: request.ip,
  });

  return response.status(201).json({ result: normalizeResult(result) });
}

export async function getMyResults(request, response) {
  const rows = await all(
    "SELECT * FROM results WHERE user_id = ? ORDER BY datetime(created_at) DESC, id DESC",
    [request.user.id],
  );
  return response.json({ results: rows.map(normalizeResult) });
}

export async function getSummary(request, response) {
  const overall = await get(
    `SELECT COUNT(*) AS completedGames,
            COALESCE(ROUND(AVG(percentage), 2), 0) AS averagePercentage,
            COALESCE(MAX(percentage), 0) AS bestPercentage
       FROM results WHERE user_id = ?`,
    [request.user.id],
  );
  const byUnit = await all(
    `SELECT unit_id AS unitId,
            COUNT(*) AS attempts,
            ROUND(MAX(percentage), 2) AS bestPercentage,
            ROUND(AVG(percentage), 2) AS averagePercentage
       FROM results WHERE user_id = ? GROUP BY unit_id ORDER BY unit_id`,
    [request.user.id],
  );
  const recentRows = await all(
    "SELECT * FROM results WHERE user_id = ? ORDER BY datetime(created_at) DESC, id DESC LIMIT 5",
    [request.user.id],
  );
  const bestUnit = byUnit.length
    ? byUnit.reduce((best, unit) => Number(unit.bestPercentage) > Number(best.bestPercentage) ? unit : best)
    : null;

  return response.json({
    summary: {
      completedGames: Number(overall.completedGames),
      averagePercentage: Number(overall.averagePercentage),
      bestPercentage: Number(overall.bestPercentage),
      completedUnits: byUnit.filter((unit) => Number(unit.bestPercentage) >= 60).length,
      bestUnit: bestUnit ? {
        unitId: Number(bestUnit.unitId),
        percentage: Number(bestUnit.bestPercentage),
      } : null,
      lastAttempt: recentRows[0] ? normalizeResult(recentRows[0]) : null,
      byUnit: byUnit.map((unit) => ({ ...unit, attempts: Number(unit.attempts) })),
      recentResults: recentRows.map(normalizeResult),
    },
  });
}

export async function getLeaderboard(request, response) {
  const rows = await all(`
    SELECT u.id,
           u.name,
           ROUND(AVG(r.percentage), 2) AS averagePercentage,
           ROUND(MAX(r.percentage), 2) AS bestPercentage,
           COUNT(r.id) AS completedGames
      FROM users u
      JOIN results r ON r.user_id = u.id
     WHERE u.status = 'active'
     GROUP BY u.id, u.name
     ORDER BY averagePercentage DESC, bestPercentage DESC, completedGames DESC, u.name ASC
     LIMIT 20
  `);

  return response.json({
    leaderboard: rows.map((row, index) => ({
      position: index + 1,
      id: row.id,
      name: row.name,
      averagePercentage: Number(row.averagePercentage),
      bestPercentage: Number(row.bestPercentage),
      completedGames: Number(row.completedGames),
    })),
  });
}
