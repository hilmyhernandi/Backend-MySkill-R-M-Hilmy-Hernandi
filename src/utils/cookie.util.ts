import { Response, Request } from "express";
import { cookieOptions } from "../config/cookie.config";

export const setCookie = (
  res: Response,
  name: string,
  value: string,
  options = cookieOptions
) => {
  res.cookie(name, value, options);
};

export const getCookie = (req: Request, name: string): string | undefined => {
  return req.cookies?.[name];
};

export const clearCookie = (
  res: Response,
  name: string,
  options = cookieOptions
) => {
  res.clearCookie(name, options);
};
