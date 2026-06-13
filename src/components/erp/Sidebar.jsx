"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const navItems = [
  {
    label: "Principal",
    items: [
      {
        href: "/",
        label: "Dashboard",
        icon: LayoutDashboard,
        badge: null,
      },
    ],
  },
  {
    label: "Operaciones",
    items: [
      {
        href: "/inventario",
        label: "Inventario",
        icon: Package,
        badge: "12",
        badgeVariant: "destructive",
      },
      {
        href: "/ventas",
        label: "Ventas",
        icon: TrendingUp,
        badge: "3",
        badgeVariant: "default",
      },
      {
        href: "/compras",
        label: "Compras",
        icon: ShoppingCart,
        badge: null,
      },
    ],
  },
  {
    label: "Gestión",
    items: [
      {
        href: "/rrhh",
        label: "RRHH",
        icon: Users,
        badge: null,
      },
      {
        href: "/contabilidad",
        label: "Contabilidad",
        icon: Calculator,
        badge: null,
      },
      {
        href: "/reportes",
        label: "Reportes",
        icon: BarChart3,
        badge: null,
      },
    ],
  },
  {
    label: "Sistema",
    items: [
      {
        href: "/configuracion",
        label: "Configuración",
        icon: Settings,
        badge: null,
      },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-sidebar flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-border">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
          <Zap className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <p className="text-sm font-bold text-sidebar-foreground leading-none">
            NexERP
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">Enterprise v1.0</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {navItems.map((group, groupIndex) => (
          <div key={groupIndex} className="mb-4">
            <p className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">
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
                      className={cn(
                        "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
                        isActive
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-4 w-4 shrink-0",
                          isActive
                            ? "text-primary-foreground"
                            : "text-muted-foreground group-hover:text-sidebar-accent-foreground"
                        )}
                      />
                      <span className="flex-1">{item.label}</span>
                      {item.badge && (
                        <Badge
                          variant={item.badgeVariant || "secondary"}
                          className="h-5 px-1.5 text-xs"
                        >
                          {item.badge}
                        </Badge>
                      )}
                      {isActive && (
                        <ChevronRight className="h-3 w-3 opacity-60" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
            {groupIndex < navItems.length - 1 && (
              <Separator className="mt-4 opacity-50" />
            )}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-border p-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="text-xs font-bold text-white">AD</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-sidebar-foreground truncate">
              Admin User
            </p>
            <p className="text-xs text-muted-foreground truncate">
              admin@empresa.com
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
