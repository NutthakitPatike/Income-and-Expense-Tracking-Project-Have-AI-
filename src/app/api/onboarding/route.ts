import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createServerSupabaseClient } from "@/lib/supabase-server";

async function getUser() {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function POST(req: NextRequest) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { name, currency, accountName, accountType, accountBalance, categories } = body;

  // Upsert user in Prisma DB
  const dbUser = await prisma.user.upsert({
    where: { id: user.id },
    update: { name, currency },
    create: {
      id: user.id,
      email: user.email || "",
      name,
      currency: currency || "THB",
    },
  });

  // Create first account
  if (accountName) {
    await prisma.account.create({
      data: {
        name: accountName,
        type: accountType || "bank",
        balance: parseFloat(accountBalance || "0"),
        icon: accountType === "cash" ? "💵" : accountType === "ewallet" ? "📱" : "🏦",
        userId: dbUser.id,
      },
    });
  }

  // Create categories
  if (categories?.length) {
    const categoryData = categories.map((cat: { name: string; icon: string; type: string; color?: string }) => ({
      name: cat.name,
      icon: cat.icon,
      color: cat.color || "#F4C0D1",
      type: cat.type,
      userId: dbUser.id,
    }));
    await prisma.category.createMany({ data: categoryData });
  }

  return NextResponse.json({ success: true, user: dbUser });
}
