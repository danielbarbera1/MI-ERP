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
  Wallet,
  TrendingDown,
  ArrowUpCircle,
  ArrowDownCircle,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Plus,
  Filter,
  Download,
  Search,
  FileText,
  ChevronLeft,
  ChevronRight,
  ListOrdered
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function ContabilidadPage() {
  const supabase = createClient();
  const [journalData, setJournalData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date-desc");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortBy]);

  const initialFormState = {
    nro_comprobante: "",
    fecha_asiento: new Date().toISOString().slice(0, 10),
    codigo_cuenta: "",
    nombre_cuenta: "",
    descripcion_movimiento: "",
    debe: "",
    haber: "",
    referencia_documento: "",
  };
  const [formData, setFormData] = useState(initialFormState);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchJournal();
  }, []);

  const fetchJournal = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("asientos_contables")
      .select("*")
      .order("fecha_asiento", { ascending: false });
      
    if (error) {
      console.error("Error fetching asientos_contables:", error);
    } else {
      setJournalData(data || []);
    }
    setLoading(false);
  };

  const handleOpenAdd = () => {
    setFormData(initialFormState);
    setIsAddOpen(true);
  };

  const handleOpenView = (entry) => {
    setSelectedEntry(entry);
    setIsViewOpen(true);
  };

  const handleOpenEdit = (entry) => {
    setSelectedEntry(entry);
    setFormData({
      nro_comprobante: entry.nro_comprobante || "",
      fecha_asiento: entry.fecha_asiento ? new Date(entry.fecha_asiento).toISOString().slice(0, 10) : "",
      codigo_cuenta: entry.codigo_cuenta || "",
      nombre_cuenta: entry.nombre_cuenta || "",
      descripcion_movimiento: entry.descripcion_movimiento || "",
      debe: entry.debe || "",
      haber: entry.haber || "",
      referencia_documento: entry.referencia_documento || "",
    });
    setIsEditOpen(true);
  };

  const handleSave = async () => {
    setSubmitting(true);
    const dataToSave = { ...formData };
    if (!dataToSave.debe) dataToSave.debe = 0;
    if (!dataToSave.haber) dataToSave.haber = 0;

    const { error } = await supabase.from("asientos_contables").insert([dataToSave]);
    if (error) {
      alert("Error al guardar: " + error.message);
    } else {
      setIsAddOpen(false);
      fetchJournal();
    }
    setSubmitting(false);
  };

  const handleUpdate = async () => {
    setSubmitting(true);
    const dataToUpdate = { ...formData };
    if (!dataToUpdate.debe) dataToUpdate.debe = 0;
    if (!dataToUpdate.haber) dataToUpdate.haber = 0;

    const { error } = await supabase
      .from("asientos_contables")
      .update(dataToUpdate)
      .eq("id", selectedEntry.id);
      
    if (error) {
      alert("Error al actualizar: " + error.message);
    } else {
      setIsEditOpen(false);
      fetchJournal();
    }
    setSubmitting(false);
  };

  const handleDelete = async (id) => {
    if (confirm("¿Estás seguro de que deseas eliminar este asiento contable?")) {
      const { error } = await supabase.from("asientos_contables").delete().eq("id", id);
      if (error) {
        alert("Error al eliminar: " + error.message);
      } else {
        fetchJournal();
      }
    }
  };

  const filteredAndSortedData = useMemo(() => {
    let data = [...journalData];

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      data = data.filter(
        (entry) =>
          (entry.nombre_cuenta && entry.nombre_cuenta.toLowerCase().includes(lowerSearch)) ||
          (entry.codigo_cuenta && entry.codigo_cuenta.toLowerCase().includes(lowerSearch)) ||
          (entry.nro_comprobante && entry.nro_comprobante.toLowerCase().includes(lowerSearch)) ||
          (entry.descripcion_movimiento && entry.descripcion_movimiento.toLowerCase().includes(lowerSearch)) ||
          (entry.referencia_documento && entry.referencia_documento.toLowerCase().includes(lowerSearch))
      );
    }

    data.sort((a, b) => {
      if (sortBy === "date-desc") return new Date(b.fecha_asiento || 0) - new Date(a.fecha_asiento || 0);
      if (sortBy === "date-asc") return new Date(a.fecha_asiento || 0) - new Date(b.fecha_asiento || 0);
      if (sortBy === "account-asc") return (a.nombre_cuenta || "").localeCompare(b.nombre_cuenta || "");
      if (sortBy === "account-desc") return (b.nombre_cuenta || "").localeCompare(a.nombre_cuenta || "");
      return 0;
    });

    return data;
  }, [journalData, searchTerm, sortBy]);

  const totalItems = filteredAndSortedData.length;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedData.slice(start, start + itemsPerPage);
  }, [filteredAndSortedData, currentPage, itemsPerPage]);

  const kpiData = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const currentMonthData = journalData.filter(e => {
      if (!e.fecha_asiento) return false;
      const date = new Date(e.fecha_asiento);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });
    
    const prevMonthData = journalData.filter(e => {
      if (!e.fecha_asiento) return false;
      const date = new Date(e.fecha_asiento);
      return date.getMonth() === prevMonth && date.getFullYear() === prevYear;
    });

    const currDebe = currentMonthData.reduce((sum, e) => sum + (parseFloat(e.debe) || 0), 0);
    const prevDebe = prevMonthData.reduce((sum, e) => sum + (parseFloat(e.debe) || 0), 0);
    const debeChange = prevDebe === 0 ? (currDebe > 0 ? 100 : 0) : ((currDebe - prevDebe) / prevDebe) * 100;

    const currHaber = currentMonthData.reduce((sum, e) => sum + (parseFloat(e.haber) || 0), 0);
    const prevHaber = prevMonthData.reduce((sum, e) => sum + (parseFloat(e.haber) || 0), 0);
    const haberChange = prevHaber === 0 ? (currHaber > 0 ? 100 : 0) : ((currHaber - prevHaber) / prevHaber) * 100;

    const currCount = currentMonthData.length;
    const prevCount = prevMonthData.length;
    const countChange = prevCount === 0 ? (currCount > 0 ? 100 : 0) : ((currCount - prevCount) / prevCount) * 100;

    // Diferencia total del mes (Balance mensual generalizado)
    const currBalance = Math.abs(currDebe - currHaber);
    const prevBalance = Math.abs(prevDebe - prevHaber);
    const balanceChange = prevBalance === 0 ? (currBalance > 0 ? 100 : 0) : ((currBalance - prevBalance) / prevBalance) * 100;

    const formatChange = (val) => {
      if (!isFinite(val)) return "0%";
      return `${val > 0 ? '+' : ''}${val.toFixed(1)}%`;
    };

    return [
      {
        id: "total-debe",
        title: "Total Debe",
        value: `$${currDebe.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        change: formatChange(debeChange),
        trend: debeChange >= 0 ? "up" : "down",
        icon: ArrowUpCircle,
        description: "Mes actual vs. anterior",
        color: "text-blue-500",
        bg: "bg-blue-500/10",
      },
      {
        id: "total-haber",
        title: "Total Haber",
        value: `$${currHaber.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        change: formatChange(haberChange),
        trend: haberChange >= 0 ? "up" : "down",
        icon: ArrowDownCircle,
        description: "Mes actual vs. anterior",
        color: "text-emerald-500",
        bg: "bg-emerald-500/10",
      },
      {
        id: "balance-mensual",
        title: "Diferencia Mensual",
        value: `$${currBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        change: formatChange(balanceChange),
        trend: balanceChange <= 0 ? "up" : "down",
        icon: Wallet,
        description: "|Debe - Haber|",
        color: "text-purple-500",
        bg: "bg-purple-500/10",
      },
      {
        id: "cantidad-asientos",
        title: "Movimientos",
        value: currCount.toString(),
        change: formatChange(countChange),
        trend: countChange >= 0 ? "up" : "down",
        icon: ListOrdered,
        description: "Asientos en este mes",
        color: "text-orange-500",
        bg: "bg-orange-500/10",
      },
    ];
  }, [journalData]);

  return (
    <ERPLayout title="Contabilidad">
      <div className="flex flex-col gap-6">
        
        {/* Page Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Contabilidad</h2>
            <p className="text-sm text-muted-foreground">Controla el libro diario, asientos contables y cuentas.</p>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button 
              className="flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 focus:ring-offset-background"
              onClick={handleOpenAdd}
            >
              <Plus className="h-4 w-4" />
              Nuevo Asiento
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

        {/* Journal Entries Table */}
        <Card className="flex flex-col flex-1">
          <CardHeader className="border-b border-border py-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle className="text-lg">Asientos Recientes (Libro Diario)</CardTitle>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar por descripción, cuenta, comprobante..."
                    className="w-full rounded-md border border-border bg-background pl-9 pr-4 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex h-9 items-center gap-2 rounded-md border border-border bg-background px-3 text-sm font-medium hover:bg-muted transition-colors outline-none focus:ring-1 focus:ring-primary">
                      <Filter className="h-4 w-4" />
                      <span className="hidden sm:inline">Ordenar</span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuRadioGroup value={sortBy} onValueChange={setSortBy}>
                      <DropdownMenuLabel>Ordenar por</DropdownMenuLabel>
                      <DropdownMenuRadioItem value="date-desc">Más recientes primero</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="date-asc">Más antiguos primero</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="account-asc">Cuenta (A-Z)</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="account-desc">Cuenta (Z-A)</DropdownMenuRadioItem>
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
                  <th className="px-6 py-3 font-semibold">Comprobante</th>
                  <th className="px-6 py-3 font-semibold">Fecha</th>
                  <th className="px-6 py-3 font-semibold">Cuenta / Descripción</th>
                  <th className="px-6 py-3 font-semibold text-right">Debe</th>
                  <th className="px-6 py-3 font-semibold text-right">Haber</th>
                  <th className="px-6 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-muted-foreground">Cargando datos...</td>
                  </tr>
                ) : paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-muted-foreground">No hay asientos registrados.</td>
                  </tr>
                ) : paginatedData.map((entry) => {
                  return (
                    <tr key={entry.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs font-medium">{entry.nro_comprobante || "N/A"}</td>
                      <td className="px-6 py-4 text-muted-foreground">{entry.fecha_asiento ? new Date(entry.fecha_asiento).toLocaleDateString() : "N/A"}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">{entry.codigo_cuenta ? `${entry.codigo_cuenta} - ` : ""}{entry.nombre_cuenta}</span>
                          <span className="text-xs text-muted-foreground">{entry.descripcion_movimiento}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-blue-600 text-right">
                        {parseFloat(entry.debe) > 0 ? `$${parseFloat(entry.debe).toFixed(2)}` : "-"}
                      </td>
                      <td className="px-6 py-4 font-medium text-emerald-600 text-right">
                        {parseFloat(entry.haber) > 0 ? `$${parseFloat(entry.haber).toFixed(2)}` : "-"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted text-muted-foreground transition-colors outline-none focus:ring-1 focus:ring-primary">
                              <MoreHorizontal className="h-4 w-4" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => handleOpenView(entry)}>Ver detalles</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleOpenEdit(entry)}>Editar asiento</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleDelete(entry.id)} className="text-red-600 focus:text-red-600 focus:bg-red-50">Eliminar</DropdownMenuItem>
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
            <DialogTitle>Nuevo Asiento Contable</DialogTitle>
            <DialogDescription>
              Registra un nuevo movimiento en el libro diario.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted-foreground">Nro. Comprobante</label>
              <input type="text" value={formData.nro_comprobante} onChange={(e) => setFormData({...formData, nro_comprobante: e.target.value})} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted-foreground">Fecha del Asiento</label>
              <input type="date" value={formData.fecha_asiento} onChange={(e) => setFormData({...formData, fecha_asiento: e.target.value})} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted-foreground">Código de Cuenta</label>
              <input type="text" value={formData.codigo_cuenta} onChange={(e) => setFormData({...formData, codigo_cuenta: e.target.value})} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted-foreground">Nombre de Cuenta</label>
              <input type="text" value={formData.nombre_cuenta} onChange={(e) => setFormData({...formData, nombre_cuenta: e.target.value})} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
            </div>
            <div className="flex flex-col gap-2 col-span-2">
              <label className="text-sm font-medium text-muted-foreground">Descripción del Movimiento</label>
              <input type="text" value={formData.descripcion_movimiento} onChange={(e) => setFormData({...formData, descripcion_movimiento: e.target.value})} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted-foreground">Debe</label>
              <input type="number" step="0.01" value={formData.debe} onChange={(e) => setFormData({...formData, debe: e.target.value})} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted-foreground">Haber</label>
              <input type="number" step="0.01" value={formData.haber} onChange={(e) => setFormData({...formData, haber: e.target.value})} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
            </div>
            <div className="flex flex-col gap-2 col-span-2">
              <label className="text-sm font-medium text-muted-foreground">Referencia de Documento</label>
              <input type="text" value={formData.referencia_documento} onChange={(e) => setFormData({...formData, referencia_documento: e.target.value})} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
            </div>
          </div>
          <DialogFooter>
            <button disabled={submitting} className="rounded-md border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-muted transition-colors outline-none focus:ring-2 focus:ring-primary/20" onClick={() => setIsAddOpen(false)}>
              Cancelar
            </button>
            <button disabled={submitting} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 focus:ring-offset-background" onClick={handleSave}>
              {submitting ? "Guardando..." : "Registrar Asiento"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Ver Detalles */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Detalles del Asiento Contable</DialogTitle>
            <DialogDescription>
              Información del movimiento registrado.
            </DialogDescription>
          </DialogHeader>
          {selectedEntry && (
            <div className="grid gap-4 py-4 grid-cols-2">
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground">ID BD</h4>
                <p className="text-sm font-medium">{selectedEntry.id}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground">Comprobante</h4>
                <p className="text-sm font-medium">{selectedEntry.nro_comprobante || "N/A"}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground">Fecha</h4>
                <p className="text-sm font-medium">{selectedEntry.fecha_asiento ? new Date(selectedEntry.fecha_asiento).toLocaleDateString() : "N/A"}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground">Referencia</h4>
                <p className="text-sm font-medium">{selectedEntry.referencia_documento || "N/A"}</p>
              </div>
              <div className="col-span-2">
                <h4 className="text-sm font-semibold text-muted-foreground">Cuenta Afectada</h4>
                <p className="text-sm font-medium">{selectedEntry.codigo_cuenta ? `${selectedEntry.codigo_cuenta} - ` : ""}{selectedEntry.nombre_cuenta}</p>
              </div>
              <div className="col-span-2">
                <h4 className="text-sm font-semibold text-muted-foreground">Descripción</h4>
                <p className="text-sm font-medium">{selectedEntry.descripcion_movimiento}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground">Debe</h4>
                <p className="text-sm font-medium text-blue-600">${parseFloat(selectedEntry.debe || 0).toFixed(2)}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground">Haber</h4>
                <p className="text-sm font-medium text-emerald-600">${parseFloat(selectedEntry.haber || 0).toFixed(2)}</p>
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

      {/* Modal de Editar Asiento */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Editar Asiento Contable</DialogTitle>
            <DialogDescription>
              Modifica la información de este asiento contable.
            </DialogDescription>
          </DialogHeader>
          {selectedEntry && (
            <div className="grid gap-4 py-4 grid-cols-2">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-muted-foreground">Nro. Comprobante</label>
                <input type="text" value={formData.nro_comprobante} onChange={(e) => setFormData({...formData, nro_comprobante: e.target.value})} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-muted-foreground">Fecha del Asiento</label>
                <input type="date" value={formData.fecha_asiento} onChange={(e) => setFormData({...formData, fecha_asiento: e.target.value})} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-muted-foreground">Código de Cuenta</label>
                <input type="text" value={formData.codigo_cuenta} onChange={(e) => setFormData({...formData, codigo_cuenta: e.target.value})} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-muted-foreground">Nombre de Cuenta</label>
                <input type="text" value={formData.nombre_cuenta} onChange={(e) => setFormData({...formData, nombre_cuenta: e.target.value})} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
              </div>
              <div className="flex flex-col gap-2 col-span-2">
                <label className="text-sm font-medium text-muted-foreground">Descripción del Movimiento</label>
                <input type="text" value={formData.descripcion_movimiento} onChange={(e) => setFormData({...formData, descripcion_movimiento: e.target.value})} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-muted-foreground">Debe</label>
                <input type="number" step="0.01" value={formData.debe} onChange={(e) => setFormData({...formData, debe: e.target.value})} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-muted-foreground">Haber</label>
                <input type="number" step="0.01" value={formData.haber} onChange={(e) => setFormData({...formData, haber: e.target.value})} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
              </div>
              <div className="flex flex-col gap-2 col-span-2">
                <label className="text-sm font-medium text-muted-foreground">Referencia de Documento</label>
                <input type="text" value={formData.referencia_documento} onChange={(e) => setFormData({...formData, referencia_documento: e.target.value})} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
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
