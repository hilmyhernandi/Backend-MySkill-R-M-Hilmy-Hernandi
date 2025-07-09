import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { errorResponse } from "../error/error";

export const errorHandlers: ErrorRequestHandler = (
  err,
  _req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof errorResponse) {
    res.status(err.status).json({
      status: "error",
      message: err.message,
    });
    return;
  }

  res.status(500).json({
    status: "error",
    message: "Internal Server Error",
  });
  return;
};
