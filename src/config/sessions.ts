import session from "express-session";
import { environments } from "./environment";

const isProduction = environments.mode === "production";

const sessionConfig = session({
  secret: environments.sessionKey!,
  resave: false,
  saveUninitialized: false,
  unset: "keep",
  cookie: {
    httpOnly: true,
    secure: isProduction,
    maxAge: 24 * 60 * 60 * 1000,
  },
});

export default sessionConfig;
