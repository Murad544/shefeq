const { z } = require('zod');

const stopGameSessionSchema = z.object({
  sessionId: z.string().uuid(),
  endReason: z.string().min(1).max(255),
});

const heartbeatGameSessionSchema = z.object({
  sessionId: z.string().uuid(),
});

module.exports = { stopGameSessionSchema, heartbeatGameSessionSchema };
