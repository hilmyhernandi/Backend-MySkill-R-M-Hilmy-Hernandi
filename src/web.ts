import express, { Application } from "express";
export const web: Application = express();

web.use(express.json());
web.use(express.urlencoded({ extended: true }));
