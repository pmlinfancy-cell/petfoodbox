import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, CatAvatar, PageHeader } from "@/components/AppShell";
import { CATS } from "@/lib/mock-data";

export const Route = createFileRoute("/cats")({
  head: () => ({ meta: [{ title: "猫猫档案 · 猫食盒子" }] }),
  component: CatsPage,
});

function CatsPage() {
  return (
    <AppShell>
      <PageHeader title="猫猫档案" subtitle={`在档 ${CATS.length} 只 · 已识别入库`} />
      <div className="px-5 grid grid-cols-2 gap-3">
        {CATS.map(c => (
          <Link key={c.id} to="/cats/$catId" params={{ catId: c.id }} className="card-soft p-4 flex flex-col items-center text-center">
            <CatAvatar emoji={c.emoji} color={c.color} size={72} />
            <p className="font-bold mt-2">{c.name}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5 truncate w-full">{c.breed}</p>
            <div className="flex gap-1 mt-2 flex-wrap justify-center">
              {c.tags.map(t => <span key={t} className="chip text-[10px]">{t}</span>)}
            </div>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}
