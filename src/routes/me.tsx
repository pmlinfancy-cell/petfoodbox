import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { loadOrders } from "@/lib/mock-data";

export const Route = createFileRoute("/me")({
  head: () => ({ meta: [{ title: "我的 · 猫食盒子" }] }),
  component: Me,
});

function Me() {
  const [authed, setAuthed] = useState(true);
  const orders = loadOrders();
  const total = orders.reduce((s, o) => s + o.amountYuan, 0);

  return (
    <AppShell>
      <PageHeader title="我的" />
      <div className="px-5">
        <div className="card-soft p-5 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-300 to-pink-300 flex items-center justify-center text-3xl">
            😺
          </div>
          <div className="flex-1">
            <p className="font-bold text-lg">{authed ? "猫粮赞助人" : "未登录"}</p>
            <p className="text-xs text-muted-foreground">
              {authed ? "微信授权 · openid_xxxx" : "登录后可保存投喂记录"}
            </p>
          </div>
          {!authed && (
            <button onClick={() => setAuthed(true)} className="btn-primary text-sm">微信登录</button>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3 mt-4">
          <Stat n={orders.length} l="投喂次数" />
          <Stat n={`¥${total}`} l="累计花费" />
          <Stat n={new Set(orders.map(o => o.catId).filter(Boolean)).size} l="喂过的猫" />
        </div>

        <div className="card-soft mt-4 divide-y divide-border">
          <MeItem icon="📋" label="我的投喂记录" to="/records" />
          <MeItem icon="🐾" label="关注的猫猫" to="/cats" />
          <MeItem icon="🛠" label="问题反馈" />
          <MeItem icon="ℹ️" label="关于猫食盒子" />
        </div>

        <p className="text-center text-[11px] text-muted-foreground mt-6">
          猫食盒子 · Demo v0.1 · 赛博养猫，也能吃好
        </p>
      </div>
    </AppShell>
  );
}

function Stat({ n, l }: { n: number | string; l: string }) {
  return (
    <div className="card-soft p-3 text-center">
      <p className="text-xl font-display text-primary">{n}</p>
      <p className="text-[11px] text-muted-foreground mt-1">{l}</p>
    </div>
  );
}

function MeItem({ icon, label, to }: { icon: string; label: string; to?: string }) {
  const inner = (
    <div className="flex items-center gap-3 p-4">
      <span className="text-xl">{icon}</span>
      <span className="flex-1 text-sm font-medium">{label}</span>
      <span className="text-muted-foreground">›</span>
    </div>
  );
  return to ? <Link to={to}>{inner}</Link> : <button className="w-full text-left" onClick={() => alert("敬请期待")}>{inner}</button>;
}
