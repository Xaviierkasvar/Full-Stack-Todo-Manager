// src/config/database.config.ts
import mysql, { Pool, PoolConnection } from 'mysql2/promise';
import dotenv from 'dotenv';
import logger from '../utils/logger.util';

// Cargar variables de entorno
dotenv.config();

class Database {
  private pool: Pool;
  private static instance: Database;

  private constructor() {
    const dbConfig = {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'todo_app',
      port: parseInt(process.env.DB_PORT || '3307'),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    };

    this.pool = mysql.createPool(dbConfig);

    // Verificar conexión
    this.testConnection();
  }

  private async testConnection() {
    try {
      const connection = await this.pool.getConnection();
      logger.info('Database connection established successfully');
      connection.release();
    } catch (error) {
      logger.error('Error connecting to database:', error);
    }
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async executeQuery<T>(query: string, params?: any[]): Promise<T> {
    try {
      const [results] = await this.pool.execute(query, params);
      return results as T;
    } catch (error) {
      logger.error('Error executing query:', { query, params, error });
      throw error;
    }
  }

  public async getConnection(): Promise<PoolConnection> {
    return await this.pool.getConnection();
  }

  public get rawPool(): Pool {
    return this.pool;
  }
}

// Exportar una instancia única
const db = Database.getInstance();
export default db;