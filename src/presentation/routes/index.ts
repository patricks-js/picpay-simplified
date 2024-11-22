import type { FastifyInstance } from "fastify";

import { authenticateController } from "@/presentation/controllers/authenticate.controller";
import { registerUserController } from "@/presentation/controllers/register-user.controller";

export async function routes(app: FastifyInstance) {
  app.post("/users", registerUserController);
  app.post("/sessions", authenticateController);
  app.post("/wallets/:walletId/transfers", async () => {});
  app.post("/wallets/:walletId/deposits", async () => {});
  app.get("/wallets/:walletId/transfers", async () => {});
}
