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
    phone: user.phone || "",
    nationalId: user.national_id || "",
    city: user.city || "",
    university: user.university || "",
    career: user.career || "",
    semester: user.semester || "",
    birthDate: user.birth_date || "",
    bio: user.bio || "",
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
  const hasPasswordHash = typeof user?.password_hash === "string" && user.password_hash.length > 0;
  const isValid = hasPasswordHash ? await bcrypt.compare(password, user.password_hash) : false;
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

const profileFields = [
  ["phone", "phone", 24],
  ["nationalId", "national_id", 10],
  ["city", "city", 80],
  ["university", "university", 120],
  ["career", "career", 100],
  ["semester", "semester", 30],
  ["birthDate", "birth_date", 10],
  ["bio", "bio", 180],
];

function optionalText(value, maxLength) {
  const normalized = String(value || "").trim();
  return normalized ? normalized.slice(0, maxLength) : null;
}

function profileValue(body, input, column) {
  return body[input] ?? body[column];
}

function isValidIsoDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

export async function updateProfile(request, response) {
  const name = String(request.body.name || "").trim();
  if (name.length < 2 || name.length > 80) {
    return response.status(400).json({ message: "El nombre debe tener entre 2 y 80 caracteres." });
  }

  const fieldLabels = { phone: "teléfono", nationalId: "cédula", city: "ciudad", university: "universidad", career: "carrera", semester: "semestre", birthDate: "fecha de nacimiento", bio: "biografía" };
  for (const [input, column, max] of profileFields) {
    if (String(profileValue(request.body, input, column) || "").trim().length > max) {
      return response.status(400).json({ message: `El campo ${fieldLabels[input]} admite máximo ${max} caracteres.` });
    }
  }
  const profile = Object.fromEntries(profileFields.map(([input, column, max]) => [column, optionalText(profileValue(request.body, input, column), max)]));
  if (profile.phone && profile.phone.length < 7) {
    return response.status(400).json({ message: "El teléfono debe tener al menos 7 caracteres." });
  }
  if (profile.national_id && !/^\d{10}$/.test(profile.national_id)) {
    return response.status(400).json({ message: "La cédula debe contener exactamente 10 dígitos." });
  }
  if (profile.birth_date && !isValidIsoDate(profile.birth_date)) {
    return response.status(400).json({ message: "La fecha de nacimiento no es válida." });
  }
  if (profile.birth_date && new Date(`${profile.birth_date}T00:00:00Z`) > new Date()) {
    return response.status(400).json({ message: "La fecha de nacimiento no puede estar en el futuro." });
  }

  await run(
    `UPDATE users SET name = ?, phone = ?, national_id = ?, city = ?, university = ?,
      career = ?, semester = ?, birth_date = ?, bio = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [name, profile.phone, profile.national_id, profile.city, profile.university, profile.career, profile.semester, profile.birth_date, profile.bio, request.user.id],
  );
  const user = await get("SELECT * FROM users WHERE id = ?", [request.user.id]);
  await createAuditLog({
    userId: user.id,
    action: "PROFILE_UPDATED",
    entity: "user",
    entityId: user.id,
    description: `Actualización del perfil de ${user.email}.`,
    ipAddress: request.ip,
  });
  return response.json({ message: "Perfil actualizado correctamente.", user: publicUser(user) });
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
