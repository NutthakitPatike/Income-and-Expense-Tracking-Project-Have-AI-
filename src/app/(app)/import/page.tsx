"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Upload, FileSpreadsheet, Check } from "lucide-react";

export default function ImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string[][]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      // Mock preview
      setPreview([
        ["15/04/2026", "โอนเงิน SCB", "-350.00"],
        ["14/04/2026", "ร้านกาแฟ", "-85.00"],
        ["13/04/2026", "เงินเดือน", "+15000.00"],
      ]);
    }
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
              <p className="font-semibold text-ink">อัพโหลดไฟล์ CSV</p>
              <p className="text-xs text-ink/40 mt-1">รองรับไฟล์ CSV จากธนาคาร</p>
            </div>
            <input type="file" accept=".csv" onChange={handleFileChange} className="hidden" />
          </label>
        </Card>

        {file && (
          <>
            <Card>
              <div className="flex items-center gap-3 mb-3">
                <FileSpreadsheet className="w-5 h-5 text-mint" />
                <div>
                  <p className="text-sm font-medium text-ink">{file.name}</p>
                  <p className="text-xs text-ink/40">{preview.length} รายการ</p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-ink/50 border-b border-sakura/10">
                      <th className="py-2 pr-4">วันที่</th>
                      <th className="py-2 pr-4">รายละเอียด</th>
                      <th className="py-2">จำนวนเงิน</th>
                    </tr>
                  </thead>
                  <tbody>
                    {preview.map((row, i) => (
                      <tr key={i} className="border-b border-sakura/5">
                        <td className="py-2 pr-4 text-ink/60">{row[0]}</td>
                        <td className="py-2 pr-4 text-ink">{row[1]}</td>
                        <td className={`py-2 font-medium ${row[2].startsWith("+") ? "text-green-600" : "text-sakura-dark"}`}>
                          {row[2]}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
            <Button className="w-full">
              <Check className="w-4 h-4" /> AI จัดหมวดหมู่และนำเข้า
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
