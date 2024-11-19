import { db } from "@/db";
import { transactions, users } from "@/db/schema";
import { verifyJwt } from "@/middlewares/verify-jwt";
import { eq, sql } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

const notificationQueue = [] as string[];

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

      const transactionSuccess = await db.transaction(async (tx) => {
        const payerBalance = Number(payer.balance) - amount;
        const payeeBalance = Number(payee.balance) + amount;

        await tx
          .update(users)
          .set({ balance: String(payerBalance) })
          .where(eq(users.id, payerId));

        await tx
          .update(users)
          .set({ balance: String(payeeBalance) })
          .where(eq(users.id, payeeId));

        const response = await fetch(
          "https://util.devi.tools/api/v2/authorize",
        );

        type ValidationServiceResponse = {
          status: "success" | "fail";
          data: { authorization: boolean };
        };

        const { data, status } =
          (await response.json()) as ValidationServiceResponse;

        if (status === "fail" || data.authorization === false) {
          tx.rollback();
        }

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

        return transaction;
      });

      if (!transactionSuccess) {
        return reply.status(502).send({
          statusCode: 502,
          error: "BadGatewayError",
          message: "Transaction validation is temporally unavailable.",
        });
      }

      const notificationServiceResponse = await fetch(
        "https://util.devi.tools/api/v1/notify",
        {
          method: "POST",
        },
      );

      if (!notificationServiceResponse.ok) {
        notificationQueue.push(notificationServiceResponse.url);
      }

      console.log(notificationQueue);

      return {
        transactionId: transactionSuccess.transactionId,
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
