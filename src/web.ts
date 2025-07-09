import express, { Application } from "express";
import cookieParser from "cookie-parser";
import sessionConfig from "./config/sessions";

export const web: Application = express();

web.use(express.json());
web.use(express.urlencoded({ extended: true }));
web.use(sessionConfig);
web.use(cookieParser());
