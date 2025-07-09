import "dotenv/config";

export const environments = {
  port: process.env.PORT,
  mode: process.env.NODE_ENV || "development",
  databases: process.env.MONGODB_URI,
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
  jwt: process.env.JWT_SECRET,
  session: process.env.SESSION_SECRET,
};
