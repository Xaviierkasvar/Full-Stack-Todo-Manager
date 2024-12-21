// src/types/common.types.ts
export interface PaginationParams {
    page: number;
    limit: number;
  }
  
  export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
      total: number;
      totalPages: number;
      currentPage: number;
      limit: number;
    };
  }
  
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
    }
  }
  
  export class ValidationError extends AppError {
    constructor(message: string) {
      super(400, 'Validation Error', message);
    }
  }
  
  // src/utils/response.util.ts
  export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: {
      message: string;
      code?: string;
      details?: any;
    };
    metadata?: Record<string, any>;
  }
  
  export class ResponseBuilder {
    static success<T>(
      data: T, 
      metadata?: Record<string, any>
    ): ApiResponse<T> {
      return {
        success: true,
        data,
        metadata
      };
    }
  
    static error(
      message: string,
      code?: string,
      details?: any
    ): ApiResponse<null> {
      return {
        success: false,
        error: {
          message,
          code,
          details
        }
      };
    }
  }
  
  // src/utils/logger.util.ts
  import winston from 'winston';
  
  const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    transports: [
      new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
      new winston.transports.File({ filename: 'logs/combined.log' })
    ]
  });
  
  if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }));
  }
  
  export default logger;
  
  // src/utils/pagination.util.ts
  import { PaginationParams } from '../types/common.types';
  
  export class PaginationUtil {
    static getParams(query: any): PaginationParams {
      const page = Math.max(1, parseInt(query.page) || 1);
      const limit = Math.max(1, Math.min(100, parseInt(query.limit) || 10));
      
      return { page, limit };
    }
  
    static getOffset({ page, limit }: PaginationParams): number {
      return (page - 1) * limit;
    }
  
    static getTotalPages(total: number, limit: number): number {
      return Math.ceil(total / limit);
    }
  }