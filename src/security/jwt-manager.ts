import jwt from "jsonwebtoken";
import { errorResponse } from "../error/error";
import { IJwtPayload } from "../interfaces/auth/jwt-auth.interface";
import { environments } from "../config/env.config";

class jwtManager {
  private readonly secret: string;
  private readonly expiresIn: number;

  constructor(
    secret: string = environments.mode!,
    expiresIn: number = 60 * 60 * 24
  ) {
    this.secret = secret;
    this.expiresIn = expiresIn;
  }

  generateToken(payload: IJwtPayload): string {
    return jwt.sign(payload, this.secret, {
      expiresIn: this.expiresIn,
    });
  }

  verifyToken(token: string): IJwtPayload {
    try {
      const decoded = jwt.verify(token, this.secret);
      if (typeof decoded === "string") {
        throw new errorResponse("invalid token payload", 401);
      }
      return decoded as IJwtPayload;
    } catch (err) {
      throw new errorResponse("invalid or expired token", 401);
    }
  }
}

export const jwtOptions = new jwtManager();
