// Mock data for development and initial UI building

export const mockUser = {
  id: "user-1",
  name: "Mochi",
  email: "mochi@example.com",
  avatar: null,
  currency: "THB",
  onboarded: true,
  createdAt: new Date(),
};

export const mockAccounts = [
  { id: "acc-1", userId: "user-1", name: "กระเป๋าเงินสด", type: "cash", balance: 3500, color: "#FAC775", icon: "wallet", createdAt: new Date() },
  { id: "acc-2", userId: "user-1", name: "ธนาคารกสิกร", type: "bank", balance: 25400, color: "#9FE1CB", icon: "building-2", createdAt: new Date() },
  { id: "acc-3", userId: "user-1", name: "TrueMoney", type: "wallet", balance: 1200, color: "#CECBF6", icon: "smartphone", createdAt: new Date() },
];

export const mockCategories = [
  { id: "cat-1", userId: "user-1", name: "อาหาร", icon: "utensils", color: "#FAC775", type: "expense", isDefault: true },
  { id: "cat-2", userId: "user-1", name: "เดินทาง", icon: "car", color: "#CECBF6", type: "expense", isDefault: true },
  { id: "cat-3", userId: "user-1", name: "ช้อปปิ้ง", icon: "shopping-bag", color: "#F4C0D1", type: "expense", isDefault: true },
  { id: "cat-4", userId: "user-1", name: "บันเทิง", icon: "gamepad-2", color: "#9FE1CB", type: "expense", isDefault: true },
  { id: "cat-5", userId: "user-1", name: "ค่าเรียน", icon: "graduation-cap", color: "#87CEEB", type: "expense", isDefault: true },
  { id: "cat-6", userId: "user-1", name: "สุขภาพ", icon: "heart-pulse", color: "#FF9999", type: "expense", isDefault: true },
  { id: "cat-7", userId: "user-1", name: "เงินเดือน", icon: "banknote", color: "#9FE1CB", type: "income", isDefault: true },
  { id: "cat-8", userId: "user-1", name: "ฟรีแลนซ์", icon: "laptop", color: "#CECBF6", type: "income", isDefault: true },
  { id: "cat-9", userId: "user-1", name: "ค่าขนม", icon: "gift", color: "#FAC775", type: "income", isDefault: true },
];

export const mockTransactions = [
  { id: "tx-1", accountId: "acc-1", userId: "user-1", type: "expense", amount: 65, note: "ข้าวผัดกะเพรา", categoryId: "cat-1", tags: [], receiptUrl: null, date: new Date("2026-04-15"), isRecurring: false, recurringInterval: null, createdAt: new Date(), category: mockCategories[0] },
  { id: "tx-2", accountId: "acc-2", userId: "user-1", type: "expense", amount: 350, note: "เติมน้ำมัน", categoryId: "cat-2", tags: [], receiptUrl: null, date: new Date("2026-04-14"), isRecurring: false, recurringInterval: null, createdAt: new Date(), category: mockCategories[1] },
  { id: "tx-3", accountId: "acc-3", userId: "user-1", type: "expense", amount: 499, note: "เสื้อยืดใหม่", categoryId: "cat-3", tags: ["shopee"], receiptUrl: null, date: new Date("2026-04-13"), isRecurring: false, recurringInterval: null, createdAt: new Date(), category: mockCategories[2] },
  { id: "tx-4", accountId: "acc-2", userId: "user-1", type: "income", amount: 15000, note: "เงินเดือน เม.ย.", categoryId: "cat-7", tags: [], receiptUrl: null, date: new Date("2026-04-01"), isRecurring: true, recurringInterval: "monthly", createdAt: new Date(), category: mockCategories[6] },
  { id: "tx-5", accountId: "acc-1", userId: "user-1", type: "expense", amount: 120, note: "ชานมไข่มุก x2", categoryId: "cat-1", tags: ["cafe"], receiptUrl: null, date: new Date("2026-04-12"), isRecurring: false, recurringInterval: null, createdAt: new Date(), category: mockCategories[0] },
];

