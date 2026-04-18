import type { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import { config } from '../config.js';

export async function registerCors(app: FastifyInstance) {
  const allowedOrigins = new Set(config.corsOrigins);

  await app.register(cors, {
    origin: (origin, callback) => {
      if (!origin) {
        callback(null, true);
        return;
      }

      if (config.nodeEnv !== 'production') {
        callback(null, true);
        return;
      }

      callback(null, allowedOrigins.has(origin));
    },
    credentials: true,
  });
}
