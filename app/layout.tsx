import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CUPSS — Plataforma Hostelería",
  description: "Gestión integral para locales de hostelería",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
