import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { get } from "../database/db.js";

export async function authMiddleware(request, response, next) {
  try {
    const authorization = request.headers.authorization;
    const token = authorization?.startsWith("Bearer ") ? authorization.slice(7) : null;

    if (!token) {
      return response.status(401).json({ message: "Debes iniciar sesión para continuar." });
    }

    const payload = jwt.verify(token, env.jwtSecret);
    const user = await get(
      `SELECT id, name, email, role, status, phone, national_id, city,
        university, career, semester, birth_date, bio, created_at, updated_at
       FROM users WHERE id = ?`,
      [payload.id || payload.userId],
    );

    if (!user) {
      return response.status(401).json({ message: "La sesión ya no es válida." });
    }
    if (user.status !== "active") {
      return response.status(403).json({ message: "Tu cuenta está suspendida. Contacta al administrador." });
    }

    request.user = user;
    next();
  } catch (error) {
    const message = error.name === "TokenExpiredError"
      ? "Tu sesión expiró. Inicia sesión nuevamente."
      : "Token de autenticación inválido.";
    return response.status(401).json({ message });
  }
}
