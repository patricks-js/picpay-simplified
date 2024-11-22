import { authenticateController } from "@/presentation/controllers/authenticate.controller";
import { registerUserController } from "@/presentation/controllers/register-user.controller";
import type { FastifyInstance } from "fastify";

export async function userRoutes(app: FastifyInstance) {
  app.post("/register", registerUserController);
  app.post("/authenticate", authenticateController);
}
