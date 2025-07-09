import { Response, NextFunction } from "express";
import { AuthRequest } from "../interfaces/request/auth-request.interface";
import { jwtOptions } from "../security/jwt-manager";
import { errorResponse } from "../error/error";

export const jwtMiddleware = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) => {
  try {
    let token: string | undefined;
    let source: "header" | "cookie" | null = null;

    const authHeader = req.headers.authorization;

    if (authHeader) {
      token = authHeader.split(" ")[1];
      source = "header";
    }

    if (req.cookies?.token) {
      token = req.cookies.token;
      source = "cookie";
    }

    if (!token) {
      throw new errorResponse("Forbidden: No token provided", 403);
    }
    const decoded = jwtOptions.verifyToken(token);

    req.user = decoded;
    req.authSource = source;

    next();
  } catch (error) {
    throw new errorResponse("Forbidden: Invalid token", 403);
  }
};
