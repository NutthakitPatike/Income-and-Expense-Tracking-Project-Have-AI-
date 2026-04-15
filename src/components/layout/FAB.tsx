"use client";

import { Plus } from "lucide-react";
import Link from "next/link";

export function FAB() {
  return (
    <Link
      href="/add-transaction"
      className="fab"
      aria-label="เพิ่มรายการ"
    >
      <Plus className="w-6 h-6" />
    </Link>
  );
}
