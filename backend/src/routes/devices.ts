import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { DeviceStatus } from '@prisma/client';
import { authenticate, requireRole } from '../middleware/authenticate.js';
import * as deviceService from '../services/deviceService.js';
import * as audit from '../services/auditService.js';

const listQuery = z.object({
  status: z.nativeEnum(DeviceStatus).optional(),
});

const updateBody = z.object({
  label: z.string().min(1).optional(),
  status: z.nativeEnum(DeviceStatus).optional(),
});

export async function deviceRoutes(app: FastifyInstance) {
  app.get('/devices', { preHandler: requireRole(['admin', 'researcher']) }, async (request, reply) => {
    const query = listQuery.safeParse(request.query);
    if (!query.success) return reply.status(400).send({ error: 'Validation failed', details: query.error.flatten() });

    const devices = await deviceService.listDevices(query.data.status);
    return reply.send({ devices });
  });

  app.get('/devices/:id', { preHandler: authenticate }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const device = await deviceService.getDevice(id);
    if (!device) return reply.status(404).send({ error: 'Device not found' });
    return reply.send({ device });
  });

  app.patch('/devices/:id', { preHandler: requireRole(['admin']) }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const body = updateBody.safeParse(request.body);
    if (!body.success) return reply.status(400).send({ error: 'Validation failed', details: body.error.flatten() });

    const existing = await deviceService.getDevice(id);
    if (!existing) return reply.status(404).send({ error: 'Device not found' });

    const updated = await deviceService.updateDevice(id, body.data);
    audit.log(request.user.id, 'device.update', 'device', id, body.data as unknown as import('@prisma/client').Prisma.InputJsonValue);
    return reply.send({ device: updated });
  });
}
