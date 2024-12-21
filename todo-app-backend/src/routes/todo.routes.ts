// src/routes/todo.routes.ts
import { Router } from 'express';
import todoController from '../controllers/todo.controller';
import { asyncHandler } from '../middlewares/async.middleware';

const router = Router();

router.get('/', asyncHandler(todoController.getAllTodos));
router.get('/:id', asyncHandler(todoController.getTodoById));
router.post('/', asyncHandler(todoController.createTodo));
router.put('/:id', asyncHandler(todoController.updateTodo));
router.delete('/:id', asyncHandler(todoController.deleteTodo));

export default router;