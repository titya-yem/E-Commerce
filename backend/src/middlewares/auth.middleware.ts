import dotenv from 'dotenv';
import { NextFunction, Request, Response } from 'express';
import { JwtPayload, verify } from 'jsonwebtoken';

dotenv.config();

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

const auth = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  const { token } = req.cookies;

  if (!token) {
    res.status(401).json({ success: false, message: "Access denied. Unauthorized" });
    return;
  }

  try {
    const decoded = verify(token, process.env.JWT_SECRET as string) as JwtPayload;

    req.user = {
      id: decoded.id as string,
      email: decoded.email as string,
      role: decoded.role as string,
    };

    next();
  } catch (error) {
    console.error("JWT verification error:", error instanceof Error ? error.message : error);
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};

export default auth;