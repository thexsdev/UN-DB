'use client';

import React, { useEffect, useState } from 'react';
import { 
  MessageSquareCode, 
  Search, 
  Trash2, 
  Plus, 
  BadgeAlert, 
  BadgeCheck, 
  BadgeInfo, 
  ShieldAlert, 
  MessageCircle,
  Mail,
  Users2,
  CalendarClock
} from 'lucide-react';

import { supabaseMock } from '@/lib/supabase';
import { Cliente, LogInteracao } from '@/types/database.types';
import Card from '@/components/ui/card';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import Modal from '@/components/ui/modal';
import { Input, Label, Textarea, Select } from '@/components/ui/input';

export default function ComunicacaoPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [logs, setLogs] = useState<LogInteracao[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filtros
  const [selectedClienteId, setSelectedClienteId] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Modal de Simulação de Log
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [logForm, setLogForm] = useState({
    cliente_id: '',
    remetente: 'Sandra Medeiros (Enfermeira Chefe)',
    canal: 'whatsapp' as 'whatsapp' | 'email' | 'reuniao',
    sentimento: 'neutro' as 'positivo' | 'neutro' | 'risco',
    resumo_ia: '',
    conteudo: '',
    topicos_str: '' // Tópicos separados por vírgula
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setIsLoading(true);
    try {
      const [c, l] = await Promise.all([
        supabaseMock.getClientes(),
        supabaseMock.getLogs()
      ]);
      setClientes(c);
      setLogs(l);
      
      if (c.length > 0) {
        setLogForm(prev => ({ ...prev, cliente_id: c[0].id }));
      }
    } catch (err) {
      console.error("Erro ao carregar comunicações reais:", err);
    } finally {
      setIsLoading(false);
    }
  }

  // --- CRIAR NOVO LOG (SIMULAÇÃO DE INTEGRACAO WHATSAPP IA) ---
  const handleOpenCreateLog = () => {
    setLogForm({
      cliente_id: clientes[0]?.id || '',
      remetente: 'Sandra Medeiros (Enfermeira Chefe)',
      canal: 'whatsapp',
      sentimento: 'neutro',
      resumo_ia: '',
      conteudo: '',
      topicos_str: 'Vigilância, Plantão'
    });
    setIsLogModalOpen(true);
  };

  const handleSaveLog = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const parsedTopicos = logForm.topicos_str
        .split(',')
        .map(t => t.trim())
        .filter(t => t !== '');

      const payload = {
        cliente_id: logForm.cliente_id,
        remetente: logForm.remetente,
        conteudo: logForm.conteudo,
        metadados: {
          canal: logForm.canal,
          sentimento: logForm.sentimento,
          resumo_ia: logForm.resumo_ia,
          topicos: parsedTopicos
        },
        data_interacao: new Date().toISOString()
      };

      await supabaseMock.createLog(payload);
      setIsLogModalOpen(false);
      loadData();
    } catch (err) {
      console.error("Erro ao criar log de comunicação real:", err);
    }
  };

  const handleDeleteLog = async (id: string) => {
    if (confirm("Deseja realmente excluir este rastro/log de conversa do Supabase?")) {
      try {
        await supabaseMock.deleteLog(id);
        loadData();
      } catch (err) {
        console.error("Erro ao excluir log do Supabase:", err);
      }
    }
  };

  // --- FILTRAGEM REATIVA ---
  const filteredLogs = logs
    .filter(log => {
      const matchesCliente = selectedClienteId === 'todos' || log.cliente_id === selectedClienteId;
      
      const canal = log.metadados?.canal || 'whatsapp';
      const sentimento = log.metadados?.sentimento || 'neutro';
      const resumo = log.metadados?.resumo_ia || '';
      const topicos = log.metadados?.topicos || [];

      const matchesSearch = log.conteudo.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            log.remetente.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            resumo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            topicos.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCliente && matchesSearch;
    })
    .sort((a, b) => new Date(b.data_interacao).getTime() - new Date(a.data_interacao).getTime());

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

  if (isLoading) {
    return (
      <div className="flex h-[70vh] flex-col items-center justify-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600" />
        <p className="text-sm font-semibold tracking-wide text-slate-500">Varrendo Linha de Comunicação...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Cabeçalho */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-3">
            <MessageSquareCode className="h-8 w-8 text-emerald-650" />
            Torre de Comunicação
          </h2>
          <p className="text-sm font-medium text-slate-550">
            Histórico consolidado de transcrições e resumos IA do WhatsApp de todas as instituições assistenciais.
          </p>
        </div>
        <Button onClick={handleOpenCreateLog} className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Simular Mensagem IA
        </Button>
      </div>

      {/* Controles de Filtros e Busca */}
      <Card className="p-4" hoverEffect={false}>
        <div className="flex flex-col md:flex-row items-center gap-4">
          {/* Busca por texto */}
          <div className="relative w-full md:flex-1">
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
            <Input 
              placeholder="Buscar por palavras-chave na conversa, tópicos ou resumos..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11"
            />
          </div>

          {/* Filtro por Cliente */}
          <div className="relative w-full md:w-80">
            <Select 
              value={selectedClienteId} 
              onChange={(e) => setSelectedClienteId(e.target.value)}
              className="pr-10"
            >
              <option value="todos">Filtro: Todas as Instituições</option>
              {clientes.map(c => (
                <option key={c.id} value={c.id}>{c.nome}</option>
              ))}
            </Select>
          </div>
        </div>
      </Card>

      {/* Rastro Diário: Timeline de Logs */}
      <div className="space-y-6">
        {filteredLogs.length === 0 ? (
          <Card className="flex flex-col items-center justify-center py-20 text-slate-500 gap-3">
            <ShieldAlert className="h-10 w-10 text-slate-300" />
            <p className="font-semibold text-slate-550">Nenhum rastro ou mensagem encontrado.</p>
            <p className="text-xs text-slate-400">Altere os termos de busca ou selecione outro cliente.</p>
          </Card>
        ) : (
          <div className="relative border-l-2 border-slate-100 ml-4 md:ml-6 pl-6 md:pl-8 space-y-8 py-2">
            {filteredLogs.map((log) => {
              const cliente = clientes.find(c => c.id === log.cliente_id);
              
              const canal = log.metadados?.canal || 'whatsapp';
              const sentimento = log.metadados?.sentimento || 'neutro';
              const resumo = log.metadados?.resumo_ia || 'Conversa Capturada';
              const topicos = log.metadados?.topicos || [];

              // Estilização condicional baseada no sentimento da crise
              const isRisco = sentimento === 'risco';
              const isPositivo = sentimento === 'positivo';

              return (
                <div key={log.id} className="relative group">
                  {/* Marcador da Timeline */}
                  <div className={`absolute -left-[35px] md:-left-[43px] top-1.5 flex h-6 w-6 items-center justify-center rounded-full border bg-white text-slate-700 transition-all group-hover:scale-110 ${
                    isRisco 
                      ? 'border-rose-500 text-rose-600 shadow-sm shadow-rose-100' 
                      : isPositivo 
                      ? 'border-emerald-500 text-emerald-600 shadow-sm shadow-emerald-100' 
                      : 'border-slate-200 text-slate-400'
                  }`}>
                    {canal === 'whatsapp' ? (
                      <MessageCircle className="h-3 w-3" />
                    ) : canal === 'email' ? (
                      <Mail className="h-3 w-3" />
                    ) : (
                      <Users2 className="h-3 w-3" />
                    )}
                  </div>

                  {/* Card do Log */}
                  <Card className={`border-l-4 bg-white ${
                    isRisco 
                      ? 'border-l-rose-500 bg-rose-50/30 hover:bg-rose-50/50' 
                      : isPositivo 
                      ? 'border-l-emerald-500 bg-emerald-50/30 hover:bg-emerald-50/50' 
                      : 'border-l-slate-200 shadow-sm'
                  }`}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-3 mb-3.5">
                      
                      {/* Meta do Cliente e Canal */}
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-emerald-600">{cliente?.nome}</span>
                          <span className="h-1 w-1 rounded-full bg-slate-300" />
                          <span className="text-[10px] text-slate-400 font-semibold uppercase">Via {canal}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1 font-semibold">
                          <CalendarClock className="h-3 w-3" />
                          Capturado em: {formatarData(log.data_interacao)} por {log.remetente}
                        </p>
                      </div>

                      {/* Alerta de Sentimento e Ações */}
                      <div className="flex items-center justify-between md:justify-end gap-4 shrink-0">
                        {isRisco ? (
                          <div className="flex items-center gap-1 text-xs font-extrabold text-rose-600 uppercase tracking-wide">
                            <BadgeAlert className="h-4.5 w-4.5 text-rose-600" /> Alerta de Risco
                          </div>
                        ) : isPositivo ? (
                          <div className="flex items-center gap-1 text-xs font-extrabold text-emerald-600 uppercase tracking-wide">
                            <BadgeCheck className="h-4.5 w-4.5 text-emerald-400 animate-pulse" /> Feedback Positivo
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-xs font-extrabold text-slate-555 uppercase tracking-wide">
                            <BadgeInfo className="h-4.5 w-4.5 text-slate-400" /> Neutro
                          </div>
                        )}

                        <button
                          onClick={() => handleDeleteLog(log.id)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-rose-600 transition-colors cursor-pointer"
                          title="Remover Registro"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                    </div>

                    {/* Resumo da IA */}
                    <div className="space-y-3">
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Resumo Inteligente IA</span>
                        <h4 className="text-sm font-extrabold text-slate-850">{resumo}</h4>
                      </div>

                      {/* Transcrição de Áudio / Conversa */}
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Transcrição Íntegra</span>
                        <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 text-xs text-slate-600 font-mono leading-relaxed max-w-none">
                          {log.conteudo}
                        </div>
                      </div>

                      {/* Tags/Tópicos */}
                      {topicos.length > 0 && (
                        <div className="flex gap-2 flex-wrap pt-1">
                          {topicos.map((topic, i) => (
                            <Badge key={i} variant="neutral" className="text-[10px] py-0.5 px-2.5 font-medium tracking-wide">
                              #{topic}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                  </Card>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* --- MODAL SIMULAR MENSAGEM IA --- */}
      <Modal isOpen={isLogModalOpen} onClose={() => setIsLogModalOpen(false)} title="Simular Nova Transcrição WhatsApp via IA">
        <form onSubmit={handleSaveLog} className="space-y-4">
          <div>
            <Label htmlFor="log_cliente">Instituição Emissora</Label>
            <Select 
              id="log_cliente" 
              required
              value={logForm.cliente_id} 
              onChange={(e) => setLogForm({...logForm, cliente_id: e.target.value})}
            >
              {clientes.map(c => (
                <option key={c.id} value={c.id}>{c.nome}</option>
              ))}
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="log_canal">Canal de Contato</Label>
              <Select 
                id="log_canal" 
                value={logForm.canal} 
                onChange={(e) => setLogForm({...logForm, canal: e.target.value as 'whatsapp' | 'email' | 'reuniao'})}
              >
                <option value="whatsapp">WhatsApp (Mensagem/Áudio)</option>
                <option value="email">Email</option>
                <option value="reuniao">Reunião Presencial/Online</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="log_sentimento">Análise de Sentimento (IA)</Label>
              <Select 
                id="log_sentimento" 
                value={logForm.sentimento} 
                onChange={(e) => setLogForm({...logForm, sentimento: e.target.value as 'positivo' | 'neutro' | 'risco'})}
              >
                <option value="neutro">Neutro (Sem alertas)</option>
                <option value="positivo">Positivo (Feedbacks/Elogios)</option>
                <option value="risco">Alerta de Risco (Crises/Faltas)</option>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="log_remetente">Nome do Remetente</Label>
              <Input 
                id="log_remetente" 
                required
                value={logForm.remetente} 
                onChange={(e) => setLogForm({...logForm, remetente: e.target.value})}
                placeholder="Ex: Dra. Sandra Albuquerque"
              />
            </div>
            <div>
              <Label htmlFor="log_resumo">Resumo Gerado pela IA (Tópico Principal)</Label>
              <Input 
                id="log_resumo" 
                required
                value={logForm.resumo_ia} 
                onChange={(e) => setLogForm({...logForm, resumo_ia: e.target.value})}
                placeholder="Ex: Alerta de falta de técnicos e medicamentos"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="log_conteudo">Transcrição Bruta (Humana)</Label>
            <Textarea 
              id="log_conteudo" 
              required
              value={logForm.conteudo} 
              onChange={(e) => setLogForm({...logForm, conteudo: e.target.value})}
              placeholder="Digite a simulação das mensagens de WhatsApp enviadas pelo cliente..."
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="log_topicos">Tópicos/Tags (Separados por vírgula)</Label>
            <Input 
              id="log_topicos" 
              value={logForm.topicos_str} 
              onChange={(e) => setLogForm({...logForm, topicos_str: e.target.value})}
              placeholder="Ex: Escala de Plantão, Vigilância, Falta de Insumos"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
            <Button type="button" variant="outline" onClick={() => setIsLogModalOpen(false)}>Cancelar</Button>
            <Button type="submit">Gerar Rastro IA</Button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