export const mockBudgets = [
  { id: "bud-1", userId: "user-1", categoryId: "cat-1", amount: 3000, spent: 2450, period: "monthly", startDate: new Date("2026-04-01"), createdAt: new Date(), category: mockCategories[0] },
  { id: "bud-2", userId: "user-1", categoryId: "cat-2", amount: 1500, spent: 350, period: "monthly", startDate: new Date("2026-04-01"), createdAt: new Date(), category: mockCategories[1] },
  { id: "bud-3", userId: "user-1", categoryId: "cat-3", amount: 2000, spent: 1800, period: "monthly", startDate: new Date("2026-04-01"), createdAt: new Date(), category: mockCategories[2] },
  { id: "bud-4", userId: "user-1", categoryId: "cat-4", amount: 1000, spent: 200, period: "monthly", startDate: new Date("2026-04-01"), createdAt: new Date(), category: mockCategories[3] },
];

export const mockSavingGoals = [
  { id: "goal-1", userId: "user-1", name: "iPad Air", targetAmount: 25000, currentAmount: 12500, deadline: new Date("2026-08-01"), icon: "tablet", color: "#CECBF6", createdAt: new Date() },
  { id: "goal-2", userId: "user-1", name: "ทริปญี่ปุ่น 🇯🇵", targetAmount: 40000, currentAmount: 8000, deadline: new Date("2026-12-01"), icon: "plane", color: "#9FE1CB", createdAt: new Date() },
  { id: "goal-3", userId: "user-1", name: "Emergency Fund", targetAmount: 30000, currentAmount: 28500, deadline: null, icon: "shield", color: "#FAC775", createdAt: new Date() },
];

export const mockNotifications = [
  { id: "notif-1", userId: "user-1", type: "budget_warning", message: "งบอาหารใช้ไป 82% แล้ว! 🍡 เหลืออีก ฿550", isRead: false, createdAt: new Date("2026-04-15T08:00:00") },
  { id: "notif-2", userId: "user-1", type: "budget_warning", message: "งบช้อปปิ้งใช้ไป 90% แล้ว! 🛍️ เหลืออีก ฿200", isRead: false, createdAt: new Date("2026-04-14T14:30:00") },
  { id: "notif-3", userId: "user-1", type: "goal_deadline", message: "เป้าหมาย 'iPad Air' ถึง 50% แล้ว! 🎉 สู้ๆ นะ", isRead: true, createdAt: new Date("2026-04-10T10:00:00") },
];

export const mockChartData = {
  incomeVsExpense: [
    { month: "พ.ย.", income: 15000, expense: 11200 },
    { month: "ธ.ค.", income: 16500, expense: 14800 },
    { month: "ม.ค.", income: 15000, expense: 9800 },
    { month: "ก.พ.", income: 15000, expense: 12400 },
    { month: "มี.ค.", income: 17000, expense: 13200 },
    { month: "เม.ย.", income: 15000, expense: 4800 },
  ],
  expenseByCategory: [
    { name: "อาหาร", value: 2450, color: "#FAC775" },
    { name: "เดินทาง", value: 350, color: "#CECBF6" },
    { name: "ช้อปปิ้ง", value: 1800, color: "#F4C0D1" },
    { name: "บันเทิง", value: 200, color: "#9FE1CB" },
  ],
};

export const mockInsight = "เดือนนี้ค่าอาหารใช้ไป 82% ของงบแล้วน้า 🍡 ลองทำข้าวกินเองบ้างจะประหยัดขึ้นเยอะเลย!";

export const defaultCategories = [
  { name: "อาหาร", icon: "utensils", color: "#FAC775", type: "expense" },
  { name: "เดินทาง", icon: "car", color: "#CECBF6", type: "expense" },
  { name: "ช้อปปิ้ง", icon: "shopping-bag", color: "#F4C0D1", type: "expense" },
  { name: "บันเทิง", icon: "gamepad-2", color: "#9FE1CB", type: "expense" },
  { name: "ค่าเรียน", icon: "graduation-cap", color: "#87CEEB", type: "expense" },
  { name: "สุขภาพ", icon: "heart-pulse", color: "#FF9999", type: "expense" },
  { name: "ค่าที่พัก", icon: "home", color: "#DDA0DD", type: "expense" },
  { name: "สาธารณูปโภค", icon: "zap", color: "#FFB347", type: "expense" },
  { name: "เงินเดือน", icon: "banknote", color: "#9FE1CB", type: "income" },
  { name: "ฟรีแลนซ์", icon: "laptop", color: "#CECBF6", type: "income" },
  { name: "ค่าขนม", icon: "gift", color: "#FAC775", type: "income" },
  { name: "ทุนการศึกษา", icon: "award", color: "#87CEEB", type: "income" },
];
