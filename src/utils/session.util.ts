import { Request } from "express";
import { errorResponse } from "../error/error";

export const setSession = (
  req: Request,
  userId: string,
  username: string
): void => {
  req.session.usersId = userId;
  req.session.username = username;
};

export const updateSession = (
  req: Request,
  usersId?: string,
  username?: string
): void => {
  if (usersId) req.session.usersId = usersId;
  if (username) req.session.username = username;
};

export const destroySession = (req: Request): Promise<void> => {
  return new Promise((resolve, reject) => {
    req.session.destroy((err) => {
      if (err) return reject(err);
      resolve();
    });
  });
};

export const getSessionUserId = (req: Request): string => {
  const userId = req.session?.usersId;
  if (!userId) {
    throw new errorResponse(
      "access denied, user is not logged in or session has expired",
      401
    );
  }
  return userId;
};
