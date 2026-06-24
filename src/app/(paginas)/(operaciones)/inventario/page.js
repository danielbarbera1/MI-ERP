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
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { useState, useMemo, useEffect } from "react";
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
  Edit,
  Eye,
  Trash,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";


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
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState("stock-desc");
  const [filterStatus, setFilterStatus] = useState("all");

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // --- Estados para Editar Producto ---
  const [editForm, setEditForm] = useState({
    nombre_producto: "",
    sku: "",
    categoria: "",
    marca: "",
    unitOfMeasurement: "",
    description: "",
    cost: "",
    stock: "",
    price: "",
  });
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);

  // --- Estados para Crear Producto ---
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newProductForm, setNewProductForm] = useState({
    nombre_producto: "",
    descripcion_detallada: "",
    marca: "",
    categoria: "",
    precio_publico_usd: "",
    costo_proveedor_usd: "",
    stock_inicial: "0",
    unidad_medida: "",
    ubicacion_almacen: ""
  });

  const handleAddProduct = async () => {
    if (!newProductForm.nombre_producto) {
      alert("El nombre del producto es obligatorio");
      return;
    }
    
    setIsSubmitting(true);
    const supabase = createClient();
    
    const { error } = await supabase.from('productos').insert([{
      nombre_producto: newProductForm.nombre_producto,
      descripcion_detallada: newProductForm.descripcion_detallada || null,
      marca: newProductForm.marca || null,
      categoria: newProductForm.categoria || null,
      precio_publico_usd: parseFloat(newProductForm.precio_publico_usd) || 0,
      costo_proveedor_usd: parseFloat(newProductForm.costo_proveedor_usd) || 0,
      stock_inicial: parseInt(newProductForm.stock_inicial) || 0,
      unidad_medida: newProductForm.unidad_medida || null,
      ubicacion_almacen: newProductForm.ubicacion_almacen || null
    }]);
    
    setIsSubmitting(false);

    if (error) {
      console.error("Error al crear producto:", error.message);
      alert("Error al crear producto. Revisa la consola.");
    } else {
      setIsAddOpen(false);
      setNewProductForm({ 
        nombre_producto: "", 
        descripcion_detallada: "", 
        marca: "", 
        categoria: "", 
        precio_publico_usd: "", 
        costo_proveedor_usd: "", 
        stock_inicial: "0", 
        unidad_medida: "", 
        ubicacion_almacen: "" 
      });
      setRefreshTrigger(prev => prev + 1); // Forzamos recarga de la tabla y KPIs
    }
  };

  // --- Estados para Paginación ---
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0); // Supabase te dará el total
  const itemsPerPage = 10; // Cantidad de items por página

  const [inventoryData, setInventoryData] = useState([]);
  const [kpiData, setKpiData] = useState([
    {
      id: "total-productos",
      title: "Total Productos",
      value: "...",
      change: "",
      trend: "neutral",
      icon: Package,
      description: "Cargando...",
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      id: "stock-bajo",
      title: "Stock Bajo/Agotado",
      value: "...",
      change: "",
      trend: "neutral",
      icon: AlertTriangle,
      description: "Cargando...",
      color: "text-orange-500",
      bg: "bg-orange-500/10",
    },
    {
      id: "valor-inventario",
      title: "Valor del Inventario",
      value: "...",
      change: "",
      trend: "neutral",
      icon: DollarSign,
      description: "Cargando...",
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      id: "categorias",
      title: "Categorías Activas",
      value: "...",
      change: "",
      trend: "neutral",
      icon: Tags,
      description: "Cargando...",
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
  ]);

  // Debounce del searchTerm para no hacer una query por cada tecla
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1); // Resetear a página 1 en cada búsqueda nueva
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const supabase = createClient();

    const fetchInventario = async () => {
      // 1. Calculamos el rango de registros (paginación)
      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;

      // 2. Construimos la query con filtro de búsqueda si existe
      let query = supabase
        .from('productos')
        .select('*', { count: 'exact' });

      // Aplicar filtro de búsqueda en Supabase
      if (debouncedSearch.trim()) {
        query = query.ilike('nombre_producto', `%${debouncedSearch.trim()}%`);
      }

      const { data, count, error } = await query.range(from, to);

      if (error) {
        console.error("Error al traer datos de Supabase:", error.message);
        return;
      }

      // 3. Actualizamos el total de items para que la botonera sepa cuántas páginas hay
      if (count !== null) {
        setTotalItems(count);
      }

      // 4. Formateamos los datos para que coincidan con la tabla
      const productosFormateados = data.map((item) => {
        const stockNum = parseInt(item.stock_inicial) || 0;
        let estadoActual = "optimo";
        if (stockNum === 0) estadoActual = "agotado";
        else if (stockNum <= 5) estadoActual = "bajo";

        return {
          id: item.id || "-", 
          name: item.nombre_producto || "Sin nombre",
          category: item.categoria || "General",
          stock: stockNum,
          minStock: 5,
          price: `$${parseFloat(item.precio_publico_usd || 0).toFixed(2)}`,
          status: estadoActual, 
          marca: item.marca || "-",
          unitOfMeasurement: item.unidad_medida || "-",
          description: item.descripcion_detallada || "-",
          cost: `$${parseFloat(item.costo_proveedor_usd || 0).toFixed(2)}`,
        };
      });

      setInventoryData(productosFormateados);

      // --- 5. CÁLCULO DE KPIs ---
      const { data: allData } = await supabase
        .from('productos')
        .select('stock_inicial, precio_publico_usd, categoria');

      if (allData) {
        const totalProductos = count || allData.length;
        const stockBajo = allData.filter(item => item.stock_inicial <= 5).length;
        const valorInventario = allData.reduce((acc, item) => {
          return acc + ((item.precio_publico_usd || 0) * (item.stock_inicial || 0));
        }, 0);
        const categoriasUnicas = new Set(allData.map(item => item.categoria)).size;

        setKpiData(prevKpi => {
          const newKpi = [...prevKpi];
          
          newKpi[0].value = totalProductos.toString();
          newKpi[0].description = "Registrados en BD";

          newKpi[1].value = stockBajo.toString();
          newKpi[1].description = "Productos críticos";

          newKpi[2].value = `$${valorInventario.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
          newKpi[2].description = "Valor total estimado";

          newKpi[3].value = categoriasUnicas.toString();
          newKpi[3].description = "Categorías distintas";

          return newKpi;
        });
      }
    };

    fetchInventario();
  }, [currentPage, refreshTrigger, debouncedSearch]);


  const handleOpenView = (product) => {
    setSelectedProduct(product);
    setIsViewOpen(true);
  };

  const handleOpenEdit = (product) => {
    setSelectedProduct(product);
    setEditForm({
      nombre_producto: product.name,
      sku: product.id,
      categoria: product.category,
      marca: product.marca,
      unitOfMeasurement: product.unitOfMeasurement,
      description: product.description,
      cost: product.cost.replace(/[^0-9.-]+/g, ""),
      stock: String(product.stock),
      price: product.price.replace(/[^0-9.-]+/g, ""),
    });
    setIsEditOpen(true);
  };

  const handleEditProduct = async () => {
    if (!selectedProduct) return;
    setIsEditSubmitting(true);
    const supabase = createClient();

    const { error } = await supabase
      .from('productos')
      .update({
        nombre_producto: editForm.nombre_producto,
        categoria: editForm.categoria,
        marca: editForm.marca,
        unidad_medida: editForm.unitOfMeasurement,
        descripcion_detallada: editForm.description,
        costo_proveedor_usd: parseFloat(editForm.cost) || 0,
        precio_publico_usd: parseFloat(editForm.price) || 0,
        stock_inicial: parseInt(editForm.stock) || 0,
      })
      .eq('id', selectedProduct.id);

    setIsEditSubmitting(false);

    if (error) {
      console.error("Error al actualizar producto:", error.message);
      alert("Error al actualizar producto. Revisa la consola.");
    } else {
      setIsEditOpen(false);
      setRefreshTrigger(prev => prev + 1);
    }
  };

  const filteredAndSortedData = useMemo(() => {
    let data = [...inventoryData];

    // La búsqueda por nombre ahora se hace en Supabase (server-side)
    // Aquí solo aplicamos filtros locales como estado

    if (filterStatus !== "all") {
      data = data.filter((item) => item.status === filterStatus);
    }

    data.sort((a, b) => {
      if (sortBy === "stock-desc") return b.stock - a.stock;
      if (sortBy === "stock-asc") return a.stock - b.stock;

      const priceA = parseFloat(a.price.replace(/[^0-9.-]+/g, ""));
      const priceB = parseFloat(b.price.replace(/[^0-9.-]+/g, ""));
      if (sortBy === "price-desc") return priceB - priceA;
      if (sortBy === "price-asc") return priceA - priceB;

      if (sortBy === "name-asc") return a.name.localeCompare(b.name);
      if (sortBy === "name-desc") return b.name.localeCompare(a.name);

      return 0;
    });

    return data;
  }, [sortBy, filterStatus, inventoryData]);

  if (!isMounted) return null;

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
            {/* <button className="flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-muted transition-colors">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Exportar</span>
            </button> */}
            <button
              className="flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 focus:ring-offset-background"
              onClick={() => setIsAddOpen(true)}
            >
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
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar por SKU o nombre..."
                    className="w-full rounded-md border border-border bg-background pl-9 pr-4 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex h-9 items-center gap-2 rounded-md border border-border bg-background px-3 text-sm font-medium hover:bg-muted transition-colors outline-none focus:ring-1 focus:ring-primary">
                      <Filter className="h-4 w-4" />
                      <span className="hidden sm:inline">Filtros</span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuRadioGroup value={sortBy} onValueChange={setSortBy}>
                      <DropdownMenuLabel>Ordenar por</DropdownMenuLabel>
                      <DropdownMenuRadioItem value="stock-desc">Mayor a menor stock</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="stock-asc">Menor a mayor stock</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="price-desc">Mayor a menor precio</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="price-asc">Menor a mayor precio</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="name-asc">Nombre (A-Z)</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup value={filterStatus} onValueChange={setFilterStatus}>
                      <DropdownMenuLabel>Filtrar por Estado</DropdownMenuLabel>
                      <DropdownMenuRadioItem value="all">Todos los estados</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="optimo">Óptimo</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="bajo">Stock Bajo</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="agotado">Agotado</DropdownMenuRadioItem>
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
                  <th className="px-6 py-3 font-semibold">Producto</th>
                  <th className="px-6 py-3 font-semibold">Categoría</th>
                  <th className="px-6 py-3 font-semibold">Stock Actual</th>
                  <th className="px-6 py-3 font-semibold">Precio Unit.</th>
                  <th className="px-6 py-3 font-semibold">Estado</th>
                  <th className="px-6 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredAndSortedData.map((item) => {
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
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted text-muted-foreground transition-colors outline-none focus:ring-2 focus:ring-primary/20">
                              <MoreHorizontal className="h-4 w-4" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuGroup>
                              <DropdownMenuItem onClick={() => handleOpenView(item)}>
                                <Eye className="mr-2 h-4 w-4" />
                                <span>Ver detalles</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleOpenEdit(item)}>
                                <Edit className="mr-2 h-4 w-4" />
                                <span>Editar</span>
                              </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem variant="destructive">
                              <Trash className="mr-2 h-4 w-4" />
                              <span>Eliminar</span>
                            </DropdownMenuItem>
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

      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalles del Producto</DialogTitle>
            <DialogDescription>
              Información detallada del producto seleccionado.
            </DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-muted-foreground">Nombre del Producto</span>
                <span className="text-sm font-medium">{selectedProduct.name}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-muted-foreground">Descripción Detallada</span>
                <span className="text-sm">{selectedProduct.description}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-muted-foreground">Marca</span>
                  <span className="text-sm">{selectedProduct.marca}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-muted-foreground">Categoría</span>
                  <span className="text-sm">{selectedProduct.category}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-muted-foreground">Precio Público (USD)</span>
                  <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">{selectedProduct.price}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-muted-foreground">Costo Proveedor (USD)</span>
                  <span className="text-sm">{selectedProduct.cost}</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-muted-foreground">Stock Actual</span>
                  <span className="text-sm">{selectedProduct.stock} unid. <span className="text-xs text-muted-foreground">(Mín: {selectedProduct.minStock})</span></span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-muted-foreground">Und. Medida</span>
                  <span className="text-sm">{selectedProduct.unitOfMeasurement}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-muted-foreground">SKU</span>
                  <span className="text-sm font-mono text-muted-foreground">{selectedProduct.id}</span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <button className="rounded-md border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-muted transition-colors outline-none focus:ring-2 focus:ring-primary/20" onClick={() => setIsViewOpen(false)}>
              Cerrar
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Producto</DialogTitle>
            <DialogDescription>
              Actualiza la información del producto.
            </DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-muted-foreground">Nombre del Producto</label>
                <input type="text" value={editForm.nombre_producto} onChange={(e) => setEditForm({...editForm, nombre_producto: e.target.value})} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-muted-foreground">Descripción Detallada</label>
                <textarea value={editForm.description} onChange={(e) => setEditForm({...editForm, description: e.target.value})} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all min-h-[80px]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-muted-foreground">Marca</label>
                  <input type="text" value={editForm.marca} onChange={(e) => setEditForm({...editForm, marca: e.target.value})} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-muted-foreground">Categoría</label>
                  <input type="text" value={editForm.categoria} onChange={(e) => setEditForm({...editForm, categoria: e.target.value})} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-muted-foreground">Precio Público (USD)</label>
                  <input type="number" value={editForm.price} onChange={(e) => setEditForm({...editForm, price: e.target.value})} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-muted-foreground">Costo Proveedor (USD)</label>
                  <input type="number" value={editForm.cost} onChange={(e) => setEditForm({...editForm, cost: e.target.value})} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-muted-foreground">Stock Inicial</label>
                  <input type="number" value={editForm.stock} onChange={(e) => setEditForm({...editForm, stock: e.target.value})} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-muted-foreground">Und. Medida</label>
                  <input type="text" value={editForm.unitOfMeasurement} onChange={(e) => setEditForm({...editForm, unitOfMeasurement: e.target.value})} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-muted-foreground">SKU</label>
                  <input type="text" value={editForm.sku} disabled className="w-full rounded-md border border-border bg-muted px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all cursor-not-allowed opacity-70" title="El SKU no se puede editar" />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <button className="rounded-md border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-muted transition-colors outline-none focus:ring-2 focus:ring-primary/20" onClick={() => setIsEditOpen(false)}>
              Cancelar
            </button>
            <button disabled={isEditSubmitting} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50" onClick={handleEditProduct}>
              {isEditSubmitting ? "Guardando..." : "Guardar Cambios"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nuevo Producto</DialogTitle>
            <DialogDescription>
              Añade un nuevo producto al inventario.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted-foreground">Nombre del Producto *</label>
              <input type="text" placeholder="Ej. Taladro Percutor 800W" value={newProductForm.nombre_producto} onChange={(e) => setNewProductForm({...newProductForm, nombre_producto: e.target.value})} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted-foreground">Descripción Detallada</label>
              <textarea placeholder="Ej. Taladro de uso industrial con estuche..." value={newProductForm.descripcion_detallada} onChange={(e) => setNewProductForm({...newProductForm, descripcion_detallada: e.target.value})} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all min-h-[80px]" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-muted-foreground">Marca</label>
                <input type="text" placeholder="Ej. Bosch" value={newProductForm.marca} onChange={(e) => setNewProductForm({...newProductForm, marca: e.target.value})} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-muted-foreground">Categoría</label>
                <input type="text" placeholder="Ej. Herramientas Eléctricas" value={newProductForm.categoria} onChange={(e) => setNewProductForm({...newProductForm, categoria: e.target.value})} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-muted-foreground">Precio Público (USD)</label>
                <input type="number" placeholder="Ej. 120.00" value={newProductForm.precio_publico_usd} onChange={(e) => setNewProductForm({...newProductForm, precio_publico_usd: e.target.value})} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-muted-foreground">Costo Proveedor (USD)</label>
                <input type="number" placeholder="Ej. 80.00" value={newProductForm.costo_proveedor_usd} onChange={(e) => setNewProductForm({...newProductForm, costo_proveedor_usd: e.target.value})} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-muted-foreground">Stock Inicial</label>
                <input type="number" placeholder="0" value={newProductForm.stock_inicial} onChange={(e) => setNewProductForm({...newProductForm, stock_inicial: e.target.value})} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-muted-foreground">Und. Medida</label>
                <input type="text" placeholder="Ej. Unidad, Caja" value={newProductForm.unidad_medida} onChange={(e) => setNewProductForm({...newProductForm, unidad_medida: e.target.value})} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-muted-foreground">Ubicación</label>
                <input type="text" placeholder="Ej. Estante B" value={newProductForm.ubicacion_almacen} onChange={(e) => setNewProductForm({...newProductForm, ubicacion_almacen: e.target.value})} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <button className="rounded-md border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-muted transition-colors outline-none focus:ring-2 focus:ring-primary/20" onClick={() => setIsAddOpen(false)}>
              Cancelar
            </button>
            <button disabled={isSubmitting} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50" onClick={handleAddProduct}>
              {isSubmitting ? "Creando..." : "Crear Producto"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ERPLayout>
  );
}
