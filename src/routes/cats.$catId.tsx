import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AppShell, CatAvatar, PageHeader } from "@/components/AppShell";
import { CATS, getDevice, loadOrders, statusLabel } from "@/lib/mock-data";

export const Route = createFileRoute("/cats/$catId")({
  head: () => ({ meta: [{ title: "猫猫详情 · 猫食盒子" }] }),
  component: CatDetail,
});

function CatDetail() {
  const { catId } = Route.useParams();
  const cat = CATS.find(c => c.id === catId);
  if (!cat) throw notFound();

  const orders = loadOrders().filter(o => o.catId === cat.id);

  return (
    <AppShell>
      <PageHeader title="猫猫档案" back="/cats" />
      <div className="px-5">
        <div className="card-soft p-6 flex flex-col items-center text-center">
          <CatAvatar emoji={cat.emoji} color={cat.color} size={120} />
          <h2 className="text-3xl mt-3">{cat.name}</h2>
          <p className="text-sm text-muted-foreground mt-1">{cat.breed} · {cat.ageEstimate}</p>
          <div className="flex gap-1 mt-3 flex-wrap justify-center">
            {cat.tags.map(t => <span key={t} className="chip">{t}</span>)}
          </div>
          <p className="text-sm text-muted-foreground mt-4 leading-relaxed max-w-xs">{cat.bio}</p>
          <p className="text-[11px] text-muted-foreground mt-3">首次识别 · {cat.firstSeen}</p>
        </div>

        <h3 className="font-bold mt-6 mb-2">近期投喂</h3>
        {orders.length === 0 ? (
          <div className="card-soft p-6 text-center text-sm text-muted-foreground">
            这只猫还在建立档案中，欢迎第一次投喂 🍚
          </div>
        ) : (
          <ul className="space-y-2">
            {orders.map(o => {
              const s = statusLabel(o.status);
              return (
                <li key={o.id}>
                  <Link to="/records/$orderId" params={{ orderId: o.id }} className="card-soft p-3 flex justify-between items-center">
                    <div>
                      <p className="text-sm font-semibold">{getDevice(o.deviceId)?.name}</p>
                      <p className="text-[11px] text-muted-foreground">{new Date(o.createdAt).toLocaleString("zh-CN", { hour12: false })}</p>
                    </div>
                    <span className={`chip ${s.tone}`}>{s.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}

        <Link to="/" className="btn-primary block text-center mt-6">返回首页</Link>
      </div>
    </AppShell>
  );
}
