import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { authenticate } from '../middleware/authenticate.js';
import { prisma } from '../lib/prisma.js';

const timeseriesQuery = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
  interval: z.enum(['day', 'week']).optional().default('day'),
});

export async function statsRoutes(app: FastifyInstance) {
  app.get('/stats/overview', { preHandler: authenticate }, async (_request, reply) => {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [totalSamples, totalDevices, aggregates, recentSamples, samplesBySource] = await Promise.all([
      prisma.sample.count(),
      prisma.device.count(),
      prisma.sample.aggregate({
        _avg: { microplasticEstimate: true, confidence: true },
      }),
      prisma.sample.count({ where: { capturedAt: { gte: sevenDaysAgo } } }),
      prisma.sample.groupBy({
        by: ['source'],
        _count: { id: true },
      }),
    ]);

    const sourceMap: Record<string, number> = {};
    for (const row of samplesBySource) {
      sourceMap[row.source] = row._count.id;
    }

    return reply.send({
      totalSamples,
      totalDevices,
      avgMicroplasticEstimate: aggregates._avg.microplasticEstimate ?? 0,
      avgConfidence: aggregates._avg.confidence ?? 0,
      samplesBySource: sourceMap,
      recentSamples,
    });
  });

  app.get('/stats/by-device', { preHandler: authenticate }, async (_request, reply) => {
    const rows = await prisma.sample.groupBy({
      by: ['deviceId'],
      _count: { id: true },
      _avg: { microplasticEstimate: true },
      _max: { capturedAt: true },
    });

    const deviceIds = rows.map((r) => r.deviceId);
    const devices = await prisma.device.findMany({ where: { id: { in: deviceIds } } });
    const deviceMap = new Map(devices.map((d) => [d.id, d]));

    const data = rows.map((row) => ({
      device: deviceMap.get(row.deviceId),
      count: row._count.id,
      avgEstimate: row._avg.microplasticEstimate ?? 0,
      lastSampleAt: row._max.capturedAt,
    }));

    return reply.send({ data });
  });

  app.get('/stats/timeseries', { preHandler: authenticate }, async (request, reply) => {
    const query = timeseriesQuery.safeParse(request.query);
    if (!query.success) return reply.status(400).send({ error: 'Validation failed', details: query.error.flatten() });

    const from = query.data.from ? new Date(query.data.from) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const to = query.data.to ? new Date(query.data.to) : new Date();
    const interval = query.data.interval;

    const truncFn = interval === 'week' ? 'week' : 'day';

    const rows = await prisma.$queryRaw<{ date: Date; count: bigint; avg_estimate: number | null }[]>`
      SELECT
        date_trunc(${truncFn}, "capturedAt") AS date,
        COUNT(*)::bigint AS count,
        AVG("microplasticEstimate") AS avg_estimate
      FROM "Sample"
      WHERE "capturedAt" >= ${from} AND "capturedAt" <= ${to}
      GROUP BY date_trunc(${truncFn}, "capturedAt")
      ORDER BY date ASC
    `;

    const data = rows.map((r) => ({
      date: r.date.toISOString(),
      count: Number(r.count),
      avgEstimate: r.avg_estimate ?? 0,
    }));

    return reply.send({ data });
  });
}
