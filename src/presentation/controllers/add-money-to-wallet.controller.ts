import { makeAddMoneyToWalletUseCase } from "@/infra/factories/make-add-money-to-wallet";
import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function addMoneyToWalletController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const bodySchema = z.object({
    amount: z.coerce.number().positive(),
  });

  const paramsSchema = z.object({
    walletId: z.string(),
  });

  const body = bodySchema.parse(request.body);
  const params = paramsSchema.parse(request.params);

  const addMoneyToWallet = makeAddMoneyToWalletUseCase();

  await addMoneyToWallet.execute({
    amount: body.amount,
    walletId: params.walletId,
  });

  return reply.status(204).send();
}
