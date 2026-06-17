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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useState, useMemo } from "react";
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
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleOpenView = (employee) => {
    setSelectedEmployee(employee);
    setIsViewOpen(true);
  };

  const handleOpenEdit = (employee) => {
    setSelectedEmployee(employee);
    setIsEditOpen(true);
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name-asc");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredAndSortedData = useMemo(() => {
    let data = [...employeeData];

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      data = data.filter(
        (employee) =>
          employee.name.toLowerCase().includes(lowerSearch) ||
          employee.id.toLowerCase().includes(lowerSearch) ||
          employee.role.toLowerCase().includes(lowerSearch)
      );
    }

    if (filterStatus !== "all") {
      data = data.filter((employee) => employee.status === filterStatus);
    }

    data.sort((a, b) => {
      if (sortBy === "name-asc") return a.name.localeCompare(b.name);
      if (sortBy === "name-desc") return b.name.localeCompare(a.name);
      if (sortBy === "date-desc") return new Date(b.hireDate) - new Date(a.hireDate);
      if (sortBy === "date-asc") return new Date(a.hireDate) - new Date(b.hireDate);

      return 0;
    });

    return data;
  }, [searchTerm, sortBy, filterStatus]);

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
            <button 
              className="flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 focus:ring-offset-background"
              onClick={() => setIsAddOpen(true)}
            >
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
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar por nombre o ID..."
                    className="w-full rounded-md border border-border bg-background pl-9 pr-4 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex h-9 items-center gap-2 rounded-md border border-border bg-background px-3 text-sm font-medium hover:bg-muted transition-colors outline-none focus:ring-1 focus:ring-primary">
                      <Filter className="h-4 w-4" />
                      <span className="hidden sm:inline">Filtrar</span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuRadioGroup value={sortBy} onValueChange={setSortBy}>
                      <DropdownMenuLabel>Ordenar por</DropdownMenuLabel>
                      <DropdownMenuRadioItem value="name-asc">Nombre (A-Z)</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="name-desc">Nombre (Z-A)</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="date-desc">Más recientes primero</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="date-asc">Más antiguos primero</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup value={filterStatus} onValueChange={setFilterStatus}>
                      <DropdownMenuLabel>Filtrar por Estado</DropdownMenuLabel>
                      <DropdownMenuRadioItem value="all">Todos los estados</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="activo">Activo</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="vacaciones">Vacaciones</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="licencia">Licencia</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
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
                {filteredAndSortedData.map((employee) => {
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
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted text-muted-foreground transition-colors outline-none focus:ring-1 focus:ring-primary">
                              <MoreHorizontal className="h-4 w-4" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => handleOpenView(employee)}>Ver detalles</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleOpenEdit(employee)}>Editar empleado</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50">Dar de baja</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nuevo Empleado</DialogTitle>
            <DialogDescription>
              Añade un nuevo miembro al equipo.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted-foreground">Nombre Completo</label>
              <input type="text" placeholder="Ej. Ana Martínez" className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted-foreground">Correo Electrónico</label>
              <input type="email" placeholder="Ej. ana@empresa.com" className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-muted-foreground">Cargo</label>
                <input type="text" placeholder="Ej. Desarrollador" className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-muted-foreground">Departamento</label>
                <select className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all">
                  <option>Tecnología</option>
                  <option>Ventas</option>
                  <option>Recursos Humanos</option>
                  <option>Operaciones</option>
                </select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <button className="rounded-md border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-muted transition-colors outline-none focus:ring-2 focus:ring-primary/20" onClick={() => setIsAddOpen(false)}>
              Cancelar
            </button>
            <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 focus:ring-offset-background" onClick={() => setIsAddOpen(false)}>
              Crear Empleado
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Ver Detalles */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalles del Empleado</DialogTitle>
            <DialogDescription>
              Información completa del empleado seleccionado.
            </DialogDescription>
          </DialogHeader>
          {selectedEmployee && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground">ID Empleado</h4>
                  <p className="text-sm font-medium">{selectedEmployee.id}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground">Estado</h4>
                  <Badge variant="outline" className={`mt-1 text-xs ${statusConfig[selectedEmployee.status]?.className}`}>
                    {statusConfig[selectedEmployee.status]?.label}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground">Nombre Completo</h4>
                  <p className="text-sm font-medium">{selectedEmployee.name}</p>
                  <p className="text-xs text-muted-foreground">{selectedEmployee.email}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground">Fecha de Ingreso</h4>
                  <p className="text-sm font-medium">{selectedEmployee.hireDate}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground">Cargo</h4>
                  <p className="text-sm font-medium">{selectedEmployee.role}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground">Departamento</h4>
                  <p className="text-sm font-medium">{selectedEmployee.department}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 focus:ring-offset-background" onClick={() => setIsViewOpen(false)}>
              Cerrar
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Editar Empleado */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Empleado</DialogTitle>
            <DialogDescription>
              Modifica la información de este empleado.
            </DialogDescription>
          </DialogHeader>
          {selectedEmployee && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-muted-foreground">Nombre Completo</label>
                  <input type="text" defaultValue={selectedEmployee.name} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-muted-foreground">Correo Electrónico</label>
                  <input type="email" defaultValue={selectedEmployee.email} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-muted-foreground">Cargo</label>
                  <input type="text" defaultValue={selectedEmployee.role} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-muted-foreground">Departamento</label>
                  <select defaultValue={selectedEmployee.department} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all">
                    <option value="Ventas">Ventas</option>
                    <option value="IT">IT</option>
                    <option value="Finanzas">Finanzas</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Atención al Cliente">Atención al Cliente</option>
                    <option value="RRHH">RRHH</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-muted-foreground">Estado</label>
                <select defaultValue={selectedEmployee.status} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all">
                  <option value="activo">Activo</option>
                  <option value="vacaciones">Vacaciones</option>
                  <option value="licencia">Licencia Médica</option>
                </select>
              </div>
            </div>
          )}
          <DialogFooter>
            <button className="rounded-md border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-muted transition-colors outline-none focus:ring-2 focus:ring-primary/20" onClick={() => setIsEditOpen(false)}>
              Cancelar
            </button>
            <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 focus:ring-offset-background" onClick={() => setIsEditOpen(false)}>
              Guardar Cambios
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ERPLayout>
  );
}
