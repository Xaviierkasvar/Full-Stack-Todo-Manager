// src/services/base.service.ts
import pool from '../config/database.config';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export abstract class BaseService {
  protected tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  protected async findAll(page: number = 1, limit: number = 10) {
    const offset = (page - 1) * limit;
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT * FROM ${this.tableName} LIMIT ? OFFSET ?`,
      [limit, offset]
    );
    return rows;
  }

  protected async findById(id: string) {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT * FROM ${this.tableName} WHERE id = ?`,
      [id]
    );
    return rows[0];
  }

  protected async create(data: any) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map(() => '?').join(', ');

    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO ${this.tableName} (${keys.join(', ')}) VALUES (${placeholders})`,
      values
    );

    return result;
  }

  protected async update(id: string, data: any) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys.map(key => `${key} = ?`).join(', ');

    const [result] = await pool.execute<ResultSetHeader>(
      `UPDATE ${this.tableName} SET ${setClause} WHERE id = ?`,
      [...values, id]
    );

    return result;
  }

  protected async delete(id: string) {
    const [result] = await pool.execute<ResultSetHeader>(
      `DELETE FROM ${this.tableName} WHERE id = ?`,
      [id]
    );
    return result;
  }
}

// src/services/todo.service.ts
import { v4 as uuidv4 } from 'uuid';
import { BaseService } from './base.service';

interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  created_at: Date;
  updated_at: Date;
}

interface CreateTodoDTO {
  title: string;
  description: string;
}

interface UpdateTodoDTO {
  title?: string;
  description?: string;
  completed?: boolean;
}

export class TodoService extends BaseService {
  constructor() {
    super('todos');
  }

  async getAllTodos(page: number = 1, limit: number = 10) {
    return this.findAll(page, limit);
  }

  async getTodoById(id: string) {
    return this.findById(id);
  }

  async createTodo(data: CreateTodoDTO) {
    const todo = {
      id: uuidv4(),
      ...data,
      completed: false,
      created_at: new Date(),
      updated_at: new Date()
    };

    await this.create(todo);
    return todo;
  }

  async updateTodo(id: string, data: UpdateTodoDTO) {
    const updateData = {
      ...data,
      updated_at: new Date()
    };

    await this.update(id, updateData);
    return this.getTodoById(id);
  }

  async deleteTodo(id: string) {
    return this.delete(id);
  }
}

export default new TodoService();