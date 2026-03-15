import { createApp } from "@/app/create-app";

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
