const { z } = require('zod');

const idSchema = z.object({
  id: z.string().uuid(),
});

const fileIdSchema = z.object({
  fileId: z.coerce.number().int().positive(),
});

module.exports = { idSchema, fileIdSchema };
