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
  ShoppingCart,
  Clock,
  DollarSign,
  Truck,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Plus,
  Filter,
  Download,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const normalizeStatus = (st) => {
  return (st || "")
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "_");
};

const statusConfig = {
  cancelado: {
    label: "Cancelado",
    className: "bg-red-500/15 text-red-600 border-red-500/20",
  },
  en_transito: {
    label: "En Tránsito",
    className: "bg-blue-500/15 text-blue-600 border-blue-500/20",
  },
  incompleto: {
    label: "Incompleto",
    className: "bg-orange-500/15 text-orange-600 border-orange-500/20",
  },
  pendiente_por_autorizar: {
    label: "Pendiente por Autorizar",
    className: "bg-yellow-500/15 text-yellow-600 border-yellow-500/20",
  },
  recibido_completo: {
    label: "Recibido Completo",
    className: "bg-emerald-500/15 text-emerald-600 border-emerald-500/20",
  },
};

export default function ComprasPage() {
  const supabase = createClient();
  const [purchasesData, setPurchasesData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState(null);
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
    numero_oc: "",
    fecha_emision: new Date().toISOString().slice(0, 10),
    fecha_entrega_est: "",
    proveedor: "",
    rif_proveedor: "",
    monto_total_usd: "",
    articulos_totales: 1,
    estatus_orden: "Pendiente por Autorizar",
    condicion_pago: "30 dias",
    comprador_responsable: "",
  };
  const [formData, setFormData] = useState(initialFormState);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("ordenes_compra")
      .select("*")
      .order("fecha_emision", { ascending: false });
      
    if (error) {
      console.error("Error fetching compras:", error);
    } else {
      setPurchasesData(data || []);
    }
    setLoading(false);
  };

  const handleOpenAdd = () => {
    setFormData(initialFormState);
    setIsAddOpen(true);
  };

  const handleOpenView = (purchase) => {
    setSelectedPurchase(purchase);
    setIsViewOpen(true);
  };

  const handleOpenEdit = (purchase) => {
    setSelectedPurchase(purchase);
    setFormData({
      numero_oc: purchase.numero_oc || "",
      fecha_emision: purchase.fecha_emision ? new Date(purchase.fecha_emision).toISOString().slice(0, 10) : "",
      fecha_entrega_est: purchase.fecha_entrega_est ? new Date(purchase.fecha_entrega_est).toISOString().slice(0, 10) : "",
      proveedor: purchase.proveedor || "",
      rif_proveedor: purchase.rif_proveedor || "",
      monto_total_usd: purchase.monto_total_usd || "",
      articulos_totales: purchase.articulos_totales || 1,
      estatus_orden: purchase.estatus_orden || "Pendiente por Autorizar",
      condicion_pago: purchase.condicion_pago || "",
      comprador_responsable: purchase.comprador_responsable || "",
    });
    setIsEditOpen(true);
  };

  const handleSave = async () => {
    setSubmitting(true);
    const { error } = await supabase.from("ordenes_compra").insert([formData]);
    if (error) {
      alert("Error al guardar: " + error.message);
    } else {
      setIsAddOpen(false);
      fetchPurchases();
    }
    setSubmitting(false);
  };

  const handleUpdate = async () => {
    setSubmitting(true);
    const { error } = await supabase
      .from("ordenes_compra")
      .update(formData)
      .eq("id", selectedPurchase.id);
    if (error) {
      alert("Error al actualizar: " + error.message);
    } else {
      setIsEditOpen(false);
      fetchPurchases();
    }
    setSubmitting(false);
  };

  const handleDelete = async (id) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta orden de compra?")) {
      const { error } = await supabase.from("ordenes_compra").delete().eq("id", id);
      if (error) {
        alert("Error al eliminar: " + error.message);
      } else {
        fetchPurchases();
      }
    }
  };

  const filteredAndSortedData = useMemo(() => {
    let data = [...purchasesData];

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      data = data.filter(
        (purchase) =>
          (purchase.proveedor && purchase.proveedor.toLowerCase().includes(lowerSearch)) ||
          (purchase.numero_oc && purchase.numero_oc.toLowerCase().includes(lowerSearch))
      );
    }

    if (filterStatus !== "all") {
      data = data.filter((purchase) => purchase.estatus_orden === filterStatus);
    }

    data.sort((a, b) => {
      if (sortBy === "date-desc") return new Date(b.fecha_emision) - new Date(a.fecha_emision);
      if (sortBy === "date-asc") return new Date(a.fecha_emision) - new Date(b.fecha_emision);
      
      const amountA = parseFloat(a.monto_total_usd) || 0;
      const amountB = parseFloat(b.monto_total_usd) || 0;
      if (sortBy === "amount-desc") return amountB - amountA;
      if (sortBy === "amount-asc") return amountA - amountB;

      if (sortBy === "name-asc") return (a.proveedor || "").localeCompare(b.proveedor || "");
      if (sortBy === "name-desc") return (b.proveedor || "").localeCompare(a.proveedor || "");

      return 0;
    });

    return data;
  }, [purchasesData, searchTerm, sortBy, filterStatus]);

  const totalItems = filteredAndSortedData.length;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedData.slice(start, start + itemsPerPage);
  }, [filteredAndSortedData, currentPage, itemsPerPage]);

  const kpiData = useMemo(() => {
    const isCompletado = (st) => normalizeStatus(st) === "recibido_completo";
    const isPendiente = (st) => {
      const s = normalizeStatus(st);
      return s === "pendiente_por_autorizar" || s === "en_transito" || s === "incompleto";
    };

    const completadas = purchasesData.filter(p => isCompletado(p.estatus_orden));
    
    // Totales (Globales)
    const comprasTotales = completadas.reduce((sum, p) => sum + (parseFloat(p.monto_total_usd) || 0), 0);
    const pendientesCount = purchasesData.filter(p => isPendiente(p.estatus_orden)).length;
    
    const pagosPendientes = purchasesData
      .filter(p => !isCompletado(p.estatus_orden))
      .reduce((sum, p) => sum + (parseFloat(p.monto_total_usd) || 0), 0);
      
    // Unique suppliers
    const proveedoresSet = new Set(purchasesData.map(p => p.proveedor).filter(Boolean));
    const proveedoresActivos = proveedoresSet.size;

    // Calculo changes (Mes actual vs anterior)
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const currentMonthAll = purchasesData.filter(sale => {
      if (!sale.fecha_emision) return false;
      const date = new Date(sale.fecha_emision);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });
    const prevMonthAll = purchasesData.filter(sale => {
      if (!sale.fecha_emision) return false;
      const date = new Date(sale.fecha_emision);
      return date.getMonth() === prevMonth && date.getFullYear() === prevYear;
    });

    // 1. Compras Totales
    const currCompras = currentMonthAll.filter(p => isCompletado(p.estatus_orden)).reduce((sum, sale) => sum + (parseFloat(sale.monto_total_usd) || 0), 0);
    const prevCompras = prevMonthAll.filter(p => isCompletado(p.estatus_orden)).reduce((sum, sale) => sum + (parseFloat(sale.monto_total_usd) || 0), 0);
    const comprasChange = prevCompras === 0 ? (currCompras > 0 ? 100 : 0) : ((currCompras - prevCompras) / prevCompras) * 100;

    // 2. Órdenes Pendientes
    const currPendientesCount = currentMonthAll.filter(p => isPendiente(p.estatus_orden)).length;
    const prevPendientesCount = prevMonthAll.filter(p => isPendiente(p.estatus_orden)).length;
    const pendientesChange = prevPendientesCount === 0 ? (currPendientesCount > 0 ? 100 : 0) : ((currPendientesCount - prevPendientesCount) / prevPendientesCount) * 100;

    // 3. Pagos Pendientes
    const currPagosPendientes = currentMonthAll.filter(p => !isCompletado(p.estatus_orden)).reduce((sum, p) => sum + (parseFloat(p.monto_total_usd) || 0), 0);
    const prevPagosPendientes = prevMonthAll.filter(p => !isCompletado(p.estatus_orden)).reduce((sum, p) => sum + (parseFloat(p.monto_total_usd) || 0), 0);
    const pagosPendientesChange = prevPagosPendientes === 0 ? (currPagosPendientes > 0 ? 100 : 0) : ((currPagosPendientes - prevPagosPendientes) / prevPagosPendientes) * 100;

    // 4. Proveedores Activos
    const currProveedores = new Set(currentMonthAll.map(p => p.proveedor).filter(Boolean)).size;
    const prevProveedores = new Set(prevMonthAll.map(p => p.proveedor).filter(Boolean)).size;
    const proveedoresChange = prevProveedores === 0 ? (currProveedores > 0 ? 100 : 0) : ((currProveedores - prevProveedores) / prevProveedores) * 100;

    const formatChange = (val) => {
      if (!isFinite(val)) return "0%";
      return `${val > 0 ? '+' : ''}${val.toFixed(1)}%`;
    };

    return [
      {
        id: "compras-totales",
        title: "Compras Totales",
        value: `$${comprasTotales.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        change: formatChange(comprasChange),
        trend: comprasChange >= 0 ? "up" : "down",
        icon: DollarSign,
        description: "vs. mes anterior",
        color: "text-blue-500",
        bg: "bg-blue-500/10",
      },
      {
        id: "ordenes-pendientes",
        title: "Órdenes Pendientes",
        value: pendientesCount.toString(),
        change: formatChange(pendientesChange),
        trend: pendientesChange <= 0 ? "up" : "down", // Bajar órdenes pendientes es bueno (verde)
        icon: Clock,
        description: "vs. mes anterior",
        color: "text-orange-500",
        bg: "bg-orange-500/10",
      },
      {
        id: "pagos-pendientes",
        title: "Pagos Pendientes",
        value: `$${pagosPendientes.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        change: formatChange(pagosPendientesChange),
        trend: pagosPendientesChange <= 0 ? "up" : "down", // Bajar deuda es bueno (verde)
        icon: ShoppingCart,
        description: "vs. mes anterior",
        color: "text-red-500",
        bg: "bg-red-500/10",
      },
      {
        id: "proveedores",
        title: "Proveedores Activos",
        value: proveedoresActivos.toString(),
        change: formatChange(proveedoresChange),
        trend: proveedoresChange >= 0 ? "up" : "down",
        icon: Truck,
        description: "vs. mes anterior",
        color: "text-emerald-500",
        bg: "bg-emerald-500/10",
      },
    ];
  }, [purchasesData]);

  return (
    <ERPLayout title="Compras">
      <div className="flex flex-col gap-6">
        
        {/* Page Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Gestión de Compras</h2>
            <p className="text-sm text-muted-foreground">Administra órdenes de compra y proveedores.</p>
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
              Nueva Orden
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

        {/* Purchases Table */}
        <Card className="flex flex-col flex-1">
          <CardHeader className="border-b border-border py-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle className="text-lg">Órdenes de Compra Recientes</CardTitle>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar orden o proveedor..."
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
                      <DropdownMenuRadioItem value="name-asc">Proveedor (A-Z)</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup value={filterStatus} onValueChange={setFilterStatus}>
                      <DropdownMenuLabel>Filtrar por Estado</DropdownMenuLabel>
                      <DropdownMenuRadioItem value="all">Todos los estados</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="Recibido Completo">Recibido Completo</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="En Tránsito">En Tránsito</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="Pendiente por Autorizar">Pendiente por Autorizar</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="Incompleto">Incompleto</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="Cancelado">Cancelado</DropdownMenuRadioItem>
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
                  <th className="px-6 py-3 font-semibold">Orden (OC)</th>
                  <th className="px-6 py-3 font-semibold">Proveedor</th>
                  <th className="px-6 py-3 font-semibold">Fecha Emisión</th>
                  <th className="px-6 py-3 font-semibold">Entrega Est.</th>
                  <th className="px-6 py-3 font-semibold">Responsable</th>
                  <th className="px-6 py-3 font-semibold">Total</th>
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
                    <td colSpan={8} className="text-center py-8 text-muted-foreground">No hay órdenes registradas.</td>
                  </tr>
                ) : paginatedData.map((purchase) => {
                  const normalizedStatus = normalizeStatus(purchase.estatus_orden);
                  const status = statusConfig[normalizedStatus] || { label: purchase.estatus_orden, className: "bg-gray-500/15 text-gray-600 border-gray-500/20" };
                  return (
                    <tr key={purchase.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs font-medium">{purchase.numero_oc || "N/A"}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">{purchase.proveedor}</span>
                          <span className="text-xs text-muted-foreground">RIF: {purchase.rif_proveedor}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">{purchase.fecha_emision ? new Date(purchase.fecha_emision).toLocaleDateString() : "N/A"}</td>
                      <td className="px-6 py-4 text-muted-foreground">{purchase.fecha_entrega_est ? new Date(purchase.fecha_entrega_est).toLocaleDateString() : "N/A"}</td>
                      <td className="px-6 py-4 text-muted-foreground">{purchase.comprador_responsable || "N/A"}</td>
                      <td className="px-6 py-4 font-medium text-foreground">${parseFloat(purchase.monto_total_usd || 0).toFixed(2)}</td>
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
                            <DropdownMenuItem onClick={() => handleOpenView(purchase)}>Ver detalles</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleOpenEdit(purchase)}>Editar orden</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleDelete(purchase.id)} className="text-red-600 focus:text-red-600 focus:bg-red-50">Eliminar</DropdownMenuItem>
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

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Nueva Orden de Compra</DialogTitle>
            <DialogDescription>
              Crea una nueva orden para un proveedor.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted-foreground">Número OC</label>
              <input type="text" value={formData.numero_oc} onChange={(e) => setFormData({...formData, numero_oc: e.target.value})} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted-foreground">Proveedor</label>
              <input type="text" value={formData.proveedor} onChange={(e) => setFormData({...formData, proveedor: e.target.value})} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted-foreground">RIF Proveedor</label>
              <input type="text" value={formData.rif_proveedor} onChange={(e) => setFormData({...formData, rif_proveedor: e.target.value})} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted-foreground">Monto Total (USD)</label>
              <input type="number" step="0.01" value={formData.monto_total_usd} onChange={(e) => setFormData({...formData, monto_total_usd: e.target.value})} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted-foreground">Artículos Totales</label>
              <input type="number" value={formData.articulos_totales} onChange={(e) => setFormData({...formData, articulos_totales: e.target.value})} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted-foreground">Comprador Responsable</label>
              <input type="text" value={formData.comprador_responsable} onChange={(e) => setFormData({...formData, comprador_responsable: e.target.value})} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted-foreground">Fecha Emisión</label>
              <input type="date" value={formData.fecha_emision} onChange={(e) => setFormData({...formData, fecha_emision: e.target.value})} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted-foreground">Fecha Entrega Est.</label>
              <input type="date" value={formData.fecha_entrega_est} onChange={(e) => setFormData({...formData, fecha_entrega_est: e.target.value})} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted-foreground">Condición Pago</label>
              <input type="text" value={formData.condicion_pago} onChange={(e) => setFormData({...formData, condicion_pago: e.target.value})} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted-foreground">Estado</label>
              <select value={formData.estatus_orden} onChange={(e) => setFormData({...formData, estatus_orden: e.target.value})} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all">
                <option value="Recibido Completo">Recibido Completo</option>
                <option value="En Tránsito">En Tránsito</option>
                <option value="Pendiente por Autorizar">Pendiente por Autorizar</option>
                <option value="Incompleto">Incompleto</option>
                <option value="Cancelado">Cancelado</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <button disabled={submitting} className="rounded-md border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-muted transition-colors outline-none focus:ring-2 focus:ring-primary/20" onClick={() => setIsAddOpen(false)}>
              Cancelar
            </button>
            <button disabled={submitting} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 focus:ring-offset-background" onClick={handleSave}>
              {submitting ? "Guardando..." : "Crear Orden"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Ver Detalles */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Detalles de Orden de Compra</DialogTitle>
            <DialogDescription>
              Información completa de la orden seleccionada.
            </DialogDescription>
          </DialogHeader>
          {selectedPurchase && (
            <div className="grid gap-4 py-4 grid-cols-2">
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground">ID BD</h4>
                <p className="text-sm font-medium">{selectedPurchase.id}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground">Número OC</h4>
                <p className="text-sm font-medium">{selectedPurchase.numero_oc || "N/A"}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground">Estado</h4>
                <Badge variant="outline" className={`mt-1 text-xs ${statusConfig[selectedPurchase.estatus_orden]?.className || "bg-gray-100 text-gray-800"}`}>
                  {statusConfig[selectedPurchase.estatus_orden]?.label || selectedPurchase.estatus_orden}
                </Badge>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground">Monto Total</h4>
                <p className="text-sm font-medium">${parseFloat(selectedPurchase.monto_total_usd || 0).toFixed(2)}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground">Proveedor</h4>
                <p className="text-sm font-medium">{selectedPurchase.proveedor}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground">RIF Proveedor</h4>
                <p className="text-sm font-medium">{selectedPurchase.rif_proveedor || "N/A"}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground">Fecha Emisión</h4>
                <p className="text-sm font-medium">{selectedPurchase.fecha_emision ? new Date(selectedPurchase.fecha_emision).toLocaleDateString() : "N/A"}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground">Entrega Estimada</h4>
                <p className="text-sm font-medium">{selectedPurchase.fecha_entrega_est ? new Date(selectedPurchase.fecha_entrega_est).toLocaleDateString() : "N/A"}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground">Artículos Totales</h4>
                <p className="text-sm font-medium">{selectedPurchase.articulos_totales}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground">Condición Pago</h4>
                <p className="text-sm font-medium">{selectedPurchase.condicion_pago || "N/A"}</p>
              </div>
              <div className="col-span-2">
                <h4 className="text-sm font-semibold text-muted-foreground">Comprador Responsable</h4>
                <p className="text-sm font-medium">{selectedPurchase.comprador_responsable || "N/A"}</p>
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

      {/* Modal de Editar Orden */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Editar Orden de Compra</DialogTitle>
            <DialogDescription>
              Modifica la información de esta orden de compra.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted-foreground">Número OC</label>
              <input type="text" value={formData.numero_oc} onChange={(e) => setFormData({...formData, numero_oc: e.target.value})} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted-foreground">Proveedor</label>
              <input type="text" value={formData.proveedor} onChange={(e) => setFormData({...formData, proveedor: e.target.value})} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted-foreground">RIF Proveedor</label>
              <input type="text" value={formData.rif_proveedor} onChange={(e) => setFormData({...formData, rif_proveedor: e.target.value})} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted-foreground">Monto Total (USD)</label>
              <input type="number" step="0.01" value={formData.monto_total_usd} onChange={(e) => setFormData({...formData, monto_total_usd: e.target.value})} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted-foreground">Artículos Totales</label>
              <input type="number" value={formData.articulos_totales} onChange={(e) => setFormData({...formData, articulos_totales: e.target.value})} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted-foreground">Comprador Responsable</label>
              <input type="text" value={formData.comprador_responsable} onChange={(e) => setFormData({...formData, comprador_responsable: e.target.value})} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted-foreground">Fecha Emisión</label>
              <input type="date" value={formData.fecha_emision} onChange={(e) => setFormData({...formData, fecha_emision: e.target.value})} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted-foreground">Fecha Entrega Est.</label>
              <input type="date" value={formData.fecha_entrega_est} onChange={(e) => setFormData({...formData, fecha_entrega_est: e.target.value})} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted-foreground">Condición Pago</label>
              <input type="text" value={formData.condicion_pago} onChange={(e) => setFormData({...formData, condicion_pago: e.target.value})} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted-foreground">Estado</label>
              <select value={formData.estatus_orden} onChange={(e) => setFormData({...formData, estatus_orden: e.target.value})} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all">
                <option value="Recibido Completo">Recibido Completo</option>
                <option value="En Tránsito">En Tránsito</option>
                <option value="Pendiente por Autorizar">Pendiente por Autorizar</option>
                <option value="Incompleto">Incompleto</option>
                <option value="Cancelado">Cancelado</option>
              </select>
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
