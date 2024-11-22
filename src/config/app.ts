import fastify from "fastify";

import { userRoutes } from "@/routes/user";
import { errorHandler } from "./error-handler";

export const app = fastify({
  logger: true,
});

app.register(userRoutes, { prefix: "/api/users" });

app.setErrorHandler(errorHandler);
