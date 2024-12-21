// src/controllers/base.controller.ts
import { Response } from 'express';

export abstract class BaseController {
  protected sendSuccess(res: Response, data: any, message = 'Success') {
    res.status(200).json({
      success: true,
      data,
      message
    });
  }

  protected sendCreated(res: Response, data: any, message = 'Created successfully') {
    res.status(201).json({
      success: true,
      data,
      message
    });
  }

  protected sendError(res: Response, message: string, statusCode = 400) {
    res.status(statusCode).json({
      success: false,
      error: { message }
    });
  }
}

// src/controllers/todo.controller.ts
import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import todoService from '../services/todo.service';
import { asyncHandler } from '../middlewares/async.middleware';

export class TodoController extends BaseController {
  getAllTodos = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const todos = await todoService.getAllTodos(page, limit);
    this.sendSuccess(res, todos);
  });

  getTodoById = asyncHandler(async (req: Request, res: Response) => {
    const todo = await todoService.getTodoById(req.params.id);
    if (!todo) {
      return this.sendError(res, 'Todo not found', 404);
    }
    this.sendSuccess(res, todo);
  });

  createTodo = asyncHandler(async (req: Request, res: Response) => {
    const todo = await todoService.createTodo(req.body);
    this.sendCreated(res, todo);
  });

  updateTodo = asyncHandler(async (req: Request, res: Response) => {
    const todo = await todoService.updateTodo(req.params.id, req.body);
    if (!todo) {
      return this.sendError(res, 'Todo not found', 404);
    }
    this.sendSuccess(res, todo, 'Todo updated successfully');
  });

  deleteTodo = asyncHandler(async (req: Request, res: Response) => {
    await todoService.deleteTodo(req.params.id);
    this.sendSuccess(res, null, 'Todo deleted successfully');
  });
}

export default new TodoController();