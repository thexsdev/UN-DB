'use client';

import React, { useEffect, useState } from 'react';
import { 
  Building2, 
  Plus, 
  Trash2, 
  Edit3, 
  Users2, 
  MapPin, 
  PhoneCall, 
  DollarSign, 
  CalendarRange, 
  Briefcase, 
  AlertCircle 
} from 'lucide-react';

import { supabaseMock } from '@/lib/supabase';
import { Cliente, Contrato } from '@/types/database.types';
import Card from '@/components/ui/card';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import Modal from '@/components/ui/modal';
import { Input, Label, Textarea, Select } from '@/components/ui/input';

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [contratos, setContratos] = useState<Contrato[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Estados de Expansão de Detalhes
  const [expandedClienteId, setExpandedClienteId] = useState<string | null>(null);

  // Estados dos Modais
  const [isClienteModalOpen, setIsClienteModalOpen] = useState(false);
  const [isContratoModalOpen, setIsContratoModalOpen] = useState(false);

  // Estados do Formulário do Cliente
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
  const [clienteForm, setClienteForm] = useState({
    nome: '',
    tipo_instituicao: 'ilpi',
    responsavel: '',
    telefone_contato: '',
    endereco: ''
  });

  // Estados do Formulário do Contrato
  const [editingContrato, setEditingContrato] = useState<Contrato | null>(null);
  const [contratoForm, setContratoForm] = useState({
    cliente_id: '',
    tipo_cobranca: 'MENSAL_FIXO',
    valor: '',
    data_inicio: '',
    data_fim: '',
    status: 'ATIVO'
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setIsLoading(true);
    try {
      const [c, con] = await Promise.all([
        supabaseMock.getClientes(),
        supabaseMock.getContratos()
      ]);
      setClientes(c);
      setContratos(con);
    } catch (err) {
      console.error("Erro ao carregar dados dos clientes reais:", err);
    } finally {
      setIsLoading(false);
    }
  }

  // --- CRUD CLIENTES ---
  const handleOpenCreateCliente = () => {
    setEditingCliente(null);
    setClienteForm({
      nome: '',
      tipo_instituicao: 'ilpi',
      responsavel: '',
      telefone_contato: '',
      endereco: ''
    });
    setIsClienteModalOpen(true);
  };

  const handleOpenEditCliente = (c: Cliente, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingCliente(c);
    setClienteForm({
      nome: c.nome,
      tipo_instituicao: c.tipo_instituicao || 'ilpi',
      responsavel: c.responsavel || '',
      telefone_contato: c.telefone_contato || '',
      endereco: c.endereco || ''
    });
    setIsClienteModalOpen(true);
  };

  const handleSaveCliente = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCliente) {
        await supabaseMock.updateCliente(editingCliente.id, clienteForm);
      } else {
        await supabaseMock.createCliente(clienteForm);
      }
      setIsClienteModalOpen(false);
      loadData();
    } catch (err) {
      console.error("Erro ao salvar cliente no Supabase:", err);
    }
  };

  const handleDeleteCliente = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Tem certeza que deseja excluir esta instituição assistencial? Todos os contratos e histórico vinculados a ela poderão ser impactados.")) {
      try {
        await supabaseMock.deleteCliente(id);
        if (expandedClienteId === id) setExpandedClienteId(null);
        loadData();
      } catch (err) {
        console.error("Erro ao excluir cliente do Supabase:", err);
      }
    }
  };

  // --- CRUD CONTRATOS ---
  const handleOpenCreateContrato = (clienteId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingContrato(null);
    
    // Pegar a data atual formatada como YYYY-MM-DD
    const hoje = new Date().toISOString().split('T')[0];

    setContratoForm({
      cliente_id: clienteId,
      tipo_cobranca: 'MENSAL_FIXO',
      valor: '1500',
      data_inicio: hoje,
      data_fim: '',
      status: 'ATIVO'
    });
    setIsContratoModalOpen(true);
  };

  const handleOpenEditContrato = (c: Contrato, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingContrato(c);
    setContratoForm({
      cliente_id: c.cliente_id,
      tipo_cobranca: c.tipo_cobranca,
      valor: c.valor ? c.valor.toString() : '0',
      data_inicio: c.data_inicio,
      data_fim: c.data_fim || '',
      status: c.status
    });
    setIsContratoModalOpen(true);
  };

  const handleSaveContrato = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        cliente_id: contratoForm.cliente_id,
        tipo_cobranca: contratoForm.tipo_cobranca,
        valor: parseFloat(contratoForm.valor) || 0,
        data_inicio: contratoForm.data_inicio,
        data_fim: contratoForm.data_fim === '' ? null : contratoForm.data_fim,
        status: contratoForm.status
      };

      if (editingContrato) {
        await supabaseMock.updateContrato(editingContrato.id, payload);
      } else {
        await supabaseMock.createContrato(payload);
      }
      setIsContratoModalOpen(false);
      loadData();
    } catch (err) {
      console.error("Erro ao salvar contrato no Supabase:", err);
    }
  };

  const handleDeleteContrato = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Deseja realmente remover permanentemente este contrato?")) {
      try {
        await supabaseMock.deleteContrato(id);
        loadData();
      } catch (err) {
        console.error("Erro ao excluir contrato do Supabase:", err);
      }
    }
  };

  // Helpers de Formatação
  const getTipoLabel = (tipo: string | null) => {
    if (!tipo) return 'Outro';
    const t = tipo.toLowerCase();
    if (t === 'ilpi') return 'ILPI (Idosos)';
    if (t === 'caps') return 'CAPS (Saúde Mental)';
    if (t === 'creche') return 'Creche Infantil';
    return tipo;
  };

  const formatarData = (dateStr: string | null) => {
    if (!dateStr) return 'Não definida';
    const [ano, mes, dia] = dateStr.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  const formatarMoeda = (valor: number | null) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor || 0);
  };

  if (isLoading) {
    return (
      <div className="flex h-[70vh] flex-col items-center justify-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600" />
        <p className="text-sm font-semibold tracking-wide text-slate-500">Consultando Módulo Comercial...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Cabeçalho */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-3">
            <Building2 className="h-8 w-8 text-emerald-600" />
            Gestão Comercial e Clientes
          </h2>
          <p className="text-sm font-medium text-slate-550">
            Cadastre instituições de assistência, gerencie vigências financeiras e contratos integrados à base ativa do Supabase.
          </p>
        </div>
        <Button onClick={handleOpenCreateCliente} className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Nova Instituição
        </Button>
      </div>

      {/* Grid de Clientes (Baseada em Cards Premium) */}
      {clientes.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-20 text-slate-500 gap-3">
          <Building2 className="h-12 w-12 text-slate-300" />
          <p className="font-semibold text-slate-500">Nenhuma instituição cadastrada.</p>
          <Button onClick={handleOpenCreateCliente} variant="outline" size="sm">Adicionar Primeiro Cliente</Button>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {clientes.map((c) => {
            const contratosCliente = contratos.filter(con => con.cliente_id === c.id);
            const contratoAtivo = contratosCliente.find(con => con.status?.toUpperCase() === 'ATIVO');
            const isExpanded = expandedClienteId === c.id;

            return (
              <div 
                key={c.id} 
                className="transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                onClick={() => setExpandedClienteId(isExpanded ? null : c.id)}
              >
                <Card className={`relative overflow-hidden h-full flex flex-col justify-between border-l-4 ${
                  isExpanded ? 'border-l-emerald-500 bg-emerald-50/5' : 'border-l-slate-200'
                }`}>
                  
                  {/* Conteúdo Principal do Card */}
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <Badge variant="info" className="mb-2">
                          {getTipoLabel(c.tipo_instituicao)}
                        </Badge>
                        <h3 className="text-lg font-bold text-slate-800 line-clamp-1">{c.nome}</h3>
                      </div>
                      
                      {/* Ações */}
                      <div className="flex gap-1 shrink-0">
                        <button
                          onClick={(e) => handleOpenEditCliente(c, e)}
                          className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
                          title="Editar Instituição"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => handleDeleteCliente(c.id, e)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-rose-600 transition-colors"
                          title="Excluir"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Metadados Básicos */}
                    <div className="space-y-2 text-xs font-medium text-slate-500">
                      <div className="flex items-center gap-2">
                        <Users2 className="h-4 w-4 text-slate-400 shrink-0" />
                        <span className="truncate">Resp: {c.responsavel || 'Não informado'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <PhoneCall className="h-4 w-4 text-slate-400 shrink-0" />
                        <span>{c.telefone_contato || 'Sem telefone'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                        <span className="truncate">{c.endereco || 'Endereço não cadastrado'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Resumo Contratual e Rodapé */}
                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      {contratoAtivo ? (
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Faturamento Mensal</p>
                          <p className="text-sm font-extrabold text-emerald-600">{formatarMoeda(contratoAtivo.valor)}</p>
                        </div>
                      ) : (
                        <span className="text-slate-400 font-semibold italic">Sem contrato ativo</span>
                      )}
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-emerald-600">
                      {isExpanded ? 'Fechar Detalhes ▲' : 'Ver Contratos ▼'}
                    </span>
                  </div>

                  {isExpanded && (
                    <div 
                      className="mt-6 pt-5 border-t-2 border-slate-100 space-y-4 cursor-default"
                      onClick={(e) => e.stopPropagation()} // Evita retrair o card ao mexer no painel
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wide">
                          <Briefcase className="h-3.5 w-3.5 text-indigo-650" />
                          Painel de Contratos
                        </h4>
                        <Button 
                          onClick={(e) => handleOpenCreateContrato(c.id, e)} 
                          size="sm" 
                          variant="outline"
                          className="flex items-center gap-1 py-1 text-[10px]"
                        >
                          <Plus className="h-3 w-3" /> Novo Contrato
                        </Button>
                      </div>

                      {contratosCliente.length === 0 ? (
                        <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 text-center text-xs text-slate-400 italic">
                          Nenhum plano ou contrato registrado para este cliente.
                        </div>
                      ) : (
                        <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                          {contratosCliente.map((con) => (
                            <div 
                              key={con.id} 
                              className={`rounded-xl p-3 border text-xs relative ${
                                con.status?.toUpperCase() === 'ATIVO' 
                                  ? 'border-emerald-200 bg-emerald-50/50' 
                                  : 'border-slate-100 bg-slate-50'
                              }`}
                            >
                              {/* Meta Contrato */}
                              <div className="flex items-center justify-between mb-2">
                                <Badge variant={con.status?.toUpperCase() === 'ATIVO' ? 'success' : 'neutral'} className="text-[9px] py-0 px-2 font-semibold">
                                  {con.status}
                                </Badge>
                                <div className="flex gap-2">
                                  <button
                                    onClick={(e) => handleOpenEditContrato(con, e)}
                                    className="text-slate-500 hover:text-slate-800 transition-colors"
                                    title="Editar Contrato"
                                  >
                                    <Edit3 className="h-3 w-3" />
                                  </button>
                                  <button
                                    onClick={(e) => handleDeleteContrato(con.id, e)}
                                    className="text-slate-400 hover:text-rose-600 transition-colors"
                                    title="Excluir Contrato"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </button>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-2 text-slate-700">
                                <div>
                                  <span className="text-[9px] text-slate-400 uppercase block font-semibold">Cobrança</span>
                                  <span className="font-bold">{con.tipo_cobranca}</span>
                                </div>
                                <div>
                                  <span className="text-[9px] text-slate-400 uppercase block font-semibold">Mensalidade</span>
                                  <span className="font-bold text-slate-900">{formatarMoeda(con.valor)}</span>
                                </div>
                              </div>

                              <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[9px] text-slate-400 font-semibold">
                                <CalendarRange className="h-3.5 w-3.5 text-slate-450" />
                                <span>{formatarData(con.data_inicio)} até {con.data_fim ? formatarData(con.data_fim) : 'Sem expiração'}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                </Card>
              </div>
            );
          })}
        </div>
      )}

      {/* --- MODAL CADASTRO / EDIÇÃO CLIENTE --- */}
      <Modal 
        isOpen={isClienteModalOpen} 
        onClose={() => setIsClienteModalOpen(false)} 
        title={editingCliente ? "Editar Instituição Assistencial" : "Nova Instituição Assistencial"}
      >
        <form onSubmit={handleSaveCliente} className="space-y-4">
          <div>
            <Label htmlFor="cli_nome">Nome da Instituição</Label>
            <Input 
              id="cli_nome" 
              required
              value={clienteForm.nome} 
              onChange={(e) => setClienteForm({...clienteForm, nome: e.target.value})}
              placeholder="Ex: Lar dos Idosos Amigos do Bem"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cli_tipo">Segmento (Cuidado)</Label>
              <Select 
                id="cli_tipo" 
                value={clienteForm.tipo_instituicao} 
                onChange={(e) => setClienteForm({...clienteForm, tipo_instituicao: e.target.value})}
              >
                <option value="ilpi">ILPI (Lar de Idosos)</option>
                <option value="caps">CAPS (Saúde Mental)</option>
                <option value="creche">Creche (Infantil)</option>
                <option value="outro">Outro Modelo</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="cli_telefone">Telefone de Contato</Label>
              <Input 
                id="cli_telefone" 
                required
                value={clienteForm.telefone_contato} 
                onChange={(e) => setClienteForm({...clienteForm, telefone_contato: e.target.value})}
                placeholder="Ex: (83) 98888-7777"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="cli_responsavel">Responsável Operacional</Label>
            <Input 
              id="cli_responsavel" 
              required
              value={clienteForm.responsavel} 
              onChange={(e) => setClienteForm({...clienteForm, responsavel: e.target.value})}
              placeholder="Ex: Dra. Sandra Albuquerque"
            />
          </div>

          <div>
            <Label htmlFor="cli_endereco">Localização Física / Endereço</Label>
            <Textarea 
              id="cli_endereco" 
              value={clienteForm.endereco} 
              onChange={(e) => setClienteForm({...clienteForm, endereco: e.target.value})}
              placeholder="Ex: Av. Epitácio Pessoa, 1200 - João Pessoa - PB"
              rows={2}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
            <Button type="button" variant="outline" onClick={() => setIsClienteModalOpen(false)}>Cancelar</Button>
            <Button type="submit">Salvar Instituição</Button>
          </div>
        </form>
      </Modal>

      {/* --- MODAL CADASTRO / EDIÇÃO CONTRATO --- */}
      <Modal
        isOpen={isContratoModalOpen}
        onClose={() => setIsContratoModalOpen(false)}
        title={editingContrato ? "Editar Vigência de Contrato" : "Novo Vínculo / Contrato"}
      >
        <form onSubmit={handleSaveContrato} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="con_cobranca">Frequência Financeira</Label>
              <Select 
                id="con_cobranca" 
                value={contratoForm.tipo_cobranca} 
                onChange={(e) => setContratoForm({...contratoForm, tipo_cobranca: e.target.value})}
              >
                <option value="MENSAL_FIXO">Mensalidade Fixa</option>
                <option value="VISITA_AVULSA">Por Visita Presencial</option>
                <option value="ANUAL">Anuidade Especial</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="con_valor">Valor Mensal (R$)</Label>
              <Input 
                id="con_valor" 
                type="number"
                required
                value={contratoForm.valor} 
                onChange={(e) => setContratoForm({...contratoForm, valor: e.target.value})}
                placeholder="Ex: 2500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="con_data_ini">Início da Vigência</Label>
              <Input 
                id="con_data_ini" 
                type="date"
                required
                value={contratoForm.data_inicio} 
                onChange={(e) => setContratoForm({...contratoForm, data_inicio: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="con_data_fim">Fim da Vigência (Opcional)</Label>
              <Input 
                id="con_data_fim" 
                type="date"
                value={contratoForm.data_fim} 
                onChange={(e) => setContratoForm({...contratoForm, data_fim: e.target.value})}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="con_status">Status do Contrato</Label>
            <Select 
              id="con_status" 
              value={contratoForm.status} 
              onChange={(e) => setContratoForm({...contratoForm, status: e.target.value})}
            >
              <option value="ATIVO">Ativo e Regular</option>
              <option value="SUSPENSO">Suspenso Temporariamente</option>
              <option value="ENCERRADO">Encerrado / Distratado</option>
            </Select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
            <Button type="button" variant="outline" onClick={() => setIsContratoModalOpen(false)}>Cancelar</Button>
            <Button type="submit">Confirmar Contrato</Button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
