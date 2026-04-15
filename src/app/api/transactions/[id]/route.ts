import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = user.id;

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
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = user.id;

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
