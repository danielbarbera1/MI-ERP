"use client";

import { useState } from "react";
import ERPLayout from "@/components/erp/ERPLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Settings,
  User,
  Shield,
  Bell,
  Database,
  Globe,
  CreditCard,
  Save,
} from "lucide-react";

export default function ConfiguracionPage() {
  const [activeTab, setActiveTab] = useState("general");

  const tabs = [
    { id: "general", label: "General", icon: Settings },
    { id: "perfil", label: "Mi Perfil", icon: User },
    { id: "seguridad", label: "Seguridad", icon: Shield },
    { id: "notificaciones", label: "Notificaciones", icon: Bell },
    { id: "facturacion", label: "Facturación", icon: CreditCard },
    { id: "integraciones", label: "Integraciones", icon: Database },
  ];

  return (
    <ERPLayout title="Configuración">
      <div className="flex flex-col gap-6">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Configuración del Sistema</h2>
            <p className="text-sm text-muted-foreground">Administra las preferencias y ajustes de tu cuenta.</p>
          </div>
          <button className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
            <Save className="h-4 w-4" />
            Guardar Cambios
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Tabs */}
          <Card className="lg:w-64 shrink-0 h-fit">
            <CardContent className="p-4">
              <nav className="flex flex-col space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <Icon className={`h-4 w-4 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </CardContent>
          </Card>

          {/* Settings Content */}
          <div className="flex-1 space-y-6">
            {activeTab === "general" && (
              <Card>
                <CardHeader>
                  <CardTitle>Ajustes Generales</CardTitle>
                  <CardDescription>Configura los detalles principales de tu empresa.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Nombre de la Empresa</label>
                      <input
                        type="text"
                        defaultValue="NexERP Enterprise"
                        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Sitio Web</label>
                      <input
                        type="url"
                        defaultValue="https://nexerp.com"
                        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Moneda Principal</label>
                      <select className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary">
                        <option>USD ($) - Dólar Estadounidense</option>
                        <option>EUR (€) - Euro</option>
                        <option>MXN ($) - Peso Mexicano</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Zona Horaria</label>
                      <select className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary">
                        <option>América/Bogotá (GMT-5)</option>
                        <option>América/Mexico_City (GMT-6)</option>
                        <option>Europa/Madrid (GMT+1)</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "perfil" && (
              <Card>
                <CardHeader>
                  <CardTitle>Perfil del Usuario</CardTitle>
                  <CardDescription>Actualiza tu información personal y foto de perfil.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-6">
                    <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white">
                      AD
                    </div>
                    <button className="rounded-md border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-muted transition-colors">
                      Cambiar Foto
                    </button>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Nombre Completo</label>
                      <input
                        type="text"
                        defaultValue="Admin User"
                        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Correo Electrónico</label>
                      <input
                        type="email"
                        defaultValue="admin@empresa.com"
                        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Empty states for other tabs to show navigation works */}
            {["seguridad", "notificaciones", "facturacion", "integraciones"].includes(activeTab) && (
              <Card>
                <CardHeader>
                  <CardTitle className="capitalize">{activeTab}</CardTitle>
                  <CardDescription>Ajustes de {activeTab} para tu cuenta.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Globe className="h-12 w-12 text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-medium text-foreground">Sección en construcción</h3>
                    <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                      Estamos trabajando en habilitar estas configuraciones. Estarán disponibles en la próxima actualización.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </ERPLayout>
  );
}
