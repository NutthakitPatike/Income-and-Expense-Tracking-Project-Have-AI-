# 🍡 Money Mochi

**จัดการเงินง่ายๆ น่ารักๆ กับ Money Mochi**

แอปจัดการการเงินส่วนตัวแบบ Mobile-First ที่ออกแบบมาให้ใช้งานง่าย สวยงาม พร้อม Dark Mode และฟีเจอร์ AI ช่วยวิเคราะห์การใช้จ่าย

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8?logo=tailwindcss)
![Supabase](https://img.shields.io/badge/Supabase-Auth_&_DB-3ecf8e?logo=supabase)
![DeepSeek](https://img.shields.io/badge/DeepSeek-AI-blue)

---

## ✨ Features

### Core
- **Dashboard** — ภาพรวมการเงิน, กราฟรายรับ-รายจ่าย, งบประมาณ, บัญชี
- **Transactions** — บันทึกรายรับ-รายจ่าย, ค้นหา, กรองตามประเภท, ลบรายการ
- **Budget** — ตั้งงบประมาณรายเดือนต่อหมวดหมู่ พร้อม Progress Bar
- **Goals** — เป้าหมายการออม พร้อม Progress Ring, เพิ่มเงินทีละครั้ง
- **Accounts** — จัดการหลายบัญชี (เงินสด, ธนาคาร, e-wallet) CRUD ครบ
- **Categories** — จัดการหมวดหมู่รายรับ-รายจ่าย พร้อมเลือกไอคอนและสี
- **Reports** — รายงานสรุปรายเดือน, กราฟ Donut สัดส่วนรายจ่าย

### Advanced
- **Dark Mode** — สลับธีม Light/Dark ได้จากหน้าตั้งค่า, บันทึกลง localStorage
- **Split Bill** — หารบิลกับเพื่อน คำนวณอัตโนมัติ
- **Import CSV** — นำเข้าข้อมูลจากไฟล์ CSV + AI จัดหมวดหมู่อัตโนมัติ (DeepSeek)
- **Mochi Insight** — AI วิเคราะห์พฤติกรรมการเงินและให้คำแนะนำบน Dashboard
- **Notifications** — ระบบแจ้งเตือนในแอป พร้อม Badge จำนวนยังไม่อ่าน
- **Onboarding** — Wizard 3 ขั้นตอนสำหรับผู้ใช้ใหม่ (ชื่อ, บัญชี, หมวดหมู่)
- **Responsive** — Mobile-First ทุกหน้า, Sidebar overlay บนมือถือ, FAB สำหรับเพิ่มรายการ

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS (Dark Mode via `class` strategy) |
| **Auth** | Supabase Auth (Email + Google OAuth) |
| **Database** | PostgreSQL (Supabase) |
| **ORM** | Prisma |
| **AI** | DeepSeek API (OpenAI-compatible) |
| **Charts** | Custom SVG (DonutChart, ProgressRing, BarChart) |
| **Icons** | Lucide React |
| **Toast** | React Hot Toast |

---

## 📁 Project Structure

```
Money Mochi/
├── prisma/
│   └── schema.prisma            # Database schema
├── public/
│   ├── manifest.json            # PWA manifest
│   └── sw.js                    # Service worker
├── src/
│   ├── app/
│   │   ├── api/                 # API Routes (REST)
│   │   │   ├── accounts/        # CRUD บัญชี
│   │   │   ├── budgets/         # CRUD งบประมาณ
│   │   │   ├── categories/      # CRUD หมวดหมู่
│   │   │   ├── dashboard/       # ข้อมูลสรุป Dashboard
│   │   │   ├── goals/           # CRUD เป้าหมายออม
│   │   │   ├── import/          # นำเข้า CSV + AI
│   │   │   ├── insight/         # Mochi Insight (AI)
│   │   │   ├── notifications/   # แจ้งเตือน
│   │   │   ├── onboarding/      # ตั้งค่าเริ่มต้น
│   │   │   ├── transactions/    # CRUD รายการ
│   │   │   └── user/            # ข้อมูลผู้ใช้
│   │   ├── (auth)/
│   │   │   ├── login/           # หน้าเข้าสู่ระบบ
│   │   │   ├── register/        # หน้าสมัคร
│   │   │   └── onboarding/      # Wizard 3 ขั้นตอน
│   │   ├── (app)/
│   │   │   ├── dashboard/       # Dashboard หลัก
│   │   │   ├── transactions/    # รายการทั้งหมด
│   │   │   ├── add-transaction/ # เพิ่มรายรับ/รายจ่าย
│   │   │   ├── budget/          # จัดการงบประมาณ
│   │   │   ├── goals/           # เป้าหมายออม
│   │   │   ├── reports/         # รายงาน
│   │   │   ├── accounts/        # จัดการบัญชี
│   │   │   ├── categories/      # จัดการหมวดหมู่
│   │   │   ├── split-bill/      # หารบิล
│   │   │   ├── import/          # นำเข้า CSV
│   │   │   ├── notifications/   # ศูนย์แจ้งเตือน
│   │   │   └── settings/        # ตั้งค่า + Dark Mode toggle
│   │   ├── globals.css          # Global styles (Light + Dark)
│   │   └── layout.tsx           # Root layout + ThemeProvider
│   ├── components/
│   │   ├── ThemeProvider.tsx     # Dark Mode context + toggle
│   │   ├── ui/                  # Button, Card, Input, Badge, Modal, EmptyState, NotificationBell, Skeleton
│   │   ├── layout/              # Sidebar, Navbar, FAB, AppLayout
│   │   └── charts/              # DonutChart, BarChart, LineChart, ProgressRing
│   ├── lib/
│   │   ├── prisma.ts            # Prisma client singleton
│   │   ├── supabase.ts          # Supabase browser client
│   │   ├── supabase-server.ts   # Supabase server client
│   │   ├── deepseek.ts          # DeepSeek AI client
│   │   ├── auth.ts              # Auth helpers (getCurrentUser)
│   │   ├── push.ts              # Web Push helpers
│   │   └── utils.ts             # Utility functions (formatCurrency, cn, etc.)
│   └── middleware.ts            # Route protection (auth guard)
├── .env                         # Environment variables
├── tailwind.config.ts           # Tailwind + custom colors + dark mode
├── tsconfig.json
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Supabase account ([supabase.com](https://supabase.com))
- DeepSeek API key ([platform.deepseek.com](https://platform.deepseek.com))

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/NutthakitPatike/Income-and-Expense-Tracking-Project-Have-AI-.git
cd Money\ Mochi

# 2. Install dependencies
npm install

# 3. Set up environment variables
# สร้างไฟล์ .env ตามตัวอย่างด้านล่าง:
```

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Database
DATABASE_URL="postgresql://postgres:password@db.your-project.supabase.co:5432/postgres"

# DeepSeek AI
DEEPSEEK_API_KEY=your-deepseek-api-key
DEEPSEEK_BASE_URL=https://api.deepseek.com
```

```bash
# 4. Generate Prisma client
npx prisma generate

# 5. Push schema to database
npx prisma db push

# 6. Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🍡

---

## 📜 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npx prisma studio` | Open Prisma database GUI |
| `npx prisma db push` | Push schema changes to DB |

---

## 🎨 Design

- **Theme** — Soft pastel (Sakura pink, Mint green, Cream, Lavender)
- **Dark Mode** — สลับ Light/Dark ผ่านหน้า Settings, บันทึกค่าใน localStorage, ใช้ Tailwind `darkMode: "class"`
- **Typography** — Noto Sans Thai
- **Mobile-First** — Responsive ทุกหน้า, Sidebar overlay, bottom FAB, touch-friendly buttons
- **Avatar** — แสดง emoji 🍡 หรืออักษรตัวแรกของชื่อเมื่อไม่มีรูปโปรไฟล์

---

## 📄 License

MIT

---

Made with 🍡 by Money Mochi Team
