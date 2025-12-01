import "express-async-errors";
import express, { ErrorRequestHandler } from "express";
import cors from "cors";
import morgan from "morgan";
import { config } from "dotenv";
import routes from "./routes/index.js";

export function createApp() {
  config();

  const app = express();

  const rawOrigins = process.env.CORS_ORIGIN?.split(",")
    .map((s) => s.trim().replace(/['"]/g, "")) // Remove quotes if present
    .filter((s) => s.length > 0);

  console.log("CORS Configuration:", {
    rawEnv: process.env.CORS_ORIGIN,
    parsedOrigins: rawOrigins,
    usingReflect: rawOrigins?.includes("*") || !rawOrigins || rawOrigins.length === 0
  });

  app.use((req, _res, next) => {
    console.log(`Incoming Request: ${req.method} ${req.path} | Origin: ${req.headers.origin}`);
    next();
  });

  app.use(
    cors({
      origin: rawOrigins?.includes("*")
        ? true
        : rawOrigins && rawOrigins.length > 0
        ? rawOrigins
        : true,
      credentials: true,
    })
  );

  app.use(express.json());
  app.use(morgan("dev"));

  app.get("/health", (_req, res) => {
    res.json({
      ok: true,
      service: "crmdesecontro-backend",
      time: new Date().toISOString(),
    });
  });

  app.use("/api/v1", routes);

  app.use((_req, res) => res.status(404).json({ error: "Not Found" }));

  const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
    // eslint-disable-next-line no-console
    console.error(err);
    res.status(500).json({ 
      error: "Internal Server Error", 
      details: err instanceof Error ? err.message : String(err) 
    });
  };
  app.use(errorHandler);

  return app;
}
