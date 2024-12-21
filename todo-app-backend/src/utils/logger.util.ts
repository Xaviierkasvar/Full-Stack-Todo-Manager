// src/utils/logger.util.ts
import winston from 'winston';
import { config } from '../config/env.config';

// Define los niveles de log
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define colores para cada nivel
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

// Añade colores a winston
winston.addColors(colors);

// Define el formato para los logs
const format = winston.format.combine(
  // Añade timestamp
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  // Colorea el texto
  winston.format.colorize({ all: true }),
  // Define el formato del mensaje
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`,
  ),
);

// Define los transportes para los logs
const transports = [
  // Escribe todos los logs en console.log
  new winston.transports.Console(),
  // Escribe todos los logs de error en error.log
  new winston.transports.File({
    filename: 'logs/error.log',
    level: 'error',
  }),
  // Escribe todos los logs en combined.log
  new winston.transports.File({ filename: 'logs/combined.log' }),
];

// Crea el logger
const logger = winston.createLogger({
  level: config.NODE_ENV === 'development' ? 'debug' : 'warn',
  levels,
  format,
  transports,
});

export default logger;