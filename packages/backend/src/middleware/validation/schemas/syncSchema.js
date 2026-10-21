const { z } = require('zod');

const startLevelRunSchema = z
  .object({
    sessionId: z.string().uuid().optional(),
    gameSessionId: z.string().uuid().optional(),
    mapId: z.string().uuid().optional(),
    mapCode: z.string().min(1).optional(),
  })
  .refine((data) => !!data.mapId || !!data.mapCode, {
    message: 'mapId or mapCode is required',
    path: ['mapCode'],
  });

const finishLevelRunSchema = z
  .object({
    runId: z.string().uuid(),
    sessionId: z.string().uuid().optional(),
    gameSessionId: z.string().uuid().optional(),
    timeMs: z.number().int().nonnegative().optional(),
    objectiveTimeSeconds: z.number().int().nonnegative().optional(),
    collectedOrbs: z.number().int().nonnegative().optional(),
    completed: z.boolean().optional(),
    endReason: z.string().max(255).nullable().optional(),
  })
  .refine(
    (data) => data.timeMs !== undefined
      || data.objectiveTimeSeconds !== undefined
      || data.collectedOrbs !== undefined
      || data.completed !== undefined
      || data.endReason !== undefined
      || data.sessionId !== undefined
      || data.gameSessionId !== undefined,
    {
      message: 'At least one field besides runId must be provided to finish the map run',
      path: ['runId'],
    },
  );

const personalBestQuerySchema = z.object({
  mapCode: z.string().min(1),
});

module.exports = {
  startLevelRunSchema,
  finishLevelRunSchema,
  personalBestQuerySchema,
};
