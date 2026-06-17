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
  Users,
  UserPlus,
  CalendarDays,
  Briefcase,
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
    id: "empleados-activos",
    title: "Empleados Activos",
    value: "145",
    change: "+3",
    trend: "up",
    icon: Users,
    description: "vs. mes anterior",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    id: "vacantes",
    title: "Posiciones Abiertas",
    value: "8",
    change: "+2",
    trend: "up",
    icon: Briefcase,
    description: "En proceso de selección",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    id: "ausencias",
    title: "Ausencias / Vacaciones",
    value: "12",
    change: "-1",
    trend: "down",
    icon: CalendarDays,
    description: "Esta semana",
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
  {
    id: "nuevos-ingresos",
    title: "Nuevos Ingresos",
    value: "5",
    change: "+5",
    trend: "up",
    icon: UserPlus,
    description: "Este mes",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
];

const employeeData = [
  {
    id: "EMP-001",
    name: "Ana Martínez",
    email: "amartinez@empresa.com",
    role: "Directora de Ventas",
    department: "Ventas",
    hireDate: "2020-03-15",
    status: "activo",
  },
  {
    id: "EMP-042",
    name: "Carlos Ruiz",
    email: "cruiz@empresa.com",
    role: "Desarrollador Senior",
    department: "IT",
    hireDate: "2022-08-01",
    status: "vacaciones",
  },
  {
    id: "EMP-087",
    name: "Laura Gómez",
    email: "lgomez@empresa.com",
    role: "Analista Contable",
    department: "Finanzas",
    hireDate: "2024-01-10",
    status: "activo",
  },
  {
    id: "EMP-112",
    name: "Miguel Torres",
    email: "mtorres@empresa.com",
    role: "Especialista en Marketing",
    department: "Marketing",
    hireDate: "2025-05-20",
    status: "activo",
  },
  {
    id: "EMP-143",
    name: "Sofía Vargas",
    email: "svargas@empresa.com",
    role: "Representante de Soporte",
    department: "Atención al Cliente",
    hireDate: "2026-02-05",
    status: "licencia",
  },
  {
    id: "EMP-145",
    name: "David Silva",
    email: "dsilva@empresa.com",
    role: "Asistente de Recursos Humanos",
    department: "RRHH",
    hireDate: "2026-06-01",
    status: "activo",
  },
];

const statusConfig = {
  activo: {
    label: "Activo",
    className: "bg-emerald-500/15 text-emerald-600 border-emerald-500/20",
  },
  vacaciones: {
    label: "Vacaciones",
    className: "bg-blue-500/15 text-blue-600 border-blue-500/20",
  },
  licencia: {
    label: "Licencia",
    className: "bg-orange-500/15 text-orange-600 border-orange-500/20",
  },
  inactivo: {
    label: "Inactivo",
    className: "bg-red-500/15 text-red-600 border-red-500/20",
  },
};

export default function RRHHPage() {
  return (
    <ERPLayout title="Recursos Humanos">
      <div className="flex flex-col gap-6">
        
        {/* Page Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Recursos Humanos</h2>
            <p className="text-sm text-muted-foreground">Administra el personal, nóminas y estructura organizacional.</p>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button className="flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-muted transition-colors">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Exportar</span>
            </button>
            <button className="flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
              <Plus className="h-4 w-4" />
              Nuevo Empleado
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

        {/* Employee Table */}
        <Card className="flex flex-col flex-1">
          <CardHeader className="border-b border-border py-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle className="text-lg">Directorio de Empleados</CardTitle>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Buscar por nombre o ID..."
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
                  <th className="px-6 py-3 font-semibold">ID</th>
                  <th className="px-6 py-3 font-semibold">Empleado</th>
                  <th className="px-6 py-3 font-semibold">Cargo</th>
                  <th className="px-6 py-3 font-semibold">Departamento</th>
                  <th className="px-6 py-3 font-semibold">Fecha Ingreso</th>
                  <th className="px-6 py-3 font-semibold">Estado</th>
                  <th className="px-6 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {employeeData.map((employee) => {
                  const status = statusConfig[employee.status];
                  return (
                    <tr key={employee.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs font-medium">{employee.id}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">{employee.name}</span>
                          <span className="text-xs text-muted-foreground">{employee.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">{employee.role}</td>
                      <td className="px-6 py-4 font-medium text-foreground">{employee.department}</td>
                      <td className="px-6 py-4 text-muted-foreground">{employee.hireDate}</td>
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
