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
} from "lucide-react";

// Mock Data
const kpiData = [
  {
    id: "compras-totales",
    title: "Compras Totales",
    value: "$28,450.00",
    change: "+8.4%",
    trend: "up",
    icon: DollarSign,
    description: "vs. mes anterior",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    id: "ordenes-pendientes",
    title: "Órdenes Pendientes",
    value: "14",
    change: "-2",
    trend: "down",
    icon: Clock,
    description: "Por recibir",
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
  {
    id: "pagos-pendientes",
    title: "Pagos Pendientes",
    value: "$5,230.50",
    change: "+12.1%",
    trend: "up",
    icon: ShoppingCart,
    description: "Cuentas por pagar",
    color: "text-red-500",
    bg: "bg-red-500/10",
  },
  {
    id: "proveedores",
    title: "Proveedores Activos",
    value: "32",
    change: "+3",
    trend: "up",
    icon: Truck,
    description: "Nuevos este mes",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
];

const purchasesData = [
  {
    id: "OC-2026-045",
    supplier: "Tech Solutions Inc.",
    email: "ventas@techsolutions.com",
    date: "2026-06-15",
    expectedDate: "2026-06-18",
    amount: "$4,500.00",
    status: "completado",
  },
  {
    id: "OC-2026-046",
    supplier: "Distribuidora Nacional",
    email: "pedidos@distribuidora.com",
    date: "2026-06-14",
    expectedDate: "2026-06-20",
    amount: "$1,250.75",
    status: "en_camino",
  },
  {
    id: "OC-2026-047",
    supplier: "Importaciones Globales",
    email: "contacto@importglobal.com",
    date: "2026-06-12",
    expectedDate: "2026-06-25",
    amount: "$8,900.00",
    status: "pendiente",
  },
  {
    id: "OC-2026-048",
    supplier: "Suministros de Oficina S.A.",
    email: "ventas@suministros.com",
    date: "2026-06-10",
    expectedDate: "2026-06-12",
    amount: "$450.00",
    status: "completado",
  },
  {
    id: "OC-2026-049",
    supplier: "Electrónica Mayorista",
    email: "mayorista@electronica.com",
    date: "2026-06-08",
    expectedDate: "2026-06-15",
    amount: "$12,400.00",
    status: "retrasado",
  },
];

const statusConfig = {
  completado: {
    label: "Recibido",
    className: "bg-emerald-500/15 text-emerald-600 border-emerald-500/20",
  },
  en_camino: {
    label: "En Camino",
    className: "bg-blue-500/15 text-blue-600 border-blue-500/20",
  },
  pendiente: {
    label: "Pendiente",
    className: "bg-orange-500/15 text-orange-600 border-orange-500/20",
  },
  retrasado: {
    label: "Retrasado",
    className: "bg-red-500/15 text-red-600 border-red-500/20",
  },
};

export default function ComprasPage() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleOpenView = (purchase) => {
    setSelectedPurchase(purchase);
    setIsViewOpen(true);
  };

  const handleOpenEdit = (purchase) => {
    setSelectedPurchase(purchase);
    setIsEditOpen(true);
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date-desc");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredAndSortedData = useMemo(() => {
    let data = [...purchasesData];

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      data = data.filter(
        (purchase) =>
          purchase.supplier.toLowerCase().includes(lowerSearch) ||
          purchase.id.toLowerCase().includes(lowerSearch)
      );
    }

    if (filterStatus !== "all") {
      data = data.filter((purchase) => purchase.status === filterStatus);
    }

    data.sort((a, b) => {
      if (sortBy === "date-desc") return new Date(b.date) - new Date(a.date);
      if (sortBy === "date-asc") return new Date(a.date) - new Date(b.date);
      
      const amountA = parseFloat(a.amount.replace(/[^0-9.-]+/g,""));
      const amountB = parseFloat(b.amount.replace(/[^0-9.-]+/g,""));
      if (sortBy === "amount-desc") return amountB - amountA;
      if (sortBy === "amount-asc") return amountA - amountB;

      if (sortBy === "name-asc") return a.supplier.localeCompare(b.supplier);
      if (sortBy === "name-desc") return b.supplier.localeCompare(a.supplier);

      return 0;
    });

    return data;
  }, [searchTerm, sortBy, filterStatus]);

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
            <button className="flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-muted transition-colors">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Exportar</span>
            </button>
            <button 
              className="flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 focus:ring-offset-background"
              onClick={() => setIsAddOpen(true)}
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
                      <DropdownMenuRadioItem value="completado">Recibido</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="en_camino">En Camino</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="pendiente">Pendiente</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="retrasado">Retrasado</DropdownMenuRadioItem>
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
                  <th className="px-6 py-3 font-semibold">Total</th>
                  <th className="px-6 py-3 font-semibold">Estado</th>
                  <th className="px-6 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredAndSortedData.map((purchase) => {
                  const status = statusConfig[purchase.status];
                  return (
                    <tr key={purchase.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs font-medium">{purchase.id}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">{purchase.supplier}</span>
                          <span className="text-xs text-muted-foreground">{purchase.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">{purchase.date}</td>
                      <td className="px-6 py-4 text-muted-foreground">{purchase.expectedDate}</td>
                      <td className="px-6 py-4 font-medium text-foreground">{purchase.amount}</td>
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
            <DialogTitle>Nueva Orden de Compra</DialogTitle>
            <DialogDescription>
              Crea una nueva orden para un proveedor.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted-foreground">Proveedor</label>
              <input type="text" placeholder="Ej. Proveedora ABC" className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted-foreground">Monto Total</label>
              <input type="text" placeholder="Ej. $5,000.00" className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-muted-foreground">Fecha Estimada</label>
                <input type="date" className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-muted-foreground">Estado</label>
                <select className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all">
                  <option>Borrador</option>
                  <option>Enviada</option>
                  <option>En tránsito</option>
                </select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <button className="rounded-md border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-muted transition-colors outline-none focus:ring-2 focus:ring-primary/20" onClick={() => setIsAddOpen(false)}>
              Cancelar
            </button>
            <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 focus:ring-offset-background" onClick={() => setIsAddOpen(false)}>
              Crear Orden
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Ver Detalles */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalles de Orden de Compra</DialogTitle>
            <DialogDescription>
              Información completa de la orden seleccionada.
            </DialogDescription>
          </DialogHeader>
          {selectedPurchase && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground">ID Orden</h4>
                  <p className="text-sm font-medium">{selectedPurchase.id}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground">Estado</h4>
                  <Badge variant="outline" className={`mt-1 text-xs ${statusConfig[selectedPurchase.status]?.className}`}>
                    {statusConfig[selectedPurchase.status]?.label}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground">Proveedor</h4>
                  <p className="text-sm font-medium">{selectedPurchase.supplier}</p>
                  <p className="text-xs text-muted-foreground">{selectedPurchase.email}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground">Monto Total</h4>
                  <p className="text-sm font-medium">{selectedPurchase.amount}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground">Fecha Emisión</h4>
                  <p className="text-sm font-medium">{selectedPurchase.date}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground">Entrega Estimada</h4>
                  <p className="text-sm font-medium">{selectedPurchase.expectedDate}</p>
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

      {/* Modal de Editar Orden */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Orden de Compra</DialogTitle>
            <DialogDescription>
              Modifica la información de esta orden de compra.
            </DialogDescription>
          </DialogHeader>
          {selectedPurchase && (
            <div className="grid gap-4 py-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-muted-foreground">Proveedor</label>
                <input type="text" defaultValue={selectedPurchase.supplier} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-muted-foreground">Monto Total</label>
                <input type="text" defaultValue={selectedPurchase.amount} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-muted-foreground">Fecha Estimada</label>
                  <input type="date" defaultValue={selectedPurchase.expectedDate} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-muted-foreground">Estado</label>
                  <select defaultValue={selectedPurchase.status} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all">
                    <option value="completado">Recibido</option>
                    <option value="en_camino">En Camino</option>
                    <option value="pendiente">Pendiente</option>
                    <option value="retrasado">Retrasado</option>
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
