'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  CalendarRange, 
  MessageSquareCode, 
  ShieldAlert,
  Activity,
  Presentation
} from 'lucide-react';
import { clsx } from 'clsx';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();

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
    <aside className="fixed bottom-0 top-0 left-0 z-40 hidden w-72 border-r border-slate-100 bg-white md:flex md:flex-col justify-between shadow-sm">
      <div>
        {/* Header/Logo */}
        <div className="flex items-center gap-3 px-6 py-8 border-b border-slate-100">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl">
            {/* <Activity className="h-5 w-5 animate-pulse" /> */}
            <img src="https://raw.githubusercontent.com/thexsdev/UN-DB/f1c89e7c06adcffecfbffb5263b818f609616aa6/public/Anotado.svg" alt="Logo" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-wider text-slate-800 uppercase">AM Consultorias</h1>
            <p className="text-[10px] font-semibold text-slate-500 tracking-widest uppercase">Anotado</p>
          </div>
        </div>

        {/* Links do Menu */}
        <nav className="mt-8 px-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                href={item.path}
                className={clsx(
                  'group flex items-center gap-4 rounded-xl px-4 py-3.5 transition-all duration-300 relative overflow-hidden',
                  isActive 
                    ? 'bg-emerald-500/5 border-l-2 border-emerald-500 text-emerald-700'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                )}
              >
                {/* Glow de fundo ativo */}
                {isActive && (
                  <span className="absolute inset-0 bg-emerald-500/5 blur-xl -z-10" />
                )}
                
                <Icon className={clsx(
                  'h-5 w-5 transition-transform duration-300 group-hover:scale-110',
                  isActive ? 'text-emerald-500' : 'text-slate-400 group-hover:text-slate-650'
                )} />

                <div className="flex flex-col">
                  <span className="text-sm font-semibold tracking-wide">{item.name}</span>
                  <span className="text-[10px] text-slate-400 font-medium group-hover:text-slate-500 transition-colors">
                    {item.description}
                  </span>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / Info de Risco */}
      <div className="p-6 border-t border-slate-100">
        <div className="rounded-2xl bg-rose-50/50 border border-rose-100/60 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-100/60 text-rose-600">
              <ShieldAlert className="h-4.5 w-4.5" />
            </div>
            <div>
              <p className="text-xs font-bold text-rose-950">Mitigação de Risco</p>
              <p className="text-[10px] text-rose-700">Monitoramento Ativo</p>
            </div>
          </div>
          <p className="mt-2 text-[10px] leading-relaxed text-slate-500 font-medium">
            Focado na Economia do Cuidado. Mantenha os prazos sob total controle para evitar infrações e passivos trabalhistas/sanitários.
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
