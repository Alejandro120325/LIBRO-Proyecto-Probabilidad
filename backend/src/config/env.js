import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: Number(process.env.PORT) || 4000,
  jwtSecret: process.env.JWT_SECRET || "development_only_change_before_deploying",
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  nodeEnv: process.env.NODE_ENV || "development",
};

if (!process.env.JWT_SECRET && env.nodeEnv === "production") {
  throw new Error("JWT_SECRET es obligatorio en producción.");
}
