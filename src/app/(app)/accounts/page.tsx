"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { mockAccounts } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import { Plus, Wallet, Building2, Smartphone } from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  cash: <Wallet className="w-5 h-5" />,
  bank: <Building2 className="w-5 h-5" />,
  wallet: <Smartphone className="w-5 h-5" />,
};

const typeLabel: Record<string, string> = {
  cash: "เงินสด",
  bank: "ธนาคาร",
  wallet: "E-Wallet",
};

export default function AccountsPage() {
  const totalBalance = mockAccounts.reduce((sum, a) => sum + a.balance, 0);

  return (
    <AppLayout title="บัญชี">
      <div className="space-y-4">
        <Card className="bg-gradient-to-br from-sakura/30 to-lavender/20 border-none text-center">
          <p className="text-sm text-ink/60">ยอดเงินทั้งหมด</p>
          <p className="text-3xl font-bold text-ink mt-1">{formatCurrency(totalBalance)}</p>
        </Card>

        <div className="flex justify-between items-center">
          <p className="text-sm text-ink/50">บัญชีของคุณ ({mockAccounts.length})</p>
          <Button size="sm">
            <Plus className="w-4 h-4" /> เพิ่มบัญชี
          </Button>
        </div>

        <div className="grid gap-3">
          {mockAccounts.map((account) => (
            <Card key={account.id} className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: `${account.color}30`, color: account.color }}
              >
                {iconMap[account.type]}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-ink text-sm">{account.name}</p>
                <Badge className="mt-0.5">{typeLabel[account.type]}</Badge>
              </div>
              <p className="font-bold text-ink">{formatCurrency(account.balance)}</p>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
