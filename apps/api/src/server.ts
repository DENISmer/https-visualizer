import path from "node:path";
import { fileURLToPath } from "node:url";

import dotenv from "dotenv";
import { createApp } from "@/app/create-app";

const apiRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
dotenv.config({ path: path.join(apiRoot, ".env") });

const start = async () => {
  const app = await createApp();

  try {
    await app.listen({
      port: 3001,
      host: "0.0.0.0",
    });

    app.log.info("API server started on http://localhost:3001");
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};

start();
