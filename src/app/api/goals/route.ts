import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = user.id;

  const goals = await prisma.savingGoal.findMany({
    where: { userId },
    orderBy: { deadline: "asc" },
  });

  return NextResponse.json(goals);
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = user.id;

  const body = await req.json();
  const goal = await prisma.savingGoal.create({
    data: {
      name: body.name,
      targetAmount: parseFloat(body.targetAmount),
      currentAmount: parseFloat(body.currentAmount || "0"),
      deadline: body.deadline ? new Date(body.deadline) : null,
      icon: body.icon || "🎯",
      userId,
    },
  });

  return NextResponse.json(goal, { status: 201 });
}
