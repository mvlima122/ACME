import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function handleError(error: unknown, context: string) {
  if (error instanceof ZodError) {
    return NextResponse.json(
      { error: "Dados inválidos", details: error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  if (error instanceof Error) {
    if (error.message === "USER_NOT_FOUND") {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }
    if (error.message === "EMAIL_ALREADY_EXISTS") {
      return NextResponse.json({ error: "Este email já está em uso" }, { status: 409 });
    }
  }

  console.error(`[${context}]`, error);
  return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
}