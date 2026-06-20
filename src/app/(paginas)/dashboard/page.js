import ERPLayout from "@/components/erp/ERPLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
} from "lucide-react";

// ─── Mock Data (replace with Supabase queries later) ──────────────────────────
const kpiData = [
  {
    id: "ventas-hoy",
    title: "Ventas de Hoy",
    value: "$24,563",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
    description: "vs. ayer $21,832",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    id: "pedidos-pendientes",
    title: "Pedidos Pendientes",
    value: "47",
    change: "-3",
    trend: "down",
    icon: ShoppingCart,
    description: "8 urgentes",
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
  {
    id: "stock-bajo",
    title: "Stock Bajo",
    value: "12",
    change: "+4",
    trend: "up",
    icon: Package,
    description: "productos críticos",
    color: "text-red-500",
    bg: "bg-red-500/10",
  },
  {
    id: "clientes-activos",
    title: "Clientes Activos",
    value: "1,284",
    change: "+8.1%",
    trend: "up",
    icon: Users,
    description: "nuevos este mes: 43",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
];

const recentOrders = [
  {
    id: "#ORD-2024-001",
    client: "Empresa ABC S.A.",
    amount: "$4,320.00",
    status: "completado",
    date: "Hace 5 min",
    items: 12,
  },
  {
    id: "#ORD-2024-002",
    client: "Tech Solutions Ltd.",
    amount: "$1,850.50",
    status: "procesando",
    date: "Hace 23 min",
    items: 5,
  },
  {
    id: "#ORD-2024-003",
    client: "Distribuidora Norte",
    amount: "$9,100.00",
    status: "pendiente",
    date: "Hace 1h",
    items: 28,
  },
  {
    id: "#ORD-2024-004",
    client: "Grupo Comercial XYZ",
    amount: "$760.25",
    status: "completado",
    date: "Hace 2h",
    items: 3,
  },
  {
    id: "#ORD-2024-005",
    client: "Importaciones Sur",
    amount: "$3,200.00",
    status: "cancelado",
    date: "Hace 3h",
    items: 8,
  },
];

const lowStockItems = [
  { name: "Laptop HP ProBook 450", stock: 2, min: 10, sku: "HP-PRO-450" },
  { name: "Monitor LG 27\" 4K", stock: 0, min: 5, sku: "LG-27-4K" },
  { name: 'Teclado Mecánico RGB', stock: 4, min: 15, sku: "KB-MECH-RGB" },
  { name: "Auriculares Sony WH-1000", stock: 1, min: 8, sku: "SONY-WH1K" },
];

const statusConfig = {
  completado: {
    label: "Completado",
    variant: "default",
    className: "bg-emerald-500/15 text-emerald-600 border-emerald-500/20",
  },
  procesando: {
    label: "Procesando",
    variant: "secondary",
    className: "bg-blue-500/15 text-blue-600 border-blue-500/20",
  },
  pendiente: {
    label: "Pendiente",
    variant: "outline",
    className: "bg-orange-500/15 text-orange-600 border-orange-500/20",
  },
  cancelado: {
    label: "Cancelado",
    variant: "destructive",
    className: "bg-red-500/15 text-red-600 border-red-500/20",
  },
};

// ─── Monthly revenue bars (mock) ──────────────────────────────────────────────
const monthlyRevenue = [
  { month: "Ene", value: 65 },
  { month: "Feb", value: 78 },
  { month: "Mar", value: 55 },
  { month: "Abr", value: 88 },
  { month: "May", value: 72 },
  { month: "Jun", value: 95 },
  { month: "Jul", value: 83 },
  { month: "Ago", value: 70 },
  { month: "Sep", value: 91 },
  { month: "Oct", value: 88 },
  { month: "Nov", value: 76 },
  { month: "Dic", value: 100 },
];

export default function DashboardPage() {
  return (
    <ERPLayout title="Dashboard">
      {/* ── Welcome Banner ───────────────────────────────────────────────── */}
      <div className="mb-6 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.15)_0%,_transparent_60%)]" />
        <div className="relative">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold mb-1">
                ¡Buenos días, Admin! 👋
              </h2>
              <p className="text-blue-100 text-sm max-w-md">
                Tu empresa tiene{" "}
                <span className="font-semibold text-white">47 pedidos</span>{" "}
                por procesar y{" "}
                <span className="font-semibold text-white">
                  12 productos con stock bajo
                </span>
                . Revisa las alertas prioritarias.
              </p>
            </div>
            <div className="hidden md:flex flex-col items-end gap-1">
              <span className="text-xs text-blue-200">Ingresos del mes</span>
              <span className="text-3xl font-bold">$284,630</span>
              <div className="flex items-center gap-1 text-emerald-300 text-sm">
                <TrendingUp className="h-3.5 w-3.5" />
                <span>+18.3% vs mes anterior</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── KPI Cards ────────────────────────────────────────────────────── */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 mb-6">
        {kpiData.map((kpi) => {
          const Icon = kpi.icon;
          const isUp = kpi.trend === "up";
          return (
            <Card
              key={kpi.id}
              className="hover:shadow-md transition-shadow duration-200"
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${kpi.bg}`}
                  >
                    <Icon className={`h-5 w-5 ${kpi.color}`} />
                  </div>
                  <div
                    className={`flex items-center gap-1 text-xs font-medium ${
                      isUp ? "text-emerald-600" : "text-red-500"
                    }`}
                  >
                    {isUp ? (
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    ) : (
                      <ArrowDownRight className="h-3.5 w-3.5" />
                    )}
                    {kpi.change}
                  </div>
                </div>
                <p className="text-2xl font-bold text-foreground mb-0.5">
                  {kpi.value}
                </p>
                <p className="text-sm font-medium text-foreground/80 mb-0.5">
                  {kpi.title}
                </p>
                <p className="text-xs text-muted-foreground">{kpi.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* ── Main Content Grid ─────────────────────────────────────────────── */}
      <div className="grid gap-6 grid-cols-1 xl:grid-cols-3">
        {/* ── Revenue Chart ── */}
        <Card className="xl:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Ingresos Mensuales</CardTitle>
                <CardDescription>Evolución de ingresos — 2024</CardDescription>
              </div>
              <Badge variant="secondary" className="text-xs">
                Año actual
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {/* Bar chart visual */}
            <div className="flex items-end gap-1.5 h-40">
              {monthlyRevenue.map((item, i) => (
                <div
                  key={item.month}
                  className="flex-1 flex flex-col items-center gap-1.5"
                >
                  <div
                    className="w-full rounded-t-md transition-all duration-500 group relative"
                    style={{
                      height: `${item.value}%`,
                      background:
                        i === 11
                          ? "linear-gradient(to top, #3b82f6, #6366f1)"
                          : i >= 9
                          ? "hsl(var(--primary) / 0.6)"
                          : "hsl(var(--primary) / 0.25)",
                    }}
                  >
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 hidden group-hover:block bg-foreground text-background text-xs rounded px-1.5 py-0.5 whitespace-nowrap">
                      ${(item.value * 2846).toLocaleString()}
                    </div>
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    {item.month}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground border-t border-border pt-3">
              <span>Total acumulado: <strong className="text-foreground">$284,630</strong></span>
              <span>Meta anual: <strong className="text-foreground">$320,000</strong></span>
              <div className="flex items-center gap-1 text-emerald-600">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>88.9% alcanzado</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── Stock Alerts ── */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Stock Crítico</CardTitle>
                <CardDescription>Productos que necesitan reposición</CardDescription>
              </div>
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {lowStockItems.map((item) => (
              <div
                key={item.sku}
                className="flex items-center gap-3 rounded-lg p-2.5 bg-muted/50 hover:bg-muted transition-colors"
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                    item.stock === 0
                      ? "bg-red-500/15 text-red-600"
                      : "bg-orange-500/15 text-orange-600"
                  }`}
                >
                  {item.stock}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">
                    {item.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    SKU: {item.sku} · Mín: {item.min}
                  </p>
                </div>
                <Badge
                  className={`shrink-0 text-xs ${
                    item.stock === 0
                      ? "bg-red-500/15 text-red-600 border-red-500/20"
                      : "bg-orange-500/15 text-orange-600 border-orange-500/20"
                  }`}
                  variant="outline"
                >
                  {item.stock === 0 ? "Sin stock" : "Bajo"}
                </Badge>
              </div>
            ))}
            <button className="w-full mt-2 text-xs font-medium text-primary hover:underline flex items-center justify-center gap-1 py-2">
              Ver todos los productos →
            </button>
          </CardContent>
        </Card>
      </div>

      {/* ── Recent Orders Table ───────────────────────────────────────────── */}
      <Card className="mt-6">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Pedidos Recientes</CardTitle>
              <CardDescription>
                Últimas transacciones de hoy
              </CardDescription>
            </div>
            <button className="text-xs font-medium text-primary hover:underline">
              Ver todos →
            </button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Pedido
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Artículos
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Total
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Hora
                  </th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentOrders.map((order) => {
                  const status = statusConfig[order.status];
                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-6 py-3.5">
                        <span className="font-mono text-xs font-medium text-foreground">
                          {order.id}
                        </span>
                      </td>
                      <td className="px-6 py-3.5">
                        <span className="font-medium text-foreground text-xs">
                          {order.client}
                        </span>
                      </td>
                      <td className="px-6 py-3.5">
                        <span className="text-muted-foreground text-xs">
                          {order.items} items
                        </span>
                      </td>
                      <td className="px-6 py-3.5">
                        <span className="font-semibold text-foreground text-xs">
                          {order.amount}
                        </span>
                      </td>
                      <td className="px-6 py-3.5">
                        <Badge
                          variant="outline"
                          className={`text-xs ${status.className}`}
                        >
                          {status.label}
                        </Badge>
                      </td>
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {order.date}
                        </div>
                      </td>
                      <td className="px-6 py-3.5">
                        <button className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-muted transition-colors">
                          <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* ── Quick Actions ─────────────────────────────────────────────────── */}
      <div className="mt-6 grid gap-3 grid-cols-2 md:grid-cols-4">
        {[
          { label: "Nueva Venta", icon: TrendingUp, href: "/ventas/nueva", color: "bg-blue-500/10 hover:bg-blue-500/20 text-blue-600" },
          { label: "Agregar Producto", icon: Package, href: "/inventario/nuevo", color: "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600" },
          { label: "Nueva Compra", icon: ShoppingCart, href: "/compras/nueva", color: "bg-purple-500/10 hover:bg-purple-500/20 text-purple-600" },
          { label: "Nuevo Cliente", icon: Users, href: "/clientes/nuevo", color: "bg-orange-500/10 hover:bg-orange-500/20 text-orange-600" },
        ].map((action) => {
          const Icon = action.icon;
          return (
            <a
              key={action.label}
              href={action.href}
              className={`flex flex-col items-center gap-2 rounded-xl p-4 transition-all duration-150 cursor-pointer border border-border ${action.color}`}
            >
              <Icon className="h-6 w-6" />
              <span className="text-xs font-medium text-center">{action.label}</span>
            </a>
          );
        })}
      </div>
    </ERPLayout>
  );
}