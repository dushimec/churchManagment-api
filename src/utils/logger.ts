import winston from "winston";
import fs from "fs";
import path from "path";
import { CronJob } from "cron";

const { combine, printf, timestamp } = winston.format;
const timestampFormat = "MMM-DD-YY HH:mm:ss";

export enum LogLevel {
  INFO = "info",
  ERROR = "error",
  WARN = "warn",
  DEBUG = "debug",
}
export interface LogEntry {
  level: LogLevel;
  timestamp: string;
  message: string;
  action?: string;
  userId?: number;
  meta?: Record<string, any>;
  raw?: string; 
}
const logFilePath = path.resolve(process.cwd(), "info.log");

export const logger = winston.createLogger({
  format: combine(
    timestamp({ format: timestampFormat }),
    printf(({ timestamp, level, message, action, userId, meta }) => {
      const structured = JSON.stringify({ action, userId, meta });
      return `${level.toUpperCase()}::${timestamp}: ${message} | ${structured}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: logFilePath, level: "info" }),
  ],
});

function parseTimestamp(ts: string): Date | null {
  const parsed = Date.parse(ts);
  return isNaN(parsed) ? null : new Date(parsed);
}

function readLogFile(): string[] {
  try {
    if (!fs.existsSync(logFilePath)) return [];
    const fileContent = fs.readFileSync(logFilePath, "utf-8");
    return fileContent.split(/\r?\n/).filter(Boolean);
  } catch (err) {
    logger.error("Failed to read log file", { error: err });
    return [];
  }
}

function parseLogLine(line: string) {
  const match = line.match(
    /^(INFO|ERROR|WARN|DEBUG)::([A-Za-z]{3}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}): (.+?) \| (.+)$/
  );
  if (!match) return null;

  const [, level, timestamp, message, structured] = match;
  let action: string | undefined;
  let userId: number | undefined;
  let meta: Record<string, any> | undefined;

  try {
    const parsed = JSON.parse(structured);
    action = parsed.action;
    userId = parsed.userId;
    meta = parsed.meta;
  } catch {
    // fallback to raw
    meta = { raw: structured };
  }

  return { level, timestamp, message, action, userId, meta, raw: line };
}

function filterLogs(logs: any[], filters: any = {}) {
  const {
    search,
    level,
    action,
    userId,
    keywords = [],
    fromDate,
    toDate,
  } = filters;

  const from = fromDate ? new Date(fromDate) : null;
  const to = toDate ? new Date(toDate) : null;

  return logs.filter((log) => {
    const ts = parseTimestamp(log.timestamp);
    if (!ts) return false;

    if (from && ts < from) return false;
    if (to && ts > to) return false;

    if (level && log.level.toLowerCase() !== level.toLowerCase()) return false;
    if (action && log.action !== action) return false;
    if (userId && log.userId !== userId) return false;

    if (keywords.length > 0) {
      const messageLower = log.message.toLowerCase();
      const matched = keywords.some((kw: string) =>
        messageLower.includes(kw.toLowerCase())
      );
      if (!matched) return false;
    }

    if (search) {
      const keyword = search.toLowerCase();
      if (
        !log.message.toLowerCase().includes(keyword) &&
        !(log.meta && Object.values(log.meta).join(" ").toLowerCase().includes(keyword))
      ) {
        return false;
      }
    }

    return true;
  });
}

function paginateLogs(logs: any[], page = 1, limit = 10) {
  const total = logs.length;
  const totalPages = Math.ceil(total / limit);
  const paginatedLogs = logs.slice((page - 1) * limit, page * limit);
  return { paginatedLogs, total, totalPages };
}

export function getLogs(options: {
  search?: string;
  level?: string;
  action?: string;
  userId?: number;
  keywords?: string[];
  fromDate?: string;
  toDate?: string;
  page?: number;
  limit?: number;
}) {
  const allLines = readLogFile();
  if (allLines.length === 0) {
    return { success: false, message: "Log file is empty or missing.", data: [] };
  }

  const parsedLogs = allLines.map(parseLogLine).filter(Boolean);
  const filteredLogs = filterLogs(parsedLogs, options);
  const { paginatedLogs, total, totalPages } = paginateLogs(
    filteredLogs,
    options.page,
    options.limit
  );

  return {
    success: true,
    data: paginatedLogs,
    meta: { total, page: options.page || 1, limit: options.limit || 10, totalPages },
  };
}


export function getPaymentLogs(options: any) {
  const paymentKeywords = [
    "payment",
    "transaction",
    "stripe",
    "card",
    "fee",
    "subscription",
    "refund",
    "charge",
    "booking",
    "tax",
    "plan",
  ];
  return getLogs({ ...options, keywords: paymentKeywords });
}

export function getLogsByAction(options: any) {
  return getLogs(options);
}

export function getErrorLogs(options: any) {
  return getLogs({ ...options, level: "error" });
}


function cleanupOldLogs() {
  logger.info("The logs will be deleted in one month", { action: "log_cleanup_notice" });

  const allLines = readLogFile();
  const now = new Date();
  const oneMonthAgo = new Date(now.getTime() - 31 * 24 * 60 * 60 * 1000);

  const filteredLines = allLines.filter((line) => {
    const parsed = parseLogLine(line);
    if (!parsed) return false;
    const ts = parseTimestamp(parsed.timestamp);
    return ts && ts >= oneMonthAgo;
  });

  try {
    fs.writeFileSync(logFilePath, filteredLines.join("\n") + "\n", "utf-8");
    logger.info("Old logs cleaned up (older than 1 month)", { action: "log_cleanup" });
  } catch (err) {
    logger.error("Failed to clean up old logs", { error: err });
  }
}

let cleanupOldLogsJob: CronJob | null = null;
let lastCleanupCount = 0;

export function initializeLogCleanupJob() {
  if (cleanupOldLogsJob) return cleanupOldLogsJob;

  cleanupOldLogsJob = new CronJob(
    "0 2 * * *", // At 02:00 AM every day
    cleanupOldLogs,
    null,
    false,
    "UTC"
  );
  cleanupOldLogsJob.start();
  logger.info("Logs cleanup cron job initialized and started");

  const updateLastCleanupCount = () => {
    const allLines = readLogFile();
    lastCleanupCount = allLines.length;
  };
  
  cleanupOldLogs();
  updateLastCleanupCount();

  setInterval(() => {
    const allLines = readLogFile();
    if (allLines.length === lastCleanupCount) {
      logger.info("No logs deleted in the last cleanup check", { action: "log_cleanup_check" });
    }
    lastCleanupCount = allLines.length;
  }, 20000);

  return cleanupOldLogsJob;
}
