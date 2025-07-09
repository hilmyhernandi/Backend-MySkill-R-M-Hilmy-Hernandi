import rateLimit, { Options } from "express-rate-limit";
import { RedisStore, RedisReply } from "rate-limit-redis";
import { redisConnection } from "../connections/redis";
import redisService from "../service/redisService";
import { IRedisMessage } from "../interfaces/interfaceRedisMessage";

export class bruteForceProtector {
  private readonly windowMs: number;
  private readonly maxAttempts: number;

  constructor(windowMs = 15 * 60 * 1000, maxAttempts = 3) {
    this.windowMs = windowMs;
    this.maxAttempts = maxAttempts;
  }

  public getMiddleware() {
    return rateLimit({
      store: new RedisStore({
        sendCommand: async (
          command: string,
          ...args: string[]
        ): Promise<RedisReply> => {
          return redisConnection.call(command, ...args) as Promise<RedisReply>;
        },
      }),
      windowMs: this.windowMs,
      max: this.maxAttempts,
      standardHeaders: true,
      legacyHeaders: false,
      message: {
        success: false,
        statusCode: 429,
        message: "Too many login attempts. Please try again later.",
      } satisfies IRedisMessage,
      handler: (_req, res, _next, options: Options) => {
        const msg = options.message as IRedisMessage;
        res.status(msg.statusCode).json(msg);
      },
    });
  }

  public async checkAttempts(email: string): Promise<number> {
    const key = this.getRateLimitKey(email);
    const attempts = await redisService.getRedisValue(key);
    return attempts ? parseInt(attempts, 10) : 0;
  }

  public async trackFailedLogin(email: string): Promise<void> {
    const key = this.getRateLimitKey(email);
    await redisConnection.incr(key);
    await redisConnection.expire(key, this.windowMs / 1000);
  }

  public async resetFailedAttempts(email: string): Promise<void> {
    const key = this.getRateLimitKey(email);
    const attempts = await redisService.getRedisValue(key);
    if (attempts && parseInt(attempts, 10) < this.maxAttempts) {
      await redisService.deleteRedisKey(key);
    }
  }

  private getRateLimitKey(email: string): string {
    return `loginAttempts:${email}`;
  }
}
