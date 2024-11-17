import { app } from "./app";

try {
  await app.listen({port: 3333, host: "0.0.0.0"})
} catch (error) {
  console.error(error);
  process.exit(1)
}