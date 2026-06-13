"use client";

import { Bell, Search, Moon, Sun, ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

export default function Header({ title = "Dashboard" }) {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDark = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/95 backdrop-blur-sm px-6">
      {/* Page Title */}
      <div className="flex-1">
        <h1 className="text-lg font-semibold text-foreground">{title}</h1>
        <p className="text-xs text-muted-foreground">
          {new Date().toLocaleDateString("es-ES", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Search Bar */}
      <div className="hidden md:flex items-center gap-2 bg-muted rounded-lg px-3 py-2 w-72">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar en el sistema..."
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
        <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-background px-1.5 text-xs text-muted-foreground">
          ⌘K
        </kbd>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDark}
          className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background hover:bg-muted transition-colors"
          aria-label="Toggle dark mode"
        >
          {darkMode ? (
            <Sun className="h-4 w-4 text-foreground" />
          ) : (
            <Moon className="h-4 w-4 text-foreground" />
          )}
        </button>

        {/* Notifications */}
        <button className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background hover:bg-muted transition-colors">
          <Bell className="h-4 w-4 text-foreground" />
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white">
            5
          </span>
        </button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-lg border border-border bg-background px-2 py-1.5 hover:bg-muted transition-colors">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs font-bold">
                  AD
                </AvatarFallback>
              </Avatar>
              <span className="hidden md:block text-sm font-medium text-foreground">
                Admin
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Perfil</DropdownMenuItem>
            <DropdownMenuItem>Configuración</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              Cerrar Sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
