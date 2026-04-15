import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createServerSupabaseClient } from "@/lib/supabase-server";

async function getUserId() {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id;
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const transaction = await prisma.transaction.update({
    where: { id: params.id, userId },
    data: {
      amount: body.amount ? parseFloat(body.amount) : undefined,
      type: body.type,
      note: body.note,
      date: body.date ? new Date(body.date) : undefined,
      categoryId: body.categoryId,
      accountId: body.accountId,
    },
    include: { category: true, account: true },
  });

  return NextResponse.json(transaction);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const transaction = await prisma.transaction.findUnique({
    where: { id: params.id, userId },
  });

  if (!transaction) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Reverse balance change
  const balanceChange = transaction.type === "income" ? -transaction.amount : transaction.amount;
  await prisma.account.update({
    where: { id: transaction.accountId },
    data: { balance: { increment: balanceChange } },
  });

  await prisma.transaction.delete({ where: { id: params.id } });

  return NextResponse.json({ success: true });
}
