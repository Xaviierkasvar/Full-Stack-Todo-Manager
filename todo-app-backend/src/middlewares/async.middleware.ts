// src/middlewares/async.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../types/error.types';
import logger from '../utils/logger.util';

type AsyncFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

interface ErrorWithStatus extends Error {
  status?: number;
  statusCode?: number;
}

/**
 * Middleware para manejar funciones asíncronas en Express
 * Captura errores y los pasa al manejador de errores
 * 
 * @param fn Función asíncrona a ejecutar
 * @returns Middleware de Express
 */
export const asyncHandler = (fn: AsyncFunction) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next))
      .catch((error: ErrorWithStatus) => {
        // Log del error
        logger.error('Error en operación asíncrona:', {
          error: error.message,
          stack: error.stack,
          path: req.path,
          method: req.method
        });

        // Si es un error personalizado, mantener su estado
        if (error instanceof AppError) {
          return next(error);
        }

        // Para errores de base de datos u otros, crear un error genérico
        const genericError = new AppError(
          500,
          'Internal Server Error',
          'Ocurrió un error procesando su solicitud'
        );

        next(genericError);
      });
  };
};

/**
 * Decorador para manejar funciones asíncronas en clases
 * 
 * @example
 * class TodoController {
 *   @AsyncRoute
 *   async getAllTodos(req: Request, res: Response) {
 *     // ... código asíncrono
 *   }
 * }
 */
export function AsyncRoute(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;

  descriptor.value = function (...args: any[]) {
    return Promise.resolve(originalMethod.apply(this, args)).catch((error: Error) => {
      const [req, res, next] = args;
      
      logger.error(`Error en ${propertyKey}:`, {
        error: error.message,
        stack: error.stack,
        path: req.path,
        method: req.method
      });

      if (next) {
        if (error instanceof AppError) {
          next(error);
        } else {
          next(new AppError(500, 'Internal Server Error', 'Ocurrió un error procesando su solicitud'));
        }
      }
    });
  };

  return descriptor;
}

/**
 * Higher-order function para reintentar operaciones asíncronas
 * 
 * @param fn Función a reintentar
 * @param retries Número de reintentos
 * @param delay Delay entre reintentos en ms
 * @returns Función con reintentos
 */
export const withRetry = (
  fn: AsyncFunction,
  retries: number = 3,
  delay: number = 1000
): AsyncFunction => {
  return async (req: Request, res: Response, next: NextFunction) => {
    let lastError: Error;
    
    for (let i = 0; i < retries; i++) {
      try {
        return await fn(req, res, next);
      } catch (error: any) {
        lastError = error;
        
        logger.warn(`Intento ${i + 1} fallido:`, {
          error: error.message,
          path: req.path,
          method: req.method
        });

        if (i < retries - 1) {
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    // Si llegamos aquí, todos los intentos fallaron
    throw lastError!;
  };
};

/**
 * Middleware para timeout en operaciones asíncronas
 * 
 * @param timeout Tiempo máximo en ms
 * @returns Middleware de Express
 */
export const timeoutHandler = (timeout: number = 5000) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const timeoutId = setTimeout(() => {
      const error = new AppError(
        408,
        'Request Timeout',
        'La operación excedió el tiempo máximo permitido'
      );
      
      logger.error('Operación timeout:', {
        path: req.path,
        method: req.method,
        timeout
      });

      next(error);
    }, timeout);

    res.on('finish', () => {
      clearTimeout(timeoutId);
    });

    next();
  };
};