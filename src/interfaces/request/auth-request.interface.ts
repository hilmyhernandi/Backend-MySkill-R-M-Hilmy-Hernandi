import { Request } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: string | jwt.JwtPayload;
  authSource?: "header" | "cookie" | null;
}
