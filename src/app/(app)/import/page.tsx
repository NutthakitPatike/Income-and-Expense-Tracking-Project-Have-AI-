"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Upload, FileSpreadsheet, Check, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function ImportPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string[][]>([]);
  const [csvText, setCsvText] = useState("");
  const [importing, setImporting] = useState(false);
  const [accounts, setAccounts] = useState<{ id: string; name: string }[]>([]);
  const [accountId, setAccountId] = useState("");

  useEffect(() => {
    fetch("/api/accounts").then((r) => r.json()).then((d) => {
      const list = Array.isArray(d) ? d : [];
      setAccounts(list);
      if (list.length > 0) setAccountId(list[0].id);
    }).catch(() => {});
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      const reader = new FileReader();
      reader.onload = (ev) => {
        const text = ev.target?.result as string;
        setCsvText(text);
        const lines = text.split("\n").filter((l) => l.trim());
        const rows = lines.slice(0, 10).map((l) => l.split(",").map((c) => c.trim()));
        setPreview(rows);
      };
      reader.readAsText(f);
    }
  };

  const handleImport = async () => {
    if (!csvText || !accountId) {
      toast.error("กรุณาเลือกไฟล์และบัญชี");
      return;
    }
    setImporting(true);
    try {
      const res = await fetch("/api/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ csv: csvText, accountId }),
      });
      if (res.ok) {
        const data = await res.json();
        toast.success(`นำเข้าสำเร็จ ${data.count || ""} รายการ! 🎉`);
        router.push("/transactions");
      } else {
        toast.error("นำเข้าไม่สำเร็จ");
      }
    } catch {
      toast.error("เกิดข้อผิดพลาด");
    }
    setImporting(false);
  };

  return (
    <AppLayout title="นำเข้ารายการ">
      <div className="space-y-4">
        <Card className="text-center py-8">
          <label className="cursor-pointer inline-flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-sakura/20 flex items-center justify-center">
              <Upload className="w-7 h-7 text-sakura-dark" />
            </div>
            <div>
              <p className="font-semibold text-ink dark:text-ink-dark">อัพโหลดไฟล์ CSV</p>
              <p className="text-xs text-ink/40 dark:text-ink-dark/40 mt-1">รองรับไฟล์ CSV จากธนาคาร</p>
            </div>
            <input type="file" accept=".csv" onChange={handleFileChange} className="hidden" />
          </label>
        </Card>

        {file && (
          <>
            {/* Account selector */}
            <Card>
              <label className="block text-sm font-medium text-ink/70 dark:text-ink-dark/70 mb-2">นำเข้าเข้าบัญชี</label>
              <div className="flex flex-wrap gap-2">
                {accounts.map((acc) => (
                  <button key={acc.id} type="button" onClick={() => setAccountId(acc.id)}
                    className={`px-3 py-2 rounded-full text-sm border transition-all ${accountId === acc.id ? "bg-lavender/20 border-lavender text-purple-700" : "bg-white dark:bg-[#333330] border-sakura/20 text-ink/50 dark:text-ink-dark/50"}`}
                  >{acc.name}</button>
                ))}
              </div>
            </Card>

            <Card>
              <div className="flex items-center gap-3 mb-3">
                <FileSpreadsheet className="w-5 h-5 text-mint" />
                <div>
                  <p className="text-sm font-medium text-ink dark:text-ink-dark">{file.name}</p>
                  <p className="text-xs text-ink/40 dark:text-ink-dark/40">{preview.length} บรรทัด (แสดง 10 บรรทัดแรก)</p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <tbody>
                    {preview.map((row, i) => (
                      <tr key={i} className="border-b border-sakura/5">
                        {row.map((cell, j) => (
                          <td key={j} className="py-2 pr-4 text-ink/70 dark:text-ink-dark/70">{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
            <Button className="w-full" onClick={handleImport} disabled={importing}>
              {importing ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> AI กำลังจัดหมวดหมู่...  </>
              ) : (
                <><Check className="w-4 h-4" /> AI จัดหมวดหมู่และนำเข้า</>
              )}
            </Button>
          </>
        )}

        {!file && (
          <EmptyState icon="📁" title="ยังไม่ได้อัพโหลดไฟล์" description="เลือกไฟล์ CSV จากธนาคารเพื่อนำเข้ารายการ" />
        )}
      </div>
    </AppLayout>
  );
}
