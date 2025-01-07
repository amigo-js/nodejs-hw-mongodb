import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import { env } from './utils/env.js';
import router from './routers/index.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import cookieParser from 'cookie-parser';
import { UPLOAD_DIR } from './constants/index.js';
import swaggerUi from 'swagger-ui-express';
import { createRequire } from 'module';

// Используем require для импорта JSON
const require = createRequire(import.meta.url);
const swaggerDocument = require('../docs/swagger.json');

export async function setupServer() {
  try {
    const app = express();
    const PORT = Number(env('PORT', '3000'));

    app.use(express.json());
    app.use(cors());
    app.use(cookieParser());

    app.use(
      pino({
        transport: {
          target: 'pino-pretty',
        },
      }),
    );

    app.get('/', (req, res) => {
      res.json({
        message: 'Hello world',
      });
    });

    // Serve static files for uploads
    app.use('/uploads', express.static(UPLOAD_DIR));

    // Serve Swagger documentation
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    // Main API routes
    app.use(router);

    // Handle 404
    app.use('*', notFoundHandler);

    // General error handler
    app.use(errorHandler);

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}