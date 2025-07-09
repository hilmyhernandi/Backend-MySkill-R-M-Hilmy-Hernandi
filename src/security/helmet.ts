import helmet, { HelmetOptions } from "helmet";
import { environments } from "../config/environment";
const isProduction = environments.mode === "production";

const helmetOptions: HelmetOptions = {
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      "default-src": ["'self'"],
      "script-src": isProduction
        ? ["'self'"]
        : ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      "style-src": isProduction ? ["'self'"] : ["'self'", "'unsafe-inline'"],
      "img-src": ["'self'", "data:"],
      "connect-src": ["'self'"],
      "object-src": ["'none'"],
      "base-uri": ["'self'"],
      "form-action": ["'self'"],
      "frame-ancestors": ["'self'"],
      "upgrade-insecure-requests": [],
    },
  },
  crossOriginEmbedderPolicy: true,
  crossOriginOpenerPolicy: { policy: "same-origin" },
  crossOriginResourcePolicy: { policy: "same-origin" },
  dnsPrefetchControl: { allow: false },
  frameguard: { action: "sameorigin" },
  hsts: isProduction
    ? { maxAge: 63072000, includeSubDomains: true, preload: true }
    : false,
  noSniff: true,
  referrerPolicy: { policy: "no-referrer" },
  hidePoweredBy: true,
  permittedCrossDomainPolicies: { permittedPolicies: "none" },
  originAgentCluster: true,
};

export const HelmetConfig = helmet(helmetOptions);
