import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { randomUUID } from 'crypto';
import { DeviceStatus } from '@prisma/client';
import * as sampleService from '../services/sampleService.js';
import * as deviceService from '../services/deviceService.js';
import * as audit from '../services/auditService.js';
import { getStorage } from '../storage/index.js';

const sampleSchema = z.object({
  sampleId: z.string().uuid(),
  deviceId: z.string(),
  capturedAt: z.string().datetime(),
  location: z.object({ lat: z.number(), lng: z.number() }),
  microplasticEstimate: z.number(),
  unit: z.string(),
  confidence: z.number().min(0).max(1),
  modelVersion: z.string(),
  qualityScore: z.number().min(0).max(1).optional(),
  notes: z.string().optional(),
  imageObjectKey: z.string().optional(),
  thumbnailObjectKey: z.string().optional(),
});

const batchSchema = z.object({
  samples: z.array(sampleSchema).min(1).max(100),
});

const heartbeatSchema = z.object({
  deviceId: z.string(),
  firmwareVersion: z.string().optional(),
  modelVersion: z.string().optional(),
  status: z.nativeEnum(DeviceStatus).optional(),
});

const presignedUploadSchema = z.object({
  filename: z.string().min(1).max(255),
});

export async function ingestRoutes(app: FastifyInstance) {
  app.post('/ingest/sample', async (request, reply) => {
    const body = sampleSchema.safeParse(request.body);
    if (!body.success) return reply.status(400).send({ error: 'Validation failed', details: body.error.flatten() });

    const sample = await sampleService.ingestSample(body.data);
    audit.log(null, 'sample.ingest', 'sample', sample.id, { deviceId: body.data.deviceId });
    return reply.status(201).send({ sample: { id: sample.id, sampleId: sample.sampleId, receivedAt: sample.receivedAt } });
  });

  app.post('/ingest/batch', async (request, reply) => {
    const body = batchSchema.safeParse(request.body);
    if (!body.success) return reply.status(400).send({ error: 'Validation failed', details: body.error.flatten() });

    const result = await sampleService.ingestBatch(body.data.samples);
    audit.log(null, 'sample.batch_ingest', 'sample', 'batch', { count: body.data.samples.length, ...result });
    return reply.status(201).send(result);
  });

  app.post('/ingest/device-heartbeat', async (request, reply) => {
    const body = heartbeatSchema.safeParse(request.body);
    if (!body.success) return reply.status(400).send({ error: 'Validation failed', details: body.error.flatten() });

    const device = await deviceService.updateDeviceHeartbeat(
      body.data.deviceId,
      body.data.firmwareVersion,
      body.data.modelVersion,
      body.data.status,
    );
    audit.log(null, 'device.heartbeat', 'device', device.id, { deviceId: body.data.deviceId });
    return reply.send({ device: { deviceId: device.deviceId, status: device.status, lastSeenAt: device.lastSeenAt } });
  });

  app.post('/upload/presigned', async (request, reply) => {
    const body = presignedUploadSchema.safeParse(request.body);
    if (!body.success) return reply.status(400).send({ error: 'Validation failed', details: body.error.flatten() });

    const objectKey = `samples/${randomUUID()}/${body.data.filename}`;
    const uploadUrl = await getStorage().getSignedUploadUrl(objectKey);
    return reply.send({ uploadUrl, objectKey });
  });
}
