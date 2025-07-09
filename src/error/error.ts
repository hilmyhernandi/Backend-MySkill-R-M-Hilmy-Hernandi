export class errorResponse extends Error {
  public readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "errorResponse";
    this.status = status;
    Error.captureStackTrace(this, this.constructor);
  }
}
