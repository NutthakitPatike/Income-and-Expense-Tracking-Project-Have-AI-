import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const account = await prisma.account.update({
    where: { id: params.id, userId: user.id },
    data: {
      name: body.name,
      type: body.type,
      balance: body.balance !== undefined ? parseFloat(body.balance) : undefined,
      icon: body.icon,
      color: body.color,
    },
  });

  return NextResponse.json(account);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Check if account has transactions
  const txCount = await prisma.transaction.count({
    where: { accountId: params.id, userId: user.id },
  });

  if (txCount > 0) {
    return NextResponse.json(
      { error: "ไม่สามารถลบบัญชีที่มีรายการธุรกรรมอยู่ได้" },
      { status: 400 }
    );
  }

  await prisma.account.delete({ where: { id: params.id, userId: user.id } });
  return NextResponse.json({ success: true });
}
