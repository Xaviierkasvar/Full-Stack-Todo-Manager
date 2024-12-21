// src/config/app.config.ts
import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import { env } from './env.config';

interface SecurityConfig {
  rateLimitWindowMs: number;
  maxRequestsPerWindow: number;
}

interface CorsConfig {
  origin: string | string[];
  credentials: boolean;
}

export class AppConfig {
  private security: SecurityConfig = {
    rateLimitWindowMs: 15 * 60 * 1000, // 15 minutos
    maxRequestsPerWindow: 100
  };

  private corsOptions: CorsConfig = {
    origin: env.NODE_ENV === 'production' 
      ? process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000']
      : '*',
    credentials: true
  };

  configureApp(app: Application): void {
    this.configureBasicMiddleware(app);
    this.configureSecurity(app);
    this.configurePerformance(app);
  }

  private configureBasicMiddleware(app: Application): void {
    // Body parsing
    app.use(express.json({ limit: '10kb' }));
    app.use(express.urlencoded({ extended: true, limit: '10kb' }));

    // Logging
    if (env.NODE_ENV === 'development') {
      app.use(morgan('dev'));
    } else {
      app.use(morgan('combined'));
    }

    // CORS
    app.use(cors(this.corsOptions));

    // Helpful headers
    app.use((req, res, next) => {
      res.setHeader('X-Powered-By', 'Todo API');
      res.setHeader('X-API-Version', '1.0.0');
      next();
    });
  }

  private configureSecurity(app: Application): void {
    // Seguridad básica con helmet
    app.use(helmet());

    // Rate limiting
    const limiter = rateLimit({
      windowMs: this.security.rateLimitWindowMs,
      max: this.security.maxRequestsPerWindow,
      standardHeaders: true,
      legacyHeaders: false,
      message: {
        status: 'error',
        message: 'Too many requests from this IP, please try again later.'
      }
    });

    app.use('/api', limiter);

    // Políticas de seguridad adicionales
    app.use(helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    }));

    app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
    
    // Prevención XSS adicional
    app.use((req, res, next) => {
      res.setHeader('X-XSS-Protection', '1; mode=block');
      next();
    });
  }

  private configurePerformance(app: Application): void {
    // Compresión de respuestas
    app.use(compression());

    // Cache headers
    app.use((req, res, next) => {
      if (req.method === 'GET') {
        res.setHeader('Cache-Control', 'private, max-age=300'); // 5 minutos
      } else {
        res.setHeader('Cache-Control', 'no-store');
      }
      next();
    });
  }

  configureDevelopment(app: Application): void {
    if (env.NODE_ENV === 'development') {
      // Habilitar pretty print de JSON en desarrollo
      app.set('json spaces', 2);

      // Logging adicional en desarrollo
      app.use((req, res, next) => {
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
        next();
      });
    }
  }

  configureErrorHandling(app: Application): void {
    // Manejo de rutas no encontradas
    app.use((req, res) => {
      res.status(404).json({
        status: 'error',
        message: `Route ${req.originalUrl} not found`
      });
    });

    // Manejo de errores global
    app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
      console.error(err.stack);

      res.status(500).json({
        status: 'error',
        message: env.NODE_ENV === 'development' ? err.message : 'Internal server error',
        ...(env.NODE_ENV === 'development' && { stack: err.stack })
      });
    });
  }
}

export const appConfig = new AppConfig();