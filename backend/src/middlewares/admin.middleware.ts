import { NextFunction, Response } from "express";
import { AuthRequest } from "./auth.middleware";

const admin = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ success: false, message: "Unauthorized" });
    return;
  }

  if (req.user.role !== "admin") {
    res.status(403).json({ success: false, message: "Forbidden: Admins only" });
    return;
  }

  next();
};

export default admin;