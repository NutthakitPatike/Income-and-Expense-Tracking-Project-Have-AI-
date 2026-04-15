import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const category = await prisma.category.update({
    where: { id: params.id, userId: user.id },
    data: {
      name: body.name,
      icon: body.icon,
      color: body.color,
      type: body.type,
    },
  });

  return NextResponse.json(category);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.category.delete({ where: { id: params.id, userId: user.id } });
  return NextResponse.json({ success: true });
}
