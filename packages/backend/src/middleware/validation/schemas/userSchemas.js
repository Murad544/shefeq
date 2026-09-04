const { z } = require('zod');

const registerSchema = z.object({
  name: z.string().trim().min(1).max(100),
  surname: z.string().trim().min(1).max(100),
  fatherName: z.string().trim().min(1).max(100).nullable().optional().default(null),
  // Accept DD-MM-YYYY or YYYY-MM-DD (frontend may send ISO)
  dateOfBirth: z
    .string()
    .regex(/^(?:\d{2}-\d{2}-\d{4}|\d{4}-\d{2}-\d{2})$/)
    .nullable()
    .optional()
    .default(null),
  sex: z.enum(['male', 'female', 'other']).nullable().optional().default(null),
  placeOfBirth: z.string().trim().min(1).max(100).nullable().optional().default(null),
  nationalSerialNumber: z.string().trim().min(7).max(20).nullable().optional().default(null),
  nationalIdNumber: z.string().trim().min(7).max(20),
  phoneNumber: z.string().regex(/^\+994\d{9}$/),
  email: z.string().email().trim(),
  educationLevel: z.string().trim().min(1).max(50).nullable().optional().default(null),
  university: z.string().trim().min(1).max(100).nullable().optional().default(null),
  profession: z.string().trim().min(1).max(100).nullable().optional().default(null),
  role: z.enum(['trainee', 'trainer']).optional().default('trainee'),
  skills: z.array(z.string().trim().min(1).max(50)).max(50).optional().default([]),
  answers: z
    .array(
      z.object({
        question_id: z.number().int().positive(),
        answer: z.string().trim().min(1).max(1000),
      })
    )
    .max(20)
    .optional()
    .default([]),
});

const passwordChangeSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(6),
});

const userIdSchema = z.object({
  id: z.coerce.number().int().positive(),
});

module.exports = { registerSchema, userIdSchema, passwordChangeSchema };
