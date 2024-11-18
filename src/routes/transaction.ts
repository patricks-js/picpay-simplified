import { db } from "@/db";
import { transactions, users } from "@/db/schema";
import { verifyJwt } from "@/middlewares/verify-jwt";
import { eq, sql } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

export async function transactionRoutes(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/",
    {
      onRequest: [verifyJwt],
      schema: {
        body: z.object({
          amount: z.number().positive(),
          payerId: z.number().int().positive(),
          payeeId: z.number().int().positive(),
        }),
      },
    },
    async (request, reply) => {
      const { amount, payerId, payeeId } = request.body;

      const [payer] = await db
        .select({
          fullName: sql /*sql*/`first_name || ' ' || surname`,
          balance: users.balance,
          role: users.role,
        })
        .from(users)
        .where(eq(users.id, payerId));

      if (!payer) {
        return reply.status(404).send({
          statusCode: 404,
          error: "NotFoundError",
          message: "Payer not found.",
        });
      }

      const [payee] = await db
        .select({
          fullName: sql /*sql*/`first_name || ' ' || surname`,
          balance: users.balance,
        })
        .from(users)
        .where(eq(users.id, payeeId));

      if (!payee) {
        return reply.status(404).send({
          statusCode: 404,
          error: "NotFoundError",
          message: "Payee not found.",
        });
      }

      if (payer.role === "merchant") {
        return reply.status(403).send({
          statusCode: 403,
          error: "ForbiddenError",
          message: "You are not allowed to perform a transaction.",
        });
      }

      if (Number(payer.balance) < amount) {
        return reply.status(400).send({
          statusCode: 400,
          error: "BadRequestError",
          message: "Balance is insufficient.",
        });
      }

      const extractBalanceFromPayer = Number(payer.balance) - amount;

      await db
        .update(users)
        .set({ balance: String(extractBalanceFromPayer) })
        .where(eq(users.id, payerId));

      const increaseBalanceFromPayee = Number(payee.balance) + amount;

      await db
        .update(users)
        .set({ balance: String(increaseBalanceFromPayee) })
        .where(eq(users.id, payeeId));

      const [transaction] = await db
        .insert(transactions)
        .values({
          amount: String(amount),
          payerId,
          payeeId,
        })
        .returning({
          transactionId: transactions.id,
        });

      return {
        transactionId: transaction?.transactionId,
        payer: {
          id: payerId,
          fullName: payer.fullName,
        },
        payee: {
          id: payeeId,
          fullName: payee.fullName,
        },
      };
    },
  );
}
