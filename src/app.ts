import fastify from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { transactionRoutes } from "./routes/transaction";
import { userRoutes } from "./routes/user";

export const app = fastify({
  logger: true,
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(userRoutes, { prefix: "/api/users" });
app.register(transactionRoutes, { prefix: "/api/transactions" });
