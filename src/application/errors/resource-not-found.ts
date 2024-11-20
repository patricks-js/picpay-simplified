export class ResourceNotFoundError extends Error {
  constructor(resource?: string) {
    super(resource ? `Resource Not Found: ${resource}` : "Resource Not Found");
    this.name = "ResourceNotFoundError";
  }
}
