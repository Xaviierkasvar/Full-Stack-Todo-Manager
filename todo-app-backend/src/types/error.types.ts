// src/types/error.types.ts
export class AppError extends Error {
    constructor(
      public statusCode: number,
      public status: string,
      message: string
    ) {
      super(message);
      Object.setPrototypeOf(this, AppError.prototype);
    }
  }
  
  export class NotFoundError extends AppError {
    constructor(message: string) {
      super(404, 'Not Found', message);
      Object.setPrototypeOf(this, NotFoundError.prototype);
    }
  }
  
  export class ValidationError extends AppError {
    constructor(message: string, public details?: any) {
      super(400, 'Validation Error', message);
      Object.setPrototypeOf(this, ValidationError.prototype);
    }
  }
  
  export class DatabaseError extends AppError {
    constructor(message: string) {
      super(500, 'Database Error', message);
      Object.setPrototypeOf(this, DatabaseError.prototype);
    }
  }
  
  export class UnauthorizedError extends AppError {
    constructor(message: string = 'Unauthorized access') {
      super(401, 'Unauthorized', message);
      Object.setPrototypeOf(this, UnauthorizedError.prototype);
    }
  }
  
  export class ForbiddenError extends AppError {
    constructor(message: string = 'Forbidden access') {
      super(403, 'Forbidden', message);
      Object.setPrototypeOf(this, ForbiddenError.prototype);
    }
  }
  
  export class ConflictError extends AppError {
    constructor(message: string) {
      super(409, 'Conflict', message);
      Object.setPrototypeOf(this, ConflictError.prototype);
    }
  }
  
  // Tipo para errores con detalles adicionales
  export interface ErrorResponse {
    status: string;
    message: string;
    statusCode: number;
    details?: any;
  }