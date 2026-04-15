import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { categorizeTransactions } from "@/lib/deepseek";

async function getUserId() {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id;
}

export async function POST(req: NextRequest) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { rows, accountId } = body as {
    rows: { date: string; description: string; amount: number; type: string }[];
    accountId: string;
  };

  if (!rows?.length || !accountId) {
    return NextResponse.json({ error: "Missing rows or accountId" }, { status: 400 });
  }

  // Get user categories for AI categorization
  const categories = await prisma.category.findMany({ where: { userId } });
  const categoryNames = categories.map((c) => c.name);

  let assignedCategories: string[];
  try {
    assignedCategories = await categorizeTransactions(
      rows.map((r) => ({ date: r.date, description: r.description, amount: r.amount })),
      categoryNames
    );
  } catch {
    assignedCategories = rows.map(() => categories[0]?.name || "อื่นๆ");
  }

  // Create transactions
  const created = [];
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const catName = assignedCategories[i] || "อื่นๆ";
    const category = categories.find((c) => c.name === catName) || categories[0];

    if (!category) continue;

    const transaction = await prisma.transaction.create({
      data: {
        amount: Math.abs(row.amount),
        type: row.type || (row.amount < 0 ? "expense" : "income"),
        note: row.description,
        date: new Date(row.date),
        userId,
        categoryId: category.id,
        accountId,
      },
    });
    created.push(transaction);

    // Update account balance
    const balanceChange = transaction.type === "income" ? transaction.amount : -transaction.amount;
    await prisma.account.update({
      where: { id: accountId },
      data: { balance: { increment: balanceChange } },
    });
  }

  return NextResponse.json({ imported: created.length });
}
