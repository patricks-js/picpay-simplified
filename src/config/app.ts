import fastify from "fastify";

import { errorHandler } from "@/config/error-handler";
import { routes } from "@/presentation/routes";

export const app = fastify({
  logger: true,
});

app.register(routes, { prefix: "/api" });

app.setErrorHandler(errorHandler);
