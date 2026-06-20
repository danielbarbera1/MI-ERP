"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  TrendingUp,
  Users,
  Calculator,
  BarChart3,
  Settings,
  ChevronRight,
  Zap,
  PanelLeftClose,
  PanelLeftOpen,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const navItems = [
  {
    label: "Principal",
    items: [
      { href: "dashboard", label: "Dashboard", icon: LayoutDashboard, badge: null },
    ],
  },
  {
    label: "Operaciones",
    items: [
      { href: "/inventario", label: "Inventario", icon: Package, badge: "12", badgeVariant: "destructive" },
      { href: "/ventas", label: "Ventas", icon: TrendingUp, badge: "3", badgeVariant: "default" },
      { href: "/compras", label: "Compras", icon: ShoppingCart, badge: null },
    ],
  },
  {
    label: "Gestión",
    items: [
      { href: "/rrhh", label: "RRHH", icon: Users, badge: null },
      { href: "/contabilidad", label: "Contabilidad", icon: Calculator, badge: null },
      { href: "/reportes", label: "Reportes", icon: BarChart3, badge: null },
    ],
  },
  {
    label: "Sistema",
    items: [
      { href: "/configuracion", label: "Configuración", icon: Settings, badge: null },
    ],
  },
];

export default function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }) {
  const pathname = usePathname();
  const [userEmail, setUserEmail] = useState("Cargando...");
  const [userInitials, setUserInitials] = useState("--");
  const [userName, setUserName] = useState("Cargando...");

  useEffect(() => {
    const supabase = createClient();
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email);
        setUserName(user.email.split('@')[0]);
        setUserInitials(user.email.substring(0, 2).toUpperCase());
      }
    };
    fetchUser();
  }, []);

  return (
    <aside
      className={cn(
        // Positioning & size
        "fixed inset-y-0 left-0 z-30 flex flex-col",
        "bg-sidebar border-r border-border",
        "transition-all duration-300 ease-in-out",

        // ── Mobile: full-width drawer, slides in/out ──────────────────────
        // Always w-72 on mobile, translate to show/hide
        "w-72",
        !mobileOpen && "-translate-x-full",
        mobileOpen && "translate-x-0 shadow-2xl",

        // ── Desktop (lg+): fixed in place, no translate, width toggles ────
        "lg:translate-x-0",
        collapsed ? "lg:w-16" : "lg:w-64",
      )}
    >
      {/* ── Logo header ─────────────────────────────────────────────────── */}
      <div className={cn(
        "flex shrink-0 items-center border-b border-border",
        collapsed ? "lg:flex-col lg:gap-2 lg:py-4 lg:px-2 flex-row gap-3 py-4 px-4"
                  : "flex-row gap-3 py-4 px-4"
      )}>
        {/* Logo icon */}
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary">
          <Zap className="h-5 w-5 text-primary-foreground" />
        </div>

        {/* Brand text */}
        <div className={cn("flex-1 min-w-0", collapsed && "lg:hidden")}>
          <p className="text-sm font-bold text-sidebar-foreground leading-none">NexERP</p>
          <p className="text-xs text-muted-foreground mt-0.5">Enterprise v1.0</p>
        </div>

        {/* Mobile: X close button */}
        <button
          onClick={onMobileClose}
          className="lg:hidden flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Desktop: collapse toggle */}
        <button
          onClick={onToggle}
          className="hidden lg:flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
          title={collapsed ? "Expandir" : "Colapsar"}
        >
          {collapsed
            ? <PanelLeftOpen className="h-4 w-4" />
            : <PanelLeftClose className="h-4 w-4" />
          }
        </button>
      </div>

      {/* ── Navigation ──────────────────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        {navItems.map((group, groupIndex) => (
          <div key={groupIndex} className="mb-4">
            {/* Group label */}
            <p className={cn(
              "px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60",
              collapsed && "lg:hidden"
            )}>
              {group.label}
            </p>

            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onMobileClose}
                      title={collapsed ? item.label : undefined}
                      className={cn(
                        "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
                        collapsed && "lg:justify-center lg:px-0",
                        isActive
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      )}
                    >
                      <Icon className={cn(
                        "h-4 w-4 shrink-0",
                        isActive
                          ? "text-primary-foreground"
                          : "text-muted-foreground group-hover:text-sidebar-accent-foreground"
                      )} />

                      <span className={cn("flex-1 whitespace-nowrap", collapsed && "lg:hidden")}>
                        {item.label}
                      </span>

                      {item.badge && (
                        <Badge
                          variant={item.badgeVariant || "secondary"}
                          className={cn("h-5 px-1.5 text-xs shrink-0", collapsed && "lg:hidden")}
                        >
                          {item.badge}
                        </Badge>
                      )}

                      {isActive && (
                        <ChevronRight className={cn("h-3 w-3 opacity-60", collapsed && "lg:hidden")} />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {groupIndex < navItems.length - 1 && (
              <Separator className={cn("mt-4 opacity-50", collapsed && "lg:hidden")} />
            )}
          </div>
        ))}
      </nav>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <div className="shrink-0 border-t border-border p-3">
        <div className={cn("flex items-center gap-3", collapsed && "lg:justify-center")}>
          <div className="h-8 w-8 shrink-0 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="text-xs font-bold text-white">{userInitials}</span>
          </div>
          <div className={cn("flex-1 min-w-0", collapsed && "lg:hidden")}>
            <p className="text-xs font-medium text-sidebar-foreground truncate">{userName}</p>
            <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
