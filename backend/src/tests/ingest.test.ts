import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { buildApp } from '../app.js';
import { randomUUID } from 'crypto';

vi.mock('../lib/prisma.js', () => ({
  prisma: {
    $queryRaw: vi.fn().mockResolvedValue([]),
    device: {
      upsert: vi.fn().mockResolvedValue({
        id: 'device-1',
        deviceId: 'unoq-001',
        label: 'unoq-001',
        status: 'active',
        firmwareVersion: null,
        modelVersion: null,
        lastSeenAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    },
    sample: {
      upsert: vi.fn().mockResolvedValue({
        id: 'sample-1',
        sampleId: 'seed-uuid',
        deviceId: 'device-1',
        capturedAt: new Date(),
        receivedAt: new Date(),
        latitude: 32.68,
        longitude: -117.18,
        microplasticEstimate: 12.4,
        unit: 'particles_per_ml',
        confidence: 0.87,
        modelVersion: 'v1.3.0',
        qualityScore: null,
        notes: null,
        imageObjectKey: null,
        thumbnailObjectKey: null,
        source: 'edge',
        createdByUserId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    },
    auditLog: {
      create: vi.fn().mockResolvedValue({}),
    },
  },
}));

describe('Ingest routes', () => {
  let app: Awaited<ReturnType<typeof buildApp>>;

  beforeAll(async () => {
    app = await buildApp();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /ingest/sample - accepts valid payload', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/ingest/sample',
      payload: {
        sampleId: randomUUID(),
        deviceId: 'unoq-001',
        capturedAt: new Date().toISOString(),
        location: { lat: 32.68, lng: -117.18 },
        microplasticEstimate: 12.4,
        unit: 'particles_per_ml',
        confidence: 0.87,
        modelVersion: 'v1.3.0',
      },
    });
    expect(res.statusCode).toBe(201);
    const body = res.json();
    expect(body.sample.sampleId).toBeDefined();
  });

  it('POST /ingest/sample - rejects invalid sampleId', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/ingest/sample',
      payload: {
        sampleId: 'not-a-uuid',
        deviceId: 'unoq-001',
        capturedAt: new Date().toISOString(),
        location: { lat: 32.68, lng: -117.18 },
        microplasticEstimate: 12.4,
        unit: 'particles_per_ml',
        confidence: 0.87,
        modelVersion: 'v1.3.0',
      },
    });
    expect(res.statusCode).toBe(400);
  });

  it('POST /ingest/device-heartbeat - updates device', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/ingest/device-heartbeat',
      payload: { deviceId: 'unoq-001', firmwareVersion: '1.0.1' },
    });
    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body.device.deviceId).toBe('unoq-001');
  });
});
