import { NextResponse } from "next/server";
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

  const [accounts, recentTransactions, incomeAgg, expenseAgg, budgets, goals, unreadNotifs] =
    await Promise.all([
      prisma.account.findMany({ where: { userId } }),
      prisma.transaction.findMany({
        where: { userId },
        include: { category: true, account: true },
        orderBy: { date: "desc" },
        take: 5,
      }),
      prisma.transaction.aggregate({
        where: { userId, type: "income", date: { gte: startOfMonth, lte: endOfMonth } },
        _sum: { amount: true },
      }),
      prisma.transaction.aggregate({
        where: { userId, type: "expense", date: { gte: startOfMonth, lte: endOfMonth } },
        _sum: { amount: true },
      }),
      prisma.budget.findMany({
        where: { userId },
        include: { category: true },
      }),
      prisma.savingGoal.findMany({ where: { userId } }),
      prisma.notification.count({ where: { userId, isRead: false } }),
    ]);

  const totalBalance = accounts.reduce((sum: number, a: { balance: number }) => sum + a.balance, 0);
  const monthlyIncome = incomeAgg._sum.amount || 0;
  const monthlyExpense = expenseAgg._sum.amount || 0;

  // Calculate budget spent
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
      return { ...budget, spent: spent._sum.amount || 0 };
    })
  );

  // Expense by category for donut chart
  const expenseByCategory = await prisma.transaction.groupBy({
    by: ["categoryId"],
    where: { userId, type: "expense", date: { gte: startOfMonth, lte: endOfMonth } },
    _sum: { amount: true },
  });

  const catIds = expenseByCategory.map((e) => e.categoryId).filter((id): id is string => id !== null);
  const categoryDetails = await prisma.category.findMany({
    where: { id: { in: catIds } },
  });

  const expenseBreakdown = expenseByCategory.map((e) => {
    const cat = categoryDetails.find((c) => c.id === e.categoryId);
    return { name: cat?.name || "อื่นๆ", value: e._sum.amount || 0 };
  });

  return NextResponse.json({
    totalBalance,
    monthlyIncome,
    monthlyExpense,
    accounts,
    recentTransactions,
    budgets: budgetsWithSpent,
    goals,
    expenseBreakdown,
    unreadNotifs,
  });
}
