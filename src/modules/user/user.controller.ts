import { RequestHandler } from "express";
import jwt from 'jsonwebtoken';
import { userCreateSchema , userLoginSchema} from "./user.schema";
import { newUser , verifyUser,getUserById,handleBulkUpload} from "./user.service";
import { generateToken, refreshToken,UserPayload } from "../../middleware/auth";

import { env } from "../../config/env";
const JWT_REFRESH_SECRET = env.JWT_REFRESH_SECRET;
const JWT_SECRET = env.JWT_SECRET;

const getCookieValue = (cookieHeader: string | undefined, name: string): string | undefined => {
  if (!cookieHeader) return undefined;

  const cookie = cookieHeader
    .split(";")
    .map((entry) => entry.trim())
    .find((entry) => entry.startsWith(`${name}=`));

  if (!cookie) return undefined;
  return decodeURIComponent(cookie.slice(name.length + 1));
};

export const createUser: RequestHandler = async (req, res, next) => {
  try {
    const input = userCreateSchema.safeParse(req.body);
    if (!input.success) {
      res.status(400).json({ error: input.error.flatten() });
      return;
    }
    const record = await newUser(input.data);
    res.status(201).json(record);
  } catch (error) {
    return next(error);
  }
};

export const loginUser: RequestHandler = async (req, res, next) => {
  try {
    // Validate request structure
    const input = userLoginSchema.safeParse(req.body);
    if (!input.success) {
      res.status(400).json({ error: input.error.flatten() });
      return;
    }

    // Call service to find user and verify credentials
    const user = await verifyUser(input.data);
    
    // Safety check: Use a generic message so attackers don't know 
    // whether the email or the password was incorrect.
    if (!user) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }
    const payload: UserPayload = {
      userId: user.id,
      email: user.email,
      role: 'user',
    };

    const token = generateToken(payload);
    const refresh = refreshToken(payload);
    // Best Practice: Send refresh token via a secure HttpOnly cookie
    res.cookie('refreshToken', refresh, {
      httpOnly: true,
      secure: false, // Requires HTTPS server in production; set to true in production
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Success response
    res.status(200).json({
      message: "Login successful",
      token : token
    });
  } catch (error) {
    return next(error); // Forward database or systemic errors to global middleware
  }
};

export const refresh : RequestHandler = async (req,res,next) => {
  const refreshToken = req?.cookies?.refreshToken;

  if (!refreshToken) {
    res.status(403).json({ message: 'Refresh token invalid or revoked' });
    return;
  }

  try {
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as { userId: string };
    
    // Fetch user details from database using decoded.userId
    const user = await getUserById(decoded?.userId);
    const userPayload: UserPayload = { userId: decoded.userId, email: user.email, role: 'user' };
    
    // Issue a fresh short-lived access token
    const newAccessToken = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '15m' });
    
    res.json({ accessToken: newAccessToken });
  } catch (err) {
    res.status(403).json({ message: 'Refresh token expired' });
  }
}

export const bulkUpload: RequestHandler = async (req, res, next) => {
  try {
    // Assuming the user is authenticated and their ID is available in req.user
    const userId = (req as any).user?.userId; // Type assertion for custom property

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const result = await handleBulkUpload(userId, req?.file);

    res.status(200).json({ message: 'Bulk upload successful', data: result });
  } catch (error) {
    return next(error);
  }
}