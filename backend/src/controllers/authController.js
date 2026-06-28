import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { get, run } from "../database/db.js";
import { createAuditLog } from "../utils/auditLog.js";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function createToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    env.jwtSecret,
    { expiresIn: "7d" },
  );
}

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    createdAt: user.created_at,
    updatedAt: user.updated_at,
  };
}

export async function register(request, response) {
  const name = String(request.body.name || "").trim();
  const email = String(request.body.email || "").trim().toLowerCase();
  const password = String(request.body.password || "");

  if (name.length < 2 || name.length > 80) {
    return response.status(400).json({ message: "El nombre debe tener entre 2 y 80 caracteres." });
  }
  if (!emailPattern.test(email) || email.length > 120) {
    return response.status(400).json({ message: "Ingresa un correo electrónico válido." });
  }
  if (password.length < 6 || password.length > 72) {
    return response.status(400).json({ message: "La contraseña debe tener entre 6 y 72 caracteres." });
  }

  const existingUser = await get("SELECT id FROM users WHERE email = ?", [email]);
  if (existingUser) {
    return response.status(409).json({ message: "Ya existe una cuenta con este correo." });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const result = await run(
    `INSERT INTO users (name, email, password_hash, role, status)
     VALUES (?, ?, ?, 'student', 'active')`,
    [name, email, passwordHash],
  );
  const user = await get("SELECT * FROM users WHERE id = ?", [result.id]);

  await createAuditLog({
    userId: user.id,
    action: "USER_REGISTERED",
    entity: "user",
    entityId: user.id,
    description: `Registro público del usuario ${user.email}.`,
    ipAddress: request.ip,
  });

  return response.status(201).json({ token: createToken(user), user: publicUser(user) });
}

export async function login(request, response) {
  const email = String(request.body.email || "").trim().toLowerCase();
  const password = String(request.body.password || "");

  if (!emailPattern.test(email) || !password) {
    return response.status(400).json({ message: "Correo y contraseña son obligatorios." });
  }

  const user = await get("SELECT * FROM users WHERE email = ?", [email]);
  const isValid = user ? await bcrypt.compare(password, user.password_hash) : false;
  if (!isValid) {
    await createAuditLog({
      userId: user?.id || null,
      action: "LOGIN_FAILED",
      entity: "user",
      entityId: user?.id || null,
      description: `Intento de inicio de sesión fallido para ${email}.`,
      ipAddress: request.ip,
    });
    return response.status(401).json({ message: "Correo o contraseña incorrectos." });
  }

  if (user.status !== "active") {
    await createAuditLog({
      userId: user.id,
      action: "LOGIN_FAILED",
      entity: "user",
      entityId: user.id,
      description: `Inicio de sesión bloqueado por cuenta suspendida: ${email}.`,
      ipAddress: request.ip,
    });
    return response.status(403).json({ message: "Tu cuenta está suspendida. Contacta al administrador." });
  }

  await createAuditLog({
    userId: user.id,
    action: "LOGIN_SUCCESS",
    entity: "user",
    entityId: user.id,
    description: `Inicio de sesión exitoso de ${email}.`,
    ipAddress: request.ip,
  });

  return response.json({ token: createToken(user), user: publicUser(user) });
}

export function me(request, response) {
  return response.json({ user: publicUser(request.user) });
}

export async function logout(request, response) {
  await createAuditLog({
    userId: request.user.id,
    action: "LOGOUT",
    entity: "user",
    entityId: request.user.id,
    description: `Cierre de sesión de ${request.user.email}.`,
    ipAddress: request.ip,
  });
  return response.json({ success: true, message: "Sesión cerrada correctamente." });
}
