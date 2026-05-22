import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell, CatAvatar, PageHeader } from "@/components/AppShell";
import { CATS, getCat, getDevice, getOrder, statusLabel, updateOrder, type Order } from "@/lib/mock-data";

export const Route = createFileRoute("/records/$orderId")({
  head: () => ({ meta: [{ title: "投喂详情 · 猫食盒子" }] }),
  component: RecordDetail,
});

function RecordDetail() {
  const { orderId } = Route.useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | undefined>(getOrder(orderId));
  const [naming, setNaming] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    const t = setInterval(() => setOrder(getOrder(orderId)), 1000);
    return () => clearInterval(t);
  }, [orderId]);

  if (!order) {
    return (
      <AppShell>
        <PageHeader title="记录不存在" back="/records" />
        <p className="px-5 text-muted-foreground">找不到这条投喂记录。</p>
      </AppShell>
    );
  }

  const cat = getCat(order.catId);
  const device = getDevice(order.deviceId);
  const s = statusLabel(order.status);

  const steps = [
    { key: "queued", label: "已下单", time: order.createdAt, desc: "支付成功，等待设备执行" },
    { key: "dispensed", label: "已出粮", time: order.dispensedAt, desc: "投食机已完成出粮" },
    { key: "eaten", label: "已进食", time: order.eatenAt, desc: "识别到猫猫吃到啦" },
  ];
  const stepIdx = order.status === "eaten" ? 3 : order.status === "dispensed" ? 2 : 1;

  return (
    <AppShell>
      <PageHeader title="投喂详情" back="/records" />
      <div className="px-5 space-y-4">
        <div className="card-soft p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-mono">{order.id}</p>
            <p className="text-lg font-bold mt-1">¥{order.amountYuan} · {order.mg}mg</p>
          </div>
          <span className={`chip ${s.tone}`}>{s.label}</span>
        </div>

        {/* video / preview */}
        <div className="card-soft overflow-hidden">
          <div className="relative aspect-video bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
            {order.status === "eaten" && cat ? (
              <div className="text-center text-white">
                <div className="text-6xl mb-2">{cat.emoji}</div>
                <p className="text-sm opacity-80">回传画面 · {cat.name} 正在吃</p>
                <button className="mt-3 text-xs underline opacity-70">▶︎ 播放完整视频</button>
              </div>
            ) : order.status === "dispensed" ? (
              <div className="text-center text-white/80 text-sm">
                <div className="text-4xl mb-2 animate-pulse">📷</div>
                等待识别猫咪到场…
              </div>
            ) : (
              <div className="text-center text-white/70 text-sm">
                <div className="text-4xl mb-2 animate-spin-slow">⏳</div>
                设备执行中
              </div>
            )}
          </div>
        </div>

        {/* timeline */}
        <div className="card-soft p-4">
          <h3 className="font-bold mb-3">投喂进度</h3>
          <ol className="relative pl-6">
            <div className="absolute left-2 top-2 bottom-2 w-px bg-border" />
            {steps.map((st, i) => {
              const done = i + 1 <= stepIdx;
              const current = i + 1 === stepIdx && order.status !== "eaten";
              return (
                <li key={st.key} className="relative pb-4 last:pb-0">
                  <span className={`absolute -left-[18px] top-1 w-4 h-4 rounded-full ring-2 ring-card
                    ${done ? "bg-primary" : "bg-border"} ${current ? "animate-pulse" : ""}`} />
                  <p className={`text-sm font-semibold ${done ? "" : "text-muted-foreground"}`}>{st.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{st.desc}</p>
                  {st.time && (
                    <p className="text-[11px] text-muted-foreground/70 mt-0.5">
                      {new Date(st.time).toLocaleString("zh-CN", { hour12: false })}
                    </p>
                  )}
                </li>
              );
            })}
          </ol>
        </div>

        {/* cat */}
        <div className="card-soft p-4">
          <h3 className="font-bold mb-3">这次喂的猫</h3>
          {cat ? (
            <div className="flex items-center gap-3">
              <CatAvatar emoji={cat.emoji} color={cat.color} size={56} />
              <div className="flex-1">
                <p className="font-bold">{cat.name}</p>
                <p className="text-xs text-muted-foreground">{cat.breed} · {cat.ageEstimate}</p>
              </div>
              <Link to="/cats/$catId" params={{ catId: cat.id }} className="chip">档案 →</Link>
            </div>
          ) : order.status === "eaten" ? (
            <div>
              <p className="text-sm text-muted-foreground mb-2">识别到一只未命名的猫，要不要给它起个名字？</p>
              {!naming ? (
                <button onClick={() => setNaming(true)} className="btn-primary">🏷 给它命名</button>
              ) : (
                <div className="flex gap-2">
                  <input value={name} onChange={e => setName(e.target.value)} placeholder="例如：小煤球"
                    className="flex-1 rounded-xl border border-input px-3 py-2 bg-card" />
                  <button className="btn-primary" onClick={() => {
                    const nc = CATS[Math.floor(Math.random() * CATS.length)];
                    updateOrder(order.id, { catId: nc.id });
                    setNaming(false);
                  }}>命名</button>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">等待识别…</p>
          )}
        </div>

        {/* meta */}
        <div className="card-soft p-4 text-sm space-y-2">
          <Row k="设备" v={`${device?.name} (${device?.id})`} />
          <Row k="位置" v={device?.location ?? "-"} />
          <Row k="支付" v="模拟支付 · 已完成" />
          <button className="text-xs text-primary font-semibold mt-2" onClick={() => alert("已记录反馈，运营会尽快处理 🙏")}>
            🛠 问题反馈
          </button>
        </div>

        <div className="flex gap-3 pt-1">
          <button onClick={() => navigate({ to: "/" })} className="flex-1 card-soft py-3 text-sm font-semibold">返回首页</button>
          <button onClick={() => navigate({ to: "/pay", search: { device: order.deviceId } })} className="btn-primary flex-1">再投一次</button>
        </div>
      </div>
    </AppShell>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{k}</span>
      <span className="font-medium text-right truncate ml-3">{v}</span>
    </div>
  );
}
