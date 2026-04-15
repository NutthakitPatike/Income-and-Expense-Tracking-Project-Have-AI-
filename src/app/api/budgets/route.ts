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

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  const budgets = await prisma.budget.findMany({
    where: { userId },
    include: { category: true },
  });

  // Calculate spent amount for each budget
  const budgetsWithSpent = await Promise.all(
    budgets.map(async (budget) => {
      const spent = await prisma.transaction.aggregate({
        where: {
          userId,
          categoryId: budget.categoryId,
          type: "expense",
          date: { gte: startOfMonth, lte: endOfMonth },
        },
        _sum: { amount: true },
      });
      return {
        ...budget,
        spent: spent._sum.amount || 0,
      };
    })
  );

  return NextResponse.json(budgetsWithSpent);
}

export async function POST(req: NextRequest) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const budget = await prisma.budget.create({
    data: {
      amount: parseFloat(body.amount),
      period: body.period || "monthly",
      startDate: body.startDate ? new Date(body.startDate) : new Date(),
      userId,
      categoryId: body.categoryId,
    },
    include: { category: true },
  });

  return NextResponse.json(budget, { status: 201 });
}
