import "dotenv/config";

export const environments = {
  port: process.env.PORT,
  mode: process.env.NODE_ENV || "development",
  databases: process.env.MONGODB_URI,
  redis: {
    host: process.env.REDIS_HOST!,
    port: parseInt(process.env.REDIS_PORT || "6379"),
    username: process.env.REDIS_USERNAME!,
    password: process.env.REDIS_PASSWORD!,
  },
  jwt: process.env.JWT_SECRET,
  sessionKey: process.env.SESSIONS_SECRET,
};
