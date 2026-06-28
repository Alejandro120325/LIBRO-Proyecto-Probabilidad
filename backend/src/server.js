import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { initializeDatabase } from "./database/initDb.js";
import { errorMiddleware, notFoundMiddleware } from "./middlewares/errorMiddleware.js";
import adminRoutes from "./routes/adminRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import resultRoutes from "./routes/resultRoutes.js";

const app = express();
const allowedOrigins = new Set([
  env.clientUrl,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
]);

app.disable("x-powered-by");
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(origin)) return callback(null, true);
    const error = new Error("Origen no permitido por CORS.");
    error.status = 403;
    return callback(error);
  },
}));
app.use(express.json({ limit: "50kb" }));

app.get("/api/health", (request, response) => {
  response.json({ status: "ok", service: "probabilidad-libro-3d" });
});
app.use("/api/auth", authRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/admin", adminRoutes);
app.use(notFoundMiddleware);
app.use(errorMiddleware);

initializeDatabase()
  .then(() => {
    app.listen(env.port, () => {
      console.log(`API disponible en http://localhost:${env.port}`);
    });
  })
  .catch((error) => {
    console.error("No fue posible iniciar la base de datos:", error);
    process.exit(1);
  });
