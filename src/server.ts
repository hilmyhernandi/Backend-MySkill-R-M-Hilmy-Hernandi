import { web } from "./web";
import { logger } from "./config/logger";
import { environments } from "./config/environment";
import { connectDB } from "./connections/databases";
import { redisConnection } from "./connections/redis";

const port = environments.port;

async function startServer() {
  try {
    await connectDB();
    redisConnection;

    web.listen(port, () => {
      logger.info(`server running on port ${port}`);
    });
  } catch (error) {
    logger.error("failed to start server:", error);
    process.exit(1);
  }
}

startServer();
