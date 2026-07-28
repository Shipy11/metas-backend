import AppError from "./AppError";

class UnauthorizedError extends AppError {
  constructor(message: string) {
    super(message, 401);
  }
}

export default UnauthorizedError;
