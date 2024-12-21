// src/app.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/env.config';
import todoRoutes from './routes/todo.routes';
import { errorHandler } from './middlewares/error.middleware';

const app = express();

// Middlewares
app.use(cors({
  origin: '*', // En producción, especifica los orígenes permitidos
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Configuración de Helmet más permisiva para desarrollo
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginOpenerPolicy: { policy: "unsafe-none" }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/v1/todos', todoRoutes);

// Error Handling
app.use(errorHandler);

// Start server
const PORT = config.PORT || 3000;

// Modificar el listen para aceptar conexiones de cualquier interfaz
app.listen(PORT, '0.0.0.0', () => {
  // Muestra la IP local para facilitar la conexión
  const networkInterfaces = require('os').networkInterfaces();
  const addresses = [];
  for (const k of Object.keys(networkInterfaces)) {
      for (const k2 of networkInterfaces[k]) {
          if (k2.family === 'IPv4' && !k2.internal) {
              addresses.push(k2.address);
          }
      }
  }
  
  console.log(`Server is running on port ${PORT}`);
  console.log('Available on:');
  addresses.forEach(addr => {
      console.log(`http://${addr}:${PORT}/api/v1/todos`);
  });
});

export default app;