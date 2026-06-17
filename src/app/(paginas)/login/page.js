"use client";

import { useState } from "react";
import { Zap, Eye, EyeOff, ArrowRight, Shield, BarChart3, Users } from "lucide-react";

const features = [
  { icon: BarChart3, label: "Reportes en tiempo real" },
  { icon: Shield,    label: "Seguridad empresarial" },
  { icon: Users,     label: "Multi-usuario y roles" },
];

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", remember: false });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // TODO: conectar con Supabase Auth
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen flex dark">
      {/* ── Left panel — brand / hero ─────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 relative overflow-hidden bg-[#0a0a0f]">
        {/* Gradient orbs */}
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-blue-600/20 blur-[120px] animate-pulse" />
        <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full bg-violet-600/20 blur-[120px] animate-pulse" style={{ animationDelay: "1.5s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-indigo-500/10 blur-[80px]" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between w-full p-12">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-600/30">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-base font-bold text-white leading-none">NexERP</p>
              <p className="text-xs text-white/40 mt-0.5">Enterprise Suite</p>
            </div>
          </div>

          {/* Main hero text */}
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
                <span className="text-xs text-blue-300 font-medium">Sistema ERP v1.0 — Enterprise</span>
              </div>
              <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight">
                Gestiona tu empresa
                <br />
                <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                  de forma inteligente
                </span>
              </h1>
              <p className="text-base text-white/50 max-w-md leading-relaxed">
                Inventario, ventas, compras, RRHH y contabilidad — todo en una sola plataforma diseñada para escalar.
              </p>
            </div>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-2">
              {features.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 backdrop-blur-sm"
                >
                  <Icon className="h-3.5 w-3.5 text-blue-400" />
                  <span className="text-xs text-white/70 font-medium">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { value: "99.9%", label: "Uptime" },
              { value: "256-bit", label: "Cifrado AES" },
              { value: "24/7", label: "Soporte" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="text-xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-white/40 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right panel — login form ──────────────────────────────────────── */}
      <div className="flex flex-1 items-center justify-center bg-background p-6 sm:p-10">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-600/30">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-base font-bold text-foreground leading-none">NexERP</p>
              <p className="text-xs text-muted-foreground mt-0.5">Enterprise Suite</p>
            </div>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground">Bienvenido de vuelta</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Ingresa tus credenciales para acceder al sistema
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                placeholder="admin@empresa.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none ring-offset-background transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  Contraseña
                </label>
                <a
                  href="#"
                  className="text-xs text-blue-500 hover:text-blue-400 font-medium transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 pr-12 text-sm text-foreground placeholder:text-muted-foreground outline-none ring-offset-background transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <div className="relative">
                <input
                  id="remember"
                  type="checkbox"
                  checked={form.remember}
                  onChange={(e) => setForm({ ...form, remember: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="h-5 w-5 rounded border border-border bg-background peer-checked:border-blue-500 peer-checked:bg-blue-500 transition-all flex items-center justify-center">
                  {form.remember && (
                    <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-sm text-muted-foreground">Mantener sesión iniciada</span>
            </label>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 hover:bg-blue-500 active:scale-[0.98] transition-all duration-150 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Iniciando sesión...
                </>
              ) : (
                <>
                  Iniciar sesión
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-background px-3 text-xs text-muted-foreground">o continúa con</span>
            </div>
          </div>
          {/* Footer note */}
          <p className="mt-8 text-center text-xs text-muted-foreground">
            ¿No tienes cuenta?{" "}
            <a href="#" className="text-blue-500 hover:text-blue-400 font-medium transition-colors">
              Contacta a tu administrador
            </a>
          </p>

          <p className="mt-6 text-center text-[11px] text-muted-foreground/50">
            © {new Date().getFullYear()} NexERP. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}
