'use client';

import React, { useEffect, useState } from 'react';
import { 
  Milestone, 
  Plus, 
  CalendarRange, 
  ClipboardCheck, 
  Trash2, 
  MapPin, 
  AlertCircle, 
  CheckCircle2, 
  Play, 
  ExternalLink 
} from 'lucide-react';

import { supabaseMock } from '@/lib/supabase';
import { Cliente, Visita, TarefaEntrega } from '@/types/database.types';
import Card from '@/components/ui/card';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import Modal from '@/components/ui/modal';
import { Input, Label, Textarea, Select } from '@/components/ui/input';

export default function OperacoesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [visitas, setVisitas] = useState<Visita[]>([]);
  const [tarefas, setTarefas] = useState<TarefaEntrega[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modais de Criação
  const [isVisitaModalOpen, setIsVisitaModalOpen] = useState(false);
  const [isTarefaModalOpen, setIsTarefaModalOpen] = useState(false);

  // Modal de Relatório de Visita (Observações de Campo)
  const [activeVisitaForReport, setActiveVisitaForReport] = useState<Visita | null>(null);
  const [visitaReportForm, setVisitaReportForm] = useState('');

  // Formulário de Nova Visita
  const [visitaForm, setVisitaForm] = useState({
    cliente_id: '',
    data_visita: '',
    status: 'AGENDADA'
  });

  // Formulário de Nova Tarefa
  const [tarefaForm, setTarefaForm] = useState({
    cliente_id: '',
    visita_id: '', // Opcional
    titulo: '',
    descricao: '',
    data_limite: '',
    status: 'PENDENTE'
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setIsLoading(true);
    try {
      const [c, v, t] = await Promise.all([
        supabaseMock.getClientes(),
        supabaseMock.getVisitas(),
        supabaseMock.getTarefas()
      ]);
      setClientes(c);
      setVisitas(v);
      setTarefas(t);

      if (c.length > 0) {
        setVisitaForm(prev => ({ ...prev, cliente_id: c[0].id }));
        setTarefaForm(prev => ({ ...prev, cliente_id: c[0].id }));
      }
    } catch (err) {
      console.error("Erro ao carregar dados das operações reais:", err);
    } finally {
      setIsLoading(false);
    }
  }

  // --- CRUD VISITAS ---
  const handleOpenCreateVisita = () => {
    setVisitaForm({
      cliente_id: clientes[0]?.id || '',
      data_visita: new Date().toISOString().substring(0, 16), // Data e hora local
      status: 'AGENDADA'
    });
    setIsVisitaModalOpen(true);
  };

  const handleSaveVisita = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        cliente_id: visitaForm.cliente_id,
        data_visita: new Date(visitaForm.data_visita).toISOString(),
        status: visitaForm.status,
        observacoes_campo: null
      };

      await supabaseMock.createVisita(payload);
      setIsVisitaModalOpen(false);
      loadData();
    } catch (err) {
      console.error("Erro ao cadastrar visita no Supabase:", err);
    }
  };

  const handleDeleteVisita = async (id: string) => {
    if (confirm("Deseja realmente remover esta visita? Isso também pode impactar tarefas vinculadas.")) {
      try {
        await supabaseMock.deleteVisita(id);
        loadData();
      } catch (err) {
        console.error("Erro ao excluir visita do Supabase:", err);
      }
    }
  };

  // --- LANÇAR RELATÓRIO / OBSERVAÇÕES DE CAMPO ---
  const handleOpenReportModal = (visita: Visita) => {
    setActiveVisitaForReport(visita);
    setVisitaReportForm(visita.observacoes_campo || '');
  };

  const handleSaveReport = async () => {
    if (!activeVisitaForReport) return;
    try {
      await supabaseMock.updateVisita(activeVisitaForReport.id, {
        observacoes_campo: visitaReportForm,
        status: 'REALIZADA' // Marca automaticamente como realizada ao lançar o relatório
      });
      setActiveVisitaForReport(null);
      loadData();
    } catch (err) {
      console.error("Erro ao salvar relatório de visita no Supabase:", err);
    }
  };

  // --- CRUD TAREFAS / ENTREGAS ---
  const handleOpenCreateTarefa = () => {
    setTarefaForm({
      cliente_id: clientes[0]?.id || '',
      visita_id: '',
      titulo: '',
      descricao: '',
      data_limite: new Date().toISOString().split('T')[0],
      status: 'PENDENTE'
    });
    setIsTarefaModalOpen(true);
  };

  const handleSaveTarefa = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        cliente_id: tarefaForm.cliente_id,
        visita_id: tarefaForm.visita_id === '' ? null : tarefaForm.visita_id,
        titulo: tarefaForm.titulo,
        descricao: tarefaForm.descricao,
        data_limite: new Date(tarefaForm.data_limite).toISOString(),
        status: tarefaForm.status
      };

      await supabaseMock.createTarefa(payload);
      setIsTarefaModalOpen(false);
      loadData();
    } catch (err) {
      console.error("Erro ao registrar obrigação regulatória no Supabase:", err);
    }
  };

  const handleUpdateTarefaStatus = async (id: string, novoStatus: string) => {
    try {
      await supabaseMock.updateTarefa(id, { status: novoStatus });
      loadData();
    } catch (err) {
      console.error("Erro ao atualizar status da tarefa no Supabase:", err);
    }
  };

  const handleDeleteTarefa = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta obrigação?")) {
      try {
        await supabaseMock.deleteTarefa(id);
        loadData();
      } catch (err) {
        console.error("Erro ao excluir tarefa do Supabase:", err);
      }
    }
  };

  // Helpers
  const formatarData = (dataStr: string) => {
    const data = new Date(dataStr);
    return data.toLocaleString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatarDataPrazo = (dataStr: string) => {
    const data = new Date(dataStr);
    return data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <div className="space-y-10">
      {/* Cabeçalho */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-3">
            <Milestone className="h-8 w-8 text-indigo-650" />
            Gestão de Operações
          </h2>
          <p className="text-sm font-medium text-slate-550">
            Acompanhe o cronograma de Visitas Presenciais (Atividade Física) e Obrigações Regulatórias (Atividade Intelectual).
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button onClick={handleOpenCreateVisita} variant="outline" className="flex items-center gap-2">
            <CalendarRange className="h-4 w-4" /> Agendar Visita
          </Button>
          <Button onClick={handleOpenCreateTarefa} className="flex items-center gap-2">
            <ClipboardCheck className="h-4 w-4" /> Criar Obrigação
          </Button>
        </div>
      </div>

      {/* Layout Split: Visitas vs Tarefas */}
      <div className="grid gap-8 lg:grid-cols-2">
        
        {/* Painel da Esquerda: Visitas Técnicas (Físicas) */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-lg font-bold tracking-wide text-indigo-650 flex items-center gap-2.5">
              <CalendarRange className="h-5 w-5" />
              Visitas de Auditoria e Apoio (Física)
            </h3>
            <Badge variant="neutral" className="font-semibold">{visitas.length} Lançamentos</Badge>
          </div>

          {visitas.length === 0 ? (
            <Card className="flex flex-col items-center justify-center py-20 text-slate-500 gap-3">
              <CalendarRange className="h-10 w-10 text-slate-300" />
              <p className="font-semibold text-slate-500">Nenhuma visita agendada.</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {visitas
                .sort((a, b) => new Date(b.data_visita).getTime() - new Date(a.data_visita).getTime())
                .map((v) => {
                  const cliente = clientes.find(c => c.id === v.cliente_id);
                  const isRealizada = v.status?.toUpperCase() === 'REALIZADA';

                  return (
                    <Card key={v.id} className={`border-l-4 ${isRealizada ? 'border-l-indigo-500' : 'border-l-amber-500'}`}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-indigo-650">{cliente?.nome}</span>
                            <span className="h-1 w-1 rounded-full bg-slate-300" />
                            <span className="text-[10px] text-slate-400 font-semibold">{formatarData(v.data_visita)}</span>
                          </div>
                          
                          <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                            {cliente?.endereco || 'Localização não cadastrada'}
                          </p>

                          {/* Relatório de Observações se houver */}
                          {v.observacoes_campo ? (
                            <div className="mt-3 rounded-xl bg-slate-50 p-3 border border-slate-100 text-xs text-slate-600 italic font-mono leading-relaxed">
                              &ldquo;{v.observacoes_campo}&rdquo;
                            </div>
                          ) : (
                            <p className="text-[10px] text-amber-700 font-bold uppercase tracking-wider mt-2.5">
                              ⚠️ Aguardando observações de campo
                            </p>
                          )}
                        </div>

                        {/* Ações da Visita */}
                        <div className="flex flex-col items-end gap-2 shrink-0">
                          <Badge variant={isRealizada ? 'success' : 'warning'}>
                            {v.status}
                          </Badge>
                          
                          <div className="flex items-center gap-1.5 mt-2">
                            <button
                              onClick={() => handleOpenReportModal(v)}
                              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors text-xs flex items-center gap-1 font-semibold cursor-pointer"
                              title="Lançar Relatório Técnico"
                            >
                              <ClipboardCheck className="h-4 w-4" /> Lançar Obs
                            </button>
                            <button
                              onClick={() => handleDeleteVisita(v.id)}
                              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-rose-600 transition-colors cursor-pointer"
                              title="Excluir Registro"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                      </div>
                    </Card>
                  );
                })}
            </div>
          )}
        </div>

        {/* Painel da Direita: Obrigações / Tarefas Regulatórias (Intelectual) */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-lg font-bold tracking-wide text-emerald-600 flex items-center gap-2.5">
              <ClipboardCheck className="h-5 w-5" />
              Obrigações e Laudos Regulatórios (Intelectual)
            </h3>
            <Badge variant="neutral" className="font-semibold">{tarefas.length} Obrigações</Badge>
          </div>

          {tarefas.length === 0 ? (
            <Card className="flex flex-col items-center justify-center py-20 text-slate-500 gap-3">
              <ClipboardCheck className="h-10 w-10 text-slate-300" />
              <p className="font-semibold text-slate-500">Nenhuma obrigação registrada.</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {tarefas
                .sort((a, b) => new Date(a.data_limite).getTime() - new Date(b.data_limite).getTime())
                .map((t) => {
                  const cliente = clientes.find(c => c.id === t.cliente_id);
                  const isEntregue = t.status?.toUpperCase() === 'ENTREGUE';
                  const isAndamento = t.status?.toUpperCase() === 'EM_ANDAMENTO';

                  return (
                    <Card key={t.id} className={`border-l-4 ${isEntregue ? 'border-l-emerald-500' : isAndamento ? 'border-l-indigo-500' : 'border-l-rose-500'}`}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-emerald-600">{cliente?.nome}</span>
                            <span className="h-1 w-1 rounded-full bg-slate-300" />
                            <span className="text-[10px] text-slate-400 font-semibold">Prazo: {formatarDataPrazo(t.data_limite)}</span>
                          </div>

                          <h4 className="text-sm font-bold text-slate-850">{t.titulo}</h4>
                          <p className="text-xs text-slate-500 leading-relaxed">{t.descricao}</p>
                        </div>

                        {/* Ações da Tarefa */}
                        <div className="flex flex-col items-end gap-2.5 shrink-0">
                          <Badge variant={isEntregue ? 'success' : isAndamento ? 'info' : 'danger'}>
                            {t.status}
                          </Badge>

                          <div className="flex items-center gap-1 mt-1">
                            {!isEntregue && !isAndamento && (
                              <button
                                onClick={() => handleUpdateTarefaStatus(t.id, 'EM_ANDAMENTO')}
                                className="rounded-lg p-1.5 text-indigo-650 hover:bg-slate-100 transition-colors cursor-pointer"
                                title="Iniciar Trabalho"
                              >
                                <Play className="h-4 w-4" />
                              </button>
                            )}
                            {!isEntregue && (
                              <button
                                onClick={() => handleUpdateTarefaStatus(t.id, 'ENTREGUE')}
                                className="rounded-lg p-1.5 text-emerald-600 hover:bg-slate-100 transition-colors cursor-pointer"
                                title="Marcar como Entregue"
                              >
                                <CheckCircle2 className="h-4 w-4" />
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteTarefa(t.id)}
                              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-rose-600 transition-colors cursor-pointer"
                              title="Excluir Obrigação"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
            </div>
          )}
        </div>

      </div>

      {/* --- MODAL RELATÓRIO DE VISITA --- */}
      <Modal 
        isOpen={activeVisitaForReport !== null} 
        onClose={() => setActiveVisitaForReport(null)} 
        title="Lançar Observações e Relatório de Campo"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-500">
            Escreva as anotações colhidas pelo consultor durante a visita. Ao confirmar, o status será alterado para **REALIZADA**.
          </p>
          <div>
            <Label htmlFor="rep_campo">Relatório da Visita</Label>
            <Textarea 
              id="rep_campo"
              required
              value={visitaReportForm} 
              onChange={(e) => setVisitaReportForm(e.target.value)}
              placeholder="Ex: Escala de enfermeiros em conformidade, identificadas 3 pendências na vigilância sanitária local..."
              rows={5}
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
            <Button type="button" variant="outline" onClick={() => setActiveVisitaForReport(null)}>Cancelar</Button>
            <Button onClick={handleSaveReport}>Gravar Observações</Button>
          </div>
        </div>
      </Modal>

      {/* --- MODAL AGENDAR VISITA --- */}
      <Modal isOpen={isVisitaModalOpen} onClose={() => setIsVisitaModalOpen(false)} title="Agendar Nova Visita Técnica">
        <form onSubmit={handleSaveVisita} className="space-y-4">
          <div>
            <Label htmlFor="vis_cliente">Instituição Assistencial</Label>
            <Select 
              id="vis_cliente" 
              required
              value={visitaForm.cliente_id} 
              onChange={(e) => setVisitaForm({...visitaForm, cliente_id: e.target.value})}
            >
              {clientes.map(c => (
                <option key={c.id} value={c.id}>{c.nome}</option>
              ))}
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="vis_data">Data e Hora da Visita</Label>
              <Input 
                id="vis_data" 
                type="datetime-local"
                required
                value={visitaForm.data_visita} 
                onChange={(e) => setVisitaForm({...visitaForm, data_visita: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="vis_status">Status Inicial</Label>
              <Select 
                id="vis_status" 
                value={visitaForm.status} 
                onChange={(e) => setVisitaForm({...visitaForm, status: e.target.value})}
              >
                <option value="AGENDADA">Agendada</option>
                <option value="REALIZADA">Realizada</option>
                <option value="CANCELADA">Cancelada</option>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
            <Button type="button" variant="outline" onClick={() => setIsVisitaModalOpen(false)}>Cancelar</Button>
            <Button type="submit">Agendar Visita</Button>
          </div>
        </form>
      </Modal>

      {/* --- MODAL CRIAR TAREFA / OBRIGAÇÃO --- */}
      <Modal isOpen={isTarefaModalOpen} onClose={() => setIsTarefaModalOpen(false)} title="Nova Obrigação / Entrega Regulatória">
        <form onSubmit={handleSaveTarefa} className="space-y-4">
          <div>
            <Label htmlFor="tar_cliente">Instituição Assistencial</Label>
            <Select 
              id="tar_cliente" 
              required
              value={tarefaForm.cliente_id} 
              onChange={(e) => setTarefaForm({...tarefaForm, cliente_id: e.target.value})}
            >
              {clientes.map(c => (
                <option key={c.id} value={c.id}>{c.nome}</option>
              ))}
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tar_prazo">Prazo Limite para Entrega</Label>
              <Input 
                id="tar_prazo" 
                type="date"
                required
                value={tarefaForm.data_limite} 
                onChange={(e) => setTarefaForm({...tarefaForm, data_limite: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="tar_status">Status Inicial</Label>
              <Select 
                id="tar_status" 
                value={tarefaForm.status} 
                onChange={(e) => setTarefaForm({...tarefaForm, status: e.target.value})}
              >
                <option value="PENDENTE">Pendente</option>
                <option value="EM_ANDAMENTO">Em Andamento</option>
                <option value="ENTREGUE">Entregue / Concluído</option>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="tar_titulo">Título da Obrigação</Label>
            <Input 
              id="tar_titulo" 
              required
              value={tarefaForm.titulo} 
              onChange={(e) => setTarefaForm({...tarefaForm, titulo: e.target.value})}
              placeholder="Ex: Renovação do Alvará Sanitário"
            />
          </div>

          <div>
            <Label htmlFor="tar_desc">Descrição Operacional</Label>
            <Textarea 
              id="tar_desc" 
              value={tarefaForm.descricao} 
              onChange={(e) => setTarefaForm({...tarefaForm, descricao: e.target.value})}
              placeholder="Ex: Obter laudo técnico do corpo de bombeiros e submeter ao órgão de vigilância estadual..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
            <Button type="button" variant="outline" onClick={() => setIsTarefaModalOpen(false)}>Cancelar</Button>
            <Button type="submit">Registrar Obrigação</Button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
