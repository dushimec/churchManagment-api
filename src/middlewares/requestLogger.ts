import { logger } from "../utils/logger";
import { Request, Response, NextFunction } from "express";

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.info(
    `⚡️[${req.method}] request incoming to endpoint ${req.originalUrl}`
  );
  next();
};
