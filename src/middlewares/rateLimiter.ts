import rateLimit from "express-rate-limit";

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    status: 429,
    success: false,
    message: "Too many login attempts. Please try again later.",
  },
});

export const smsLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, 
  max: 3,
  message: {
    status: 429,
    success: false,
    message: "Too many SMS requests. Please wait before requesting again.",
  },
});