import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createServerSupabaseClient } from "@/lib/supabase-server";

async function getUserId() {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id;
}

export async function GET() {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const goals = await prisma.savingGoal.findMany({
    where: { userId },
    orderBy: { deadline: "asc" },
  });

  return NextResponse.json(goals);
}

export async function POST(req: NextRequest) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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
