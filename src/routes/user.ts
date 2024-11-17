import { db } from "@/db";
import { users } from "@/db/schema";
import bcrypt from "bcryptjs";
import { eq, or } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

export async function userRoutes(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/register",
    {
      schema: {
        body: z.object({
          firstName: z.string(),
          surname: z.string(),
          email: z.string().email(),
          document: z.string().min(11).max(14),
          password: z.string(),
          role: z.enum(["customer", "merchant"]),
        }),
      },
    },
    async (request, reply) => {
      const { firstName, surname, email, document, password, role } =
        request.body;

      const [userAlreadyExists] = await db
        .select({ id: users.id })
        .from(users)
        .where(or(eq(users.email, email), eq(users.document, document)));

      if (userAlreadyExists) {
        return reply.status(409).send({
          statusCode: 409,
          error: "UserAlreadyExistsError",
          message: "User already exists.",
        });
      }

      const passwordHash = await bcrypt.hash(password, 7);

      const [user] = await db
        .insert(users)
        .values({
          firstName,
          surname,
          email,
          document,
          passwordHash,
          role,
        })
        .returning({
          id: users.id,
          createdAt: users.createdAt,
        });

      if (!user) {
        return reply.status(500).send({
          statusCode: 500,
          error: "ServerError",
          message: "Something went wrong.",
        });
      }

      return reply.status(201).send({ user });
    },
  );
}
