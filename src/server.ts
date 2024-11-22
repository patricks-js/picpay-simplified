import { app } from "@/config/app";
import { env } from "@/config/env";

const port = env.PORT;
const host = env.HOST;

try {
  await app.listen({ port, host });
} catch (error) {
  console.error(error);
  process.exit(1);
}
