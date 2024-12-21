// src/controllers/todo.controller.ts
import { Request, Response, NextFunction } from 'express';
import { BaseController } from './base.controller';
import todoService from '../services/todo.service';
import { CreateTodoDTO, UpdateTodoDTO } from '../types/todo.types';
import { NotFoundError } from '../types/error.types';
import logger from '../utils/logger.util';
import { PaginationUtil } from '../utils/pagination.util';

export class TodoController extends BaseController {
    /**
     * @desc    Get all todos with pagination
     * @route   GET /api/v1/todos
     */
    async getAllTodos(req: Request, res: Response, next: NextFunction) {
        try {
            const pagination = PaginationUtil.getParams(req.query);
            logger.info('Getting todos with pagination:', pagination);

            const { todos, total } = await todoService.getAllTodos(pagination);
            
            res.json({
                success: true,
                data: {
                    items: todos,
                    pagination: {
                        total,
                        currentPage: pagination.page,
                        totalPages: Math.ceil(total / pagination.limit),
                        limit: pagination.limit
                    }
                }
            });
        } catch (error) {
            logger.error('Error in getAllTodos controller:', error);
            next(error);
        }
    }

    /**
     * @desc    Get todo by id
     * @route   GET /api/v1/todos/:id
     */
    async getTodoById(req: Request, res: Response, next: NextFunction) {
        try {
            const todo = await todoService.getTodoById(req.params.id);
            if (!todo) {
                throw new NotFoundError('Todo not found');
            }
            
            res.json({
                success: true,
                data: todo
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * @desc    Create new todo
     * @route   POST /api/v1/todos
     */
    async createTodo(req: Request, res: Response, next: NextFunction) {
        try {
            const todoData: CreateTodoDTO = {
                title: req.body.title,
                description: req.body.description
            };

            const createdTodo = await todoService.createTodo(todoData);
            logger.info('Todo created successfully');

            res.status(201).json({
                success: true,
                data: createdTodo
            });
        } catch (error) {
            logger.error('Error creating todo:', error);
            next(error);
        }
    }

    /**
     * @desc    Update todo
     * @route   PUT /api/v1/todos/:id
     */
    async updateTodo(req: Request, res: Response, next: NextFunction) {
        try {
            const todoData: UpdateTodoDTO = {
                title: req.body.title,
                description: req.body.description,
                completed: req.body.completed
            };

            const updatedTodo = await todoService.updateTodo(req.params.id, todoData);
            
            if (!updatedTodo) {
                throw new NotFoundError('Todo not found');
            }

            res.json({
                success: true,
                data: updatedTodo
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * @desc    Delete todo
     * @route   DELETE /api/v1/todos/:id
     */
    async deleteTodo(req: Request, res: Response, next: NextFunction) {
        try {
            await todoService.deleteTodo(req.params.id);
            
            res.json({
                success: true,
                message: 'Todo deleted successfully'
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new TodoController();