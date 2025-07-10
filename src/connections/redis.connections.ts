import Redis from "ioredis";
import { environments } from "../config/env.config";
import { logger, loggerRedis } from "../config/logger";

export const redisConnection = new Redis({
  host: environments.redis.host,
  port: environments.redis.port,
  username: environments.redis.username,
  password: environments.redis.password,
  retryStrategy: (times: number) => {
    const delay = Math.min(times * 100, 2000);
    if (times > 10) {
      loggerRedis.error(
        "redis failed to reconnect after multiple attempts. Exiting"
      );
      process.exit(1);
    }
    return delay;
  },
});

redisConnection.on("connect", () => {
  loggerRedis.info("redis Cloud connected successfully");
});

redisConnection.on("close", () => {
  loggerRedis.error("redis connection closed unexpectedly");
  logger.error("critical: Redis connection closed, shutting down server");
  process.exit(1);
});

redisConnection.on("end", () => {
  loggerRedis.error("Redis connection ended");
  logger.error("critical: Redis connection ended, exiting process");
  process.exit(1);
});

redisConnection.on("reconnecting", (delay: number) => {
  loggerRedis.warn(`reconnecting to Redis in ${delay}ms`);
});

redisConnection.on("error", (err: Error) => {
  loggerRedis.error("redis connection error", {
    message: err.message,
    stack: err.stack,
  });
});
