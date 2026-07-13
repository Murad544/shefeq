const { z } = require('zod');

const stopGameSessionSchema = z.object({
  sessionId: z.string().uuid(),
  endReason: z.string().min(1).max(255),
});

module.exports = { stopGameSessionSchema };
