import type { Metadata, Viewport } from "next";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Money Mochi 🍡 — Personal Finance Tracker",
  description: "ติดตามรายรับรายจ่ายง่ายๆ สไตล์น่ารัก สำหรับนักศึกษาและคนรักการออม",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#F4C0D1",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" suppressHydrationWarning>
      <body className="min-h-screen bg-cream dark:bg-cream-dark dark:text-ink-dark" suppressHydrationWarning>
        <ThemeProvider>
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#fff",
              color: "#444441",
              borderRadius: "1rem",
              border: "1px solid rgba(244, 192, 209, 0.3)",
              padding: "12px 16px",
              fontSize: "14px",
            },
          }}
        />
        </ThemeProvider>
      </body>
    </html>
  );
}
