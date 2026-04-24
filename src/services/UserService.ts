import bcrypt from "bcryptjs";
import  prisma  from "@/lib/prisma";
import type { CreateUserInput, UpdateUserInput } from "@/lib/validations/user";

const SALT_ROUNDS = 10;

// Campos públicos — senha nunca sai da service
const publicSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  createdAt: true,
  updatedAt: true,
};

export async function getAllUsers() {
  return prisma.user.findMany({
    orderBy: { id: 'desc' },
    select: publicSelect,
  });
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    select: publicSelect,
  });
}

export async function createUser(data: CreateUserInput) {
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) throw new Error("EMAIL_ALREADY_EXISTS");

  const hashed = await bcrypt.hash(data.password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: { ...data, password: hashed },
    select: publicSelect,
  });

  return user;
}

export async function updateUser(id: string, data: UpdateUserInput) {
  const existing = await prisma.user.findUnique({ where: { id } });
  if (!existing) throw new Error("USER_NOT_FOUND");

  if (data.email && data.email !== existing.email) {
    const emailTaken = await prisma.user.findUnique({ where: { email: data.email } });
    if (emailTaken) throw new Error("EMAIL_ALREADY_EXISTS");
  }

  const payload: UpdateUserInput & { password?: string } = { ...data };
  if (data.password) {
    payload.password = await bcrypt.hash(data.password, SALT_ROUNDS);
  }

  return prisma.user.update({
    where: { id },
    data: payload,
    select: publicSelect,
  });
}

export async function deleteUser(id: string) {
  const existing = await prisma.user.findUnique({ where: { id } });
  if (!existing) throw new Error("USER_NOT_FOUND");

  await prisma.user.delete({ where: { id } });
  return { message: "Usuário deletado com sucesso" };
}