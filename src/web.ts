import express, { Application } from "express";
import cookieParser from "cookie-parser";
import sessionConfig from "./config/sessions.config";
import { helmetConfig } from "./security/helmet";
import { errorHandlers } from "./middlewares/error-handlers.middleware.";
import authRouter from "./router/auth.router";
import usersRouter from "./router/users.router";

export const web: Application = express();

web.use(express.json());
web.use(express.urlencoded({ extended: true }));
web.use(cookieParser());
web.use(sessionConfig);
web.use(helmetConfig);
web.use("/api/auth", authRouter);
web.use("/api/users", usersRouter);
web.use(errorHandlers);
