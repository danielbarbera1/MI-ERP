"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import Sidebar from "@/components/erp/Sidebar";
import Header from "@/components/erp/Header";

export default function ERPLayout({ children, title }) {
  const [collapsed, setCollapsed] = useState(false); // Desktop only
  const [mobileOpen, setMobileOpen] = useState(false); // Mobile drawer

  // Close mobile drawer on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-20 bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setMobileOpen(false)}
      />

      {/* Sidebar */}
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((p) => !p)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Main content — on mobile no margin; on desktop adjust to sidebar width */}
      <div
        className={cn(
          "flex flex-col flex-1 min-w-0 transition-all duration-300 ease-in-out",
          collapsed ? "lg:ml-16" : "lg:ml-64"
        )}
      >
        <Header
          title={title}
          onMenuClick={() => setMobileOpen((p) => !p)}
        />
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
