import { z } from "zod";

export const createUserSchema = z.object({
  name: z
    .string({ required_error: "Nome é obrigatório" })
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres")
    .trim(),
  email: z
    .string({ required_error: "Email é obrigatório" })
    .email("Email inválido")
    .toLowerCase()
    .trim(),
  password: z
    .string({ required_error: "Senha é obrigatória" })
    .min(6, "Senha deve ter pelo menos 6 caracteres")
    .max(100),
  role: z.enum(["ADMIN", "USER"]).default("USER"),
});

export const updateUserSchema = z.object({
  name: z.string().min(2).max(100).trim().optional(),
  email: z.string().email("Email inválido").toLowerCase().trim().optional(),
  password: z.string().min(6).max(100).optional(),
  role: z.enum(["ADMIN", "USER"]).optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;