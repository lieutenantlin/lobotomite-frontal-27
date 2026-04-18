import { prisma } from '../lib/prisma.js';
import { findOrCreateDevice } from './deviceService.js';
import { getStorage } from '../storage/index.js';
import type { SampleSource } from '@prisma/client';

export interface IngestSampleData {
  sampleId: string;
  deviceId: string;
  capturedAt: string;
  location: { lat: number; lng: number };
  microplasticEstimate: number;
  unit: string;
  confidence: number;
  modelVersion: string;
  qualityScore?: number;
  notes?: string;
  imageObjectKey?: string;
  thumbnailObjectKey?: string;
}

export async function ingestSample(data: IngestSampleData) {
  const device = await findOrCreateDevice(data.deviceId);

  return prisma.sample.upsert({
    where: { sampleId: data.sampleId },
    update: {
      latitude: data.location.lat,
      longitude: data.location.lng,
      microplasticEstimate: data.microplasticEstimate,
      unit: data.unit,
      confidence: data.confidence,
      modelVersion: data.modelVersion,
      qualityScore: data.qualityScore,
      notes: data.notes,
      imageObjectKey: data.imageObjectKey,
      thumbnailObjectKey: data.thumbnailObjectKey,
    },
    create: {
      sampleId: data.sampleId,
      deviceId: device.id,
      capturedAt: new Date(data.capturedAt),
      receivedAt: new Date(),
      latitude: data.location.lat,
      longitude: data.location.lng,
      microplasticEstimate: data.microplasticEstimate,
      unit: data.unit,
      confidence: data.confidence,
      modelVersion: data.modelVersion,
      qualityScore: data.qualityScore,
      notes: data.notes,
      imageObjectKey: data.imageObjectKey,
      thumbnailObjectKey: data.thumbnailObjectKey,
      source: 'edge' as SampleSource,
    },
  });
}

export async function ingestBatch(samples: IngestSampleData[]) {
  const results = await Promise.allSettled(samples.map(ingestSample));
  const errors: string[] = [];
  let success = 0;
  let failed = 0;

  for (let i = 0; i < results.length; i++) {
    const r = results[i];
    if (r.status === 'fulfilled') {
      success++;
    } else {
      failed++;
      errors.push(`sample[${i}] ${(r as PromiseRejectedResult).reason?.message ?? 'unknown error'}`);
    }
  }

  return { success, failed, errors };
}

export interface SampleFilters {
  deviceId?: string;
  source?: SampleSource;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

export async function listSamples(filters: SampleFilters) {
  const page = Math.max(1, filters.page ?? 1);
  const limit = Math.min(100, Math.max(1, filters.limit ?? 20));
  const skip = (page - 1) * limit;

  const where = {
    ...(filters.deviceId && { device: { deviceId: filters.deviceId } }),
    ...(filters.source && { source: filters.source }),
    ...(filters.from || filters.to
      ? {
          capturedAt: {
            ...(filters.from && { gte: new Date(filters.from) }),
            ...(filters.to && { lte: new Date(filters.to) }),
          },
        }
      : {}),
  };

  const [data, total] = await Promise.all([
    prisma.sample.findMany({
      where,
      include: { device: { select: { deviceId: true, label: true } }, tags: true },
      orderBy: { capturedAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.sample.count({ where }),
  ]);

  return { data, total, page, limit };
}

export async function getSample(id: string) {
  return prisma.sample.findUnique({
    where: { id },
    include: { device: { select: { deviceId: true, label: true } }, tags: true },
  });
}

export async function getSampleBySampleId(sampleId: string) {
  return prisma.sample.findUnique({
    where: { sampleId },
    include: { device: { select: { deviceId: true, label: true } }, tags: true },
  });
}

export async function updateSample(id: string, data: { notes?: string; tags?: string[] }) {
  const { tags, ...rest } = data;

  const updated = await prisma.sample.update({
    where: { id },
    data: {
      ...rest,
      ...(tags !== undefined && {
        tags: {
          deleteMany: {},
          create: tags.map((tag) => ({ tag })),
        },
      }),
    },
    include: { tags: true },
  });
  return updated;
}

export async function deleteSample(id: string) {
  return prisma.sample.delete({ where: { id } });
}

export async function getSignedImageUrls(sample: { imageObjectKey: string | null; thumbnailObjectKey: string | null }) {
  const storage = getStorage();
  const [imageUrl, thumbnailUrl] = await Promise.all([
    sample.imageObjectKey ? storage.getSignedDownloadUrl(sample.imageObjectKey) : Promise.resolve(undefined),
    sample.thumbnailObjectKey ? storage.getSignedDownloadUrl(sample.thumbnailObjectKey) : Promise.resolve(undefined),
  ]);
  return { imageUrl, thumbnailUrl };
}
