// Mock data + localStorage state for 猫食盒子 demo

export type Device = {
  id: string;
  name: string;
  location: string;
  x: number; // percent on map
  y: number;
  status: "online" | "offline" | "busy";
  feedToday: number;
};

export type Cat = {
  id: string;
  name: string;
  breed: string;
  ageEstimate: string;
  color: string;
  emoji: string;
  tags: string[];
  bio: string;
  firstSeen: string;
};

export type OrderStatus = "queued" | "dispensed" | "eaten" | "error";

export type Order = {
  id: string;
  deviceId: string;
  catId?: string;
  amountYuan: number;
  mg: number;
  status: OrderStatus;
  createdAt: number;
  dispensedAt?: number;
  eatenAt?: number;
  errorReason?: string;
};

export const DEVICES: Device[] = [
  { id: "SZU-A1", name: "粤海食堂喵机", location: "深大·粤海校区·一食堂南门", x: 28, y: 36, status: "online", feedToday: 42 },
  { id: "SZU-A2", name: "图书馆喵机", location: "深大·图书馆后院", x: 58, y: 24, status: "online", feedToday: 18 },
  { id: "SZU-A3", name: "杜鹃山喵机", location: "深大·杜鹃山小径", x: 72, y: 60, status: "busy", feedToday: 31 },
  { id: "SZU-A4", name: "文山湖喵机", location: "深大·文山湖畔", x: 42, y: 72, status: "offline", feedToday: 0 },
];

export const CATS: Cat[] = [
  { id: "c1", name: "橘里橘气", breed: "中华田园·橘猫", ageEstimate: "约 2 岁", color: "from-orange-300 to-amber-400", emoji: "🐱", tags: ["贪吃", "亲人"], bio: "食堂南门常驻，听到出粮声就跑来。", firstSeen: "2024-09-01" },
  { id: "c2", name: "黑米团子", breed: "中华田园·狸花", ageEstimate: "约 1 岁", color: "from-slate-600 to-slate-800", emoji: "🐈‍⬛", tags: ["机警", "夜行"], bio: "通常深夜出没在图书馆灌木丛。", firstSeen: "2024-11-12" },
  { id: "c3", name: "奶盖", breed: "中华田园·奶牛", ageEstimate: "约 3 岁", color: "from-zinc-200 to-zinc-400", emoji: "🐈", tags: ["元老", "佛系"], bio: "杜鹃山片区的老住户，毛色干净。", firstSeen: "2024-04-22" },
  { id: "c4", name: "三花小姐", breed: "中华田园·三花", ageEstimate: "约 1.5 岁", color: "from-rose-300 to-orange-300", emoji: "😺", tags: ["挑食", "傲娇"], bio: "只吃湿粮，干粮表演性闻一闻。", firstSeen: "2025-02-10" },
  { id: "c5", name: "云朵", breed: "中华田园·白猫", ageEstimate: "约 8 月", color: "from-blue-100 to-indigo-200", emoji: "😻", tags: ["小奶猫", "新入库"], bio: "今年春天刚被识别入库的小家伙。", firstSeen: "2026-03-18" },
];

export type Package = { id: string; price: number; mg: number; label: string; enabled: boolean };
export const PACKAGES: Package[] = [
  { id: "p1", price: 1, mg: 20, label: "尝鲜一口", enabled: true },
  { id: "p2", price: 3, mg: 70, label: "饱腹一餐", enabled: false },
  { id: "p3", price: 5, mg: 150, label: "豪华大餐", enabled: false },
];

// ----- order persistence -----
const KEY = "mc-orders";

const seed: Order[] = [
  { id: "ORD-20260520-001", deviceId: "SZU-A1", catId: "c1", amountYuan: 1, mg: 20, status: "eaten",
    createdAt: Date.now() - 86400000, dispensedAt: Date.now() - 86399000, eatenAt: Date.now() - 86380000 },
  { id: "ORD-20260521-002", deviceId: "SZU-A3", catId: "c3", amountYuan: 1, mg: 20, status: "eaten",
    createdAt: Date.now() - 43200000, dispensedAt: Date.now() - 43199000, eatenAt: Date.now() - 43180000 },
];

export function loadOrders(): Order[] {
  if (typeof window === "undefined") return seed;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      localStorage.setItem(KEY, JSON.stringify(seed));
      return seed;
    }
    return JSON.parse(raw) as Order[];
  } catch {
    return seed;
  }
}

export function saveOrders(orders: Order[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(orders));
}

export function addOrder(o: Order) {
  const list = loadOrders();
  list.unshift(o);
  saveOrders(list);
}

export function updateOrder(id: string, patch: Partial<Order>) {
  const list = loadOrders().map(o => o.id === id ? { ...o, ...patch } : o);
  saveOrders(list);
}

export function getOrder(id: string): Order | undefined {
  return loadOrders().find(o => o.id === id);
}

export function getCat(id?: string) {
  return CATS.find(c => c.id === id);
}

export function getDevice(id: string) {
  return DEVICES.find(d => d.id === id);
}

export function statusLabel(s: OrderStatus): { label: string; tone: string } {
  switch (s) {
    case "queued": return { label: "队列中", tone: "bg-amber-100 text-amber-800" };
    case "dispensed": return { label: "已出粮", tone: "bg-sky-100 text-sky-800" };
    case "eaten": return { label: "已进食", tone: "bg-emerald-100 text-emerald-800" };
    case "error": return { label: "异常", tone: "bg-rose-100 text-rose-800" };
  }
}

export function newOrderId() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const rand = Math.floor(Math.random() * 900 + 100);
  return `ORD-${y}${m}${day}-${rand}`;
}
