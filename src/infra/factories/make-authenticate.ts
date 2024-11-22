import { AuthenticateUseCase } from "@/application/use-cases/authenticate";
import { JoseGenerateTokenGateway } from "@/infra/gateways/jose-generate-token-gateway";
import { DrizzleUserRepository } from "@/infra/repositories/drizzle/drizzle-user-repository";

export function makeAuthenticateUseCase(): AuthenticateUseCase {
  const userRepository = new DrizzleUserRepository();
  const generateTokenGateway = new JoseGenerateTokenGateway();
  return new AuthenticateUseCase(userRepository, generateTokenGateway);
}
