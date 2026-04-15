# 🍡 Money Mochi

**จัดการเงินง่ายๆ น่ารักๆ กับ Money Mochi**

แอปจัดการการเงินส่วนตัวแบบ Mobile-First ที่ออกแบบมาให้ใช้งานง่าย สวยงาม พร้อมฟีเจอร์ AI ช่วยวิเคราะห์การใช้จ่าย

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8?logo=tailwindcss)
![Supabase](https://img.shields.io/badge/Supabase-Auth_&_DB-3ecf8e?logo=supabase)
![DeepSeek](https://img.shields.io/badge/DeepSeek-AI-blue)

---

## ✨ Features

### Core
- **Dashboard** — ภาพรวมการเงิน, กราฟรายรับ-รายจ่าย, งบประมาณ, บัญชี
- **Transactions** — บันทึกรายรับ-รายจ่าย, ค้นหา, กรอง, Export CSV
- **Budget** — ตั้งงบประมาณรายเดือนพร้อม Progress Bar
- **Goals** — เป้าหมายการออม พร้อม Progress Ring
- **Accounts** — จัดการหลายบัญชี (เงินสด, ธนาคาร, e-wallet)
- **Reports** — รายงานสรุป, กราฟ, Export PDF

### Advanced
- **Split Bill** — หารบิลกับเพื่อน คำนวณอัตโนมัติ
- **Import CSV** — นำเข้าข้อมูลจากไฟล์ CSV + AI จัดหมวดหมู่อัตโนมัติ
- **Mochi Insight** — AI วิเคราะห์พฤติกรรมการเงินและให้คำแนะนำ (DeepSeek)
- **Notifications** — แจ้งเตือน Push เมื่อใกล้เกินงบ
- **Receipt Upload** — แนบรูปใบเสร็จ (Supabase Storage)
- **PWA** — ติดตั้งเป็นแอปบนมือถือได้

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS |
| **Auth** | Supabase Auth (Email + Google OAuth) |
| **Database** | PostgreSQL (Supabase) |
| **ORM** | Prisma |
| **AI** | DeepSeek API (OpenAI-compatible) |
| **Charts** | Recharts |
| **Icons** | Lucide React |
| **Toast** | React Hot Toast |
| **Push** | Web Push (VAPID) |
| **Storage** | Supabase Storage |

---

## 📁 Project Structure

```
Money Mochi/
├── prisma/
│   └── schema.prisma          # Database schema (9 models)
├── public/
│   └── manifest.json          # PWA manifest
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/         # Login page
│   │   │   ├── register/      # Register page
│   │   │   └── onboarding/    # 3-step onboarding wizard
│   │   ├── (app)/
│   │   │   ├── dashboard/     # Main dashboard
│   │   │   ├── transactions/  # Transaction list
│   │   │   ├── add-transaction/ # Add income/expense
│   │   │   ├── budget/        # Budget management
│   │   │   ├── goals/         # Saving goals
│   │   │   ├── reports/       # Financial reports
│   │   │   ├── accounts/      # Account management
│   │   │   ├── split-bill/    # Bill splitting
│   │   │   ├── import/        # CSV import
│   │   │   ├── notifications/ # Notification center
│   │   │   └── settings/      # App settings
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Landing page
│   ├── components/
│   │   ├── ui/                # Button, Card, Modal, Input, Badge, etc.
│   │   ├── layout/            # Sidebar, Navbar, FAB, AppLayout
│   │   └── charts/            # BarChart, DonutChart, LineChart, ProgressRing
│   └── lib/
│       ├── prisma.ts          # Prisma client singleton
│       ├── supabase.ts        # Supabase browser client
│       ├── supabase-server.ts # Supabase server client
│       ├── deepseek.ts        # DeepSeek AI client
│       ├── auth.ts            # Auth helpers
│       ├── push.ts            # Web Push helpers
│       ├── utils.ts           # Utility functions
│       └── mock-data.ts       # Mock data for prototyping
├── .env                       # Environment variables
├── tailwind.config.ts
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
git clone <your-repo-url>
cd money-mochi

# 2. Install dependencies
npm install

# 3. Set up environment variables
# Copy .env.example or create .env with the following:
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

# Web Push (generate: npx web-push generate-vapid-keys)
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your-public-key
VAPID_PRIVATE_KEY=your-private-key
VAPID_EMAIL=mailto:your-email@example.com
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
- **Typography** — Noto Sans Thai
- **Mobile-First** — Responsive sidebar, bottom FAB
- **Dark Mode** — Coming soon

---

## 📄 License

MIT

---

Made with 🍡 by Money Mochi Team
