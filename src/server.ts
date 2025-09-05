import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import { logger } from "./utils/logger";
import { languagePreference } from "./middlewares/languagePreference";
import { prisma } from "./config/database";
import { initializeCronJobs } from "./config/cron";
import { Server } from "socket.io";
import http from "http";
// Load environment variables
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT;
const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});



// Middlewares
app.use(helmet());
app.use(
  cors({
    origin: "*",
    // This will be set in production
    // origin: [
    //   process.env.FRONTEND_URL,
    //   "http://localhost:3000", // web
    //   "exp://127.0.0.1:19000", // Expo Go (React Native)
    //   "yourapp://callback"
    //   // add more as needed
    // ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

// Webhooks routes 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


initializeCronJobs();

// Routes
app.use(languagePreference);

// Health check endpoint
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "OK" });
});

io.on("connection", (socket) => {
  logger.info(`🚀 Client connected: ${socket.id}`);

  socket.on("disconnect", () => {
    logger.info(`🚫 Client disconnected: ${socket.id}`);
  });
});


prisma.$connect().then(() => {
  logger.info("⚡️ Connected to the database");
  server.listen(PORT, () => {
    logger.info(`⚡️[server]: Server is running at http://localhost:${PORT}`);
    logger.info(
      `📚 API Documentation available at http://localhost:${PORT}/api-docs`
    );
  });
});
