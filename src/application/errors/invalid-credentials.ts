export class InvalidCredentialsError extends Error {
  constructor() {
    super("Invalid credentials! Try again.");
    this.name = "InvalidCredentialsError";
  }
}
