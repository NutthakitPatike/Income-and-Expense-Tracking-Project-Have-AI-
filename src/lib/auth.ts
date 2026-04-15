import { createServerSupabaseClient } from "./supabase-server";
import { prisma } from "./prisma";

export async function getCurrentUser() {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  let dbUser = await prisma.user.findUnique({
    where: { id: user.id },
  });

  if (!dbUser) {
    dbUser = await prisma.user.create({
      data: {
        id: user.id,
        email: user.email!,
        name: user.user_metadata?.full_name || user.email?.split("@")[0],
        avatar: user.user_metadata?.avatar_url,
      },
    });

    // Seed default categories for new user
    const defaultCategories = [
      // รายจ่าย (Expense)
      { name: "อาหาร", icon: "🍔", color: "#FFB7B2", type: "expense" },
      { name: "คาเฟ่/เครื่องดื่ม", icon: "☕", color: "#FFDAC1", type: "expense" },
      { name: "ค่าเดินทาง", icon: "🚗", color: "#C7CEEA", type: "expense" },
      { name: "ที่อยู่อาศัย", icon: "🏠", color: "#A0D2DB", type: "expense" },
      { name: "ช้อปปิ้ง", icon: "🛒", color: "#D4A5FF", type: "expense" },
      { name: "สุขภาพ", icon: "💊", color: "#B5EAD7", type: "expense" },
      { name: "บันเทิง", icon: "🎬", color: "#F4C0D1", type: "expense" },
      { name: "การศึกษา", icon: "📚", color: "#E2F0CB", type: "expense" },
      { name: "ค่าโทรศัพท์/เน็ต", icon: "📱", color: "#9FE1CB", type: "expense" },
      { name: "ค่าน้ำ/ไฟ", icon: "💡", color: "#FFD700", type: "expense" },
      { name: "เสื้อผ้า", icon: "👗", color: "#F4C0D1", type: "expense" },
      { name: "ท่องเที่ยว", icon: "✈️", color: "#A0D2DB", type: "expense" },
      { name: "สัตว์เลี้ยง", icon: "🐱", color: "#E2F0CB", type: "expense" },
      { name: "ของขวัญ", icon: "🎁", color: "#D4A5FF", type: "expense" },
      { name: "อื่นๆ", icon: "📁", color: "#C7CEEA", type: "expense" },
      // รายรับ (Income)
      { name: "เงินเดือน", icon: "💰", color: "#B5EAD7", type: "income" },
      { name: "ฟรีแลนซ์", icon: "💻", color: "#9FE1CB", type: "income" },
      { name: "ลงทุน/ปันผล", icon: "📈", color: "#E2F0CB", type: "income" },
      { name: "ขายของ", icon: "🏪", color: "#FFDAC1", type: "income" },
      { name: "รายรับอื่นๆ", icon: "🎯", color: "#FFD700", type: "income" },
    ];

    await prisma.category.createMany({
      data: defaultCategories.map((cat) => ({ ...cat, userId: dbUser!.id })),
    });
  }

  return dbUser;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}
