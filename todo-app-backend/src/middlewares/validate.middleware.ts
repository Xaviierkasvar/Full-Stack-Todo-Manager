// src/middlewares/validate.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { ValidationError } from '../types/error.types';
import logger from '../utils/logger.util';

interface ValidationConfig {
  /**
   * Si es true, valida que solo existan en el request los campos definidos en el schema
   */
  strict?: boolean;
  /**
   * Si es true, remueve campos no definidos en el schema en lugar de lanzar error
   */
  strip?: boolean;
}

export const validate = (schema: AnyZodObject, config: ValidationConfig = {}) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dataToValidate = {
        body: req.body,
        query: req.query,
        params: req.params
      };

      // Aplicar configuración de validación
      if (config.strict) {
        schema = schema.strict();
      }
      if (config.strip) {
        schema = schema.strip();
      }

      // Realizar la validación
      const validatedData = await schema.parseAsync(dataToValidate);

      // Actualizar el request con los datos validados y transformados
      req.body = validatedData.body;
      req.query = validatedData.query;
      req.params = validatedData.params;

      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Formatear errores de Zod en un formato más amigable
        const validationErrors = formatZodError(error);
        
        logger.warn('Validation error:', {
          errors: validationErrors,
          path: req.path,
          body: req.body
        });

        return next(new ValidationError('Validation failed', validationErrors));
      }

      return next(error);
    }
  };
};

// Función para formatear errores de Zod
const formatZodError = (error: ZodError) => {
  return error.errors.map(err => ({
    field: err.path.join('.'),
    message: err.message,
    code: err.code
  }));
};

// Custom validators reutilizables
export const customValidators = {
  isValidDate: (value: any): boolean => {
    const date = new Date(value);
    return date instanceof Date && !isNaN(date.getTime());
  },

  isValidUUID: (value: string): boolean => {
    const uuidRegex = 
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(value);
  },

  isValidTimeZone: (value: string): boolean => {
    try {
      Intl.DateTimeFormat(undefined, { timeZone: value });
      return true;
    } catch (error) {
      return false;
    }
  },

  isStrongPassword: (value: string): boolean => {
    // Mínimo 8 caracteres, al menos una mayúscula, una minúscula, un número y un carácter especial
    const strongPasswordRegex = 
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(value);
  }
};

// Schema de ejemplo para TODO
import { z } from 'zod';

export const todoSchema = {
  create: z.object({
    body: z.object({
      title: z.string()
        .min(1, 'Title is required')
        .max(100, 'Title must be less than 100 characters'),
      description: z.string()
        .min(1, 'Description is required')
        .max(500, 'Description must be less than 500 characters'),
      dueDate: z.string()
        .refine(customValidators.isValidDate, {
          message: 'Invalid date format'
        })
        .optional(),
      priority: z.enum(['low', 'medium', 'high'])
        .optional()
        .default('medium')
    })
  }),

  update: z.object({
    params: z.object({
      id: z.string().refine(customValidators.isValidUUID, {
        message: 'Invalid todo ID format'
      })
    }),
    body: z.object({
      title: z.string()
        .min(1, 'Title is required')
        .max(100, 'Title must be less than 100 characters')
        .optional(),
      description: z.string()
        .min(1, 'Description is required')
        .max(500, 'Description must be less than 500 characters')
        .optional(),
      completed: z.boolean().optional(),
      dueDate: z.string()
        .refine(customValidators.isValidDate, {
          message: 'Invalid date format'
        })
        .optional(),
      priority: z.enum(['low', 'medium', 'high']).optional()
    })
  }),

  pagination: z.object({
    query: z.object({
      page: z.string()
        .transform(Number)
        .refine(n => n > 0, 'Page must be greater than 0')
        .optional()
        .default('1'),
      limit: z.string()
        .transform(Number)
        .refine(n => n > 0 && n <= 100, 'Limit must be between 1 and 100')
        .optional()
        .default('10'),
      sortBy: z.enum(['title', 'createdAt', 'priority', 'dueDate'])
        .optional()
        .default('createdAt'),
      order: z.enum(['asc', 'desc'])
        .optional()
        .default('desc')
    })
  })
};

// Ejemplo de uso:
/*
router.post('/todos', 
  validate(todoSchema.create, { strict: true }), 
  todoController.createTodo
);

router.put('/todos/:id', 
  validate(todoSchema.update), 
  todoController.updateTodo
);

router.get('/todos', 
  validate(todoSchema.pagination), 
  todoController.getAllTodos
);
*/