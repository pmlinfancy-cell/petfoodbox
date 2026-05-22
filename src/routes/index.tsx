import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, CatAvatar } from "@/components/AppShell";
import { CATS, DEVICES } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "猫食盒子 · 赛博养猫也能吃好" },
      { name: "description", content: "深大校园投食机地图，一元就能给附近的猫加一顿饭。" },
      { property: "og:title", content: "猫食盒子" },
      { property: "og:description", content: "户外投食机 + 猫脸识别 + 投喂闭环。" },
    ],
  }),
  component: Home,
});

function Home() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(DEVICES.find(d => d.status === "online")!.id);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const device = DEVICES.find(d => d.id === selected)!;

  return (
    <AppShell>
      <header className="px-5 pt-6 pb-3 flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">深大·粤海校区</p>
          <h1 className="text-2xl">附近的猫，等你投喂 🍱</h1>
        </div>
        <Link to="/me" className="card-soft w-11 h-11 rounded-full flex items-center justify-center text-lg">😺</Link>
      </header>

      {/* Map */}
      <div className="mx-5 card-soft overflow-hidden">
        <div
          className="relative h-[320px]"
          style={{
            background:
              "radial-gradient(circle at 30% 40%, oklch(0.85 0.08 150 / 0.5), transparent 40%)," +
              "radial-gradient(circle at 70% 70%, oklch(0.82 0.1 200 / 0.4), transparent 45%)," +
              "linear-gradient(135deg, oklch(0.94 0.04 130), oklch(0.92 0.04 170))",
          }}
        >
          {/* fake roads */}
          <svg className="absolute inset-0 w-full h-full opacity-40" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,50 Q30,40 50,55 T100,45" stroke="white" strokeWidth="2" fill="none" />
            <path d="M50,0 Q55,40 45,60 T55,100" stroke="white" strokeWidth="2" fill="none" />
            <circle cx="50" cy="50" r="14" fill="oklch(0.7 0.12 200 / 0.25)" />
          </svg>
          <div className="absolute top-3 left-3 chip bg-white/80">📍 深圳大学</div>

          {DEVICES.map(d => {
            const tone = d.status === "online" ? "bg-emerald-500" : d.status === "busy" ? "bg-amber-500" : "bg-zinc-400";
            const active = d.id === selected;
            return (
              <button
                key={d.id}
                onClick={() => d.status !== "offline" && setSelected(d.id)}
                className="absolute -translate-x-1/2 -translate-y-1/2 group"
                style={{ left: `${d.x}%`, top: `${d.y}%` }}
              >
                <div className={`relative ${active ? "scale-125" : ""} transition-transform`}>
                  {d.status === "online" && (
                    <span className={`absolute inset-0 rounded-full ${tone} opacity-40 animate-ping`} />
                  )}
                  <span className={`relative block w-7 h-7 rounded-full ${tone} ring-4 ring-white flex items-center justify-center text-white text-sm shadow-lg`}>
                    🐾
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* device card */}
        <div className="p-4 border-t border-border bg-card">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg">{device.name}</h3>
                <span className={`chip ${device.status === "online" ? "bg-emerald-100 text-emerald-700" : device.status === "busy" ? "bg-amber-100 text-amber-700" : "bg-zinc-200 text-zinc-600"}`}>
                  {device.status === "online" ? "在线·空闲" : device.status === "busy" ? "执行中" : "离线"}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{device.location}</p>
              <p className="text-xs text-muted-foreground mt-2">今日已投喂 <b className="text-foreground">{device.feedToday}</b> 次</p>
            </div>
          </div>
          <button
            disabled={device.status === "offline"}
            onClick={() => navigate({ to: "/pay", search: { device: device.id } })}
            className="btn-primary w-full mt-4 text-base"
          >
            🍚 开始投食
          </button>
        </div>
      </div>

      {/* quick row */}
      <div className="px-5 mt-4 grid grid-cols-2 gap-3">
        <Link to="/records" className="card-soft p-3 flex items-center gap-3">
          <span className="text-2xl">📋</span>
          <div>
            <p className="font-semibold text-sm">投喂记录</p>
            <p className="text-xs text-muted-foreground">看看猫吃没吃</p>
          </div>
        </Link>
        <button onClick={() => setDrawerOpen(true)} className="card-soft p-3 flex items-center gap-3 text-left">
          <span className="text-2xl">🐱</span>
          <div>
            <p className="font-semibold text-sm">猫猫列表</p>
            <p className="text-xs text-muted-foreground">{CATS.length} 只在档</p>
          </div>
        </button>
      </div>

      {/* recent cats horizontal */}
      <section className="px-5 mt-5">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg">最近露面</h2>
          <Link to="/cats" className="text-xs text-primary font-semibold">查看全部 →</Link>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5">
          {CATS.map(c => (
            <Link key={c.id} to="/cats/$catId" params={{ catId: c.id }}
              className="card-soft p-3 w-32 shrink-0 flex flex-col items-center text-center">
              <CatAvatar emoji={c.emoji} color={c.color} size={56} />
              <p className="font-bold text-sm mt-2 truncate w-full">{c.name}</p>
              <p className="text-[11px] text-muted-foreground truncate w-full">{c.ageEstimate}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* slide drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-40 flex justify-end" onClick={() => setDrawerOpen(false)}>
          <div className="absolute inset-0 bg-foreground/30" />
          <aside onClick={(e) => e.stopPropagation()}
            className="relative w-72 max-w-[80vw] bg-card h-full overflow-y-auto p-4 shadow-2xl animate-in slide-in-from-right">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold">猫猫列表</h3>
              <button onClick={() => setDrawerOpen(false)} className="text-muted-foreground">✕</button>
            </div>
            <ul className="space-y-2">
              {CATS.map(c => (
                <li key={c.id}>
                  <Link to="/cats/$catId" params={{ catId: c.id }} onClick={() => setDrawerOpen(false)}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted">
                    <CatAvatar emoji={c.emoji} color={c.color} size={40} />
                    <div className="min-w-0">
                      <p className="font-semibold text-sm">{c.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{c.breed}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      )}
    </AppShell>
  );
}
