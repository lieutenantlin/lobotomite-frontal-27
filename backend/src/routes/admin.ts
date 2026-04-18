import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { UserRole } from '@prisma/client';
import { requireRole } from '../middleware/authenticate.js';
import { prisma } from '../lib/prisma.js';
import * as audit from '../services/auditService.js';

const updateUserBody = z.object({
  role: z.nativeEnum(UserRole),
});

const auditQuery = z.object({
  actorUserId: z.string().optional(),
  entityType: z.string().optional(),
  action: z.string().optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
});

export async function adminRoutes(app: FastifyInstance) {
  const adminGuard = requireRole(['admin']);

  app.get('/admin/users', { preHandler: adminGuard }, async (_request, reply) => {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, name: true, role: true, createdAt: true, updatedAt: true },
      orderBy: { createdAt: 'desc' },
    });
    return reply.send({ users });
  });

  app.patch('/admin/users/:id', { preHandler: adminGuard }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const body = updateUserBody.safeParse(request.body);
    if (!body.success) return reply.status(400).send({ error: 'Validation failed', details: body.error.flatten() });

    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) return reply.status(404).send({ error: 'User not found' });

    const updated = await prisma.user.update({
      where: { id },
      data: { role: body.data.role },
      select: { id: true, email: true, name: true, role: true, updatedAt: true },
    });
    audit.log(request.user.id, 'user.role_change', 'user', id, { newRole: body.data.role });
    return reply.send({ user: updated });
  });

  app.delete('/admin/users/:id', { preHandler: adminGuard }, async (request, reply) => {
    const { id } = request.params as { id: string };
    if (id === request.user.id) return reply.status(400).send({ error: 'Cannot delete your own account' });

    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) return reply.status(404).send({ error: 'User not found' });

    await prisma.user.delete({ where: { id } });
    audit.log(request.user.id, 'user.delete', 'user', id, { email: existing.email });
    return reply.status(204).send();
  });

  app.get('/admin/audit-log', { preHandler: adminGuard }, async (request, reply) => {
    const query = auditQuery.safeParse(request.query);
    if (!query.success) return reply.status(400).send({ error: 'Validation failed', details: query.error.flatten() });

    const page = Math.max(1, query.data.page ?? 1);
    const limit = Math.min(100, query.data.limit ?? 20);
    const skip = (page - 1) * limit;

    const where = {
      ...(query.data.actorUserId && { actorUserId: query.data.actorUserId }),
      ...(query.data.entityType && { entityType: query.data.entityType }),
      ...(query.data.action && { action: query.data.action }),
    };

    const [data, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        include: { actorUser: { select: { id: true, email: true, name: true } } },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.auditLog.count({ where }),
    ]);

    return reply.send({ data, total, page, limit });
  });
}
