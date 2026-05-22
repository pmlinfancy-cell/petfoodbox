import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell, CatAvatar, PageHeader } from "@/components/AppShell";
import { getCat, getDevice, loadOrders, statusLabel, type Order } from "@/lib/mock-data";

export const Route = createFileRoute("/records")({
  head: () => ({ meta: [{ title: "投喂记录 · 猫食盒子" }] }),
  component: RecordsPage,
});

function RecordsPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    setOrders(loadOrders());
    const t = setInterval(() => setOrders(loadOrders()), 1500);
    return () => clearInterval(t);
  }, []);

  return (
    <AppShell>
      <PageHeader title="投喂记录" subtitle="你养过的每一只猫，都在这里" />
      <div className="px-5 space-y-3">
        {orders.length === 0 && (
          <div className="card-soft p-8 text-center">
            <div className="text-5xl mb-3">🐾</div>
            <p className="font-bold">还没有投喂记录</p>
            <p className="text-sm text-muted-foreground mt-1">去看看附近的猫猫吧</p>
            <Link to="/" className="btn-primary inline-block mt-4">去投喂</Link>
          </div>
        )}
        {orders.map(o => {
          const cat = getCat(o.catId);
          const device = getDevice(o.deviceId);
          const s = statusLabel(o.status);
          return (
            <Link key={o.id} to="/records/$orderId" params={{ orderId: o.id }}
              className="card-soft p-4 flex items-center gap-3">
              {cat
                ? <CatAvatar emoji={cat.emoji} color={cat.color} size={52} />
                : <div className="w-13 h-13 w-[52px] h-[52px] rounded-full bg-muted flex items-center justify-center text-2xl">❓</div>}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-bold truncate">{cat ? cat.name : "尚未识别"}</p>
                  <span className={`chip ${s.tone}`}>{s.label}</span>
                </div>
                <p className="text-xs text-muted-foreground truncate mt-0.5">{device?.name} · {o.mg}mg</p>
                <p className="text-[11px] text-muted-foreground/80 mt-1">{new Date(o.createdAt).toLocaleString("zh-CN", { hour12: false })}</p>
              </div>
              <span className="text-muted-foreground">›</span>
            </Link>
          );
        })}
      </div>
    </AppShell>
  );
}
