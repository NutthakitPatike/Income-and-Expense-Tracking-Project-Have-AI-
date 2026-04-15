import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = user.id;

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
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = user.id;

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
