import fastify from "fastify";

import { errorHandler } from "@/config/error-handler";
import { userRoutes } from "@/presentation/routes/user";

export const app = fastify({
  logger: true,
});

app.register(userRoutes, { prefix: "/api/users" });

app.setErrorHandler(errorHandler);
