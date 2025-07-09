import { web } from "./web";
import { logger } from "./config/logger";
import { environments } from "./config/environment";

const port = environments.port;

async function startServer() {
  try {
    web.listen(port, () => {
      logger.info(`server running on port ${port}`);
    });
  } catch (error) {
    logger.error("failed to start server:", error);
    process.exit(1);
  }
}

startServer();
