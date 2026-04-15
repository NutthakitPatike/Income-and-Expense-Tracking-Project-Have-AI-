import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createServerSupabaseClient } from "@/lib/supabase-server";

async function getUserId() {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id;
}

export async function GET(req: NextRequest) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const search = searchParams.get("search");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");

  const where: Record<string, unknown> = { userId };
  if (type && type !== "all") where.type = type;
  if (search) {
    where.OR = [
      { note: { contains: search, mode: "insensitive" } },
    ];
  }

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      include: { category: true, account: true },
      orderBy: { date: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.transaction.count({ where }),
  ]);

  return NextResponse.json({ transactions, total, page, limit });
}

export async function POST(req: NextRequest) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { amount, type, note, date, categoryId, accountId, receiptUrl } = body;

  const transaction = await prisma.transaction.create({
    data: {
      amount: parseFloat(amount),
      type,
      note: note || "",
      date: new Date(date),
      userId,
      categoryId,
      accountId,
      receiptUrl,
    },
    include: { category: true, account: true },
  });

  // Update account balance
  const balanceChange = type === "income" ? parseFloat(amount) : -parseFloat(amount);
  await prisma.account.update({
    where: { id: accountId },
    data: { balance: { increment: balanceChange } },
  });

  return NextResponse.json(transaction, { status: 201 });
}
