import { beforeEach, describe, expect, it, vi } from 'vitest';

const { send } = vi.hoisted(() => ({
  send: vi.fn(),
}));

vi.mock('../aws/dynamo.js', () => ({
  dynamo: {
    send,
  },
}));

import { putSample } from '../aws/sampleRepository.js';

describe('AWS sample repository', () => {
  beforeEach(() => {
    send.mockReset().mockResolvedValue({});
  });

  it('omits null createdByUserId when writing edge samples', async () => {
    await putSample({
      id: 'sample-1',
      sampleId: '11111111-1111-1111-1111-111111111111',
      deviceId: 'unoq-001',
      capturedAt: '2026-04-19T00:00:00.000Z',
      receivedAt: '2026-04-19T00:00:01.000Z',
      latitude: 32.68,
      longitude: -117.18,
      microplasticEstimate: 12.4,
      unit: 'particles_per_ml',
      confidence: 0.91,
      modelVersion: 'v1.0.0',
      qualityScore: null,
      notes: null,
      imageObjectKey: null,
      thumbnailObjectKey: null,
      source: 'edge',
      createdByUserId: null,
      tags: [],
    });

    expect(send).toHaveBeenCalledTimes(1);
    const command = send.mock.calls[0]?.[0];
    expect(command.input.Item).not.toHaveProperty('createdByUserId');
  });
});
