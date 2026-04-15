import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-cream px-4">
      <div className="text-center max-w-md">
        <div className="text-7xl mb-4">🍡</div>
        <h1 className="text-4xl font-bold text-ink mb-2">Money Mochi</h1>
        <p className="text-ink/60 mb-8 text-lg">
          ติดตามรายรับรายจ่ายง่ายๆ
          <br />
          สไตล์น่ารัก สำหรับนักศึกษาและคนรักการออม
        </p>
        <div className="flex flex-col gap-3">
          <Link
            href="/login"
            className="btn-primary text-center text-lg"
          >
            เข้าสู่ระบบ
          </Link>
          <Link
            href="/register"
            className="btn-secondary text-center text-lg"
          >
            สร้างบัญชีใหม่
          </Link>
          <Link
            href="/dashboard"
            className="text-sakura-dark hover:text-sakura underline text-sm mt-2"
          >
            ดูตัวอย่าง Dashboard →
          </Link>
        </div>
      </div>
    </main>
  );
}
