const { z } = require('zod');

const loginSchema = z.object({
  email: z.string().email().trim(),
  password: z.string().min(1),
});

const createAdminSchema = z.object({
  email: z.string().email().trim(),
  password: z.string().min(6),
  name: z.string().optional(),
  role: z.enum(['admin', 'superadmin']).default('admin'),
});

const adminUserEditSchema = z.object({
  name: z.string().trim().min(1).max(100).optional(),
  surname: z.string().trim().min(1).max(100).optional(),
  fatherName: z.string().trim().min(1).max(100).optional(),
  educationLevel: z.string().trim().min(1).max(50).optional(),
  university: z.string().trim().min(1).max(100).optional(),
  profession: z.string().trim().min(1).max(100).optional(),
  phoneNumber: z
    .string()
    .regex(/^\+994\d{9}$/)
    .optional(),
  password: z.string().min(6).optional(),
});

module.exports = { loginSchema, createAdminSchema, adminUserEditSchema };
