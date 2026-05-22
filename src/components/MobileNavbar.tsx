'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  CalendarRange, 
  MessageSquareCode, 
  Presentation, 
  ShieldAlert,
  Menu,
  X,
  Activity
} from 'lucide-react';
import { clsx } from 'clsx';

export const MobileNavbar: React.FC = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    {
      name: 'Painel Geral',
      path: '/',
      icon: LayoutDashboard,
      description: 'A Visão do Todo'
    },
    {
      name: 'Clientes & Contratos',
      path: '/clientes',
      icon: Users,
      description: 'Instituições e Faturamento'
    },
    {
      name: 'Operações e Prazos',
      path: '/operacoes',
      icon: CalendarRange,
      description: 'Visitas vs. Entregas'
    },
    {
      name: 'Torre de Comunicação',
      path: '/comunicacao',
      icon: MessageSquareCode,
      description: 'WhatsApp IA Logs'
    },
    {
      name: 'Slides do Pitch',
      path: '/slides',
      icon: Presentation,
      description: 'Apresentação Interativa'
    }
  ];

  return (
    <>
      {/* Header Mobile Fixo */}
      <header className="flex items-center justify-between border-b border-slate-100 bg-white/95 p-4 backdrop-blur-md md:hidden sticky top-0 z-30 shadow-sm w-full">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600">
            <Activity className="h-4.5 w-4.5 animate-pulse" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-wider text-slate-800 uppercase leading-none">Torre de Comando</h1>
            <p className="text-[8px] font-semibold text-emerald-600 tracking-wider uppercase">AM Consultorias</p>
          </div>
        </div>

        <button 
          onClick={() => setIsOpen(true)}
          className="p-2 rounded-xl bg-slate-50 border border-slate-200/60 text-slate-600 hover:text-slate-900 transition-all active:scale-95"
          aria-label="Abrir Menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </header>

      {/* Drawer Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm md:hidden animate-fade-in"
          onClick={() => setIsOpen(false)}
        >
          {/* Drawer Content */}
          <div 
            className="fixed top-0 bottom-0 left-0 w-72 bg-white border-r border-slate-100 flex flex-col justify-between shadow-2xl p-0 animate-slide-in-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              {/* Header do Drawer */}
              <div className="flex items-center justify-between px-6 py-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg">
                    <img src="/anotado.svg" alt="Logo" className="h-7 w-7" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold tracking-wider text-slate-800 uppercase leading-none">AM Consultorias</h2>
                    <p className="text-[9px] font-semibold text-slate-500 tracking-wider uppercase">Anotado</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg bg-slate-50 border border-slate-250 text-slate-500 hover:text-slate-800 transition-all"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Links de Navegação */}
              <nav className="mt-6 px-4 space-y-1.5">
                {menuItems.map((item) => {
                  const isActive = pathname === item.path;
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      onClick={() => setIsOpen(false)}
                      className={clsx(
                        'group flex items-center gap-4 rounded-xl px-4 py-3 transition-all duration-300 relative overflow-hidden',
                        isActive 
                          ? 'bg-emerald-500/5 border-l-2 border-emerald-500 text-emerald-700 font-bold'
                          : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                      )}
                    >
                      {isActive && (
                        <span className="absolute inset-0 bg-emerald-500/5 blur-xl -z-10" />
                      )}
                      
                      <Icon className={clsx(
                        'h-5 w-5 transition-transform duration-300 group-hover:scale-110',
                        isActive ? 'text-emerald-500' : 'text-slate-400 group-hover:text-slate-600'
                      )} />

                      <div className="flex flex-col">
                        <span className="text-sm tracking-wide">{item.name}</span>
                        <span className="text-[9px] text-slate-400 font-medium">
                          {item.description}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Rodapé do Drawer */}
            <div className="p-6 border-t border-slate-100 bg-slate-50/50">
              <div className="rounded-xl bg-rose-50/50 border border-rose-100/60 p-3.5">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-100/60 text-rose-600">
                    <ShieldAlert className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-rose-950">Mitigação de Risco</p>
                    <p className="text-[9px] text-rose-700">Monitoramento Ativo</p>
                  </div>
                </div>
                <p className="mt-2 text-[9px] leading-relaxed text-slate-500 font-medium">
                  Focado na Economia do Cuidado. Mantenha os prazos sob total controle para evitar infrações e passivos trabalhistas.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileNavbar;
