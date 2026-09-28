// auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from "../config/env";

export interface UserPayload {
  userId: string;
  email: string;
  role: 'admin' | 'user';
}

const JWT_SECRET = env.JWT_SECRET;
const JWT_REFRESH_SECRET = env.JWT_REFRESH_SECRET;

// Extend Express Request interface to include the user payload globally
declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

// 1. Helper to generate a token
export const generateToken = (payload: UserPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
};

// 2. Middleware to authenticate requests
export const authenticateJWT = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Authorization token missing or malformed' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify token and cast the decoded object to our custom UserPayload interface
    const decoded = jwt.verify(token, JWT_SECRET) as UserPayload;
    
    // Attach the user data to the request object for downstream routes to use
    req.user = decoded; 
    next();
  } catch (error) {
    res.status(403).json({ message: 'Invalid or expired token' });
  }
};

// 1. Helper to refresh a token
export const refreshToken = (payload: UserPayload): string => {
  return jwt.sign({ userId: payload.userId }, JWT_REFRESH_SECRET, { expiresIn: '7 days' });
};
