import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function GET() {
  try {
    const user = await prisma.user.create({
      data: {
        name: "John Doe",
        email: "email@example.com",
      },
    });
    return NextResponse.json({
      message: "Database connection successfully!",
      user: user,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Database connection failed!", details: error },
      { status: 500 }
    );
  }
}
