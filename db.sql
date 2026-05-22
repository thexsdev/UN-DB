-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.clientes (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  nome character varying NOT NULL,
  tipo_instituicao character varying,
  responsavel character varying,
  telefone_contato character varying,
  endereco text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT clientes_pkey PRIMARY KEY (id)
);
CREATE TABLE public.contratos (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  cliente_id uuid NOT NULL,
  tipo_cobranca character varying NOT NULL,
  valor numeric,
  data_inicio date NOT NULL,
  data_fim date,
  status character varying DEFAULT 'ATIVO'::character varying,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT contratos_pkey PRIMARY KEY (id),
  CONSTRAINT contratos_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id)
);
CREATE TABLE public.log_interacoes (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  cliente_id uuid,
  remetente character varying NOT NULL,
  conteudo text NOT NULL,
  metadados jsonb,
  data_interacao timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT log_interacoes_pkey PRIMARY KEY (id),
  CONSTRAINT log_interacoes_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id)
);
CREATE TABLE public.tarefas_entregas (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  cliente_id uuid NOT NULL,
  visita_id uuid,
  titulo character varying NOT NULL,
  descricao text,
  data_limite timestamp with time zone NOT NULL,
  status character varying DEFAULT 'PENDENTE'::character varying,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT tarefas_entregas_pkey PRIMARY KEY (id),
  CONSTRAINT tarefas_entregas_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id),
  CONSTRAINT tarefas_entregas_visita_id_fkey FOREIGN KEY (visita_id) REFERENCES public.visitas(id)
);
CREATE TABLE public.visitas (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  cliente_id uuid NOT NULL,
  data_visita timestamp with time zone NOT NULL,
  status character varying DEFAULT 'AGENDADA'::character varying,
  observacoes_campo text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT visitas_pkey PRIMARY KEY (id),
  CONSTRAINT visitas_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id)
);