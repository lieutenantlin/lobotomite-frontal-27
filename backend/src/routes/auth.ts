import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { UserRole } from '@prisma/client';
import * as authService from '../services/authService.js';
import { authenticate } from '../middleware/authenticate.js';
import * as audit from '../services/auditService.js';

const registerBody = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
  role: z.nativeEnum(UserRole).optional(),
});

const loginBody = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function authRoutes(app: FastifyInstance) {
  app.post('/auth/register', async (request, reply) => {
    const body = registerBody.safeParse(request.body);
    if (!body.success) return reply.status(400).send({ error: 'Validation failed', details: body.error.flatten() });

    try {
      const user = await authService.registerUser(body.data.email, body.data.password, body.data.name, body.data.role);
      const token = authService.generateToken(user);
      audit.log(user.id, 'user.register', 'user', user.id);
      return reply.status(201).send({ user, token });
    } catch (err) {
      const e = err as NodeJS.ErrnoException;
      if (e.code === 'EMAIL_TAKEN') return reply.status(409).send({ error: 'Email already in use' });
      throw err;
    }
  });

  app.post('/auth/login', async (request, reply) => {
    const body = loginBody.safeParse(request.body);
    if (!body.success) return reply.status(400).send({ error: 'Validation failed', details: body.error.flatten() });

    try {
      const user = await authService.loginUser(body.data.email, body.data.password);
      const token = authService.generateToken(user);
      audit.log(user.id, 'user.login', 'user', user.id);
      return reply.send({ user, token });
    } catch {
      return reply.status(401).send({ error: 'Invalid credentials' });
    }
  });

  app.post('/auth/logout', async (_request, reply) => {
    return reply.send({ message: 'logged out' });
  });

  app.get('/auth/me', { preHandler: authenticate }, async (request, reply) => {
    const user = await authService.getUserById(request.user.id);
    if (!user) return reply.status(404).send({ error: 'User not found' });
    return reply.send(user);
  });
}
