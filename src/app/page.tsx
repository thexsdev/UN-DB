'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Users, 
  DollarSign, 
  Calendar, 
  AlertOctagon, 
  ArrowUpRight,
  Clock,
  MapPin,
  MessageSquare,
  BadgeAlert,
  BadgeCheck,
  BadgeInfo,
  ShieldCheck,
  Plus
} from 'lucide-react';

import { supabaseMock } from '@/lib/supabase';
import { Cliente, Contrato, Visita, TarefaEntrega, LogInteracao } from '@/types/database.types';
import Card from '@/components/ui/card';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';

export default function Dashboard() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [contratos, setContratos] = useState<Contrato[]>([]);
  const [visitas, setVisitas] = useState<Visita[]>([]);
  const [tarefas, setTarefas] = useState<TarefaEntrega[]>([]);
  const [logs, setLogs] = useState<LogInteracao[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [c, con, v, t, l] = await Promise.all([
          supabaseMock.getClientes(),
          supabaseMock.getContratos(),
          supabaseMock.getVisitas(),
          supabaseMock.getTarefas(),
          supabaseMock.getLogs(),
        ]);
        setClientes(c);
        setContratos(con);
        setVisitas(v);
        setTarefas(t);
        setLogs(l);
      } catch (err) {
        console.error("Erro ao carregar dados do dashboard real:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  // Cálculos de Resumo com base no db.sql real
  const totalClientes = clientes.length;
  
  const faturamentoMensal = contratos
    .filter(c => c.status?.toUpperCase() === 'ATIVO' && c.tipo_cobranca?.toUpperCase() === 'MENSAL_FIXO')
    .reduce((acc, curr) => acc + (curr.valor || 0), 0);

  const visitasFuturas = visitas.filter(v => v.status?.toUpperCase() === 'AGENDADA').length;
  
  const entregasUrgentesCount = tarefas.filter(t => t.status?.toUpperCase() === 'PENDENTE').length;

  // Ordenação das Tarefas mais urgentes (por data_limite)
  const tarefasUrgentes = tarefas
    .filter(t => t.status?.toUpperCase() !== 'ENTREGUE')
    .sort((a, b) => new Date(a.data_limite).getTime() - new Date(b.data_limite).getTime())
    .slice(0, 3); // Top 3 mais críticas

  // Próximas Visitas Agendadas
  const proximasVisitas = visitas
    .filter(v => v.status?.toUpperCase() === 'AGENDADA')
    .sort((a, b) => new Date(a.data_visita).getTime() - new Date(b.data_visita).getTime())
    .slice(0, 3);

  // Últimos Logs WhatsApp / IA
  const ultimasInteracoes = logs
    .sort((a, b) => new Date(b.data_interacao).getTime() - new Date(a.data_interacao).getTime())
    .slice(0, 3);

  // Formatação de data
  const formatarData = (dataStr: string) => {
    const data = new Date(dataStr);
    return data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };

  const getDiasRestantes = (dataLimiteStr: string) => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const limite = new Date(dataLimiteStr);
    limite.setHours(0, 0, 0, 0);
    const diffTime = limite.getTime() - hoje.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
  };

  const getTipoLabel = (tipo: string | null) => {
    if (!tipo) return 'Instituição';
    const t = tipo.toLowerCase();
    if (t === 'ilpi') return 'ILPI';
    if (t === 'caps') return 'CAPS';
    if (t === 'creche') return 'Creche';
    return tipo;
  };

  if (isLoading) {
    return (
      <div className="flex h-[70vh] flex-col items-center justify-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600" />
        <p className="text-sm font-semibold tracking-wide text-slate-500">Varrendo Base de Dados do Supabase...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Cabeçalho */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Visão do Todo</h2>
          <p className="text-sm font-medium text-slate-550">
            Monitoramento de riscos em tempo real com base no banco de dados Supabase real.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-100/80 px-4 py-2 text-xs font-semibold text-emerald-700 shadow-sm">
            <ShieldCheck className="h-4.5 w-4.5 text-emerald-600 animate-pulse" />
            Integrado ao Supabase
          </div>
          <Link href="/operacoes">
            <Button size="sm" className="flex items-center gap-2">
              <Plus className="h-4 w-4" /> Nova Operação
            </Button>
          </Link>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="flex items-center gap-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 tracking-wider uppercase">Clientes Cadastrados</p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{totalClientes}</h3>
          </div>
        </Card>

        <Card className="flex items-center gap-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 tracking-wider uppercase">Faturamento Fixo</p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{formatarMoeda(faturamentoMensal)}</h3>
          </div>
        </Card>

        <Card className="flex items-center gap-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50 border border-sky-100 text-sky-600">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 tracking-wider uppercase">Visitas Agendadas</p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{visitasFuturas}</h3>
          </div>
        </Card>

        <Card className="flex items-center gap-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 border border-amber-100 text-amber-600">
            <AlertOctagon className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 tracking-wider uppercase">Tarefas Pendentes</p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{entregasUrgentesCount}</h3>
          </div>
        </Card>
      </div>

      {/* Grid Principal do Dashboard */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Coluna 1 e 2: Obrigações Urgentes e Visitas */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Tarefas e Entregas Críticas */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold tracking-wide text-slate-900 flex items-center gap-2">
                <Clock className="h-5 w-5 text-emerald-600" />
                Tarefas e Entregas Críticas
              </h3>
              <Link href="/operacoes" className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                Ver todas <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>

            {tarefasUrgentes.length === 0 ? (
              <Card className="flex items-center justify-center py-10 text-slate-500">
                Nenhuma tarefa pendente! Operação 100% em dia.
              </Card>
            ) : (
              <div className="space-y-4">
                {tarefasUrgentes.map(t => {
                  const diasRestantes = getDiasRestantes(t.data_limite);
                  const isAtrasado = diasRestantes < 0;
                  const isUrgente = diasRestantes <= 2 && diasRestantes >= 0;
                  const cliente = clientes.find(c => c.id === t.cliente_id);

                  return (
                    <Card key={t.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className="text-xs font-medium text-slate-500">{cliente?.nome}</span>
                          <span className="h-1 w-1 rounded-full bg-slate-300" />
                          <Badge variant={isAtrasado ? 'danger' : isUrgente ? 'warning' : 'info'}>
                            {getTipoLabel(cliente?.tipo_instituicao || '')}
                          </Badge>
                        </div>
                        <h4 className="text-base font-bold text-slate-800">{t.titulo}</h4>
                        <p className="text-xs text-slate-500 leading-relaxed max-w-lg">{t.descricao}</p>
                      </div>

                      <div className="flex sm:flex-col items-start sm:items-end justify-between sm:justify-center gap-2 border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0 font-medium">
                        <span className="text-xs text-slate-400 font-semibold">Prazo: {formatarData(t.data_limite)}</span>
                        {isAtrasado ? (
                          <Badge variant="danger">Atrasado ({Math.abs(diasRestantes)}d)</Badge>
                        ) : isUrgente ? (
                          <Badge variant="warning">{diasRestantes === 0 ? 'Hoje' : `Em ${diasRestantes}d`}</Badge>
                        ) : (
                          <Badge variant="success">No prazo</Badge>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          {/* Próximas Visitas Agendadas */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold tracking-wide text-slate-900 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-indigo-600" />
                Próximas Visitas a Campo
              </h3>
              <Link href="/operacoes" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                Ver todas <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>

            {proximasVisitas.length === 0 ? (
              <Card className="flex items-center justify-center py-10 text-slate-500">
                Nenhuma visita agendada no momento.
              </Card>
            ) : (
              <div className="grid gap-6 sm:grid-cols-3">
                {proximasVisitas.map(v => {
                  const cliente = clientes.find(c => c.id === v.cliente_id);
                  const isAmanhaOuHoje = getDiasRestantes(v.data_visita) <= 1;

                  return (
                    <Card key={v.id} className="flex flex-col justify-between h-44 relative overflow-hidden">
                      {isAmanhaOuHoje && (
                        <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-amber-500 to-rose-500" />
                      )}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <Badge variant="info">
                            {getTipoLabel(cliente?.tipo_instituicao || '')}
                          </Badge>
                          <span className="text-[10px] font-bold text-slate-500">{formatarData(v.data_visita)}</span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-800 line-clamp-1">{cliente?.nome}</h4>
                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{cliente?.endereco}</p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[10px] text-slate-400 truncate max-w-[130px] font-semibold">Status: {v.status}</span>
                        <span className="text-[10px] font-semibold text-indigo-600 cursor-pointer hover:text-indigo-700">Ver rota</span>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* Coluna 3: Feed de Interações WhatsApp IA */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold tracking-wide text-slate-900 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-emerald-600" />
              Torre de Logs (WhatsApp IA)
            </h3>
            <Link href="/comunicacao" className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
              Painel Completo <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="space-y-4">
            {ultimasInteracoes.length === 0 ? (
              <Card className="flex items-center justify-center py-10 text-slate-500">
                Nenhuma interação capturada.
              </Card>
            ) : (
              ultimasInteracoes.map(log => {
                const cliente = clientes.find(c => c.id === log.cliente_id);
                const sentimento = log.metadados?.sentimento || 'neutro';
                const resumo = log.metadados?.resumo_ia || 'Conversa Capturada';
                const canal = log.metadados?.canal || 'whatsapp';
                const topicos = log.metadados?.topicos || [];

                return (
                  <Card 
                    key={log.id} 
                    className={`flex flex-col relative overflow-hidden transition-all duration-300 border-l-4 bg-white ${
                      sentimento === 'risco' 
                        ? 'border-l-rose-500 bg-rose-50/30 hover:bg-rose-50/50' 
                        : sentimento === 'positivo' 
                        ? 'border-l-emerald-500 bg-emerald-50/30 hover:bg-emerald-50/50' 
                        : 'border-l-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2.5">
                      <div>
                        <h4 className="text-xs font-bold text-slate-700 line-clamp-1">{cliente?.nome}</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">{formatarData(log.data_interacao)} - {log.remetente}</p>
                      </div>
                      {sentimento === 'risco' ? (
                        <div className="flex items-center gap-1 text-[10px] font-bold text-rose-600 uppercase">
                          <BadgeAlert className="h-3.5 w-3.5" /> Risco
                        </div>
                      ) : sentimento === 'positivo' ? (
                        <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 uppercase">
                          <BadgeCheck className="h-3.5 w-3.5" /> Positivo
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase">
                          <BadgeInfo className="h-3.5 w-3.5" /> Neutro
                        </div>
                      )}
                    </div>

                    <p className="text-xs font-bold text-slate-800 mt-1 mb-2 leading-snug">
                      {resumo}
                    </p>
                    
                    <p className="text-xs text-slate-500 bg-slate-50 rounded-xl p-3 border border-slate-100 font-mono text-[11px] leading-relaxed line-clamp-3">
                      {log.conteudo}
                    </p>

                    {topicos.length > 0 && (
                      <div className="flex gap-1.5 flex-wrap mt-3">
                        {topicos.map((topic, i) => (
                          <Badge key={i} variant="neutral" className="text-[9px] py-0 px-2 tracking-wide font-normal">
                            #{topic}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </Card>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
