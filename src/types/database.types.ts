export interface Cliente {
  id: string;
  nome: string;
  tipo_instituicao: string | null;
  responsavel: string | null;
  telefone_contato: string | null;
  endereco: string | null;
  created_at: string;
  updated_at: string;
}

export interface Contrato {
  id: string;
  cliente_id: string;
  tipo_cobranca: string;
  valor: number | null;
  data_inicio: string;
  data_fim: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface LogInteracao {
  id: string;
  cliente_id: string;
  remetente: string;
  conteudo: string;
  metadados: {
    canal?: 'whatsapp' | 'email' | 'reuniao';
    sentimento?: 'positivo' | 'neutro' | 'risco';
    resumo_ia?: string;
    topicos?: string[];
  } | null;
  data_interacao: string;
  created_at: string;
}

export interface TarefaEntrega {
  id: string;
  cliente_id: string;
  visita_id: string | null;
  titulo: string;
  descricao: string | null;
  data_limite: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Visita {
  id: string;
  cliente_id: string;
  data_visita: string;
  status: string;
  observacoes_campo: string | null;
  created_at: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      clientes: {
        Row: Cliente;
        Insert: Omit<Cliente, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Cliente, 'id'>>;
      };
      contratos: {
        Row: Contrato;
        Insert: Omit<Contrato, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Contrato, 'id'>>;
      };
      visitas: {
        Row: Visita;
        Insert: Omit<Visita, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Visita, 'id'>>;
      };
      tarefas_entregas: {
        Row: TarefaEntrega;
        Insert: Omit<TarefaEntrega, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<TarefaEntrega, 'id'>>;
      };
      log_interacoes: {
        Row: LogInteracao;
        Insert: Omit<LogInteracao, 'id' | 'created_at'>;
        Update: Partial<Omit<LogInteracao, 'id'>>;
      };
    };
  };
}
