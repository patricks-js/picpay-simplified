import type { FastifyInstance } from "fastify";

import { authenticateController } from "@/presentation/controllers/authenticate.controller";
import { registerUserController } from "@/presentation/controllers/register-user.controller";
import { addMoneyToWalletController } from "../controllers/add-money-to-wallet.controller";

export async function routes(app: FastifyInstance) {
  app.post("/users", registerUserController);
  app.post("/sessions", authenticateController);
  app.post("/wallets/:walletId/deposits", addMoneyToWalletController);
  app.post("/wallets/:walletId/transfers", async () => {});
  app.get("/wallets/:walletId/transfers", async () => {});
}
