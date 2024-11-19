export interface IGenerateTokenGateway {
  execute(payload: Record<string, unknown>): Promise<{ token: string }>;
}
