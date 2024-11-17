import fastify from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { userRoutes } from "./routes/user";

export const app = fastify({
  logger: true,
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(userRoutes, { prefix: "/api/users" });
