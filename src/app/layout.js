import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata = {
  title: "NexERP — Sistema ERP Empresarial",
  description:
    "Sistema ERP completo para la gestión de inventario, ventas, compras, RRHH y contabilidad.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="es"
      className={`${inter.variable} h-full antialiased dark`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
