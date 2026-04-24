import { NextRequest, NextResponse } from "next/server";
import { createUserSchema } from "@/lib/validations/user";
import { createUser, getAllUsers } from "@/services/UserService";
import { handleError } from "@/lib/ApiHelpers";


export async function GET() {
  try {
    const users = await getAllUsers();
    return NextResponse.json({ data: users }, { status: 200 });
  } catch (error) {
    return handleError(error, "GET /api/users");
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createUserSchema.parse(body);
    const user = await createUser(parsed);
    return NextResponse.json({ data: user }, { status: 201 });
  } catch (error) {
    return handleError(error, "POST /api/users");
  }
}