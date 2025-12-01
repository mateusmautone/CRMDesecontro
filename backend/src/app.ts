import express, { ErrorRequestHandler } from "express";
import cors from "cors";
import morgan from "morgan";
import { config } from "dotenv";
import routes from "./routes/index.js";

export function createApp() {
  config();

  const app = express();

  const origins = process.env.CORS_ORIGIN?.split(",").map((s) => s.trim());
  app.use(
    cors({
      origin: origins && origins.length > 0 ? origins : "*",
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
    res.status(500).json({ error: "Internal Server Error" });
  };
  app.use(errorHandler);

  return app;
}
