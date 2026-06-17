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
} from "lucide-react";

// Mock Data
const kpiData = [
  {
    id: "beneficio-neto",
    title: "Beneficio Neto",
    value: "$12,450.00",
    change: "+15.3%",
    trend: "up",
    icon: Wallet,
    description: "Este mes",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    id: "gastos",
    title: "Gastos Operativos",
    value: "$8,230.50",
    change: "-4.1%",
    trend: "down",
    icon: TrendingDown,
    description: "vs. mes anterior",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    id: "cuentas-cobrar",
    title: "Cuentas por Cobrar",
    value: "$15,800.00",
    change: "+2.5%",
    trend: "up",
    icon: ArrowUpCircle,
    description: "Pendientes de clientes",
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
  {
    id: "cuentas-pagar",
    title: "Cuentas por Pagar",
    value: "$5,420.00",
    change: "-1.2%",
    trend: "down",
    icon: ArrowDownCircle,
    description: "A proveedores",
    color: "text-red-500",
    bg: "bg-red-500/10",
  },
];

const journalData = [
  {
    id: "AS-2606-001",
    date: "2026-06-15",
    account: "Banco Nacional",
    description: "Pago factura cliente Global Tech",
    debit: "$850.00",
    credit: "-",
    status: "conciliado",
  },
  {
    id: "AS-2606-002",
    date: "2026-06-14",
    account: "Cuentas por Pagar",
    description: "Pago a proveedor Tech Solutions",
    debit: "-",
    credit: "$1,200.00",
    status: "pendiente",
  },
  {
    id: "AS-2606-003",
    date: "2026-06-13",
    account: "Nómina",
    description: "Pago de quincena empleados",
    debit: "$14,500.00",
    credit: "-",
    status: "conciliado",
  },
  {
    id: "AS-2606-004",
    date: "2026-06-12",
    account: "Servicios Básicos",
    description: "Factura de electricidad",
    debit: "-",
    credit: "$340.50",
    status: "conciliado",
  },
  {
    id: "AS-2606-005",
    date: "2026-06-10",
    account: "Caja Chica",
    description: "Reposición de fondos",
    debit: "$200.00",
    credit: "-",
    status: "revision",
  },
  {
    id: "AS-2606-006",
    date: "2026-06-08",
    account: "Inventario",
    description: "Ajuste por merma",
    debit: "-",
    credit: "$120.00",
    status: "revision",
  },
];

const statusConfig = {
  conciliado: {
    label: "Conciliado",
    className: "bg-emerald-500/15 text-emerald-600 border-emerald-500/20",
  },
  pendiente: {
    label: "Pendiente",
    className: "bg-orange-500/15 text-orange-600 border-orange-500/20",
  },
  revision: {
    label: "En Revisión",
    className: "bg-blue-500/15 text-blue-600 border-blue-500/20",
  },
};

export default function ContabilidadPage() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleOpenView = (entry) => {
    setSelectedEntry(entry);
    setIsViewOpen(true);
  };

  const handleOpenEdit = (entry) => {
    setSelectedEntry(entry);
    setIsEditOpen(true);
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date-desc");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredAndSortedData = useMemo(() => {
    let data = [...journalData];

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      data = data.filter(
        (entry) =>
          entry.account.toLowerCase().includes(lowerSearch) ||
          entry.id.toLowerCase().includes(lowerSearch) ||
          entry.description.toLowerCase().includes(lowerSearch)
      );
    }

    if (filterStatus !== "all") {
      data = data.filter((entry) => entry.status === filterStatus);
    }

    data.sort((a, b) => {
      if (sortBy === "date-desc") return new Date(b.date) - new Date(a.date);
      if (sortBy === "date-asc") return new Date(a.date) - new Date(b.date);
      if (sortBy === "account-asc") return a.account.localeCompare(b.account);
      if (sortBy === "account-desc") return b.account.localeCompare(a.account);

      return 0;
    });

    return data;
  }, [searchTerm, sortBy, filterStatus]);

  return (
    <ERPLayout title="Contabilidad">
      <div className="flex flex-col gap-6">
        
        {/* Page Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Contabilidad</h2>
            <p className="text-sm text-muted-foreground">Controla el libro diario, estados financieros y cuentas.</p>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button className="flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-muted transition-colors">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Reportes Financieros</span>
            </button>
            <button 
              className="flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 focus:ring-offset-background"
              onClick={() => setIsAddOpen(true)}
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
                    placeholder="Buscar por referencia o cuenta..."
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
                      <DropdownMenuRadioItem value="date-asc">Más antiguos primero</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="account-asc">Cuenta (A-Z)</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="account-desc">Cuenta (Z-A)</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup value={filterStatus} onValueChange={setFilterStatus}>
                      <DropdownMenuLabel>Filtrar por Estado</DropdownMenuLabel>
                      <DropdownMenuRadioItem value="all">Todos los estados</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="conciliado">Conciliado</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="pendiente">Pendiente</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="revision">En Revisión</DropdownMenuRadioItem>
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
                  <th className="px-6 py-3 font-semibold">Ref.</th>
                  <th className="px-6 py-3 font-semibold">Fecha</th>
                  <th className="px-6 py-3 font-semibold">Cuenta / Descripción</th>
                  <th className="px-6 py-3 font-semibold text-right">Debe</th>
                  <th className="px-6 py-3 font-semibold text-right">Haber</th>
                  <th className="px-6 py-3 font-semibold">Estado</th>
                  <th className="px-6 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredAndSortedData.map((entry) => {
                  const status = statusConfig[entry.status];
                  return (
                    <tr key={entry.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs font-medium">{entry.id}</td>
                      <td className="px-6 py-4 text-muted-foreground">{entry.date}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">{entry.account}</span>
                          <span className="text-xs text-muted-foreground">{entry.description}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-foreground text-right">{entry.debit}</td>
                      <td className="px-6 py-4 font-medium text-foreground text-right">{entry.credit}</td>
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
                            <DropdownMenuItem onClick={() => handleOpenView(entry)}>Ver detalles</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleOpenEdit(entry)}>Editar asiento</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50">Eliminar</DropdownMenuItem>
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
            <DialogTitle>Nuevo Asiento Contable</DialogTitle>
            <DialogDescription>
              Registra un nuevo movimiento en el libro diario.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted-foreground">Cuenta Afectada</label>
              <input type="text" placeholder="Ej. 1001 - Caja General" className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted-foreground">Descripción / Concepto</label>
              <input type="text" placeholder="Ej. Pago a proveedor" className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-muted-foreground">Debe</label>
                <input type="number" placeholder="0.00" className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-muted-foreground">Haber</label>
                <input type="number" placeholder="0.00" className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-muted-foreground">Fecha</label>
                <input type="date" className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-muted-foreground">Estado</label>
                <select className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all">
                  <option>Completado</option>
                  <option>Pendiente</option>
                  <option>Conciliado</option>
                </select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <button className="rounded-md border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-muted transition-colors outline-none focus:ring-2 focus:ring-primary/20" onClick={() => setIsAddOpen(false)}>
              Cancelar
            </button>
            <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 focus:ring-offset-background" onClick={() => setIsAddOpen(false)}>
              Registrar Asiento
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Ver Detalles */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalles del Asiento Contable</DialogTitle>
            <DialogDescription>
              Información del movimiento registrado.
            </DialogDescription>
          </DialogHeader>
          {selectedEntry && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground">Referencia</h4>
                  <p className="text-sm font-medium">{selectedEntry.id}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground">Estado</h4>
                  <Badge variant="outline" className={`mt-1 text-xs ${statusConfig[selectedEntry.status]?.className}`}>
                    {statusConfig[selectedEntry.status]?.label}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <h4 className="text-sm font-semibold text-muted-foreground">Cuenta Afectada</h4>
                  <p className="text-sm font-medium">{selectedEntry.account}</p>
                  <p className="text-xs text-muted-foreground">{selectedEntry.description}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground">Debe</h4>
                  <p className="text-sm font-medium text-emerald-600">{selectedEntry.debit}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground">Haber</h4>
                  <p className="text-sm font-medium text-red-600">{selectedEntry.credit}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground">Fecha</h4>
                  <p className="text-sm font-medium">{selectedEntry.date}</p>
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

      {/* Modal de Editar Asiento */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Asiento Contable</DialogTitle>
            <DialogDescription>
              Modifica la información de este movimiento.
            </DialogDescription>
          </DialogHeader>
          {selectedEntry && (
            <div className="grid gap-4 py-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-muted-foreground">Cuenta Afectada</label>
                <input type="text" defaultValue={selectedEntry.account} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-muted-foreground">Descripción / Concepto</label>
                <input type="text" defaultValue={selectedEntry.description} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-muted-foreground">Debe</label>
                  <input type="text" defaultValue={selectedEntry.debit !== "-" ? selectedEntry.debit.replace(/[^0-9.]/g, "") : ""} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-muted-foreground">Haber</label>
                  <input type="text" defaultValue={selectedEntry.credit !== "-" ? selectedEntry.credit.replace(/[^0-9.]/g, "") : ""} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-muted-foreground">Fecha</label>
                  <input type="date" defaultValue={selectedEntry.date} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-muted-foreground">Estado</label>
                  <select defaultValue={selectedEntry.status} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all">
                    <option value="conciliado">Conciliado</option>
                    <option value="pendiente">Pendiente</option>
                    <option value="revision">En Revisión</option>
                  </select>
                </div>
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
