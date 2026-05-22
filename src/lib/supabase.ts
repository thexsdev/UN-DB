import { createClient } from '@supabase/supabase-js';
import { Cliente, Contrato, Visita, TarefaEntrega, LogInteracao } from '../types/database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';

// Inicialização Dinâmica do Supabase para evitar conflitos de tipagem do SDK
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const supabaseMock = {
  // --- CLIENTES ---
  async getClientes(): Promise<Cliente[]> {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .order('nome', { ascending: true });
    
    if (error) {
      console.error('Erro Supabase getClientes:', error);
      throw error;
    }
    return (data as any) || [];
  },
  
  async createCliente(cliente: Omit<Cliente, 'id' | 'created_at' | 'updated_at'>): Promise<Cliente> {
    const { data, error } = await supabase
      .from('clientes')
      .insert(cliente as any)
      .select()
      .single();

    if (error) {
      console.error('Erro Supabase createCliente:', error);
      throw error;
    }
    return data as any;
  },

  async updateCliente(id: string, updates: Partial<Cliente>): Promise<Cliente> {
    const { data, error } = await supabase
      .from('clientes')
      .update(updates as any)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro Supabase updateCliente:', error);
      throw error;
    }
    return data as any;
  },

  async deleteCliente(id: string): Promise<void> {
    const { error } = await supabase
      .from('clientes')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro Supabase deleteCliente:', error);
      throw error;
    }
  },

  // --- CONTRATOS ---
  async getContratos(): Promise<Contrato[]> {
    const { data, error } = await supabase
      .from('contratos')
      .select('*');

    if (error) {
      console.error('Erro Supabase getContratos:', error);
      throw error;
    }
    return (data as any) || [];
  },

  async getContratosByCliente(clienteId: string): Promise<Contrato[]> {
    const { data, error } = await supabase
      .from('contratos')
      .select('*')
      .eq('cliente_id', clienteId);

    if (error) {
      console.error('Erro Supabase getContratosByCliente:', error);
      throw error;
    }
    return (data as any) || [];
  },

  async createContrato(contrato: Omit<Contrato, 'id' | 'created_at' | 'updated_at'>): Promise<Contrato> {
    const { data, error } = await supabase
      .from('contratos')
      .insert(contrato as any)
      .select()
      .single();

    if (error) {
      console.error('Erro Supabase createContrato:', error);
      throw error;
    }
    return data as any;
  },

  async updateContrato(id: string, updates: Partial<Contrato>): Promise<Contrato> {
    const { data, error } = await supabase
      .from('contratos')
      .update(updates as any)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro Supabase updateContrato:', error);
      throw error;
    }
    return data as any;
  },

  async deleteContrato(id: string): Promise<void> {
    const { error } = await supabase
      .from('contratos')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro Supabase deleteContrato:', error);
      throw error;
    }
  },

  // --- VISITAS ---
  async getVisitas(): Promise<Visita[]> {
    const { data, error } = await supabase
      .from('visitas')
      .select('*');

    if (error) {
      console.error('Erro Supabase getVisitas:', error);
      throw error;
    }
    return (data as any) || [];
  },

  async createVisita(visita: Omit<Visita, 'id' | 'created_at' | 'updated_at'>): Promise<Visita> {
    const { data, error } = await supabase
      .from('visitas')
      .insert(visita as any)
      .select()
      .single();

    if (error) {
      console.error('Erro Supabase createVisita:', error);
      throw error;
    }
    return data as any;
  },

  async updateVisita(id: string, updates: Partial<Visita>): Promise<Visita> {
    const { data, error } = await supabase
      .from('visitas')
      .update(updates as any)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro Supabase updateVisita:', error);
      throw error;
    }
    return data as any;
  },

  async deleteVisita(id: string): Promise<void> {
    const { error } = await supabase
      .from('visitas')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro Supabase deleteVisita:', error);
      throw error;
    }
  },

  // --- TAREFAS / ENTREGAS ---
  async getTarefas(): Promise<TarefaEntrega[]> {
    const { data, error } = await supabase
      .from('tarefas_entregas')
      .select('*');

    if (error) {
      console.error('Erro Supabase getTarefas:', error);
      throw error;
    }
    return (data as any) || [];
  },

  async createTarefa(tarefa: Omit<TarefaEntrega, 'id' | 'created_at' | 'updated_at'>): Promise<TarefaEntrega> {
    const { data, error } = await supabase
      .from('tarefas_entregas')
      .insert(tarefa as any)
      .select()
      .single();

    if (error) {
      console.error('Erro Supabase createTarefa:', error);
      throw error;
    }
    return data as any;
  },

  async updateTarefa(id: string, updates: Partial<TarefaEntrega>): Promise<TarefaEntrega> {
    const { data, error } = await supabase
      .from('tarefas_entregas')
      .update(updates as any)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro Supabase updateTarefa:', error);
      throw error;
    }
    return data as any;
  },

  async deleteTarefa(id: string): Promise<void> {
    const { error } = await supabase
      .from('tarefas_entregas')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro Supabase deleteTarefa:', error);
      throw error;
    }
  },

  // --- LOG INTERACOES ---
  async getLogs(): Promise<LogInteracao[]> {
    const { data, error } = await supabase
      .from('log_interacoes')
      .select('*');

    if (error) {
      console.error('Erro Supabase getLogs:', error);
      throw error;
    }
    return (data as any) || [];
  },

  async createLog(log: Omit<LogInteracao, 'id' | 'created_at'>): Promise<LogInteracao> {
    const { data, error } = await supabase
      .from('log_interacoes')
      .insert(log as any)
      .select()
      .single();

    if (error) {
      console.error('Erro Supabase createLog:', error);
      throw error;
    }
    return data as any;
  },

  async deleteLog(id: string): Promise<void> {
    const { error } = await supabase
      .from('log_interacoes')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro Supabase deleteLog:', error);
      throw error;
    }
  }
};
