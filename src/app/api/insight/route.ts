import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { getMochiInsight } from "@/lib/deepseek";

async function getUserId() {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id;
}

export async function GET() {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Check cache: return today's insight if it exists
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const cached = await prisma.insight.findUnique({
    where: { userId_date: { userId, date: today } },
  });

  if (cached) {
    return NextResponse.json({ insight: cached.message, cached: true });
  }

  // No cache — compute fresh insight
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  const [incomeAgg, expenseAgg, topCatResult, budgets] = await Promise.all([
    prisma.transaction.aggregate({
      where: { userId, type: "income", date: { gte: startOfMonth, lte: endOfMonth } },
      _sum: { amount: true },
    }),
    prisma.transaction.aggregate({
      where: { userId, type: "expense", date: { gte: startOfMonth, lte: endOfMonth } },
      _sum: { amount: true },
    }),
    prisma.transaction.groupBy({
      by: ["categoryId"],
      where: { userId, type: "expense", date: { gte: startOfMonth, lte: endOfMonth } },
      _sum: { amount: true },
      orderBy: { _sum: { amount: "desc" } },
      take: 1,
    }),
    prisma.budget.findMany({ where: { userId } }),
  ]);

  const income = incomeAgg._sum.amount || 0;
  const expense = expenseAgg._sum.amount || 0;

  let topCategory = "ไม่มีข้อมูล";
  if (topCatResult.length > 0 && topCatResult[0].categoryId) {
    const cat = await prisma.category.findUnique({ where: { id: topCatResult[0].categoryId } });
    topCategory = cat?.name || "อื่นๆ";
  }

  const totalBudget = budgets.reduce((sum: number, b: { amount: number }) => sum + b.amount, 0);
  const budgetUsage = totalBudget > 0 ? Math.round((expense / totalBudget) * 100) : 0;

  let message: string;
  try {
    message = await getMochiInsight({ income, expense, topCategory, budgetUsage });
  } catch (error) {
    console.error("DeepSeek insight error:", error);
    message = `เดือนนี้รายรับ ${income.toLocaleString()} บาท รายจ่าย ${expense.toLocaleString()} บาท 🍡 ลองดูรายจ่ายหมวด${topCategory}นะ!`;
  }

  // Save to cache
  await prisma.insight.upsert({
    where: { userId_date: { userId, date: today } },
    update: { message },
    create: { userId, date: today, message },
  });

  return NextResponse.json({ insight: message, cached: false });
}
