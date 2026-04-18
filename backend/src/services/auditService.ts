import { prisma } from '../lib/prisma.js';
import type { Prisma } from '@prisma/client';

export function log(
  actorUserId: string | null,
  action: string,
  entityType: string,
  entityId: string,
  metadata: Prisma.InputJsonValue = {},
): void {
  prisma.auditLog
    .create({
      data: {
        actorUserId: actorUserId ?? undefined,
        action,
        entityType,
        entityId,
        metadata,
      },
    })
    .catch((err) => console.error('[audit] failed to write log:', err));
}
