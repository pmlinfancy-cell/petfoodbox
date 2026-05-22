import { Link, useLocation } from "@tanstack/react-router";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const tabs = [
    { to: "/", icon: "🗺", label: "投食" },
    { to: "/records", icon: "📋", label: "记录" },
    { to: "/cats", icon: "🐾", label: "猫猫" },
    { to: "/me", icon: "👤", label: "我的" },
  ];
  return (
    <div className="min-h-screen paw-bg flex justify-center">
      <div className="relative w-full max-w-[460px] min-h-screen pb-24 bg-background/40">
        {children}
        <nav className="fixed bottom-0 left-0 right-0 flex justify-center pointer-events-none z-50">
          <div className="w-full max-w-[460px] px-3 pb-3 pointer-events-auto">
            <div className="card-soft flex items-center justify-around py-2">
              {tabs.map(t => {
                const active = t.to === "/" ? pathname === "/" : pathname.startsWith(t.to);
                return (
                  <Link key={t.to} to={t.to} className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors"
                    style={{ color: active ? "var(--color-primary)" : "var(--color-muted-foreground)" }}>
                    <span className="text-xl leading-none">{t.icon}</span>
                    <span className={`text-[11px] font-semibold ${active ? "" : "opacity-70"}`}>{t.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}

export function PageHeader({ title, subtitle, back }: { title: string; subtitle?: string; back?: string }) {
  return (
    <header className="px-5 pt-6 pb-4 flex items-start gap-3">
      {back && (
        <Link to={back} className="card-soft w-10 h-10 flex items-center justify-center text-lg shrink-0">←</Link>
      )}
      <div className="flex-1">
        <h1 className="text-2xl text-foreground">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
      </div>
    </header>
  );
}

export function CatAvatar({ emoji, color, size = 48 }: { emoji: string; color: string; size?: number }) {
  return (
    <div
      className={`bg-gradient-to-br ${color} rounded-full flex items-center justify-center shrink-0 shadow-inner ring-2 ring-white/60`}
      style={{ width: size, height: size, fontSize: size * 0.55 }}
    >
      <span>{emoji}</span>
    </div>
  );
}
