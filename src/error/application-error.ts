export class ApplicationError extends Error {
  statusCode: number;
  methodName: string;
  errorMessage: string;
  
  constructor(
    statusCode: number,
    message: string,
    methodName?: string
  ) {
    super();
    this.statusCode = statusCode;
    this.errorMessage = message;
    this.methodName = methodName
  }
}
