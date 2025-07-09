import mongoose from "mongoose";
import { environments } from "../config/environment";
import { loggerDB } from "../config/logger";

const uriDB = environments.databases;

const mongooseConnectionOptions: mongoose.ConnectOptions = {
  serverSelectionTimeoutMS: 5000,
  maxPoolSize: 10,
};

const maxRetries = 5;
const retryInterval = 5000;

export const connectDB = async () => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await mongoose.connect(uriDB!, mongooseConnectionOptions);
      loggerDB.info("databases connected success");
      return;
    } catch (err) {
      loggerDB.error(
        `databases connection failed (Attempt ${attempt}): ${err}`
      );
      if (attempt < maxRetries) {
        loggerDB.warn(`retry in ${retryInterval / 1000}s`);
        await new Promise((res) => setTimeout(res, retryInterval));
      } else {
        loggerDB.error(`exhausted all ${maxRetries} connection attempts`);
        throw err;
      }
    }
  }
};

mongoose.connection.on("disconnected", () =>
  loggerDB.warn("databases disconnected")
);
mongoose.connection.on("reconnected", () =>
  loggerDB.info("databases reconnected")
);
mongoose.connection.on("error", (err) =>
  loggerDB.error(`databases error: ${err}`)
);
