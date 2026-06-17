"use client";

import ERPLayout from "@/components/erp/ERPLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  AlertTriangle,
  DollarSign,
  Tags,
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
    id: "total-productos",
    title: "Total Productos",
    value: "1,432",
    change: "+12",
    trend: "up",
    icon: Package,
    description: "vs. mes anterior",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    id: "stock-bajo",
    title: "Stock Bajo/Agotado",
    value: "24",
    change: "-5",
    trend: "down",
    icon: AlertTriangle,
    description: "vs. mes anterior",
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
  {
    id: "valor-inventario",
    title: "Valor del Inventario",
    value: "$142,500",
    change: "+5.2%",
    trend: "up",
    icon: DollarSign,
    description: "vs. mes anterior",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    id: "categorias",
    title: "Categorías Activas",
    value: "18",
    change: "0",
    trend: "neutral",
    icon: Tags,
    description: "Sin cambios",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
];

const inventoryData = [
  {
    id: "SKU-1001",
    name: "Laptop HP ProBook 450",
    category: "Electrónica",
    stock: 45,
    minStock: 10,
    price: "$850.00",
    status: "optimo",
  },
  {
    id: "SKU-1002",
    name: "Monitor LG 27\" 4K",
    category: "Electrónica",
    stock: 5,
    minStock: 8,
    price: "$320.00",
    status: "bajo",
  },
  {
    id: "SKU-1003",
    name: "Silla de Oficina Ergonómica",
    category: "Mobiliario",
    stock: 0,
    minStock: 5,
    price: "$150.00",
    status: "agotado",
  },
  {
    id: "SKU-1004",
    name: "Teclado Mecánico RGB",
    category: "Accesorios",
    stock: 112,
    minStock: 20,
    price: "$65.00",
    status: "optimo",
  },
  {
    id: "SKU-1005",
    name: "Auriculares Sony WH-1000",
    category: "Audio",
    stock: 2,
    minStock: 10,
    price: "$280.00",
    status: "bajo",
  },
  {
    id: "SKU-1006",
    name: "Escritorio Elevable",
    category: "Mobiliario",
    stock: 15,
    minStock: 5,
    price: "$450.00",
    status: "optimo",
  },
];

const statusConfig = {
  optimo: {
    label: "Óptimo",
    className: "bg-emerald-500/15 text-emerald-600 border-emerald-500/20",
  },
  bajo: {
    label: "Stock Bajo",
    className: "bg-orange-500/15 text-orange-600 border-orange-500/20",
  },
  agotado: {
    label: "Agotado",
    className: "bg-red-500/15 text-red-600 border-red-500/20",
  },
};

export default function InventarioPage() {
  return (
    <ERPLayout title="Inventario">
      <div className="flex flex-col gap-6">
        
        {/* Page Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Inventario</h2>
            <p className="text-sm text-muted-foreground">Gestiona tus productos, niveles de stock y categorías.</p>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button className="flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-muted transition-colors">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Exportar</span>
            </button>
            <button className="flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
              <Plus className="h-4 w-4" />
              Nuevo Producto
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {kpiData.map((kpi) => {
            const Icon = kpi.icon;
            const isUp = kpi.trend === "up";
            const isNeutral = kpi.trend === "neutral";
            return (
              <Card key={kpi.id}>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${kpi.bg}`}>
                      <Icon className={`h-5 w-5 ${kpi.color}`} />
                    </div>
                    {!isNeutral && (
                      <div className={`flex items-center gap-1 text-xs font-medium ${isUp ? "text-emerald-600" : "text-red-500"}`}>
                        {isUp ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                        {kpi.change}
                      </div>
                    )}
                    {isNeutral && (
                      <div className="text-xs font-medium text-muted-foreground">
                        {kpi.change}
                      </div>
                    )}
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

        {/* Inventory Table */}
        <Card className="flex flex-col flex-1">
          <CardHeader className="border-b border-border py-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle className="text-lg">Catálogo de Productos</CardTitle>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Buscar por SKU o nombre..."
                    className="w-full rounded-md border border-border bg-background pl-9 pr-4 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>
                <button className="flex h-9 items-center gap-2 rounded-md border border-border bg-background px-3 text-sm font-medium hover:bg-muted transition-colors">
                  <Filter className="h-4 w-4" />
                  <span className="hidden sm:inline">Filtros</span>
                </button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 overflow-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground sticky top-0">
                <tr>
                  <th className="px-6 py-3 font-semibold">Producto</th>
                  <th className="px-6 py-3 font-semibold">Categoría</th>
                  <th className="px-6 py-3 font-semibold">Stock Actual</th>
                  <th className="px-6 py-3 font-semibold">Precio Unit.</th>
                  <th className="px-6 py-3 font-semibold">Estado</th>
                  <th className="px-6 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {inventoryData.map((item) => {
                  const status = statusConfig[item.status];
                  return (
                    <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">{item.name}</span>
                          <span className="text-xs text-muted-foreground font-mono">{item.id}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">{item.category}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">{item.stock} unid.</span>
                          <span className="text-xs text-muted-foreground">Mín: {item.minStock}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-foreground">{item.price}</td>
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
