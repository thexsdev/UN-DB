import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import MobileNavbar from "@/components/MobileNavbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://undb.anotado.app.br/"),
  title: "Torre de Comando - AM Consultorias",
  description: "Painel SaaS de Inteligência Operacional e Mitigação de Riscos na Economia do Cuidado. Gestão avançada para ILPIs, creches e CAPS.",
  openGraph: {
    title: "Torre de Comando - AM Consultorias",
    description: "Painel SaaS de Inteligência Operacional e Mitigação de Riscos na Economia do Cuidado. Gestão avançada para ILPIs, creches e CAPS.",
    url: "https://undb.anotado.app.br",
    siteName: "AM Consultorias",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Torre de Comando - AM Consultorias",
    description: "Painel SaaS de Inteligência Operacional e Mitigação de Riscos na Economia do Cuidado. Gestão avançada para ILPIs, creches e CAPS.",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-slate-50 text-slate-900 font-sans selection:bg-emerald-500/15 selection:text-slate-900">
        <div className="flex min-h-screen flex-col md:flex-row">
          {/* Sidebar para desktop */}
          <Sidebar />

          {/* Header e Navegação Mobile (Drawer) */}
          <MobileNavbar />

          {/* Painel Principal */}
          <main className="flex-1 md:pl-72 flex flex-col min-h-screen">
            {/* Background Decorativo Neon Glow */}
            <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden">
              <div className="absolute top-[-10%] left-[20%] h-[500px] w-[500px] rounded-full bg-emerald-500/5 blur-[120px]" />
              <div className="absolute bottom-[10%] right-[10%] h-[400px] w-[400px] rounded-full bg-indigo-500/5 blur-[100px]" />
            </div>
            
            {/* Conteúdo Dinâmico */}
            <div className="relative z-10 flex-1 p-6 md:p-10 max-w-7xl w-full mx-auto">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
