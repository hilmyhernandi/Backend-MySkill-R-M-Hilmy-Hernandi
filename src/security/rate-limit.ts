import rateLimit, {
  RateLimitRequestHandler,
  Options,
} from "express-rate-limit";
import { RedisStore, RedisReply } from "rate-limit-redis";
import { redisConnection } from "../connections/redis.connections";
import { IRedisMessage } from "../interfaces/messages/redis-message.interface";
import { loggerRedis } from "../config/logger";
import { Request, Response, NextFunction } from "express";

export class rateLimiter {
  private readonly windowMs: number;
  private readonly maxRequests: number;

  constructor(windowMs = 60 * 60 * 1000, maxRequests = 3) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
  }

  public getMiddleware(): RateLimitRequestHandler {
    return rateLimit({
      store: new RedisStore({
        sendCommand: async (
          command: string,
          ...args: string[]
        ): Promise<RedisReply> => {
          try {
            const result = await redisConnection.call(command, ...args);
            return result as RedisReply;
          } catch (error) {
            loggerRedis.error("Redis sendCommand error in rateLimiter", {
              message: (error as Error).message,
              stack: (error as Error).stack,
              command,
              args,
            });
            throw error;
          }
        },
      }),
      windowMs: this.windowMs,
      max: this.maxRequests,
      standardHeaders: true,
      legacyHeaders: false,
      message: {
        success: false,
        statusCode: 429,
        message: "too many requests, please try again later",
      } satisfies IRedisMessage,
      handler: (
        req: Request,
        res: Response,
        _next: NextFunction,
        optionsUsed: Options
      ) => {
        const customMessage = optionsUsed.message as IRedisMessage;
        loggerRedis.warn(`rate limit exceeded for IP: ${req.ip}`);
        res.status(customMessage.statusCode).json(customMessage);
      },
    });
  }
}
