// src/services/todo.service.ts
import { v4 as uuidv4 } from 'uuid';
import db from '../config/database.config';
import { Todo, CreateTodoDTO, UpdateTodoDTO } from '../types/todo.types';
import { NotFoundError, DatabaseError } from '../types/error.types';
import logger from '../utils/logger.util';
import { PaginationParams } from '../utils/pagination.util';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

class TodoService {
    async getAllTodos(pagination: PaginationParams): Promise<{ todos: Todo[], total: number }> {
        const connection = await db.rawPool.getConnection();
        
        try {
            // Convertir los parámetros de paginación a números enteros
            const limit = parseInt(String(pagination.limit), 10);
            const page = parseInt(String(pagination.page), 10);
            const offset = (page - 1) * limit;

            logger.info('Query parameters:', { limit, page, offset });

            // Primero obtener el total
            const [countResult] = await connection.query('SELECT COUNT(*) as total FROM todos');
            const total = (countResult as any)[0].total;

            logger.info('Total records:', total);

            // Luego obtener los registros paginados
            const [rows] = await connection.query(
                'SELECT * FROM todos ORDER BY created_at DESC LIMIT ? OFFSET ?',
                [limit, offset]
            );

            logger.info('Records retrieved:', (rows as any[]).length);

            return {
                todos: rows as Todo[],
                total: Number(total)
            };
        } catch (error) {
            logger.error('Database error:', error);
            throw new DatabaseError(
                error instanceof Error 
                    ? error.message 
                    : 'Error retrieving todos from database'
            );
        } finally {
            connection.release();
        }
    }

    async getTodoById(id: string): Promise<Todo | null> {
        const connection = await db.rawPool.getConnection();
        try {
            const [rows] = await connection.query(
                'SELECT * FROM todos WHERE id = ?',
                [id]
            );

            const todos = rows as RowDataPacket[];
            return todos.length > 0 ? todos[0] as Todo : null;
        } catch (error) {
            logger.error(`Error getting todo ${id}:`, error);
            throw new DatabaseError('Error retrieving todo from database');
        } finally {
            connection.release();
        }
    }

    async createTodo(data: CreateTodoDTO): Promise<Todo> {
        const connection = await db.rawPool.getConnection();
        
        try {
            await connection.beginTransaction();

            const todo = {
                id: uuidv4(),
                ...data,
                completed: false,
                created_at: new Date(),
                updated_at: new Date()
            };

            await connection.query(
                'INSERT INTO todos (id, title, description, completed, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
                [todo.id, todo.title, todo.description, todo.completed, todo.created_at, todo.updated_at]
            );

            const [rows] = await connection.query(
                'SELECT * FROM todos WHERE id = ?',
                [todo.id]
            );

            await connection.commit();
            
            const todos = rows as RowDataPacket[];
            if (todos.length === 0) {
                throw new DatabaseError('Todo was not created properly');
            }

            return todos[0] as Todo;
        } catch (error) {
            await connection.rollback();
            logger.error('Error in createTodo:', error);
            throw new DatabaseError('Error creating todo');
        } finally {
            connection.release();
        }
    }

    async updateTodo(id: string, data: UpdateTodoDTO): Promise<Todo | null> {
        const connection = await db.rawPool.getConnection();
        
        try {
            await connection.beginTransaction();

            const updateFields = [];
            const values = [];

            if (data.title !== undefined) {
                updateFields.push('title = ?');
                values.push(data.title);
            }
            if (data.description !== undefined) {
                updateFields.push('description = ?');
                values.push(data.description);
            }
            if (data.completed !== undefined) {
                updateFields.push('completed = ?');
                values.push(data.completed);
            }

            updateFields.push('updated_at = ?');
            values.push(new Date());
            values.push(id);

            await connection.query(
                `UPDATE todos SET ${updateFields.join(', ')} WHERE id = ?`,
                values
            );

            const [rows] = await connection.query(
                'SELECT * FROM todos WHERE id = ?',
                [id]
            );

            await connection.commit();

            const todos = rows as RowDataPacket[];
            return todos.length > 0 ? todos[0] as Todo : null;
        } catch (error) {
            await connection.rollback();
            logger.error(`Error updating todo ${id}:`, error);
            throw new DatabaseError('Error updating todo');
        } finally {
            connection.release();
        }
    }

    async deleteTodo(id: string): Promise<void> {
        const connection = await db.rawPool.getConnection();
        
        try {
            const [result] = await connection.query(
                'DELETE FROM todos WHERE id = ?',
                [id]
            );

            if ((result as ResultSetHeader).affectedRows === 0) {
                throw new NotFoundError(`Todo with id ${id} not found`);
            }
        } catch (error) {
            logger.error(`Error deleting todo ${id}:`, error);
            throw new DatabaseError('Error deleting todo');
        } finally {
            connection.release();
        }
    }
}

export default new TodoService();