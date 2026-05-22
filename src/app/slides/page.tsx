'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  ArrowRight, 
  Maximize2, 
  Database, 
  MessageSquare, 
  Network, 
  Users, 
  Layers, 
  ArrowUpRight, 
  TrendingUp, 
  AlertTriangle, 
  X, 
  HelpCircle,
  CheckCircle2
} from 'lucide-react';
import Button from '@/components/ui/button';

// Definição dos slides e seus respectivos tempos ideais e roteiros falados
const SLIDES_CONFIG = [
  {
    title: 'Capa',
    duration: 40,
    roteiro: 'Apresente o projeto da AM Consultorias para a cadeira de Banco de Dados. Introduza o Adriano, a Economia do Cuidado, o problema do crescimento rápido e o gargalo gerencial causado por anotações em papel ou planilhas avulsas.',
  },
  {
    title: 'Dado Social',
    duration: 35,
    roteiro: 'Apresente os dados de envelhecimento populacional acelerado do Censo IBGE 2022. Explique a gravidade e o risco social da falta de organização de dados na Economia do Cuidado (asilos e CAPS), onde erros colocam vidas em risco direta e fisicamente.',
  },
  {
    title: 'Modelo de Dados',
    duration: 45,
    roteiro: 'Explique o coração da modelagem relacional de 5 tabelas no Supabase (PostgreSQL). Destaque a separação clara de visitas (evento físico) e tarefas/entregas (obrigação de prazo) e o uso do tipo JSONB na tabela de logs para guardar inteligência do WhatsApp.',
  },
  {
    title: 'Arquitetura',
    duration: 45,
    roteiro: 'Apresente a engrenagem do Estagiário de Bolso. Explique o fluxo completo de mensagens ou áudios via WhatsApp (Evolution API) que são recebidos pelo n8n, transcritos pelo Gemini 2.5, processados com o agente de IA Gemini 3.5 e gravados no Supabase.',
  },
  {
    title: 'Demonstração',
    duration: 40,
    roteiro: 'Mostre as imagens reais do projeto. Explique a facilidade do Adriano ao enviar áudio no carro após a visita de campo e ver a Torre de Logs do dashboard atualizar em tempo real, com a classificação automática de sentimentos de Risco (vermelho) ou Positivo (verde).',
  },
  {
    title: 'Conclusão',
    duration: 20,
    roteiro: 'Conclua refletindo sobre o aprendizado da equipe ao transformar áudios não estruturados em relacionamentos rígidos. Enfatize o papel do Banco de Dados como uma infraestrutura de proteção social real. Agradeça a atenção e abra para perguntas.',
  }
];

