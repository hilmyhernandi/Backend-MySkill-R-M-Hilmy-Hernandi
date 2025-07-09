import { CookieOptions } from "express";
import { environments } from "./environment";

const isProduction = environments.mode === "production";

export const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "strict" : "lax",
  maxAge: 1000 * 60 * 60 * 24,
};
