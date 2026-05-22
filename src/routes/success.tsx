import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/success")({
  validateSearch: z.object({ order: z.string() }),
  head: () => ({ meta: [{ title: "投喂成功 · 猫食盒子" }] }),
  component: SuccessPage,
});

function SuccessPage() {
  const { order } = Route.useSearch();
  return (
    <AppShell>
      <div className="px-5 pt-16 flex flex-col items-center text-center">
        <div className="relative">
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-emerald-300 to-emerald-500 flex items-center justify-center text-5xl shadow-xl">
            🍱
          </div>
          <span className="absolute -top-2 -right-2 text-3xl animate-bounce">✨</span>
        </div>
        <h1 className="text-3xl mt-6">投喂下单成功</h1>
        <p className="text-sm text-muted-foreground mt-2 max-w-xs">
          已加入投食队列，设备正在出粮。猫猫识别到进食后会自动更新记录哦。
        </p>

        <div className="card-soft w-full mt-6 p-4 text-left">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">订单号</span>
            <span className="font-mono text-xs">{order}</span>
          </div>
          <div className="flex justify-between text-sm mt-2">
            <span className="text-muted-foreground">状态</span>
            <span className="chip bg-amber-100 text-amber-800">队列中 → 即将出粮</span>
          </div>
        </div>

        <div className="w-full mt-8 space-y-3">
          <Link to="/records/$orderId" params={{ orderId: order }} className="btn-primary block text-center">
            查看本次投喂记录
          </Link>
          <Link to="/" className="block text-center text-sm text-muted-foreground py-2">
            返回首页
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
