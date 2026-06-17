"use client";

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
  DollarSign,
  ShoppingCart,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Plus,
  Filter,
  Download,
  Search,
} from "lucide-react";

// Mock Data
const kpiData = [
  {
    id: "ingresos-totales",
    title: "Ingresos Totales",
    value: "$45,231.89",
    change: "+20.1%",
    trend: "up",
    icon: DollarSign,
    description: "vs. mes anterior",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    id: "ventas",
    title: "Ventas Realizadas",
    value: "+2350",
    change: "+15%",
    trend: "up",
    icon: ShoppingCart,
    description: "vs. mes anterior",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    id: "ticket-promedio",
    title: "Ticket Promedio",
    value: "$124.50",
    change: "-2%",
    trend: "down",
    icon: CreditCard,
    description: "vs. mes anterior",
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
  {
    id: "conversion",
    title: "Tasa de Conversión",
    value: "3.2%",
    change: "+1.2%",
    trend: "up",
    icon: TrendingUp,
    description: "vs. mes anterior",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
];

const salesData = [
  {
    id: "VNT-7234",
    customer: "Acme Corp",
    email: "contacto@acme.com",
    date: "2026-06-15",
    amount: "$1,250.00",
    status: "completado",
    method: "Tarjeta de Crédito",
  },
  {
    id: "VNT-7235",
    customer: "Global Tech",
    email: "ventas@globaltech.com",
    date: "2026-06-15",
    amount: "$850.00",
    status: "procesando",
    method: "Transferencia",
  },
  {
    id: "VNT-7236",
    customer: "María García",
    email: "maria.g@email.com",
    date: "2026-06-14",
    amount: "$120.50",
    status: "completado",
    method: "PayPal",
  },
  {
    id: "VNT-7237",
    customer: "Industrias Stark",
    email: "compras@stark.com",
    date: "2026-06-14",
    amount: "$5,400.00",
    status: "pendiente",
    method: "Transferencia",
  },
  {
    id: "VNT-7238",
    customer: "Juan Pérez",
    email: "juanp@email.com",
    date: "2026-06-13",
    amount: "$45.00",
    status: "completado",
    method: "Tarjeta de Débito",
  },
  {
    id: "VNT-7239",
    customer: "Wayne Enterprises",
    email: "billing@wayne.com",
    date: "2026-06-13",
    amount: "$12,000.00",
    status: "cancelado",
    method: "Transferencia",
  },
];

const statusConfig = {
  completado: {
    label: "Completado",
    className: "bg-emerald-500/15 text-emerald-600 border-emerald-500/20",
  },
  procesando: {
    label: "Procesando",
    className: "bg-blue-500/15 text-blue-600 border-blue-500/20",
  },
  pendiente: {
    label: "Pendiente",
    className: "bg-orange-500/15 text-orange-600 border-orange-500/20",
  },
  cancelado: {
    label: "Cancelado",
    className: "bg-red-500/15 text-red-600 border-red-500/20",
  },
};

export default function VentasPage() {
  return (
    <ERPLayout title="Ventas">
      <div className="flex flex-col gap-6">
        
        {/* Page Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Gestión de Ventas</h2>
            <p className="text-sm text-muted-foreground">Administra tus ventas, facturas y transacciones recientes.</p>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button className="flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-muted transition-colors">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Exportar</span>
            </button>
            <button className="flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
              <Plus className="h-4 w-4" />
              Nueva Venta
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {kpiData.map((kpi) => {
            const Icon = kpi.icon;
            const isUp = kpi.trend === "up";
            return (
              <Card key={kpi.id}>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${kpi.bg}`}>
                      <Icon className={`h-5 w-5 ${kpi.color}`} />
                    </div>
                    <div className={`flex items-center gap-1 text-xs font-medium ${isUp ? "text-emerald-600" : "text-red-500"}`}>
                      {isUp ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                      {kpi.change}
                    </div>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
                    <p className="text-sm font-medium text-foreground/80">{kpi.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{kpi.description}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Sales Table */}
        <Card className="flex flex-col flex-1">
          <CardHeader className="border-b border-border py-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle className="text-lg">Transacciones Recientes</CardTitle>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Buscar venta..."
                    className="w-full rounded-md border border-border bg-background pl-9 pr-4 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>
                <button className="flex h-9 items-center gap-2 rounded-md border border-border bg-background px-3 text-sm font-medium hover:bg-muted transition-colors">
                  <Filter className="h-4 w-4" />
                  <span className="hidden sm:inline">Filtrar</span>
                </button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 overflow-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground sticky top-0">
                <tr>
                  <th className="px-6 py-3 font-semibold">ID Transacción</th>
                  <th className="px-6 py-3 font-semibold">Cliente</th>
                  <th className="px-6 py-3 font-semibold">Fecha</th>
                  <th className="px-6 py-3 font-semibold">Monto</th>
                  <th className="px-6 py-3 font-semibold">Método</th>
                  <th className="px-6 py-3 font-semibold">Estado</th>
                  <th className="px-6 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {salesData.map((sale) => {
                  const status = statusConfig[sale.status];
                  return (
                    <tr key={sale.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs font-medium">{sale.id}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">{sale.customer}</span>
                          <span className="text-xs text-muted-foreground">{sale.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">{sale.date}</td>
                      <td className="px-6 py-4 font-medium text-foreground">{sale.amount}</td>
                      <td className="px-6 py-4 text-muted-foreground">{sale.method}</td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className={`text-xs ${status.className}`}>
                          {status.label}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted text-muted-foreground transition-colors">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </ERPLayout>
  );
}
