// src/config/env.config.ts
import dotenv from 'dotenv';

dotenv.config();

export const config = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Database configuration
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_USER: process.env.DB_USER || 'root',
  DB_PASSWORD: process.env.DB_PASSWORD || '',
  DB_NAME: process.env.DB_NAME || 'todo_app',
  DB_PORT: parseInt(process.env.DB_PORT || '3306'),
};

// src/config/database.config.ts
import mysql from 'mysql2/promise';
import { config } from './env.config';

const pool = mysql.createPool({
  host: config.DB_HOST,
  user: config.DB_USER,
  password: config.DB_PASSWORD,
  database: config.DB_NAME,
  port: config.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;

// src/config/app.config.ts
import express from 'express';
import cors from 'cors';

export const configureMiddlewares = (app: express.Application) => {
  // CORS configuration
  app.use(cors());
  
  // Body parser
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  
  // Security headers
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
  });
};