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
  BarChart3,
  PieChart,
  CalendarDays,
  FileSpreadsheet,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Filter,
  Search,
  Plus,
  Play,
  MoreVertical,
} from "lucide-react";

// Mock Data
const kpiData = [
  {
    id: "reportes-generados",
    title: "Reportes Generados",
    value: "1,284",
    change: "+15%",
    trend: "up",
    icon: FileSpreadsheet,
    description: "Este mes",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    id: "reportes-programados",
    title: "Reportes Programados",
    value: "24",
    change: "+2",
    trend: "up",
    icon: CalendarDays,
    description: "Envíos automáticos",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    id: "dashboards-activos",
    title: "Dashboards Activos",
    value: "12",
    change: "0",
    trend: "neutral",
    icon: PieChart,
    description: "Vistas personalizadas",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    id: "fuentes-datos",
    title: "Fuentes de Datos",
    value: "8",
    change: "+1",
    trend: "up",
    icon: BarChart3,
    description: "Conexiones activas",
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
];

const reportesDisponibles = [
  {
    id: "REP-001",
    name: "Resumen de Ventas Mensual",
    category: "Ventas",
    format: "PDF / Excel",
    lastGenerated: "Hoy, 08:30 AM",
    frequency: "Mensual",
    status: "disponible",
  },
  {
    id: "REP-002",
    name: "Valoración de Inventario",
    category: "Inventario",
    format: "Excel",
    lastGenerated: "Ayer, 18:00 PM",
    frequency: "Semanal",
    status: "disponible",
  },
  {
    id: "REP-003",
    name: "Estado de Resultados (P&L)",
    category: "Contabilidad",
    format: "PDF",
    lastGenerated: "12 Jun 2026",
    frequency: "Trimestral",
    status: "procesando",
  },
  {
    id: "REP-004",
    name: "Nómina Detallada",
    category: "RRHH",
    format: "Excel / CSV",
    lastGenerated: "30 May 2026",
    frequency: "Quincenal",
    status: "disponible",
  },
  {
    id: "REP-005",
    name: "Análisis de Antigüedad de Saldos",
    category: "Contabilidad",
    format: "PDF / Excel",
    lastGenerated: "15 Jun 2026",
    frequency: "A demanda",
    status: "error",
  },
  {
    id: "REP-006",
    name: "Rendimiento de Vendedores",
    category: "Ventas",
    format: "PDF",
    lastGenerated: "01 Jun 2026",
    frequency: "Mensual",
    status: "disponible",
  },
];

const statusConfig = {
  disponible: {
    label: "Disponible",
    className: "bg-emerald-500/15 text-emerald-600 border-emerald-500/20",
  },
  procesando: {
    label: "Procesando",
    className: "bg-blue-500/15 text-blue-600 border-blue-500/20",
  },
  error: {
    label: "Error",
    className: "bg-red-500/15 text-red-600 border-red-500/20",
  },
};

export default function ReportesPage() {
  return (
    <ERPLayout title="Reportes">
      <div className="flex flex-col gap-6">
        
        {/* Page Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Centro de Reportes</h2>
            <p className="text-sm text-muted-foreground">Genera, programa y analiza información clave del negocio.</p>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button className="flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
              <Plus className="h-4 w-4" />
              Reporte Personalizado
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

        {/* Reports Table */}
        <Card className="flex flex-col flex-1">
          <CardHeader className="border-b border-border py-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle className="text-lg">Catálogo de Reportes</CardTitle>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Buscar reporte..."
                    className="w-full rounded-md border border-border bg-background pl-9 pr-4 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>
                <button className="flex h-9 items-center gap-2 rounded-md border border-border bg-background px-3 text-sm font-medium hover:bg-muted transition-colors">
                  <Filter className="h-4 w-4" />
                  <span className="hidden sm:inline">Categorías</span>
                </button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 overflow-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground sticky top-0">
                <tr>
                  <th className="px-6 py-3 font-semibold">Reporte</th>
                  <th className="px-6 py-3 font-semibold">Categoría</th>
                  <th className="px-6 py-3 font-semibold">Formatos</th>
                  <th className="px-6 py-3 font-semibold">Frecuencia</th>
                  <th className="px-6 py-3 font-semibold">Última Generación</th>
                  <th className="px-6 py-3 font-semibold">Estado</th>
                  <th className="px-6 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {reportesDisponibles.map((reporte) => {
                  const status = statusConfig[reporte.status];
                  return (
                    <tr key={reporte.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">{reporte.name}</span>
                          <span className="text-xs text-muted-foreground font-mono">{reporte.id}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-muted-foreground">{reporte.category}</span>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">{reporte.format}</td>
                      <td className="px-6 py-4 text-muted-foreground">{reporte.frequency}</td>
                      <td className="px-6 py-4 text-muted-foreground">{reporte.lastGenerated}</td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className={`text-xs ${status.className}`}>
                          {status.label}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button 
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted text-primary transition-colors"
                            title="Generar ahora"
                          >
                            <Play className="h-4 w-4" />
                          </button>
                          <button 
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted text-muted-foreground transition-colors"
                            title="Descargar último"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                          <button className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted text-muted-foreground transition-colors">
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        </div>
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
