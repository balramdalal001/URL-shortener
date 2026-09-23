import { rateLimit } from 'express-rate-limit';

export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 5, // Block IP after 5 failed/successive attempts per hour
  message: {
    status: 429,
    message: 'Too many login attempts. Please try again in an hour.',
  },
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});
