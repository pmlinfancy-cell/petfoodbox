import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { AppShell, PageHeader } from "@/components/AppShell";
import { DEVICES, PACKAGES, addOrder, newOrderId, updateOrder } from "@/lib/mock-data";

export const Route = createFileRoute("/pay")({
  validateSearch: z.object({ device: z.string().optional() }),
  head: () => ({ meta: [{ title: "立即投喂 · 猫食盒子" }] }),
  component: PayPage,
});

function PayPage() {
  const { device: deviceId } = Route.useSearch();
  const navigate = useNavigate();
  const device = DEVICES.find(d => d.id === deviceId) ?? DEVICES[0];
  const [pkgId, setPkgId] = useState(PACKAGES[0].id);
  const [paying, setPaying] = useState(false);
  const pkg = PACKAGES.find(p => p.id === pkgId)!;

  const handlePay = () => {
    setPaying(true);
    const id = newOrderId();
    const order = {
      id, deviceId: device.id, amountYuan: pkg.price, mg: pkg.mg,
      status: "queued" as const, createdAt: Date.now(),
    };
    addOrder(order);
    // simulate state machine
    setTimeout(() => updateOrder(id, { status: "dispensed", dispensedAt: Date.now() }), 3500);
    setTimeout(() => {
      const catIds = ["c1", "c2", "c3", "c4", "c5"];
      updateOrder(id, { status: "eaten", eatenAt: Date.now(), catId: catIds[Math.floor(Math.random() * catIds.length)] });
    }, 8000);
    setTimeout(() => navigate({ to: "/success", search: { order: id } }), 900);
  };

  return (
    <AppShell>
      <PageHeader title="选个套餐" subtitle="为这只可能很饿的小猫加一顿饭" back="/" />

      <div className="px-5">
        <div className="card-soft p-4 mb-4">
          <p className="text-xs text-muted-foreground">投喂设备</p>
          <p className="font-bold mt-1">{device.name}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{device.location}</p>
        </div>

        {/* trust */}
        <div className="card-soft p-4 mb-4 bg-gradient-to-br from-amber-50 to-orange-50">
          <div className="grid grid-cols-3 text-center gap-2">
            <div>
              <p className="text-xl font-display text-primary">12,408</p>
              <p className="text-[11px] text-muted-foreground mt-1">人已投喂</p>
            </div>
            <div className="border-x border-border/60">
              <p className="text-xl font-display text-primary">37</p>
              <p className="text-[11px] text-muted-foreground mt-1">只猫吃饱</p>
            </div>
            <div>
              <p className="text-xl font-display text-primary">23s</p>
              <p className="text-[11px] text-muted-foreground mt-1">平均到粮</p>
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground text-center mt-3">
            💚 所有猫粮均在保质期内，批次可溯源
          </p>
        </div>

        <h3 className="text-sm font-bold mb-2 text-muted-foreground">选择投喂量</h3>
        <div className="space-y-3">
          {PACKAGES.map(p => {
            const active = pkgId === p.id;
            return (
              <button key={p.id} disabled={!p.enabled}
                onClick={() => setPkgId(p.id)}
                className={`w-full card-soft p-4 flex items-center justify-between text-left transition
                  ${active ? "ring-2 ring-primary" : ""} ${!p.enabled ? "opacity-50" : ""}`}>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-lg">¥{p.price}</p>
                    <span className="chip">{p.label}</span>
                    {!p.enabled && <span className="chip bg-muted">即将开放</span>}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">约 {p.mg}mg 猫粮 · 1~2 只猫的一顿</p>
                </div>
                <span className={`w-6 h-6 rounded-full border-2 ${active ? "bg-primary border-primary" : "border-border"} flex items-center justify-center text-white text-xs`}>
                  {active && "✓"}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="fixed bottom-20 left-0 right-0 flex justify-center pointer-events-none z-30">
        <div className="w-full max-w-[460px] px-5 pointer-events-auto">
          <button onClick={handlePay} disabled={paying} className="btn-primary w-full text-base">
            {paying ? "🐾 正在为你投喂…" : `立即投喂 · ¥${pkg.price}`}
          </button>
          <p className="text-[11px] text-center text-muted-foreground mt-2">Demo 演示·支付为模拟回调</p>
        </div>
      </div>
    </AppShell>
  );
}
