export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public cause?: unknown,
  ) {
    super(message);
    this.name = "AppError";
  }
}
