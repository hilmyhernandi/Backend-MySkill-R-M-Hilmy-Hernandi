import { redisConnection } from "../connections/redis.connections";

const setRedisValue = (key: string, value: unknown, ttl: number) => {
  const stringValue = JSON.stringify(value);
  return redisConnection.set(key, stringValue, "EX", ttl);
};

const getRedisValue = async (key: string) => {
  return await redisConnection.get(key);
};

const updateRedisValues = async (
  key: string,
  updates: Record<string, unknown>
) => {
  const data = await getRedisValue(key);
  if (!data) return null;

  const ttl = await redisConnection.ttl(key);
  const updated = { ...JSON.parse(data), ...updates };
  const stringified = JSON.stringify(updated);

  return ttl > 0
    ? redisConnection.set(key, stringified, "EX", ttl)
    : redisConnection.set(key, stringified);
};

const deleteRedisKey = async (key: string) => {
  return await redisConnection.del(key);
};

export default {
  setRedisValue,
  getRedisValue,
  updateRedisValues,
  deleteRedisKey,
};
