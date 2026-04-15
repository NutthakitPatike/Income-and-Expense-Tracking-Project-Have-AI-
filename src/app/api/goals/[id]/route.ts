import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = user.id;

  const body = await req.json();

  // Add money to goal
  if (body.addAmount) {
    const goal = await prisma.savingGoal.update({
      where: { id: params.id, userId },
      data: { currentAmount: { increment: parseFloat(body.addAmount) } },
    });
    return NextResponse.json(goal);
  }

  const goal = await prisma.savingGoal.update({
    where: { id: params.id, userId },
    data: {
      name: body.name,
      targetAmount: body.targetAmount ? parseFloat(body.targetAmount) : undefined,
      deadline: body.deadline ? new Date(body.deadline) : undefined,
      icon: body.icon,
    },
  });

  return NextResponse.json(goal);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = user.id;

  await prisma.savingGoal.delete({ where: { id: params.id, userId } });
  return NextResponse.json({ success: true });
}
