"use client";

import { Bell, Search, Moon, Sun, ChevronDown, Menu } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function Header({ title = "Dashboard", onMenuClick }) {
  const [darkMode, setDarkMode] = useState(false);
  const [userEmail, setUserEmail] = useState("Cargando...");
  const [userInitials, setUserInitials] = useState("--");
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email);
        setUserInitials(user.email.substring(0, 2).toUpperCase());
      }
    };
    fetchUser();
  }, []);

  const toggleDark = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-3 border-b border-border bg-background/95 backdrop-blur-sm px-4">
      {/* Hamburger — mobile only */}
      <button
        onClick={onMenuClick}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border hover:bg-muted transition-colors lg:hidden"
        aria-label="Abrir menú"
      >
        <Menu className="h-5 w-5 text-foreground" />
      </button>

      {/* Page title */}
      <div className="flex-1 min-w-0">
        <h1 className="text-base font-semibold text-foreground truncate lg:text-lg">{title}</h1>
        <p className="text-xs text-muted-foreground hidden sm:block">
          {new Date().toLocaleDateString("es-ES", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Search — hidden on small screens */}
      {/* <div className="hidden md:flex items-center gap-2 bg-muted rounded-lg px-3 py-2 w-64 xl:w-80">
        <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar en el sistema..."
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div> */}

      {/* Actions */}
      <div className="flex items-center gap-1.5">
        {/* Dark mode */}
        <button
          onClick={toggleDark}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border hover:bg-muted transition-colors"
          aria-label="Toggle dark mode"
        >
          {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 rounded-lg border border-border bg-background px-2 py-1.5 hover:bg-muted transition-colors outline-none focus:ring-2 focus:ring-primary/20">
            <Avatar className="h-7 w-7">
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs font-bold">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <span className="hidden md:block text-sm font-medium">{userEmail.split('@')[0]}</span>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem className="text-destructive cursor-pointer" onClick={handleLogout}>Cerrar Sesión</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
