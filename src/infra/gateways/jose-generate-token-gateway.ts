import * as jose from "jose";

import type { IGenerateTokenGateway } from "@/application/gateways/generate-token-gateway";
import { AUDIENCE, EXPIRATION_TIME, ISSUER } from "@/config/constants";
import { env } from "@/config/env";

export class JoseGenerateTokenGateway implements IGenerateTokenGateway {
  async execute(payload: Record<string, unknown>): Promise<{ token: string }> {
    const secret = new TextEncoder().encode(env.AUTH_SECRET);
    const protectedHeader = {
      alg: "HS256",
      typ: "JWT",
    };

    const token = await new jose.SignJWT(payload)
      .setProtectedHeader(protectedHeader)
      .setIssuedAt()
      .setIssuer(ISSUER)
      .setAudience(AUDIENCE)
      .setExpirationTime(EXPIRATION_TIME)
      .sign(secret);

    return {
      token,
    };
  }
}
