import { logger, initializeLogCleanupJob } from "../utils/logger";


export const initializeCronJobs = () => {
  try {
    logger.info("Starting cron jobs initialization...");

    const logCleanupCron = initializeLogCleanupJob();

    logger.info("All cron jobs initialized successfully");

    return {
      logCleanupCron,
    };
  } catch (error) {
    logger.error("Error initializing cron jobs:", error);
    throw error;
  }
};
