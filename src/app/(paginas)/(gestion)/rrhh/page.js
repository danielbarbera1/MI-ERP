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
import { useState, useMemo, useEffect } from "react";
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
  ChevronLeft,
  ChevronRight,
  DollarSign
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const normalizeStatus = (st) => {
  return (st || "")
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "_");
};

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
  const supabase = createClient();
  const [employeesData, setEmployeesData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name-asc");
  const [filterStatus, setFilterStatus] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus, sortBy]);

  const initialFormState = {
    cedula: "",
    nombre_completo: "",
    departamento: "",
    cargo_puesto: "",
    email_corporativo: "",
    telefono_movil: "",
    fecha_ingreso: new Date().toISOString().slice(0, 10),
    salario_base_usd: "",
    estatus: "Activo",
    supervisor_directo: "",
  };
  const [formData, setFormData] = useState(initialFormState);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("empleados")
      .select("*")
      .order("nombre_completo", { ascending: true });
      
    if (error) {
      console.error("Error fetching empleados:", error);
    } else {
      setEmployeesData(data || []);
    }
    setLoading(false);
  };

  const handleOpenAdd = () => {
    setFormData(initialFormState);
    setIsAddOpen(true);
  };

  const handleOpenView = (employee) => {
    setSelectedEmployee(employee);
    setIsViewOpen(true);
  };

  const handleOpenEdit = (employee) => {
    setSelectedEmployee(employee);
    setFormData({
      cedula: employee.cedula || "",
      nombre_completo: employee.nombre_completo || "",
      departamento: employee.departamento || "",
      cargo_puesto: employee.cargo_puesto || "",
      email_corporativo: employee.email_corporativo || "",
      telefono_movil: employee.telefono_movil || "",
      fecha_ingreso: employee.fecha_ingreso ? new Date(employee.fecha_ingreso).toISOString().slice(0, 10) : "",
      salario_base_usd: employee.salario_base_usd || "",
      estatus: employee.estatus || "Activo",
      supervisor_directo: employee.supervisor_directo || "",
    });
    setIsEditOpen(true);
  };

  const handleSave = async () => {
    setSubmitting(true);
    const { error } = await supabase.from("empleados").insert([formData]);
    if (error) {
      alert("Error al guardar: " + error.message);
    } else {
      setIsAddOpen(false);
      fetchEmployees();
    }
    setSubmitting(false);
  };

  const handleUpdate = async () => {
    setSubmitting(true);
    const { error } = await supabase
      .from("empleados")
      .update(formData)
      .eq("id", selectedEmployee.id);
      
    if (error) {
      alert("Error al actualizar: " + error.message);
    } else {
      setIsEditOpen(false);
      fetchEmployees();
    }
    setSubmitting(false);
  };

  const handleDelete = async (id) => {
    if (confirm("¿Estás seguro de que deseas eliminar este empleado?")) {
      const { error } = await supabase.from("empleados").delete().eq("id", id);
      if (error) {
        alert("Error al eliminar: " + error.message);
      } else {
        fetchEmployees();
      }
    }
  };

  const filteredAndSortedData = useMemo(() => {
    let data = [...employeesData];

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      data = data.filter(
        (employee) =>
          (employee.nombre_completo && employee.nombre_completo.toLowerCase().includes(lowerSearch)) ||
          (employee.cedula && employee.cedula.toLowerCase().includes(lowerSearch)) ||
          (employee.cargo_puesto && employee.cargo_puesto.toLowerCase().includes(lowerSearch))
      );
    }

    if (filterStatus !== "all") {
      data = data.filter((employee) => employee.estatus === filterStatus);
    }

    data.sort((a, b) => {
      if (sortBy === "name-asc") return (a.nombre_completo || "").localeCompare(b.nombre_completo || "");
      if (sortBy === "name-desc") return (b.nombre_completo || "").localeCompare(a.nombre_completo || "");
      if (sortBy === "date-desc") return new Date(b.fecha_ingreso || 0) - new Date(a.fecha_ingreso || 0);
      if (sortBy === "date-asc") return new Date(a.fecha_ingreso || 0) - new Date(b.fecha_ingreso || 0);
      return 0;
    });

    return data;
  }, [employeesData, searchTerm, sortBy, filterStatus]);

  const totalItems = filteredAndSortedData.length;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedData.slice(start, start + itemsPerPage);
  }, [filteredAndSortedData, currentPage, itemsPerPage]);

  const kpiData = useMemo(() => {
    const isActivo = (st) => normalizeStatus(st) === "activo";
    const isAusente = (st) => {
      const s = normalizeStatus(st);
      return s === "vacaciones" || s === "licencia";
    };

    const activos = employeesData.filter(e => isActivo(e.estatus));
    const activosCount = activos.length;
    const ausenciasCount = employeesData.filter(e => isAusente(e.estatus)).length;
    
    const nominaMensual = activos.reduce((sum, e) => sum + (parseFloat(e.salario_base_usd) || 0), 0);

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const currentMonthNuevos = employeesData.filter(e => {
      if (!e.fecha_ingreso) return false;
      const date = new Date(e.fecha_ingreso);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    }).length;
    
    const prevMonthNuevos = employeesData.filter(e => {
      if (!e.fecha_ingreso) return false;
      const date = new Date(e.fecha_ingreso);
      return date.getMonth() === prevMonth && date.getFullYear() === prevYear;
    }).length;

    const nuevosChange = prevMonthNuevos === 0 ? (currentMonthNuevos > 0 ? 100 : 0) : ((currentMonthNuevos - prevMonthNuevos) / prevMonthNuevos) * 100;

    const formatChange = (val) => {
      if (!isFinite(val)) return "0%";
      return `${val > 0 ? '+' : ''}${val.toFixed(1)}%`;
    };

    return [
      {
        id: "empleados-activos",
        title: "Empleados Activos",
        value: activosCount.toString(),
        change: "",
        trend: "up",
        icon: Users,
        description: "Plantilla actual",
        color: "text-blue-500",
        bg: "bg-blue-500/10",
      },
      {
        id: "nomina-mensual",
        title: "Nómina Mensual",
        value: `$${nominaMensual.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        change: "",
        trend: "up",
        icon: DollarSign,
        description: "Salario base empleados activos",
        color: "text-purple-500",
        bg: "bg-purple-500/10",
      },
      {
        id: "ausencias",
        title: "Ausencias / Licencias",
        value: ausenciasCount.toString(),
        change: "",
        trend: "down",
        icon: CalendarDays,
        description: "En este momento",
        color: "text-orange-500",
        bg: "bg-orange-500/10",
      },
      {
        id: "nuevos-ingresos",
        title: "Nuevos Ingresos",
        value: currentMonthNuevos.toString(),
        change: formatChange(nuevosChange),
        trend: nuevosChange >= 0 ? "up" : "down",
        icon: UserPlus,
        description: "Este mes vs. anterior",
        color: "text-emerald-500",
        bg: "bg-emerald-500/10",
      },
    ];
  }, [employeesData]);

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
            {/* <button className="flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-muted transition-colors">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Exportar</span>
            </button> */}
            <button 
              className="flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 focus:ring-offset-background"
              onClick={handleOpenAdd}
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
                    {kpi.change && (
                      <div className={`flex items-center gap-1 text-xs font-medium ${isUp ? "text-emerald-600" : "text-red-500"}`}>
                        {isUp ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
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
                    placeholder="Buscar por nombre o cédula..."
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
                      <DropdownMenuRadioItem value="Activo">Activo</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="Vacaciones">Vacaciones</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="Licencia">Licencia</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="Inactivo">Inactivo</DropdownMenuRadioItem>
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
                  <th className="px-6 py-3 font-semibold">Cédula</th>
                  <th className="px-6 py-3 font-semibold">Empleado</th>
                  <th className="px-6 py-3 font-semibold">Cargo</th>
                  <th className="px-6 py-3 font-semibold">Departamento</th>
                  <th className="px-6 py-3 font-semibold">Fecha Ingreso</th>
                  <th className="px-6 py-3 font-semibold">Salario</th>
                  <th className="px-6 py-3 font-semibold">Estado</th>
                  <th className="px-6 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-muted-foreground">Cargando datos...</td>
                  </tr>
                ) : paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-muted-foreground">No hay empleados registrados.</td>
                  </tr>
                ) : paginatedData.map((employee) => {
                  const normalizedStatus = normalizeStatus(employee.estatus);
                  const status = statusConfig[normalizedStatus] || { label: employee.estatus, className: "bg-gray-500/15 text-gray-600 border-gray-500/20" };
                  return (
                    <tr key={employee.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs font-medium">{employee.cedula || "N/A"}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">{employee.nombre_completo}</span>
                          <span className="text-xs text-muted-foreground">{employee.email_corporativo}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">{employee.cargo_puesto}</td>
                      <td className="px-6 py-4 font-medium text-foreground">{employee.departamento}</td>
                      <td className="px-6 py-4 text-muted-foreground">{employee.fecha_ingreso ? new Date(employee.fecha_ingreso).toLocaleDateString() : "N/A"}</td>
                      <td className="px-6 py-4 font-medium text-foreground">${parseFloat(employee.salario_base_usd || 0).toFixed(2)}</td>
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
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleDelete(employee.id)} className="text-red-600 focus:text-red-600 focus:bg-red-50">Dar de baja / Eliminar</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
          <div className="flex items-center justify-between border-t border-border px-6 py-4 bg-background rounded-b-xl">
            <div className="text-sm text-muted-foreground">
              Mostrando página <span className="font-medium text-foreground">{currentPage}</span> de <span className="font-medium text-foreground">{Math.max(1, Math.ceil(totalItems / itemsPerPage))}</span>
              {" "}(Total: {totalItems} registros)
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="flex h-9 items-center justify-center gap-1 rounded-md border border-border bg-background px-3 text-sm font-medium hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </button>
              <button
                onClick={() => setCurrentPage(p => p + 1)}
                disabled={currentPage >= Math.ceil(totalItems / itemsPerPage) || totalItems === 0}
                className="flex h-9 items-center justify-center gap-1 rounded-md border border-border bg-background px-3 text-sm font-medium hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Siguiente
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </Card>
      </div>

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Nuevo Empleado</DialogTitle>
            <DialogDescription>
              Añade un nuevo miembro al equipo en la base de datos.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted-foreground">Cédula</label>
              <input type="text" value={formData.cedula} onChange={(e) => setFormData({...formData, cedula: e.target.value})} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted-foreground">Nombre Completo</label>
              <input type="text" value={formData.nombre_completo} onChange={(e) => setFormData({...formData, nombre_completo: e.target.value})} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted-foreground">Departamento</label>
              <input type="text" value={formData.departamento} onChange={(e) => setFormData({...formData, departamento: e.target.value})} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted-foreground">Cargo / Puesto</label>
              <input type="text" value={formData.cargo_puesto} onChange={(e) => setFormData({...formData, cargo_puesto: e.target.value})} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted-foreground">Email Corporativo</label>
              <input type="email" value={formData.email_corporativo} onChange={(e) => setFormData({...formData, email_corporativo: e.target.value})} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted-foreground">Teléfono Móvil</label>
              <input type="text" value={formData.telefono_movil} onChange={(e) => setFormData({...formData, telefono_movil: e.target.value})} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted-foreground">Fecha de Ingreso</label>
              <input type="date" value={formData.fecha_ingreso} onChange={(e) => setFormData({...formData, fecha_ingreso: e.target.value})} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted-foreground">Salario Base (USD)</label>
              <input type="number" step="0.01" value={formData.salario_base_usd} onChange={(e) => setFormData({...formData, salario_base_usd: e.target.value})} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted-foreground">Supervisor Directo</label>
              <input type="text" value={formData.supervisor_directo} onChange={(e) => setFormData({...formData, supervisor_directo: e.target.value})} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted-foreground">Estado</label>
              <select value={formData.estatus} onChange={(e) => setFormData({...formData, estatus: e.target.value})} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all">
                <option value="Activo">Activo</option>
                <option value="Vacaciones">Vacaciones</option>
                <option value="Licencia">Licencia</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <button disabled={submitting} className="rounded-md border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-muted transition-colors outline-none focus:ring-2 focus:ring-primary/20" onClick={() => setIsAddOpen(false)}>
              Cancelar
            </button>
            <button disabled={submitting} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 focus:ring-offset-background" onClick={handleSave}>
              {submitting ? "Guardando..." : "Crear Empleado"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Ver Detalles */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Detalles del Empleado</DialogTitle>
            <DialogDescription>
              Información completa del empleado seleccionado.
            </DialogDescription>
          </DialogHeader>
          {selectedEmployee && (
            <div className="grid gap-4 py-4 grid-cols-2">
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground">ID BD</h4>
                <p className="text-sm font-medium">{selectedEmployee.id}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground">Cédula</h4>
                <p className="text-sm font-medium">{selectedEmployee.cedula || "N/A"}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground">Nombre Completo</h4>
                <p className="text-sm font-medium">{selectedEmployee.nombre_completo}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground">Estado</h4>
                <Badge variant="outline" className={`mt-1 text-xs ${statusConfig[normalizeStatus(selectedEmployee.estatus)]?.className || "bg-gray-100 text-gray-800"}`}>
                  {statusConfig[normalizeStatus(selectedEmployee.estatus)]?.label || selectedEmployee.estatus}
                </Badge>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground">Departamento</h4>
                <p className="text-sm font-medium">{selectedEmployee.departamento || "N/A"}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground">Cargo / Puesto</h4>
                <p className="text-sm font-medium">{selectedEmployee.cargo_puesto || "N/A"}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground">Email Corporativo</h4>
                <p className="text-sm font-medium">{selectedEmployee.email_corporativo || "N/A"}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground">Teléfono Móvil</h4>
                <p className="text-sm font-medium">{selectedEmployee.telefono_movil || "N/A"}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground">Fecha de Ingreso</h4>
                <p className="text-sm font-medium">{selectedEmployee.fecha_ingreso ? new Date(selectedEmployee.fecha_ingreso).toLocaleDateString() : "N/A"}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground">Salario Base</h4>
                <p className="text-sm font-medium">${parseFloat(selectedEmployee.salario_base_usd || 0).toFixed(2)}</p>
              </div>
              <div className="col-span-2">
                <h4 className="text-sm font-semibold text-muted-foreground">Supervisor Directo</h4>
                <p className="text-sm font-medium">{selectedEmployee.supervisor_directo || "N/A"}</p>
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
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Editar Empleado</DialogTitle>
            <DialogDescription>
              Modifica la información de este empleado.
            </DialogDescription>
          </DialogHeader>
          {selectedEmployee && (
            <div className="grid gap-4 py-4 grid-cols-2">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-muted-foreground">Cédula</label>
                <input type="text" value={formData.cedula} onChange={(e) => setFormData({...formData, cedula: e.target.value})} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-muted-foreground">Nombre Completo</label>
                <input type="text" value={formData.nombre_completo} onChange={(e) => setFormData({...formData, nombre_completo: e.target.value})} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-muted-foreground">Departamento</label>
                <input type="text" value={formData.departamento} onChange={(e) => setFormData({...formData, departamento: e.target.value})} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-muted-foreground">Cargo / Puesto</label>
                <input type="text" value={formData.cargo_puesto} onChange={(e) => setFormData({...formData, cargo_puesto: e.target.value})} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-muted-foreground">Email Corporativo</label>
                <input type="email" value={formData.email_corporativo} onChange={(e) => setFormData({...formData, email_corporativo: e.target.value})} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-muted-foreground">Teléfono Móvil</label>
                <input type="text" value={formData.telefono_movil} onChange={(e) => setFormData({...formData, telefono_movil: e.target.value})} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-muted-foreground">Fecha de Ingreso</label>
                <input type="date" value={formData.fecha_ingreso} onChange={(e) => setFormData({...formData, fecha_ingreso: e.target.value})} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-muted-foreground">Salario Base (USD)</label>
                <input type="number" step="0.01" value={formData.salario_base_usd} onChange={(e) => setFormData({...formData, salario_base_usd: e.target.value})} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-muted-foreground">Supervisor Directo</label>
                <input type="text" value={formData.supervisor_directo} onChange={(e) => setFormData({...formData, supervisor_directo: e.target.value})} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-muted-foreground">Estado</label>
                <select value={formData.estatus} onChange={(e) => setFormData({...formData, estatus: e.target.value})} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all">
                  <option value="Activo">Activo</option>
                  <option value="Vacaciones">Vacaciones</option>
                  <option value="Licencia">Licencia</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
              </div>
            </div>
          )}
          <DialogFooter>
            <button disabled={submitting} className="rounded-md border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-muted transition-colors outline-none focus:ring-2 focus:ring-primary/20" onClick={() => setIsEditOpen(false)}>
              Cancelar
            </button>
            <button disabled={submitting} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 focus:ring-offset-background" onClick={handleUpdate}>
              {submitting ? "Guardando..." : "Guardar Cambios"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ERPLayout>
  );
}
