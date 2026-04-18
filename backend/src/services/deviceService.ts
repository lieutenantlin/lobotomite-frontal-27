import { prisma } from '../lib/prisma.js';
import type { DeviceStatus } from '@prisma/client';

export async function findOrCreateDevice(deviceId: string) {
  return prisma.device.upsert({
    where: { deviceId },
    update: { lastSeenAt: new Date() },
    create: {
      deviceId,
      label: deviceId,
      status: 'active',
      lastSeenAt: new Date(),
    },
  });
}

export async function updateDeviceHeartbeat(
  deviceId: string,
  firmwareVersion?: string,
  modelVersion?: string,
  status?: DeviceStatus,
) {
  const device = await prisma.device.upsert({
    where: { deviceId },
    update: {
      lastSeenAt: new Date(),
      ...(firmwareVersion !== undefined && { firmwareVersion }),
      ...(modelVersion !== undefined && { modelVersion }),
      ...(status !== undefined && { status }),
    },
    create: {
      deviceId,
      label: deviceId,
      status: status ?? 'active',
      firmwareVersion,
      modelVersion,
      lastSeenAt: new Date(),
    },
  });
  return device;
}

export async function listDevices(status?: DeviceStatus) {
  return prisma.device.findMany({
    where: status ? { status } : undefined,
    orderBy: { lastSeenAt: 'desc' },
  });
}

export async function getDevice(id: string) {
  return prisma.device.findUnique({ where: { id } });
}

export async function updateDevice(id: string, data: { label?: string; status?: DeviceStatus }) {
  return prisma.device.update({ where: { id }, data });
}
