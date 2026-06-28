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
import { createClient } from "@/lib/supabase/client";
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
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

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
  const supabase = createClient();
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date-desc");
  const [filterStatus, setFilterStatus] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus, sortBy]);

  const initialFormState = {
    codigo_tx: "",
    fecha_hora: new Date().toISOString().slice(0, 16),
    tipo_transaccion: "Venta",
    entidad_tercero: "",
    operador_vendedor: "",
    monto_usd: "",
    estatus: "completado",
    metodo_pago: "Transferencia",
    concepto_detallado: "",
  };
  const [formData, setFormData] = useState(initialFormState);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("transacciones")
      .select("*")
      .order("fecha_hora", { ascending: false });
      
    if (error) {
      console.error("Error fetching ventas:", error);
    } else {
      setSalesData(data || []);
    }
    setLoading(false);
  };

  const handleOpenAdd = () => {
    setFormData(initialFormState);
    setIsAddOpen(true);
  };

  const handleOpenView = (sale) => {
    setSelectedSale(sale);
    setIsViewOpen(true);
  };

  const handleOpenEdit = (sale) => {
    setSelectedSale(sale);
    setFormData({
      codigo_tx: sale.codigo_tx || "",
      fecha_hora: sale.fecha_hora ? new Date(sale.fecha_hora).toISOString().slice(0, 16) : "",
      tipo_transaccion: sale.tipo_transaccion || "Venta",
      entidad_tercero: sale.entidad_tercero || "",
      operador_vendedor: sale.operador_vendedor || "",
      monto_usd: sale.monto_usd || "",
      estatus: sale.estatus || "completado",
      metodo_pago: sale.metodo_pago || "Transferencia",
      concepto_detallado: sale.concepto_detallado || "",
    });
    setIsEditOpen(true);
  };

  const handleSave = async () => {
    setSubmitting(true);
    const { error } = await supabase.from("transacciones").insert([formData]);
    if (error) {
      alert("Error al guardar: " + error.message);
    } else {
      setIsAddOpen(false);
      fetchSales();
    }
    setSubmitting(false);
  };

  const handleUpdate = async () => {
    setSubmitting(true);
    const { error } = await supabase
      .from("transacciones")
      .update(formData)
      .eq("id", selectedSale.id);
    if (error) {
      alert("Error al actualizar: " + error.message);
    } else {
      setIsEditOpen(false);
      fetchSales();
    }
    setSubmitting(false);
  };

  const handleDelete = async (id) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta venta?")) {
      const { error } = await supabase.from("transacciones").delete().eq("id", id);
      if (error) {
        alert("Error al eliminar: " + error.message);
      } else {
        fetchSales();
      }
    }
  };

  const filteredAndSortedData = useMemo(() => {
    let data = [...salesData];

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      data = data.filter(
        (sale) =>
          (sale.entidad_tercero && sale.entidad_tercero.toLowerCase().includes(lowerSearch)) ||
          (sale.codigo_tx && sale.codigo_tx.toLowerCase().includes(lowerSearch))
      );
    }

    if (filterStatus !== "all") {
      data = data.filter((sale) => sale.estatus === filterStatus);
    }

    data.sort((a, b) => {
      if (sortBy === "date-desc") return new Date(b.fecha_hora) - new Date(a.fecha_hora);
      if (sortBy === "date-asc") return new Date(a.fecha_hora) - new Date(b.fecha_hora);
      
      const priceA = parseFloat(a.monto_usd) || 0;
      const priceB = parseFloat(b.monto_usd) || 0;
      if (sortBy === "amount-desc") return priceB - priceA;
      if (sortBy === "amount-asc") return priceA - priceB;

      if (sortBy === "name-asc") return (a.entidad_tercero || "").localeCompare(b.entidad_tercero || "");
      if (sortBy === "name-desc") return (b.entidad_tercero || "").localeCompare(a.entidad_tercero || "");

      return 0;
    });

    return data;
  }, [salesData, searchTerm, sortBy, filterStatus]);

  const totalItems = filteredAndSortedData.length;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedData.slice(start, start + itemsPerPage);
  }, [filteredAndSortedData, currentPage, itemsPerPage]);

  const kpiData = useMemo(() => {
    const completadas = salesData.filter(sale => sale.estatus === "completado" || sale.estatus === "Completado");
    
    // Totales de todos los tiempos
    const ingresosTotales = completadas.reduce((sum, sale) => sum + (parseFloat(sale.monto_usd) || 0), 0);
    const ventasRealizadas = completadas.length;
    const ticketPromedio = ventasRealizadas > 0 ? ingresosTotales / ventasRealizadas : 0;
    const pendientes = salesData.filter(sale => sale.estatus === "pendiente" || sale.estatus === "Pendiente").length;

    // Calculo para "change" (mes actual vs mes anterior)
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const currentMonthSales = completadas.filter(sale => {
      if (!sale.fecha_hora) return false;
      const date = new Date(sale.fecha_hora);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });
    const prevMonthSales = completadas.filter(sale => {
      if (!sale.fecha_hora) return false;
      const date = new Date(sale.fecha_hora);
      return date.getMonth() === prevMonth && date.getFullYear() === prevYear;
    });

    const currIngresos = currentMonthSales.reduce((sum, sale) => sum + (parseFloat(sale.monto_usd) || 0), 0);
    const prevIngresos = prevMonthSales.reduce((sum, sale) => sum + (parseFloat(sale.monto_usd) || 0), 0);
    const ingresosChange = prevIngresos === 0 ? (currIngresos > 0 ? 100 : 0) : ((currIngresos - prevIngresos) / prevIngresos) * 100;

    const currVentas = currentMonthSales.length;
    const prevVentas = prevMonthSales.length;
    const ventasChange = prevVentas === 0 ? (currVentas > 0 ? 100 : 0) : ((currVentas - prevVentas) / prevVentas) * 100;

    const currTicket = currVentas > 0 ? currIngresos / currVentas : 0;
    const prevTicket = prevVentas > 0 ? prevIngresos / prevVentas : 0;
    const ticketChange = prevTicket === 0 ? (currTicket > 0 ? 100 : 0) : ((currTicket - prevTicket) / prevTicket) * 100;

    const pendientesActual = salesData.filter(sale => {
      if (!sale.fecha_hora) return false;
      const date = new Date(sale.fecha_hora);
      return (sale.estatus === "pendiente" || sale.estatus === "Pendiente") && date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    }).length;
    const pendientesPrev = salesData.filter(sale => {
      if (!sale.fecha_hora) return false;
      const date = new Date(sale.fecha_hora);
      return (sale.estatus === "pendiente" || sale.estatus === "Pendiente") && date.getMonth() === prevMonth && date.getFullYear() === prevYear;
    }).length;
    const pendientesChange = pendientesPrev === 0 ? (pendientesActual > 0 ? 100 : 0) : ((pendientesActual - pendientesPrev) / pendientesPrev) * 100;

    const formatChange = (val) => {
      if (!isFinite(val)) return "0%";
      return `${val > 0 ? '+' : ''}${val.toFixed(1)}%`;
    };

    return [
      {
        id: "ingresos-totales",
        title: "Ingresos Totales",
        value: `$${ingresosTotales.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        change: formatChange(ingresosChange),
        trend: ingresosChange >= 0 ? "up" : "down",
        icon: DollarSign,
        description: "vs. mes anterior",
        color: "text-emerald-500",
        bg: "bg-emerald-500/10",
      },
      {
        id: "ventas",
        title: "Ventas Realizadas",
        value: ventasRealizadas.toString(),
        change: formatChange(ventasChange),
        trend: ventasChange >= 0 ? "up" : "down",
        icon: ShoppingCart,
        description: "vs. mes anterior",
        color: "text-blue-500",
        bg: "bg-blue-500/10",
      },
      {
        id: "ticket-promedio",
        title: "Ticket Promedio",
        value: `$${ticketPromedio.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        change: formatChange(ticketChange),
        trend: ticketChange >= 0 ? "up" : "down",
        icon: CreditCard,
        description: "vs. mes anterior",
        color: "text-orange-500",
        bg: "bg-orange-500/10",
      },
      {
        id: "pendientes",
        title: "Ventas Pendientes",
        value: pendientes.toString(),
        change: formatChange(pendientesChange),
        trend: pendientesChange <= 0 ? "up" : "down", 
        icon: TrendingUp,
        description: "vs. mes anterior",
        color: "text-purple-500",
        bg: "bg-purple-500/10",
      },
    ];
  }, [salesData]);

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
            <button 
              className="flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 focus:ring-offset-background"
              onClick={handleOpenAdd}
            >
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
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar código o cliente..."
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
                      <DropdownMenuRadioItem value="date-desc">Más recientes primero</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="date-asc">Más antiguas primero</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="amount-desc">Mayor a menor monto</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="amount-asc">Menor a mayor monto</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="name-asc">Cliente (A-Z)</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup value={filterStatus} onValueChange={setFilterStatus}>
                      <DropdownMenuLabel>Filtrar por Estado</DropdownMenuLabel>
                      <DropdownMenuRadioItem value="all">Todos los estados</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="completado">Completado</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="procesando">Procesando</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="pendiente">Pendiente</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="cancelado">Cancelado</DropdownMenuRadioItem>
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
                  <th className="px-6 py-3 font-semibold">Código TX</th>
                  <th className="px-6 py-3 font-semibold">Cliente / Entidad</th>
                  <th className="px-6 py-3 font-semibold">Fecha y Hora</th>
                  <th className="px-6 py-3 font-semibold">Monto (USD)</th>
                  <th className="px-6 py-3 font-semibold">Método</th>
                  <th className="px-6 py-3 font-semibold">Estado</th>
                  <th className="px-6 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-muted-foreground">Cargando datos...</td>
                  </tr>
                ) : filteredAndSortedData.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-muted-foreground">No hay ventas registradas.</td>
                  </tr>
                ) : paginatedData.map((sale) => {
                  const status = statusConfig[sale.estatus] || { label: sale.estatus, className: "bg-gray-500/15 text-gray-600" };
                  return (
                    <tr key={sale.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs font-medium">{sale.codigo_tx || "N/A"}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">{sale.entidad_tercero || "Desconocido"}</span>
                          <span className="text-xs text-muted-foreground">{sale.tipo_transaccion}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {sale.fecha_hora ? new Date(sale.fecha_hora).toLocaleString() : "N/A"}
                      </td>
                      <td className="px-6 py-4 font-medium text-foreground">${parseFloat(sale.monto_usd || 0).toFixed(2)}</td>
                      <td className="px-6 py-4 text-muted-foreground">{sale.metodo_pago}</td>
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
                            <DropdownMenuItem onClick={() => handleOpenView(sale)}>Ver detalles</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleOpenEdit(sale)}>Editar venta</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleDelete(sale.id)} className="text-red-600 focus:text-red-600 focus:bg-red-50">Eliminar</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
          {/* Paginación */}
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

      {/* Modal de Agregar */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Nueva Venta</DialogTitle>
            <DialogDescription>
              Registra una nueva transacción de venta.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted-foreground">Código TX</label>
              <input type="text" value={formData.codigo_tx} onChange={(e) => setFormData({...formData, codigo_tx: e.target.value})} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted-foreground">Fecha y Hora</label>
              <input type="datetime-local" value={formData.fecha_hora} onChange={(e) => setFormData({...formData, fecha_hora: e.target.value})} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted-foreground">Cliente (Tercero)</label>
              <input type="text" value={formData.entidad_tercero} onChange={(e) => setFormData({...formData, entidad_tercero: e.target.value})} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted-foreground">Vendedor (Operador)</label>
              <input type="text" value={formData.operador_vendedor} onChange={(e) => setFormData({...formData, operador_vendedor: e.target.value})} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted-foreground">Monto (USD)</label>
              <input type="number" step="0.01" value={formData.monto_usd} onChange={(e) => setFormData({...formData, monto_usd: e.target.value})} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted-foreground">Tipo de Transacción</label>
              <input type="text" value={formData.tipo_transaccion} onChange={(e) => setFormData({...formData, tipo_transaccion: e.target.value})} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted-foreground">Método de Pago</label>
              <select value={formData.metodo_pago} onChange={(e) => setFormData({...formData, metodo_pago: e.target.value})} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all">
                <option value="Tarjeta de Crédito">Tarjeta de Crédito</option>
                <option value="Transferencia">Transferencia</option>
                <option value="Efectivo">Efectivo</option>
                <option value="PayPal">PayPal</option>
                <option value="Tarjeta de Débito">Tarjeta de Débito</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted-foreground">Estado</label>
              <select value={formData.estatus} onChange={(e) => setFormData({...formData, estatus: e.target.value})} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all">
                <option value="completado">Completado</option>
                <option value="procesando">Procesando</option>
                <option value="pendiente">Pendiente</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>
            <div className="flex flex-col gap-2 col-span-2">
              <label className="text-sm font-medium text-muted-foreground">Concepto Detallado</label>
              <textarea value={formData.concepto_detallado} onChange={(e) => setFormData({...formData, concepto_detallado: e.target.value})} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none" rows="3" />
            </div>
          </div>
          <DialogFooter>
            <button disabled={submitting} className="rounded-md border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-muted transition-colors outline-none focus:ring-2 focus:ring-primary/20" onClick={() => setIsAddOpen(false)}>
              Cancelar
            </button>
            <button disabled={submitting} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 focus:ring-offset-background" onClick={handleSave}>
              {submitting ? "Guardando..." : "Registrar Venta"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Ver Detalles */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Detalles de la Transacción</DialogTitle>
            <DialogDescription>
              Información completa de la venta seleccionada.
            </DialogDescription>
          </DialogHeader>
          {selectedSale && (
            <div className="grid gap-4 py-4 grid-cols-2">
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground">ID Interno</h4>
                <p className="text-sm font-medium">{selectedSale.id}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground">Código TX</h4>
                <p className="text-sm font-medium">{selectedSale.codigo_tx || "N/A"}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground">Estado</h4>
                <Badge variant="outline" className={`mt-1 text-xs ${statusConfig[selectedSale.estatus]?.className || "bg-gray-100 text-gray-800"}`}>
                  {statusConfig[selectedSale.estatus]?.label || selectedSale.estatus}
                </Badge>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground">Fecha y Hora</h4>
                <p className="text-sm font-medium">{selectedSale.fecha_hora ? new Date(selectedSale.fecha_hora).toLocaleString() : "N/A"}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground">Cliente (Tercero)</h4>
                <p className="text-sm font-medium">{selectedSale.entidad_tercero}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground">Vendedor (Operador)</h4>
                <p className="text-sm font-medium">{selectedSale.operador_vendedor || "N/A"}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground">Monto Total</h4>
                <p className="text-sm font-medium">${parseFloat(selectedSale.monto_usd || 0).toFixed(2)}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground">Método de Pago</h4>
                <p className="text-sm font-medium">{selectedSale.metodo_pago}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground">Tipo de Transacción</h4>
                <p className="text-sm font-medium">{selectedSale.tipo_transaccion}</p>
              </div>
              <div className="col-span-2">
                <h4 className="text-sm font-semibold text-muted-foreground">Concepto</h4>
                <p className="text-sm font-medium whitespace-pre-wrap">{selectedSale.concepto_detallado || "Sin concepto"}</p>
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

      {/* Modal de Editar Venta */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Editar Venta</DialogTitle>
            <DialogDescription>
              Modifica la información de esta transacción.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted-foreground">Código TX</label>
              <input type="text" value={formData.codigo_tx} onChange={(e) => setFormData({...formData, codigo_tx: e.target.value})} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted-foreground">Fecha y Hora</label>
              <input type="datetime-local" value={formData.fecha_hora} onChange={(e) => setFormData({...formData, fecha_hora: e.target.value})} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted-foreground">Cliente (Tercero)</label>
              <input type="text" value={formData.entidad_tercero} onChange={(e) => setFormData({...formData, entidad_tercero: e.target.value})} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted-foreground">Vendedor (Operador)</label>
              <input type="text" value={formData.operador_vendedor} onChange={(e) => setFormData({...formData, operador_vendedor: e.target.value})} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted-foreground">Monto (USD)</label>
              <input type="number" step="0.01" value={formData.monto_usd} onChange={(e) => setFormData({...formData, monto_usd: e.target.value})} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted-foreground">Tipo de Transacción</label>
              <input type="text" value={formData.tipo_transaccion} onChange={(e) => setFormData({...formData, tipo_transaccion: e.target.value})} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted-foreground">Método de Pago</label>
              <select value={formData.metodo_pago} onChange={(e) => setFormData({...formData, metodo_pago: e.target.value})} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all">
                <option value="Tarjeta de Crédito">Tarjeta de Crédito</option>
                <option value="Transferencia">Transferencia</option>
                <option value="Efectivo">Efectivo</option>
                <option value="PayPal">PayPal</option>
                <option value="Tarjeta de Débito">Tarjeta de Débito</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted-foreground">Estado</label>
              <select value={formData.estatus} onChange={(e) => setFormData({...formData, estatus: e.target.value})} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all">
                <option value="completado">Completado</option>
                <option value="procesando">Procesando</option>
                <option value="pendiente">Pendiente</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>
            <div className="flex flex-col gap-2 col-span-2">
              <label className="text-sm font-medium text-muted-foreground">Concepto Detallado</label>
              <textarea value={formData.concepto_detallado} onChange={(e) => setFormData({...formData, concepto_detallado: e.target.value})} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none" rows="3" />
            </div>
          </div>
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
