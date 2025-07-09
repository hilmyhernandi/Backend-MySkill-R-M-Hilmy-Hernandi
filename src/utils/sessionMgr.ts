import { Request } from "express";

export const setSession = (
  req: Request,
  userId: string,
  username: string
): void => {
  req.session.userId = userId;
  req.session.username = username;
};

export const updateSession = (
  req: Request,
  userId?: string,
  username?: string
): void => {
  if (userId) req.session.userId = userId;
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
