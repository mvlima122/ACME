import { NextRequest, NextResponse } from "next/server";
import { updateUserSchema } from "@/lib/validations/user";
import { deleteUser, getUserById, updateUser } from "@/services/UserService";
import { handleError } from "@/lib/ApiHelpers";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const user = await getUserById(id);
    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }
    return NextResponse.json({ data: user }, { status: 200 });
  } catch (error) {
    return handleError(error, "GET /api/users/:id");
  }
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = updateUserSchema.parse(body);
    const user = await updateUser(id, parsed);
    return NextResponse.json({ data: user }, { status: 200 });
  } catch (error) {
    return handleError(error, "PATCH /api/users/:id");
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const result = await deleteUser(id);
    return NextResponse.json({ data: result }, { status: 200 });
  } catch (error) {
    return handleError(error, "DELETE /api/users/:id");
  }
}