export default function SlidesPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeDERTable, setActiveDERTable] = useState<string | null>(null);
  const [activeArchitectureTab, setActiveArchitectureTab] = useState<'conceptual' | 'full' | 'agent' | 'webhook'>('full');
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  
  // Referência do Contêiner para Tela Cheia
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Monitora alterações de tela cheia nativas (como a tecla ESC) e redimensionamentos (ex: F11)
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    const handleResize = () => {
      // Verifica se a janela ocupa toda a largura e altura da tela (útil para F11)
      const isWindowFullscreen = 
        window.innerWidth === window.screen.width && 
        window.innerHeight === window.screen.height;
      setIsFullscreen(!!document.fullscreenElement || isWindowFullscreen);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    window.addEventListener('resize', handleResize);
    
    // Executa verificação inicial
    handleResize();

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;
    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error("Erro ao alternar tela cheia:", err);
    }
  };
  
  // Efeitos de controle de teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft' || e.key === 'Backspace') {
        e.preventDefault();
        prevSlide();
      } else if (e.key === 'Escape') {
        // Se estiver em fullscreen, deixa o navegador lidar com a saída, se não estiver, volta pro painel
        if (!document.fullscreenElement) {
          window.location.href = '/';
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide]);

  const nextSlide = () => {
    if (currentSlide < SLIDES_CONFIG.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  return (
    <div ref={containerRef} className="fixed inset-0 z-50 w-screen h-screen bg-slate-50 text-slate-900 flex flex-col justify-between overflow-hidden select-none font-sans">
      
      {/* Decorações Pastel Flutuantes */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -top-1/4 -left-1/4 h-[800px] w-[800px] rounded-full bg-emerald-100/40 blur-[160px] animate-pulse" />
        <div className="absolute -bottom-1/4 -right-1/4 h-[800px] w-[800px] rounded-full bg-indigo-100/40 blur-[160px]" />
      </div>
      {/* ÁREA CENTRAL */}
      <main className="relative z-10 flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* VIEWPORT DO SLIDE (ESTRUTURA 16:9 PROPORCIONAL E ALINHADA) */}
        <div className={`flex-1 flex items-center justify-center relative overflow-hidden transition-all duration-500 ${
          isFullscreen ? 'p-0 bg-slate-50' : 'p-4 sm:p-6'
        }`}>
          <div className={`w-full relative flex flex-col justify-between backdrop-blur-xl transition-all duration-500 ${
            isFullscreen 
              ? 'w-full h-full rounded-none border-none p-6 sm:p-10 md:p-16 lg:p-20 bg-slate-50 overflow-y-auto' 
              : 'max-w-6xl w-full aspect-auto md:aspect-[16/9] rounded-3xl bg-white border border-slate-100 shadow-2xl shadow-slate-200/50 p-5 pb-24 md:p-14 overflow-y-auto md:overflow-hidden'
          }`}>
            
            {/* Background Grid no Slide */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-50/40 via-white/0 to-emerald-50/30 pointer-events-none" />
            
            {/* SLIDE 1: CAPA */}
            {currentSlide === 0 && (
              <div className="flex-1 flex flex-col justify-between relative z-10 animate-fade-in">
                <div className={`${isFullscreen ? 'space-y-6 md:space-y-8 my-auto' : 'space-y-3 sm:space-y-4'}`}>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`font-extrabold tracking-widest text-emerald-700 uppercase bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full shadow-sm ${
                      isFullscreen ? 'text-[10px] md:text-xs px-3 md:px-4 py-1 md:py-1.5' : 'text-[9px] sm:text-[10px]'
                    }`}>
                      PjBL ACADÊMICO E COMERCIAL
                    </span>
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-300 hidden sm:inline" />
                    <span className={`font-bold text-slate-500 uppercase tracking-wider ${
                      isFullscreen ? 'text-[10px] md:text-xs' : 'text-[9px] sm:text-[10px]'
                    }`}>
                      Cadeira de Banco de Dados
                    </span>
                  </div>
                  <h2 className={`font-extrabold tracking-tight text-slate-900 leading-tight ${
                    isFullscreen ? 'text-4xl md:text-6xl' : 'text-2xl sm:text-4xl md:text-6xl'
                  }`}>
                    AM Consultorias: <br />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-red-500 to-red-600">
                      Economia do Cuidado
                    </span>
                  </h2>
                  <p className={`text-slate-600 max-w-4xl font-medium leading-relaxed ${
                    isFullscreen ? 'text-base md:text-xl lg:text-2xl' : 'text-xs sm:text-sm md:text-lg'
                  }`}>
                    Como a modelagem relacional de banco de dados e a Inteligência Artificial automatizada mitigam riscos de integridade e protegem vidas humanas vulneráveis.
                  </p>
                </div>

                <div className={`grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-3 border-t border-slate-100 pt-4 sm:pt-8 ${
                  isFullscreen ? 'mt-8 md:mt-12 pb-6 md:pb-12 gap-8 md:gap-10' : 'mt-3 sm:mt-4'
                }`}>
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className={`flex items-center justify-center rounded-xl bg-slate-50 border border-slate-100 text-indigo-600 shadow-sm hover:shadow-md transition-all ${
                      isFullscreen ? 'h-12 w-12 md:h-16 md:w-16' : 'h-9 w-9 sm:h-10 sm:w-10'
                    }`}>
                      <Users className={`${isFullscreen ? 'h-6 w-6 md:h-8 md:w-8' : 'h-4 w-4 sm:h-5 sm:w-5'}`} />
                    </div>
                    <div>
                      <p className={`font-bold text-slate-500 uppercase tracking-widest ${
                        isFullscreen ? 'text-[9px] md:text-xs' : 'text-[8px] sm:text-[9px]'
                      }`}>Apoio de Negócio</p>
                      <h4 className={`font-extrabold text-slate-800 mt-0.5 ${
                        isFullscreen ? 'text-sm md:text-base' : 'text-[11px] sm:text-xs'
                      }`}>Adriano (AM Consultorias)</h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className={`flex items-center justify-center rounded-xl bg-slate-50 border border-slate-100 text-emerald-600 shadow-sm hover:shadow-md transition-all ${
                      isFullscreen ? 'h-12 w-12 md:h-16 md:w-16 animate-pulse' : 'h-9 w-9 sm:h-10 sm:w-10'
                    }`}>
                      <Database className={`${isFullscreen ? 'h-6 w-6 md:h-8 md:w-8 animate-pulse' : 'h-4 w-4 sm:h-5 sm:w-5'}`} />
                    </div>
                    <div>
                      <p className={`font-bold text-slate-500 uppercase tracking-widest ${
                        isFullscreen ? 'text-[9px] md:text-xs' : 'text-[8px] sm:text-[9px]'
                      }`}>Orientação Acadêmica</p>
                      <h4 className={`font-extrabold text-slate-800 mt-0.5 ${
                        isFullscreen ? 'text-sm md:text-base' : 'text-[11px] sm:text-xs'
                      }`}>Prof. Felipe Gomes Barbosa</h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className={`flex items-center justify-center rounded-xl bg-slate-50 border border-slate-100 text-sky-600 shadow-sm hover:shadow-md transition-all ${
                      isFullscreen ? 'h-12 w-12 md:h-16 md:w-16' : 'h-9 w-9 sm:h-10 sm:w-10'
                    }`}>
                      <Network className={`${isFullscreen ? 'h-6 w-6 md:h-8 md:w-8' : 'h-4 w-4 sm:h-5 sm:w-5'}`} />
                    </div>
                    <div>
                      <p className={`font-bold text-slate-500 uppercase tracking-widest ${
                        isFullscreen ? 'text-[9px] md:text-xs' : 'text-[8px] sm:text-[9px]'
                      }`}>Instituição de Ensino</p>
                      <h4 className={`font-extrabold text-slate-800 mt-0.5 ${
                        isFullscreen ? 'text-sm md:text-base' : 'text-[11px] sm:text-xs'
                      }`}>UNDB - ES03BN (2026.1)</h4>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SLIDE 2: DADO SOCIAL & RISCO */}
            {currentSlide === 1 && (
              <div className="flex-1 flex flex-col justify-between relative z-10 animate-fade-in">
                <div className={`${isFullscreen ? 'space-y-4' : 'space-y-1.5 sm:space-y-2'}`}>
                  <div className="flex items-center gap-2">
                    <span className={`font-extrabold tracking-widest text-indigo-700 uppercase bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full ${
                      isFullscreen ? 'text-xs' : 'text-[9px] sm:text-[10px]'
                    }`}>
                      CONTEXTO E DOR SOCIAL
                    </span>
                  </div>
                  <h2 className={`font-extrabold tracking-tight text-slate-900 ${
                    isFullscreen ? 'text-3xl md:text-5xl lg:text-6xl' : 'text-lg sm:text-3xl md:text-4xl'
                  }`}>
                    O Envelhecimento Populacional e a Pressão Gerencial
                  </h2>
                </div>

                <div className={`grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 my-auto ${
                  isFullscreen ? 'py-6 md:py-10 gap-8 md:gap-10' : 'py-2'
                }`}>
                  {/* Bloco Estatístico IBGE */}
                  <div className={`bg-slate-50 border border-slate-100 rounded-2xl flex flex-col justify-center relative overflow-hidden group hover:border-slate-200 hover:shadow-md transition-all duration-300 ${
                    isFullscreen ? 'p-6 md:p-10' : 'p-4 sm:p-6'
                  }`}>
                    <div className="absolute top-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-400 w-full" />
                    <div className="flex items-baseline gap-2">
                      <span className={`font-black text-emerald-600 tracking-tighter animate-pulse ${
                        isFullscreen ? 'text-5xl md:text-7xl lg:text-8xl' : 'text-3xl sm:text-5xl md:text-6xl'
                      }`}>+57,4%</span>
                      <TrendingUp className={`text-emerald-600 ${isFullscreen ? 'h-6 w-6 md:h-8 md:w-8' : 'h-4 w-4 sm:h-5 sm:w-5'}`} />
                    </div>
                    <h4 className={`font-bold text-slate-800 ${isFullscreen ? 'text-base md:text-lg mt-3 md:mt-5' : 'text-xs sm:text-sm mt-2 sm:mt-3'}`}>Crescimento de Idosos 65+ anos</h4>
                    <p className={`text-slate-600 leading-relaxed ${isFullscreen ? 'text-xs md:text-sm lg:text-base mt-1.5 md:mt-2' : 'text-[10px] sm:text-[11px] mt-1'}`}>
                      Segundo o Censo IBGE 2022, o número de idosos atingiu 22,1 milhões no Brasil. Essa explosão populacional gera uma demanda gigantesca por lares de idosos (ILPIs).
                    </p>
                  </div>

                  {/* Bloco de Risco de Vida */}
                  <div className={`bg-slate-50 border border-slate-100 rounded-2xl flex flex-col justify-center relative overflow-hidden group hover:border-slate-200 hover:shadow-md transition-all duration-300 ${
                    isFullscreen ? 'p-6 md:p-10' : 'p-4 sm:p-6'
                  }`}>
                    <div className="absolute top-0 right-0 h-1 bg-gradient-to-r from-rose-500 to-amber-500 w-full" />
                    <div className="flex items-center gap-2 sm:gap-3 text-rose-600">
                      <AlertTriangle className={`${isFullscreen ? 'h-8 w-8 md:h-12 md:w-12' : 'h-5 w-5 sm:h-8 sm:w-8'} animate-bounce`} />
                      <span className={`font-extrabold uppercase tracking-wider ${isFullscreen ? 'text-base md:text-xl' : 'text-sm sm:text-lg'}`}>Alto Risco Operacional</span>
                    </div>
                    <h4 className={`font-bold text-slate-800 ${isFullscreen ? 'text-base md:text-lg mt-3 md:mt-5' : 'text-xs sm:text-sm mt-2 sm:mt-3'}`}>Onde um erro de dados custa vidas</h4>
                    <p className={`text-slate-600 leading-relaxed ${isFullscreen ? 'text-xs md:text-sm lg:text-base mt-1.5 md:mt-2' : 'text-[10px] sm:text-[11px] mt-1'}`}>
                      Diferente de e-commerces, falhas de dados na Economia do Cuidado não geram só prejuízo financeiro. Esquecer um prazo ou uma inspeção significa colocar a integridade física de idosos e crianças em risco.
                    </p>
                  </div>
                </div>

                <div className={`text-center font-semibold text-slate-600 bg-slate-50 border border-slate-100 rounded-xl ${
                  isFullscreen ? 'py-4 text-sm mt-6' : 'py-2 text-xs'
                }`}>
                  A modelagem do Banco de Dados atua como uma verdadeira <strong className="text-emerald-600">Rede de Segurança Social</strong>.
                </div>
              </div>
            )}

            {/* SLIDE 3: MODELAGEM DE DADOS (DER INTERATIVO) */}
            {currentSlide === 2 && (
              <div className="flex-1 flex flex-col justify-between relative z-10 animate-fade-in">
                <div className={`${isFullscreen ? 'space-y-4' : 'space-y-1.5 sm:space-y-2'}`}>
                  <div className="flex items-center gap-2">
                    <span className={`font-extrabold tracking-widest text-emerald-700 uppercase bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full ${
                      isFullscreen ? 'text-xs' : 'text-[9px] sm:text-[10px]'
                    }`}>
                      ESTRUTURAÇÃO DO BANCO (POSTGRESQL)
                    </span>
                  </div>
                  <h2 className={`font-extrabold tracking-tight text-slate-900 flex flex-wrap items-center gap-2 sm:gap-3 ${
                    isFullscreen ? 'text-3xl md:text-5xl lg:text-6xl' : 'text-lg sm:text-3xl md:text-4xl'
                  }`}>
                    O Modelo Relacional de Dados
                    <span className={`text-slate-500 font-semibold tracking-normal normal-case ${isFullscreen ? 'text-xs' : 'text-[10px] sm:text-xs'}`}>
                      (Passe o mouse ou toque nas tabelas)
                    </span>
                  </h2>
                </div>

                {/* VISUALIZADOR DER INTERATIVO */}
                <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 my-auto relative gap-4 ${
                  isFullscreen ? 'gap-6 py-4 md:py-8' : 'py-3'
                }`}>
                  {/* Clientes */}
                  <div 
                    onMouseEnter={() => setActiveDERTable('clientes')}
                    onMouseLeave={() => setActiveDERTable(null)}
                    onClick={() => setActiveDERTable('clientes')}
                    className={`border rounded-xl bg-white transition-all duration-300 cursor-pointer ${
                      isFullscreen ? 'p-6 lg:p-7 scale-[1.02] hover:scale-[1.05]' : 'p-3'
                    } ${
                      activeDERTable === 'clientes' 
                        ? 'border-emerald-500 shadow-[0_10px_25px_rgba(16,185,129,0.08)] bg-white transform scale-[1.03]' 
                        : activeDERTable ? 'border-slate-100 opacity-40' : 'border-slate-200 shadow-sm'
                    }`}
                  >
                    <div className={`flex items-center justify-between border-b border-slate-100 ${isFullscreen ? 'pb-3 mb-3' : 'pb-1.5 mb-1.5'}`}>
                      <span className={`font-extrabold text-emerald-600 uppercase tracking-wider ${isFullscreen ? 'text-xs md:text-sm lg:text-base font-black' : 'text-xs sm:text-[10px]'}`}>clientes</span>
                      <Database className={`${isFullscreen ? 'h-4 w-4 text-emerald-500/80' : 'h-3 w-3 text-slate-500'}`} />
                    </div>
                    <div className={`space-y-1.5 font-mono ${isFullscreen ? 'text-xs lg:text-[13px] xl:text-[14px] space-y-2.5' : 'text-xs sm:text-[8px] space-y-1.5 sm:space-y-1'}`}>
                      <div className="text-slate-700 font-bold"><span className="text-yellow-600">id</span> uuid PK</div>
                      <div className="text-slate-500"><span className="font-semibold text-slate-700">nome</span> varchar</div>
                      <div className="text-slate-500"><span className="font-semibold text-slate-700">tipo_instituicao</span></div>
                      <div className="text-slate-500"><span className="font-semibold text-slate-700">responsavel</span></div>
                      <div className="text-slate-500"><span className="font-semibold text-slate-700">telefone_contato</span></div>
                      <div className="text-slate-500"><span className="font-semibold text-slate-700">endereco</span> text</div>
                    </div>
                  </div>

                  {/* Contratos */}
                  <div 
                    onMouseEnter={() => setActiveDERTable('contratos')}
                    onMouseLeave={() => setActiveDERTable(null)}
                    onClick={() => setActiveDERTable('contratos')}
                    className={`border rounded-xl bg-white transition-all duration-300 cursor-pointer ${
                      isFullscreen ? 'p-6 lg:p-7 scale-[1.02] hover:scale-[1.05]' : 'p-3'
                    } ${
                      activeDERTable === 'contratos' || activeDERTable === 'clientes'
                        ? 'border-indigo-500 shadow-[0_10px_25px_rgba(99,102,241,0.08)] bg-white transform scale-[1.03]' 
                        : activeDERTable ? 'border-slate-100 opacity-40' : 'border-slate-200 shadow-sm'
                    }`}
                  >
                    <div className={`flex items-center justify-between border-b border-slate-100 ${isFullscreen ? 'pb-3 mb-3' : 'pb-1.5 mb-1.5'}`}>
                      <span className={`font-extrabold text-indigo-600 uppercase tracking-wider ${isFullscreen ? 'text-xs md:text-sm lg:text-base font-black' : 'text-xs sm:text-[10px]'}`}>contratos</span>
                      <Database className={`${isFullscreen ? 'h-4 w-4 text-indigo-400/80' : 'h-3 w-3 text-slate-500'}`} />
                    </div>
                    <div className={`space-y-1.5 font-mono ${isFullscreen ? 'text-xs lg:text-[13px] xl:text-[14px] space-y-2.5' : 'text-xs sm:text-[8px] space-y-1.5 sm:space-y-1'}`}>
                      <div className="text-slate-700 font-bold"><span className="text-yellow-600">id</span> uuid PK</div>
                      <div className="text-indigo-600 font-semibold"><span className="text-indigo-500">cliente_id</span> uuid FK</div>
                      <div className="text-slate-500"><span className="font-semibold text-slate-700">tipo_cobranca</span></div>
                      <div className="text-slate-500"><span className="font-semibold text-slate-700">valor</span> numeric</div>
                      <div className="text-slate-500"><span className="font-semibold text-slate-700">data_inicio</span> date</div>
                      <div className="text-slate-500"><span className="font-semibold text-slate-700">status</span> varchar</div>
                    </div>
                  </div>

                  {/* Visitas */}
                  <div 
                    onMouseEnter={() => setActiveDERTable('visitas')}
                    onMouseLeave={() => setActiveDERTable(null)}
                    onClick={() => setActiveDERTable('visitas')}
                    className={`border rounded-xl bg-white transition-all duration-300 cursor-pointer ${
                      isFullscreen ? 'p-6 lg:p-7 scale-[1.02] hover:scale-[1.05]' : 'p-3'
                    } ${
                      activeDERTable === 'visitas' || activeDERTable === 'clientes' || activeDERTable === 'tarefas_entregas'
                        ? 'border-sky-500 shadow-[0_10px_25px_rgba(56,189,248,0.08)] bg-white transform scale-[1.03]' 
                        : activeDERTable ? 'border-slate-100 opacity-40' : 'border-slate-200 shadow-sm'
                    }`}
                  >
                    <div className={`flex items-center justify-between border-b border-slate-100 ${isFullscreen ? 'pb-3 mb-3' : 'pb-1.5 mb-1.5'}`}>
                      <span className={`font-extrabold text-sky-600 uppercase tracking-wider ${isFullscreen ? 'text-xs md:text-sm lg:text-base font-black' : 'text-xs sm:text-[10px]'}`}>visitas</span>
                      <Database className={`${isFullscreen ? 'h-4 w-4 text-sky-400/80' : 'h-3 w-3 text-slate-500'}`} />
                    </div>
                    <div className={`space-y-1.5 font-mono ${isFullscreen ? 'text-xs lg:text-[13px] xl:text-[14px] space-y-2.5' : 'text-xs sm:text-[8px] space-y-1.5 sm:space-y-1'}`}>
                      <div className="text-slate-700 font-bold"><span className="text-yellow-600">id</span> uuid PK</div>
                      <div className="text-sky-600 font-semibold"><span className="text-sky-500">cliente_id</span> uuid FK</div>
                      <div className="text-slate-500"><span className="font-semibold text-slate-700">data_visita</span> timestamp</div>
                      <div className="text-slate-500"><span className="font-semibold text-slate-700">status</span> varchar</div>
                      <div className="text-slate-500"><span className="font-semibold text-slate-700">observacoes_campo</span></div>
                    </div>
                  </div>

                  {/* Tarefas e Entregas */}
                  <div 
                    onMouseEnter={() => setActiveDERTable('tarefas_entregas')}
                    onMouseLeave={() => setActiveDERTable(null)}
                    onClick={() => setActiveDERTable('tarefas_entregas')}
                    className={`border rounded-xl bg-white transition-all duration-300 cursor-pointer ${
                      isFullscreen ? 'p-6 lg:p-7 scale-[1.02] hover:scale-[1.05]' : 'p-3'
                    } ${
                      activeDERTable === 'tarefas_entregas' || activeDERTable === 'clientes' || activeDERTable === 'visitas'
                        ? 'border-amber-500 shadow-[0_10px_25px_rgba(245,158,11,0.08)] bg-white transform scale-[1.03]' 
                        : activeDERTable ? 'border-slate-100 opacity-40' : 'border-slate-200 shadow-sm'
                    }`}
                  >
                    <div className={`flex items-center justify-between border-b border-slate-100 ${isFullscreen ? 'pb-3 mb-3' : 'pb-1.5 mb-1.5'}`}>
                      <span className={`font-extrabold text-amber-600 uppercase tracking-wider ${isFullscreen ? 'text-xs md:text-sm lg:text-base font-black' : 'text-xs sm:text-[10px]'}`}>tarefas_entregas</span>
                      <Database className={`${isFullscreen ? 'h-4 w-4 text-amber-400/80' : 'h-3 w-3 text-slate-500'}`} />
                    </div>
                    <div className={`space-y-1.5 font-mono ${isFullscreen ? 'text-xs lg:text-[13px] xl:text-[14px] space-y-2.5' : 'text-xs sm:text-[8px] space-y-1.5 sm:space-y-1'}`}>
                      <div className="text-slate-700 font-bold"><span className="text-yellow-600">id</span> uuid PK</div>
                      <div className="text-emerald-600 font-semibold"><span className="text-emerald-500">cliente_id</span> uuid FK</div>
                      <div className="text-sky-600 font-semibold"><span className="text-sky-500">visita_id</span> uuid FK</div>
                      <div className="text-slate-500"><span className="font-semibold text-slate-700">titulo</span> varchar</div>
                      <div className="text-slate-500"><span className="font-semibold text-slate-700">descricao</span> text</div>
                      <div className="text-slate-500"><span className="font-semibold text-slate-700">data_limite</span></div>
                    </div>
                  </div>

                  {/* Log Interacoes */}
                  <div 
                    onMouseEnter={() => setActiveDERTable('log_interacoes')}
                    onMouseLeave={() => setActiveDERTable(null)}
                    onClick={() => setActiveDERTable('log_interacoes')}
                    className={`border rounded-xl bg-white transition-all duration-300 cursor-pointer ${
                      isFullscreen ? 'p-6 lg:p-7 scale-[1.02] hover:scale-[1.05]' : 'p-3'
                    } ${
                      activeDERTable === 'log_interacoes' || activeDERTable === 'clientes'
                        ? 'border-purple-500 shadow-[0_10px_25px_rgba(192,132,252,0.08)] bg-white transform scale-[1.03]' 
                        : activeDERTable ? 'border-slate-100 opacity-40' : 'border-slate-200 shadow-sm'
                    }`}
                  >
                    <div className={`flex items-center justify-between border-b border-slate-100 ${isFullscreen ? 'pb-3 mb-3' : 'pb-1.5 mb-1.5'}`}>
                      <span className={`font-extrabold text-purple-600 uppercase tracking-wider ${isFullscreen ? 'text-xs md:text-sm lg:text-base font-black' : 'text-xs sm:text-[10px]'}`}>log_interacoes</span>
                      <Database className={`${isFullscreen ? 'h-4 w-4 text-purple-400/80' : 'h-3 w-3 text-slate-500'}`} />
                    </div>
                    <div className={`space-y-1.5 font-mono ${isFullscreen ? 'text-xs lg:text-[13px] xl:text-[14px] space-y-2.5' : 'text-xs sm:text-[8px] space-y-1.5 sm:space-y-1'}`}>
                      <div className="text-slate-700 font-bold"><span className="text-yellow-600">id</span> uuid PK</div>
                      <div className="text-purple-600 font-semibold"><span className="text-purple-500">cliente_id</span> uuid FK</div>
                      <div className="text-slate-500"><span className="font-semibold text-slate-700">remetente</span> varchar</div>
                      <div className="text-slate-500"><span className="font-semibold text-slate-700">conteudo</span> text</div>
                      <div className="text-fuchsia-700 font-bold bg-fuchsia-50 border border-fuchsia-100 px-1.5 py-0.5 rounded">metadados jsonb</div>
                      <div className="text-slate-500"><span className="font-semibold text-slate-700">data_interacao</span> timestamp</div>
                    </div>
                  </div>

                </div>

                <div className={`flex items-center justify-between gap-6 border-t border-slate-100 ${
                  isFullscreen ? 'pt-6 mt-6 text-sm' : 'pt-4 mt-2 text-xs'
                }`}>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-semibold text-slate-600">Tabela clientes no núcleo (Relacionamentos 1:N).</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-fuchsia-500 animate-pulse" />
                    <span className="font-bold text-fuchsia-700">Estrutura JSONB flexível para rastreabilidade de conversas e IA.</span>
                  </div>
                </div>
              </div>
            )}

            {/* SLIDE 4: ARQUITETURA TECNOLÓGICA */}
            {currentSlide === 3 && (
              <div className="flex-1 flex flex-col justify-between relative z-10 animate-fade-in">
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                  <div className={`${isFullscreen ? 'space-y-4' : 'space-y-1.5 sm:space-y-2'}`}>
                    <div className="flex items-center gap-2">
                      <span className={`font-extrabold tracking-widest text-indigo-700 uppercase bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full ${
                        isFullscreen ? 'text-xs' : 'text-[9px] sm:text-[10px]'
                      }`}>
                        ENGENHARIA E AUTOMACÃO
                      </span>
                    </div>
                    <h2 className={`font-extrabold tracking-tight text-slate-900 ${
                      isFullscreen ? 'text-3xl md:text-5xl lg:text-6xl' : 'text-lg sm:text-3xl md:text-4xl'
                    }`}>
                      A Engrenagem do "Estagiário de Bolso"
                    </h2>
                  </div>

                  {/* TABS INTERATIVAS */}
                  <div className="flex flex-wrap items-center gap-1.5 bg-slate-100/80 border border-slate-200/50 px-2 py-1.5 rounded-xl self-start">
                    <button 
                      onClick={() => setActiveArchitectureTab('conceptual')}
                      className={`px-2.5 py-1.5 rounded-lg text-[10px] sm:text-xs font-bold transition-all duration-300 ${
                        activeArchitectureTab === 'conceptual'
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/80 shadow-sm'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      Conceitual
                    </button>
                    <button 
                      onClick={() => setActiveArchitectureTab('full')}
                      className={`px-2.5 py-1.5 rounded-lg text-[10px] sm:text-xs font-bold transition-all duration-300 ${
                        activeArchitectureTab === 'full'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-sm'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      Fluxo Real (Geral)
                    </button>
                    <button 
                      onClick={() => setActiveArchitectureTab('agent')}
                      className={`px-2.5 py-1.5 rounded-lg text-[10px] sm:text-xs font-bold transition-all duration-300 ${
                        activeArchitectureTab === 'agent'
                          ? 'bg-sky-50 text-sky-700 border border-sky-200/80 shadow-sm'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      AI Agent & Tools
                    </button>
                    <button 
                      onClick={() => setActiveArchitectureTab('webhook')}
                      className={`px-2.5 py-1.5 rounded-lg text-[10px] sm:text-xs font-bold transition-all duration-300 ${
                        activeArchitectureTab === 'webhook'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200/80 shadow-sm'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      Triagem & Entrada
                    </button>
                  </div>
                </div>

                {/* CONTEÚDO BASEADO NA TAB SELECIONADA */}
                <div className="my-auto">
                  {activeArchitectureTab === 'conceptual' && (
                    <div className={`grid grid-cols-1 md:grid-cols-5 items-center justify-center gap-4 md:gap-2 ${
                      isFullscreen ? 'py-12 gap-6' : 'py-3'
                    }`}>
                      {/* 1. WhatsApp */}
                      <div className={`flex flex-col items-center bg-slate-50 border border-slate-100 shadow-sm rounded-2xl text-center transition-all ${
                        isFullscreen ? 'p-6' : 'p-3 sm:p-4'
                      }`}>
                        <div className={`flex items-center justify-center rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 shadow-sm transition-all ${
                          isFullscreen ? 'h-16 w-16 mb-4' : 'h-10 w-10 sm:h-12 sm:w-12 mb-2 sm:mb-3'
                        }`}>
                          <MessageSquare className={`${isFullscreen ? 'h-8 w-8' : 'h-5 w-5 sm:h-6 sm:w-6'}`} />
                        </div>
                        <span className={`font-extrabold text-slate-700 tracking-wider uppercase ${isFullscreen ? 'text-xs' : 'text-[9px] sm:text-[10px]'}`}>WhatsApp</span>
                        <p className={`text-slate-500 mt-1 leading-relaxed ${isFullscreen ? 'text-[10px]' : 'text-[8px]'}`}>Evolution API capta o áudio do Adriano</p>
                      </div>

                      {/* Conector */}
                      <div className="hidden md:flex flex-col items-center text-slate-300">
                        <span className={`font-mono text-slate-500 tracking-wider ${isFullscreen ? 'text-[10px]' : 'text-[8px]'}`}>Webhook</span>
                        <div className={`h-0.5 w-full bg-gradient-to-r from-emerald-500 to-indigo-500 relative ${isFullscreen ? 'mt-3' : 'mt-2'}`}>
                          <div className="absolute top-[-3px] left-0 h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
                        </div>
                      </div>

                      {/* 2. n8n Core */}
                      <div className={`flex flex-col items-center bg-slate-50 border border-slate-100 shadow-sm rounded-2xl text-center relative overflow-hidden transition-all ${
                        isFullscreen ? 'p-6' : 'p-3 sm:p-4'
                      }`}>
                        <div className="absolute top-0 left-0 right-0 h-1 bg-indigo-500" />
                        <div className={`flex items-center justify-center rounded-full bg-indigo-50 border border-indigo-200 text-indigo-600 shadow-sm transition-all ${
                          isFullscreen ? 'h-16 w-16 mb-4' : 'h-10 w-10 sm:h-12 sm:w-12 mb-2 sm:mb-3'
                        }`}>
                          <Layers className={`animate-pulse ${isFullscreen ? 'h-8 w-8' : 'h-5 w-5 sm:h-6 sm:w-6'}`} />
                        </div>
                        <span className={`font-extrabold text-slate-700 tracking-wider uppercase ${isFullscreen ? 'text-xs' : 'text-[9px] sm:text-[10px]'}`}>n8n Workflow</span>
                        <p className={`text-slate-500 mt-1 leading-relaxed ${isFullscreen ? 'text-[10px]' : 'text-[8px]'}`}>Gerencia o fluxo e orquestra a IA</p>
                      </div>

                      {/* Conector */}
                      <div className="hidden md:flex flex-col items-center text-slate-300">
                        <span className={`font-mono text-slate-500 tracking-wider ${isFullscreen ? 'text-[10px]' : 'text-[8px]'}`}>Query Tools</span>
                        <div className={`h-0.5 w-full bg-gradient-to-r from-indigo-500 to-sky-500 relative ${isFullscreen ? 'mt-3' : 'mt-2'}`}>
                          <div className="absolute top-[-3px] left-1/2 h-2.5 w-2.5 rounded-full bg-indigo-400 animate-ping" />
                        </div>
                      </div>

                      {/* 3. Gemini / Supabase */}
                      <div className={`flex flex-col items-center bg-slate-50 border border-slate-100 shadow-sm rounded-2xl text-center relative overflow-hidden transition-all ${
                        isFullscreen ? 'p-6' : 'p-4'
                      }`}>
                        <div className="absolute top-0 left-0 right-0 h-1 bg-sky-500" />
                        <div className={`flex items-center justify-center rounded-full bg-sky-50 border border-sky-200 text-sky-600 shadow-sm transition-all ${
                          isFullscreen ? 'h-16 w-16 mb-4' : 'h-12 w-12 mb-3'
                        }`}>
                          <Database className={`${isFullscreen ? 'h-8 w-8' : 'h-6 w-6'}`} />
                        </div>
                        <span className={`font-extrabold text-slate-700 tracking-wider uppercase ${isFullscreen ? 'text-xs' : 'text-[10px]'}`}>Supabase (SQL)</span>
                        <p className={`text-slate-500 mt-1 leading-relaxed ${isFullscreen ? 'text-[10px]' : 'text-[8px]'}`}>Gemini 3.5 interage direto com o Postgres</p>
                      </div>
                    </div>
                  )}

                  {activeArchitectureTab === 'full' && (
                    <div className="flex flex-col items-center justify-center py-2 relative group cursor-zoom-in animate-fade-in" onClick={() => setLightboxImage('/n8n_flow_real_completo.png')}>
                      <div className="w-full bg-white border border-slate-100 rounded-2xl p-3 shadow-lg shadow-slate-200/50 relative overflow-hidden transition-all duration-300 group-hover:border-emerald-200 group-hover:shadow-slate-300/50">
                        <div className="absolute top-2 right-2 z-10 flex gap-2">
                          <span className="text-[9px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded uppercase tracking-wider">Print Real do n8n</span>
                          <span className="p-1 rounded-md bg-slate-50 text-slate-500 group-hover:text-slate-800 border border-slate-200"><Maximize2 className="h-3.5 w-3.5" /></span>
                        </div>
                        <div className="aspect-[21/6] md:aspect-[32/8] w-full rounded-xl overflow-hidden bg-white border border-slate-100 flex items-center justify-center">
                          <img src="/n8n_flow_real_completo.png" alt="Fluxo n8n Completo" className="w-full h-full object-contain filter brightness-[0.98] group-hover:scale-[1.01] transition-all duration-500" />
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 mt-2">Clique na imagem para expandi-la e visualizar os detalhes de cada nó de automação.</span>
                    </div>
                  )}

                  {activeArchitectureTab === 'agent' && (
                    <div className="flex flex-col items-center justify-center py-2 relative group cursor-zoom-in animate-fade-in" onClick={() => setLightboxImage('/n8n_flow_real_agent.png')}>
                      <div className="w-full bg-white border border-slate-100 rounded-2xl p-3 shadow-lg shadow-slate-200/50 relative overflow-hidden transition-all duration-300 group-hover:border-sky-200 group-hover:shadow-slate-300/50">
                        <div className="absolute top-2 right-2 z-10 flex gap-2">
                          <span className="text-[9px] font-extrabold bg-sky-50 text-sky-700 border border-sky-200 px-2 py-0.5 rounded uppercase tracking-wider">AI Agent & Supabase Tools</span>
                          <span className="p-1 rounded-md bg-slate-50 text-slate-500 group-hover:text-slate-800 border border-slate-200"><Maximize2 className="h-3.5 w-3.5" /></span>
                        </div>
                        <div className="aspect-[21/7] md:aspect-[24/8] w-full rounded-xl overflow-hidden bg-white border border-slate-100 flex items-center justify-center">
                          <img src="/n8n_flow_real_agent.png" alt="AI Agent e Ferramentas" className="w-full h-full object-contain filter brightness-[0.98] group-hover:scale-[1.01] transition-all duration-500" />
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 mt-2">Nó centralizado de IA orquestrando o Gemini Chat Model com 14 ferramentas ligadas direto no PostgreSQL do Supabase.</span>
                    </div>
                  )}

                  {activeArchitectureTab === 'webhook' && (
                    <div className="flex flex-col items-center justify-center py-2 relative group cursor-zoom-in animate-fade-in" onClick={() => setLightboxImage('/n8n_flow_real_inicio.png')}>
                      <div className="w-full bg-white border border-slate-100 rounded-2xl p-3 shadow-lg shadow-slate-200/50 relative overflow-hidden transition-all duration-300 group-hover:border-amber-200 group-hover:shadow-slate-300/50">
                        <div className="absolute top-2 right-2 z-10 flex gap-2">
                          <span className="text-[9px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded uppercase tracking-wider">Triagem de Entrada (Webhook)</span>
                          <span className="p-1 rounded-md bg-slate-50 text-slate-500 group-hover:text-slate-800 border border-slate-200"><Maximize2 className="h-3.5 w-3.5" /></span>
                        </div>
                        <div className="aspect-[21/7] md:aspect-[24/8] w-full rounded-xl overflow-hidden bg-white border border-slate-100 flex items-center justify-center">
                          <img src="/n8n_flow_real_inicio.png" alt="Higienização de Entrada" className="w-full h-full object-contain filter brightness-[0.98] group-hover:scale-[1.01] transition-all duration-500" />
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 mt-2">Webhook recebendo as mensagens da Evolution API, higienizando contatos e roteando atendentes e clientes no banco.</span>
                    </div>
                  )}
                </div>

                <div className={`bg-slate-50 border border-slate-100 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 transition-all ${
                  isFullscreen ? 'p-6 mt-6' : 'p-3 sm:p-4 mt-2'
                }`}>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className={`text-emerald-600 flex-shrink-0 ${isFullscreen ? 'h-6 w-6 md:h-7 md:w-7' : 'h-4 w-4 sm:h-5 sm:w-5'}`} />
                    <p className={`text-slate-600 leading-relaxed font-medium ${isFullscreen ? 'text-xs md:text-sm' : 'text-[9px] sm:text-xs'}`}>
                      {activeArchitectureTab === 'conceptual' && 'O Adriano fala no trânsito -> a IA entende -> a integridade referencial do banco relacional garante o agendamento -> o dashboard atualiza.'}
                      {activeArchitectureTab === 'full' && 'Orquestração horizontal: Webhook tria e higieniza contatos, registra a interação, envia ao Agent com IA que lê/escreve no Supabase e responde via WhatsApp.'}
                      {activeArchitectureTab === 'agent' && 'O AI Agent consome o Gemini e decide autonomamente qual ferramenta SQL (clientes_getAll, tarefas_create, visitas_create, etc.) usar para cumprir o áudio.'}
                      {activeArchitectureTab === 'webhook' && 'Validação em tempo real: verifica IDs de mensagens recebidas, higieniza números com Regex, busca clientes existentes e separa fluxo de atendentes.'}
                    </p>
                  </div>
                  <button 
                    onClick={() => {
                      if (activeArchitectureTab === 'conceptual') setLightboxImage('/n8n_flow_real_completo.png');
                      else if (activeArchitectureTab === 'full') setLightboxImage('/n8n_flow_real_completo.png');
                      else if (activeArchitectureTab === 'agent') setLightboxImage('/n8n_flow_real_agent.png');
                      else if (activeArchitectureTab === 'webhook') setLightboxImage('/n8n_flow_real_inicio.png');
                    }}
                    className={`font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5 shrink-0 transition-all ${
                      isFullscreen ? 'text-xs md:text-sm' : 'text-[9px] sm:text-[10px]'
                    }`}
                  >
                    Ver Imagem Ampliada <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* SLIDE 5: IMAGENS E DEMONSTRAÇÃO DO SISTEMA REAL */}
            {currentSlide === 4 && (
              <div className="flex-1 flex flex-col justify-between relative z-10 animate-fade-in">
                <div className={`${isFullscreen ? 'space-y-4' : 'space-y-2'}`}>
                  <div className="flex items-center gap-2">
                    <span className={`font-extrabold tracking-widest text-emerald-700 uppercase bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full ${
                      isFullscreen ? 'text-xs' : 'text-[10px]'
                    }`}>
                      PITCH VISUAL E FUNCIONAL
                    </span>
                  </div>
                  <h2 className={`font-extrabold tracking-tight text-slate-900 ${
                    isFullscreen ? 'text-4xl md:text-6xl' : 'text-3xl md:text-4xl'
                  }`}>
                    Operação Integrada: Mobile e Dashboard
                  </h2>
                </div>

                <div className={`grid gap-6 md:grid-cols-2 my-auto ${
                  isFullscreen ? 'py-10 gap-10' : 'py-2'
                }`}>
                  
                  {/* Mockup do WhatsApp */}
                  <div className={`bg-white border border-slate-100 rounded-2xl flex flex-col justify-between relative group overflow-hidden transition-all duration-300 hover:border-slate-200 hover:shadow-md cursor-zoom-in ${
                    isFullscreen ? 'p-5' : 'p-3'
                  }`} onClick={() => setLightboxImage('/whatsapp_chat_preview.png')}>
                    <div className={`flex items-center justify-between ${isFullscreen ? 'mb-4' : 'mb-2'}`}>
                      <span className={`font-extrabold text-emerald-600 uppercase tracking-widest flex items-center gap-1.5 ${
                        isFullscreen ? 'text-xs' : 'text-[9px]'
                      }`}>
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Estagiário de Bolso (WhatsApp)
                      </span>
                      <span className="text-[9px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded uppercase tracking-wider">Clique para Ampliar</span>
                    </div>
                    <div className="aspect-[16/10] bg-white rounded-xl relative overflow-hidden border border-slate-100 shadow-inner">
                      <img 
                        src="/whatsapp_chat_preview.png" 
                        alt="WhatsApp Chat Mockup"
                        className="object-cover w-full h-full opacity-90 group-hover:scale-105 transition-all duration-500"
                      />
                    </div>
                  </div>

                  {/* Mockup do Dashboard */}
                  <div className={`bg-white border border-slate-100 rounded-2xl flex flex-col justify-between relative group overflow-hidden transition-all duration-300 hover:border-slate-200 hover:shadow-md cursor-zoom-in ${
                    isFullscreen ? 'p-5' : 'p-3'
                  }`} onClick={() => setLightboxImage('/dashboard_preview.png')}>
                    <div className={`flex items-center justify-between ${isFullscreen ? 'mb-4' : 'mb-2'}`}>
                      <span className={`font-extrabold text-indigo-600 uppercase tracking-widest flex items-center gap-1.5 ${
                        isFullscreen ? 'text-xs' : 'text-[9px]'
                      }`}>
                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
                        Torre de Comando (Next.js)
                      </span>
                      <span className="text-[9px] font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded uppercase tracking-wider">Clique para Ampliar</span>
                    </div>
                    <div className="aspect-[16/10] bg-white rounded-xl relative overflow-hidden border border-slate-100 shadow-inner">
                      <img 
                        src="/dashboard_preview.png" 
                        alt="Dashboard Mockup"
                        className="object-cover w-full h-full opacity-90 group-hover:scale-105 transition-all duration-500"
                      />
                    </div>
                  </div>

                </div>

                <div className={`flex items-center justify-between text-slate-500 border-t border-slate-100 ${
                  isFullscreen ? 'pt-6 mt-6 text-sm' : 'pt-4 mt-2 text-[11px]'
                }`}>
                  <span>Imagens reais simuladas da solução integrada rodando localmente.</span>
                  <Link href="/" target="_blank" className={`font-extrabold text-emerald-700 hover:text-emerald-805 flex items-center gap-1.5 bg-emerald-50 border border-emerald-200/85 hover:bg-emerald-100/70 rounded-xl transition-all duration-300 ${
                    isFullscreen ? 'px-5 py-2.5 text-xs' : 'px-3.5 py-1.5 text-[10px]'
                  }`}>
                    Navegar pelo Dashboard Real <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            )}

            {/* SLIDE 6: REFLEXÃO ACADÊMICA & CONCLUSAO */}
            {currentSlide === 5 && (
              <div className="flex-1 flex flex-col justify-between relative z-10 animate-fade-in">
                <div className={`${isFullscreen ? 'space-y-4' : 'space-y-1.5 sm:space-y-2'}`}>
                  <div className="flex items-center gap-2">
                    <span className={`font-extrabold tracking-widest text-indigo-700 uppercase bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full ${
                      isFullscreen ? 'text-xs' : 'text-[9px] sm:text-[10px]'
                    }`}>
                      REFLEXÃO ACADÊMICA E IMPACTO
                    </span>
                  </div>
                  <h2 className={`font-extrabold tracking-tight text-slate-900 ${
                    isFullscreen ? 'text-3xl md:text-5xl lg:text-6xl' : 'text-lg sm:text-3xl md:text-4xl'
                  }`}>
                    O Banco de Dados como Rede de Segurança
                  </h2>
                </div>

                <div className={`bg-slate-50 border border-slate-100 rounded-2xl my-auto relative overflow-hidden transition-all shadow-sm ${
                  isFullscreen ? 'p-6 md:p-10 space-y-4 md:space-y-6' : 'p-4 sm:p-6 md:p-8 space-y-3 sm:space-y-4'
                }`}>
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-emerald-500 to-indigo-500" />
                  <p className={`text-slate-700 leading-relaxed font-medium transition-all ${
                    isFullscreen ? 'text-base md:text-xl lg:text-2xl' : 'text-xs sm:text-sm md:text-base'
                  }`}>
                    "A nossa maior descoberta acadêmica foi compreender como traduzir dados altamente não estruturados – como os desabafos de coordenadoras de lares de idosos ou anotações apressadas no celular – para a rigidez estruturada de um banco de dados relacional (Supabase/PostgreSQL)."
                  </p>
                  <p className={`text-slate-500 leading-relaxed font-normal italic transition-all ${
                    isFullscreen ? 'text-xs md:text-lg' : 'text-[10px] sm:text-xs md:text-sm'
                  }`}>
                    "Garantir a integridade referencial em uma tabela de tarefas de auditoria significa, na prática, garantir que um asilo não fique sem a inspeção das tabelas de medicação. A disciplina de Banco de Dados na UNDB deixou de ser apenas comandos SQL, tornando-se uma ferramenta poderosa de transformação e segurança social."
                  </p>
                </div>

                <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 ${
                  isFullscreen ? 'pt-8 mt-6' : 'pt-4 sm:pt-6 mt-2'
                }`}>
                  <div className="text-center sm:text-left">
                    <p className={`font-bold text-slate-500 uppercase tracking-widest ${
                      isFullscreen ? 'text-[11px]' : 'text-[8px] sm:text-[9px]'
                    }`}>Grupo de Desenvolvimento</p>
                    <h4 className={`font-extrabold text-slate-800 mt-0.5 sm:mt-1 ${
                      isFullscreen ? 'text-sm' : 'text-[10px] sm:text-xs'
                    }`}>Acadêmicos de Engenharia de Software — UNDB</h4>
                    <div className={`grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-1 mt-2 text-left text-slate-500 font-semibold tracking-tight transition-all duration-300 ${
                      isFullscreen ? 'text-[11px] md:text-[12px]' : 'text-[7.5px] sm:text-[9px]'
                    }`}>
                      <div className="flex items-center gap-1">
                        <span className="h-1 w-1 rounded-full bg-emerald-500 shrink-0" />
                        <span>Victor Eduard R. Cabra</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="h-1 w-1 rounded-full bg-indigo-500 shrink-0" />
                        <span>José Dominick S. Pereira</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="h-1 w-1 rounded-full bg-emerald-500 shrink-0" />
                        <span>Taino Samuel L. Ribeiro</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="h-1 w-1 rounded-full bg-indigo-500 shrink-0" />
                        <span>João Marcelo S. Praseres</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="h-1 w-1 rounded-full bg-emerald-500 shrink-0" />
                        <span>Gabriel Ordonez dos</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="h-1 w-1 rounded-full bg-indigo-500 shrink-0" />
                        <span>Landiel durans C. da Silva</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="h-1 w-1 rounded-full bg-emerald-500 shrink-0" />
                        <span>Luiz Gabriel M. Ferreira</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="h-1 w-1 rounded-full bg-indigo-500 shrink-0" />
                        <span>Renan Silva Pires</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`font-bold text-slate-500 ${isFullscreen ? 'text-sm' : 'text-xs'}`}>Muito obrigado pela atenção!</span>
                    <span className={`flex items-center justify-center rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-600 shadow ${
                      isFullscreen ? 'h-10 w-10' : 'h-8 w-8'
                    }`}>
                      <HelpCircle className={`animate-pulse ${isFullscreen ? 'h-5.5 w-5.5' : 'h-4.5 w-4.5'}`} />
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* BARRA DE NAVEGAÇÃO INTERNA DOS SLIDES */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 sm:gap-3.5 bg-white/95 border border-slate-200/80 px-3 sm:px-4.5 py-2 rounded-2xl shadow-xl shadow-slate-200/60 z-20 max-w-[95vw] sm:max-w-none">
              <button 
                onClick={prevSlide}
                disabled={currentSlide === 0}
                className="p-1.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100/70 disabled:opacity-30 disabled:hover:bg-transparent transition-all duration-205"
                title="Slide Anterior"
              >
                <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </button>
              
              <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto">
                {SLIDES_CONFIG.map((_, i) => (
                  <button 
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      currentSlide === i ? 'w-4 sm:w-6 bg-emerald-500' : 'w-1.5 sm:w-2 bg-slate-200 hover:bg-slate-300'
                    }`}
                  />
                ))}
              </div>

              <button 
                onClick={nextSlide}
                disabled={currentSlide === SLIDES_CONFIG.length - 1}
                className="p-1.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100/70 disabled:opacity-30 disabled:hover:bg-transparent transition-all duration-205"
                title="Próximo Slide"
              >
                <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </button>

              <span className="h-4 w-px bg-slate-200 mx-0.5 sm:mx-1" />

              {/* Botão de Fullscreen sempre visível (especialmente útil em tela cheia) */}
              <button 
                onClick={toggleFullscreen}
                className={`p-1.5 rounded-xl transition-all duration-205 ${
                  isFullscreen 
                    ? 'text-emerald-600 bg-emerald-50 border border-emerald-150 hover:bg-emerald-100/80 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/70'
                }`}
                title={isFullscreen ? "Sair de Tela Cheia" : "Tela Cheia"}
              >
                <Maximize2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </button>

              {/* Botão Sair da Apresentação */}
              <Link href="/">
                <button 
                  className="p-1.5 rounded-xl text-rose-500 hover:text-rose-600 hover:bg-rose-50 transition-all duration-205"
                  title="Sair do Slide"
                >
                  <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </button>
              </Link>
            </div>

          </div>
        </div>

      </main>

      {/* RODAPÉ DO MODO DE APRESENTAÇÃO */}
      {/* <footer className="relative z-10 px-8 py-3.5 border-t border-slate-900 bg-slate-950/80 backdrop-blur-md flex items-center justify-between text-[11px] text-slate-500 font-semibold">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-emerald-400" />
          <span>Use as **Teclas de Seta** ou **Espaço** para avançar os slides. Pressione **ESC** para sair.</span>
        </div>
        <span className="font-bold text-slate-400">AM Consultorias &copy; 2026. Todos os direitos reservados.</span>
      </footer> */}

      {lightboxImage && (
        <div 
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4 md:p-8 cursor-zoom-out animate-fade-in"
        >
          <div className="absolute top-4 right-4 z-50">
            <button 
              onClick={() => setLightboxImage(null)}
              className="p-2.5 rounded-full bg-white border border-slate-100 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-all shadow-lg"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="relative max-w-7xl max-h-[90vh] bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-2xl p-2 flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <img 
              src={lightboxImage} 
              alt="Fluxo Real Expandido" 
              className="max-w-full max-h-[85vh] object-contain rounded-2xl"
            />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-800/90 border border-slate-700 text-slate-200 text-[10px] md:text-xs px-4 py-2 rounded-full font-bold shadow-md">
              Clique fora ou no X para fechar o zoom
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
