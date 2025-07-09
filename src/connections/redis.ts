import Redis from "ioredis";
import { environments } from "../config/environment";
import { logger, loggerRedis } from "../config/logger";

export const redisConnection = new Redis({
  host: environments.redis.host,
  port: Number(environments.redis.port),
  retryStrategy: (times: number) => {
    const delay = Math.min(times * 100, 2000);
    if (times > 10) {
      loggerRedis.error(
        "Redis failed to reconnect after multiple attempts. Exiting"
      );
      process.exit(1);
    }
    return delay;
  },
});

redisConnection.on("connect", () => {
  loggerRedis.info("redis connected success");
});

redisConnection.on("close", () => {
  loggerRedis.error("redis connection closed unexpectedly");
  logger.error("Critical: redis connection closed, shutting down server");
  process.exit(1);
});

redisConnection.on("end", () => {
  loggerRedis.error("redis connection ended");
  logger.error("Critical: redis connection ended, exiting process");
  process.exit(1);
});

redisConnection.on("reconnecting", (delay: number) => {
  loggerRedis.warn(`Attempting to reconnect to redis in ${delay}ms`);
});

redisConnection.on("error", (err: Error) => {
  loggerRedis.error("redis connection error", {
    message: err.message,
    stack: err.stack,
  });
});
