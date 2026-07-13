const { z } = require('zod');

const startLevelRunSchema = z
  .object({
    mapId: z.string().uuid().optional(),
    mapCode: z.string().min(1).optional(),
    gameSessionId: z.string().uuid().optional(),
  })
  .refine((data) => !!data.mapId || !!data.mapCode, {
    message: 'mapId or mapCode is required',
    path: ['mapId'],
  });

const finishLevelRunSchema = z
  .object({
    runId: z.string().uuid(),
    gameSessionId: z.string().uuid().optional(),
    objectiveTimeSeconds: z.number().int().nonnegative().optional(),
    collectedOrbs: z.number().int().nonnegative().optional(),
    completed: z.boolean().optional(),
    endReason: z.string().max(255).nullable().optional(),
  })
  .refine(
    (data) =>
      data.objectiveTimeSeconds !== undefined ||
      data.collectedOrbs !== undefined ||
      data.completed !== undefined ||
      data.endReason !== undefined ||
      data.gameSessionId !== undefined,
    {
      message: 'At least one field besides runId must be provided to finish the map run',
      path: ['runId'],
    }
  );

module.exports = { startLevelRunSchema, finishLevelRunSchema };
