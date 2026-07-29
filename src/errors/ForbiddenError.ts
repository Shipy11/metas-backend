import AppError from "./AppError";

class ForbiddenError extends AppError {
  constructor(message: string) {
    super(message, 403);
  }
}

export default ForbiddenError;
