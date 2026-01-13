import "./types";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import { logger } from "./utils/logger";
import { languagePreference } from "./middlewares/languagePreference";
import { prisma } from "./config/database";
import swaggerRoutes from "./routes/swagger.route";
import { initializeCronJobs } from "./config/cron";
import mainRouter from "./routes";

dotenv.config();
const port = process.env.PORT || 3000;

const app: Express = express();

app.get("/", (_, res) => {
  res.json({ message: "Welcome to the church management API" });
});
app.use(helmet());
app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== "production") {
  initializeCronJobs();
}

app.use(languagePreference);
app.use("/api/v1", mainRouter);
app.use("/api-docs", swaggerRoutes);

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "OK" });
});
app.listen(port, () => {
  logger.info(`🚀 Server running on port ${port}`);
}); 
prisma.$connect().then(() => {
  logger.info("⚡️ Connected to the database");
});

export default app;
