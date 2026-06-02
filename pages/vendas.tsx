import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { 
  Sparkles, 
  Building2, 
  Users2, 
  Layers, 
  Database, 
  Palette, 
  TrendingUp, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  RefreshCw, 
  Printer, 
  FileText,
  DollarSign,
  Laptop,
  Smartphone,
  ChevronRight
} from 'lucide-react';
import type { SalesBriefingFormData, SalesBriefingFormErrors, SubmissionStatus, SalesBriefingField } from '../types/vendas';

const initialFormData: SalesBriefingFormData = {
  // 1. O Básico
  projectName: '',
  businessDescription: '',
  projectGoals: '',

  // 2. Processo e Usuários
  currentProcess: '',
  targetUsers: '',

  // 3. Recursos
  keyFeatures: '',
  salesReports: '',

  // 4. Integrações
  paymentGateways: '',
  integrations: '',

  // 5. Design e Prazo
  brandIdentity: '',
  references: '',
  deadline: '',
};

interface StepConfig {
  number: number;
  title: string;
  shortTitle: string;
  icon: React.ComponentType<any>;
  description: string;
}

const STEPS: StepConfig[] = [
  {
    number: 1,
    title: '1. O Básico (Escopo e Modelo)',
    shortTitle: 'O Básico',
    icon: Building2,
    description: 'Identificação do projeto, modelo comercial e objetivos principais a alcançar.'
  },
  {
    number: 2,
    title: '2. Processo Comercial e Usuários',
    shortTitle: 'Processo e Usuários',
    icon: Users2,
    description: 'Como as vendas funcionam hoje e quem utilizará a ferramenta.'
  },
  {
    number: 3,
    title: '3. Recursos e Relatórios',
    shortTitle: 'Recursos e Relatórios',
    icon: Layers,
    description: 'Funcionalidades desejadas e as necessidades de dashboards/relatórios.'
  },
  {
    number: 4,
    title: '4. Integrações e Notificações',
    shortTitle: 'Integrações',
    icon: Database,
    description: 'Gateways de pagamento, envio de notificações e conexão com ERPs/CRMs.'
  },
  {
    number: 5,
    title: '5. Design, Referências e Prazo',
    shortTitle: 'Design e Prazo',
    icon: Palette,
    description: 'Estilo visual do sistema, referências de mercado e cronograma.'
  }
];

export default function SalesBriefingForm() {
  const [formData, setFormData] = useState<SalesBriefingFormData>(initialFormData);
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<SalesBriefingFormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<SubmissionStatus>({ state: 'idle' });
  const [progress, setProgress] = useState(0);

  // Calculates completion progress percentage out of all 11 fields
  useEffect(() => {
    const totalFields = 11;
    let filledFields = 0;
    
    Object.keys(formData).forEach((key) => {
      if (formData[key as SalesBriefingField]?.trim()) {
        filledFields++;
      }
    });
    
    setProgress(Math.round((filledFields / totalFields) * 100));
  }, [formData]);

  // Real-time single field validation
  const validateField = (name: SalesBriefingField, value: string): string => {
    if (name === 'projectName') {
      if (!value.trim()) return 'O nome do projeto/sistema é obrigatório.';
      if (value.trim().length < 2) return 'O nome deve ter pelo menos 2 caracteres.';
    }
    
    if (name === 'businessDescription') {
      if (!value.trim()) return 'A explicação do modelo de negócio é obrigatória.';
      if (value.trim().length < 10) return 'Por favor, detalhe em pelo menos 10 caracteres.';
    }
    
    if (name === 'projectGoals') {
      if (!value.trim()) return 'Os objetivos principais do projeto são obrigatórios.';
      if (value.trim().length < 10) return 'Por favor, descreva em pelo menos 10 caracteres.';
    }
    
    if (name === 'references' && value.trim()) {
      const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/i;
      if (!urlPattern.test(value.trim()) && !value.includes('http')) {
        // Permitir texto livre mas alertar caso tente colocar uma URL inválida
        if (value.includes('.') || value.includes('/')) {
          return 'Se for inserir um link, use um formato de URL válido.';
        }
      }
    }
    
    return '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target as { name: SalesBriefingField; value: string };
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (touched[name]) {
      const errorMsg = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: errorMsg || undefined }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target as { name: SalesBriefingField; value: string };
    setTouched(prev => ({ ...prev, [name]: true }));
    const errorMsg = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: errorMsg || undefined }));
  };

  const isStepValid = (stepNum: number): boolean => {
    if (stepNum === 1) {
      return !!formData.projectName.trim() && 
             !!formData.businessDescription.trim() && 
             !!formData.projectGoals.trim() &&
             formData.projectName.trim().length >= 2 &&
             formData.businessDescription.trim().length >= 10 &&
             formData.projectGoals.trim().length >= 10;
    }
    return true;
  };

  const validateStep = (step: number): boolean => {
    const stepErrors: SalesBriefingFormErrors = {};
    let fieldsToValidate: SalesBriefingField[] = [];

    if (step === 1) {
      fieldsToValidate = ['projectName', 'businessDescription', 'projectGoals'];
    } else if (step === 5) {
      fieldsToValidate = ['references'];
    }

    fieldsToValidate.forEach(field => {
      const errorMsg = validateField(field, formData[field]);
      if (errorMsg) {
        stepErrors[field] = errorMsg;
      }
    });

    setErrors(prev => ({ ...prev, ...stepErrors }));

    const newTouched = { ...touched };
    fieldsToValidate.forEach(field => {
      newTouched[field] = true;
    });
    setTouched(newTouched);

    return Object.keys(stepErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 5));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const firstError = Object.keys(errors).find(key => {
        if (currentStep === 1) return ['projectName', 'businessDescription', 'projectGoals'].includes(key);
        if (currentStep === 5) return ['references'].includes(key);
        return false;
      }) as SalesBriefingField | undefined;

      if (firstError) {
        document.getElementById(firstError)?.focus();
      }
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentStep < 5) {
      handleNext();
      return;
    }
    
    if (!validateStep(1) || !validateStep(5)) {
      setCurrentStep(1);
      setTimeout(() => {
        const errorField = document.getElementById('projectName');
        errorField?.focus();
        errorField?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
      return;
    }
    
    setStatus({ state: 'loading' });
    console.log('%c[Sales Briefing Submission Initiated]', 'color: #10b981; font-weight: bold;', formData);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('%c[Sales Briefing Simulated API Response 201]', 'color: #10b981; font-weight: bold;', formData);
      setStatus({ state: 'success' });
    } catch (error: any) {
      console.error(error);
      setStatus({ 
        state: 'error', 
        errorMessage: error?.message || 'Erro ao enviar o briefing. Por favor, tente novamente.' 
      });
    }
  };

  const downloadTxtReport = () => {
    const report = `==================================================
BRIEFING DE SISTEMA DE GESTÃO DE VENDAS - ANDERSON JOSÉ
==================================================
Nome do Projeto/Sistema: ${formData.projectName}
Data de Envio: ${new Date().toLocaleDateString('pt-BR')}

1. O BÁSICO (ESCOPO E MODELO)
--------------------------------------------------
* Nome do Projeto: ${formData.projectName}
* O que a empresa vende e modelo comercial: 
  ${formData.businessDescription}
* Objetivos principais do projeto: 
  ${formData.projectGoals}

2. PROCESSO COMERCIAL E USUÁRIOS
--------------------------------------------------
* Como gerenciam as vendas atualmente: 
  ${formData.currentProcess || 'Não informado'}
* Usuários do sistema e dispositivos prioritários: 
  ${formData.targetUsers || 'Não informado'}

3. RECURSOS E RELATÓRIOS
--------------------------------------------------
* Recursos essenciais desejados: 
  ${formData.keyFeatures || 'Não informado'}
* Necessidades de relatórios e painéis (dashboards): 
  ${formData.salesReports || 'Não informado'}

4. INTEGRAÇÕES E NOTIFICAÇÕES
--------------------------------------------------
* Gateways de pagamento desejados: 
  ${formData.paymentGateways || 'Não informado'}
* Integrações externas (ERP, CRM, WhatsApp, etc.): 
  ${formData.integrations || 'Não informado'}

5. DESIGN, REFERÊNCIAS E PRAZO
--------------------------------------------------
* Identidade de marca / cores existentes: 
  ${formData.brandIdentity || 'Não informado'}
* Referências de sistemas ou sites: 
  ${formData.references || 'Não informado'}
* Prazo limite / Data de lançamento desejada: 
  ${formData.deadline || 'Não informado'}

==================================================
Relatório gerado em ${new Date().toLocaleString('pt-BR')} por Anderson José Branding.
==================================================`;

    const element = document.createElement("a");
    const file = new Blob([report], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `Briefing-Vendas-${formData.projectName.replace(/\s+/g, '-').toLowerCase()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter') {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT') {
        e.preventDefault();
        if (currentStep < 5) {
          handleNext();
        }
      }
    }
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setErrors({});
    setTouched({});
    setStatus({ state: 'idle' });
    setCurrentStep(1);
  };

  return (
    <>
      <div className="min-h-screen selection:bg-brand-500/30 print:hidden">
        <Head>
          <title>Briefing de Gestão de Vendas // Anderson José</title>
          <meta name="description" content="Briefing estratégico para desenvolvimento de site/sistema de gestão de vendas." />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-12 min-h-screen">
            
            {/* COLUNA ESQUERDA: Logo, Seletor e Menu Lateral */}
            <div className="lg:col-span-5 lg:sticky lg:top-0 lg:h-screen flex flex-col justify-between py-12 lg:py-16 text-zinc-100 z-10">
              <div>
                {/* Logo */}
                <div className="flex items-center gap-2 mb-8 group cursor-default">
                  <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-emerald-500 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform duration-300">
                    <TrendingUp className="h-5 w-5 text-white animate-pulse-subtle" />
                  </div>
                  <span className="font-extrabold tracking-wider text-lg bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-zinc-400">
                    ANDERSON JOSÉ <span className="text-brand-400 font-light">//</span> BRANDING
                  </span>
                </div>

                {/* Seletor de Briefing */}
                <div className="flex items-center gap-1 bg-zinc-900/80 border border-zinc-800 p-1 rounded-xl mb-8 w-fit">
                  <Link 
                    href="/" 
                    className="px-3 py-1.5 rounded-lg text-[11px] font-semibold text-zinc-400 hover:text-zinc-200 transition-all"
                  >
                    Branding
                  </Link>
                  <Link 
                    href="/vendas" 
                    className="px-3 py-1.5 rounded-lg text-[11px] font-bold bg-brand-500 text-white shadow-md shadow-brand-500/10 transition-all"
                  >
                    Gestão de Vendas
                  </Link>
                </div>

                {/* Informações Principais */}
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight mb-4">
                  Briefing de Sistema <br />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-brand-400">
                    de Gestão de Vendas.
                  </span>
                </h1>
                <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed mb-8 max-w-sm">
                  Descreva as necessidades operacionais, metas comerciais e regras de negócio para que possamos planejar e desenhar uma ferramenta ideal para as suas vendas.
                </p>
              </div>

              {/* Menu Lateral de Passos e Progresso */}
              <div className="space-y-6">
                {/* Progresso Geral */}
                {status.state !== 'success' && (
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md shadow-2xl">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Preenchimento Geral</span>
                      <span className="text-xs font-bold text-emerald-400">{progress}%</span>
                    </div>
                    <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-emerald-500 to-brand-400 h-full rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${progress}%` }}
                        role="progressbar"
                        aria-valuenow={progress}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      />
                    </div>
                  </div>
                )}

                {/* Lista dos Passos Interativos */}
                {status.state !== 'success' && (
                  <nav className="space-y-3" aria-label="Navegação do formulário">
                    {STEPS.map((step) => {
                      const StepIcon = step.icon;
                      const isActive = currentStep === step.number;
                      const isCompleted = currentStep > step.number;
                      
                      return (
                        <button
                          key={step.number}
                          type="button"
                          onClick={() => {
                            if (step.number < currentStep || validateStep(currentStep)) {
                              setCurrentStep(step.number);
                            }
                          }}
                          className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-300 ${
                            isActive 
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-white shadow-lg shadow-emerald-500/5'
                              : isCompleted
                                ? 'bg-zinc-900/40 border-zinc-800 text-emerald-400 hover:border-zinc-700'
                                : 'bg-transparent border-transparent text-zinc-500 cursor-not-allowed'
                          }`}
                          disabled={step.number > currentStep && !isStepValid(currentStep)}
                        >
                          <div className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 border transition-all ${
                            isActive
                              ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400'
                              : isCompleted
                                ? 'bg-emerald-500/15 border-emerald-500/25 text-emerald-400'
                                : 'bg-zinc-900 border-zinc-800 text-zinc-600'
                          }`}>
                            {isCompleted ? (
                              <CheckCircle2 className="h-4.5 w-4.5" />
                            ) : (
                              <StepIcon className="h-4 w-4" />
                            )}
                          </div>
                          <div>
                            <p className={`text-xs font-semibold ${isActive ? 'text-white' : 'text-zinc-400'}`}>
                              Passo {step.number}
                            </p>
                            <p className="text-[11px] text-zinc-500 font-medium truncate max-w-[200px] xl:max-w-[260px]">
                              {step.shortTitle}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </nav>
                )}
              </div>

              {/* Rodapé */}
              <div className="hidden lg:block text-[11px] text-zinc-600">
                &copy; {new Date().getFullYear()} Anderson José. Todos os direitos reservados.
              </div>
            </div>

            {/* COLUNA DIREITA: Container das Etapas e Form */}
            <div className="lg:col-span-7 pb-16 pt-4 lg:pt-16 flex flex-col justify-center">
              
              {status.state === 'success' ? (
                /* ================= SUCCESS STATE CARD ================= */
                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-10 backdrop-blur-md shadow-2xl text-center relative overflow-hidden animate-slide-up">
                  <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

                  <div className="mx-auto h-16 w-16 bg-emerald-500/20 border border-emerald-500/30 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-emerald-500/10">
                    <CheckCircle2 className="h-9 w-9 text-emerald-400" />
                  </div>
                  
                  <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
                    Briefing de Vendas Enviado!
                  </h2>
                  <p className="text-zinc-400 text-sm max-w-md mx-auto mb-8 leading-relaxed">
                    Muito obrigado por preencher. Com estas informações de regras de negócio, fluxos de usuários e funcionalidades, faremos um mapeamento completo e o orçamento de engenharia para o seu sistema de vendas.
                  </p>

                  {/* Resumo visual compacto dos dados */}
                  <div className="text-left bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 mb-8 max-w-lg mx-auto text-xs md:text-sm">
                    <h3 className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 mb-4 border-b border-zinc-800 pb-2">
                      Resumo do Envio do Briefing
                    </h3>
                    <dl className="space-y-3.5">
                      <div>
                        <dt className="text-zinc-500 font-medium">Nome do Projeto</dt>
                        <dd className="text-zinc-200 font-semibold mt-0.5">{formData.projectName}</dd>
                      </div>
                      <div>
                        <dt className="text-zinc-500 font-medium">Modelo de Negócio</dt>
                        <dd className="text-zinc-300 mt-0.5 line-clamp-2">{formData.businessDescription}</dd>
                      </div>
                      {formData.keyFeatures && (
                        <div>
                          <dt className="text-zinc-500 font-medium">Recursos Chave</dt>
                          <dd className="text-zinc-300 mt-0.5 line-clamp-2">{formData.keyFeatures}</dd>
                        </div>
                      )}
                      {formData.deadline && (
                        <div>
                          <dt className="text-zinc-500 font-medium">Prazo Estimado</dt>
                          <dd className="text-zinc-300 mt-0.5">{formData.deadline}</dd>
                        </div>
                      )}
                    </dl>
                  </div>

                  {/* Ações de Exportação */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 max-w-lg mx-auto">
                    <button
                      onClick={() => window.print()}
                      type="button"
                      className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 border border-white/10 text-white text-xs font-semibold py-3.5 px-6 rounded-xl transition-all"
                    >
                      <Printer className="h-4 w-4 text-emerald-400" />
                      Imprimir ou Salvar PDF
                    </button>

                    <button
                      onClick={downloadTxtReport}
                      type="button"
                      className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 border border-white/10 text-white text-xs font-semibold py-3.5 px-6 rounded-xl transition-all"
                    >
                      <FileText className="h-4 w-4 text-emerald-400" />
                      Baixar Relatório (.txt)
                    </button>
                  </div>

                  <button
                    onClick={handleReset}
                    type="button"
                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-brand-600 hover:from-emerald-500 hover:to-brand-500 text-white text-xs font-semibold py-3.5 px-8 rounded-xl shadow-lg active:scale-98 transition-all duration-300 w-full sm:w-auto"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Enviar outro Briefing
                  </button>
                </div>
              ) : (
                /* ================= MULTI-STEP WIZARD FORM ================= */
                <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} noValidate className="space-y-8 animate-slide-up">
                  
                  {/* 1. PASSO: O BÁSICO */}
                  {currentStep === 1 && (
                    <fieldset className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-xl hover:border-white/15 transition-all duration-300">
                      <legend className="float-left w-full flex items-center gap-3 text-lg md:text-xl font-bold text-white mb-2">
                        <div className="h-8 w-8 bg-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-400">
                          <Building2 className="h-4.5 w-4.5" />
                        </div>
                        <span>1. O Básico (Escopo e Modelo)</span>
                      </legend>
                      <p className="clear-left text-xs text-zinc-400 mb-8 border-b border-zinc-800/80 pb-4">
                        {STEPS[0].description}
                      </p>
                      
                      <div className="space-y-6">
                        {/* Project Name */}
                        <div>
                          <div className="flex justify-between items-baseline mb-2">
                            <label htmlFor="projectName" className="block text-xs font-semibold text-zinc-300">
                              Qual é o nome provisório ou oficial do sistema/site? <span className="text-rose-500" aria-hidden="true">*</span>
                            </label>
                            <span className="text-[10px] text-zinc-500">Obrigatório</span>
                          </div>
                          <input
                            type="text"
                            id="projectName"
                            name="projectName"
                            value={formData.projectName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="Ex: GestãoMax Vendas, Portal do Distribuidor, E-commerce Alpha"
                            aria-required="true"
                            aria-invalid={!!errors.projectName}
                            aria-describedby={errors.projectName ? "projectName-error" : undefined}
                            className={`w-full bg-zinc-900/60 border rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-600 transition-all ${
                              errors.projectName && touched.projectName
                                ? 'border-rose-500/50 bg-rose-500/5 focus:border-rose-500'
                                : 'border-zinc-800 focus:border-emerald-500'
                            }`}
                          />
                          {errors.projectName && touched.projectName && (
                            <div id="projectName-error" className="flex items-center gap-1.5 mt-2 text-[10px] text-rose-400 font-medium" role="alert">
                              <AlertCircle className="h-3 w-3" />
                              <span>{errors.projectName}</span>
                            </div>
                          )}
                        </div>

                        {/* Business Description */}
                        <div>
                          <div className="flex justify-between items-baseline mb-2">
                            <label htmlFor="businessDescription" className="block text-xs font-semibold text-zinc-300">
                              O que a empresa comercializa e qual é o modelo comercial? (B2B, B2C, venda interna/externa) <span className="text-rose-500" aria-hidden="true">*</span>
                            </label>
                            <span className="text-[10px] text-zinc-500">Mínimo 10 caracteres</span>
                          </div>
                          <textarea
                            id="businessDescription"
                            name="businessDescription"
                            value={formData.businessDescription}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            rows={4}
                            placeholder="Ex: Comercializamos materiais de construção para distribuidoras (B2B) através de representantes comerciais que visitam fisicamente os clientes..."
                            aria-required="true"
                            aria-invalid={!!errors.businessDescription}
                            aria-describedby={errors.businessDescription ? "businessDescription-error" : undefined}
                            className={`w-full bg-zinc-900/60 border rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-600 transition-all resize-y ${
                              errors.businessDescription && touched.businessDescription
                                ? 'border-rose-500/50 bg-rose-500/5 focus:border-rose-500'
                                : 'border-zinc-800 focus:border-emerald-500'
                            }`}
                          />
                          {errors.businessDescription && touched.businessDescription && (
                            <div id="businessDescription-error" className="flex items-center gap-1.5 mt-2 text-[10px] text-rose-400 font-medium" role="alert">
                              <AlertCircle className="h-3 w-3" />
                              <span>{errors.businessDescription}</span>
                            </div>
                          )}
                        </div>

                        {/* Project Goals */}
                        <div>
                          <div className="flex justify-between items-baseline mb-2">
                            <label htmlFor="projectGoals" className="block text-xs font-semibold text-zinc-300">
                              Quais são os principais objetivos do sistema e que problemas ele deve solucionar? <span className="text-rose-500" aria-hidden="true">*</span>
                            </label>
                            <span className="text-[10px] text-zinc-500">Obrigatório</span>
                          </div>
                          <textarea
                            id="projectGoals"
                            name="projectGoals"
                            value={formData.projectGoals}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            rows={3}
                            placeholder="Ex: Eliminar o envio de pedidos por WhatsApp/papel, agilizar a consulta de estoque em tempo real para os vendedores na rua, e reduzir erros de digitação de faturamento no ERP."
                            aria-required="true"
                            aria-invalid={!!errors.projectGoals}
                            aria-describedby={errors.projectGoals ? "projectGoals-error" : undefined}
                            className={`w-full bg-zinc-900/60 border rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-600 transition-all resize-y ${
                              errors.projectGoals && touched.projectGoals
                                ? 'border-rose-500/50 bg-rose-500/5 focus:border-rose-500'
                                : 'border-zinc-800 focus:border-emerald-500'
                            }`}
                          />
                          {errors.projectGoals && touched.projectGoals && (
                            <div id="projectGoals-error" className="flex items-center gap-1.5 mt-2 text-[10px] text-rose-400 font-medium" role="alert">
                              <AlertCircle className="h-3 w-3" />
                              <span>{errors.projectGoals}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </fieldset>
                  )}

                  {/* 2. PASSO: PROCESSO COMERCIAL E USUÁRIOS */}
                  {currentStep === 2 && (
                    <fieldset className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-xl hover:border-white/15 transition-all duration-300">
                      <legend className="float-left w-full flex items-center gap-3 text-lg md:text-xl font-bold text-white mb-2">
                        <div className="h-8 w-8 bg-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-400">
                          <Users2 className="h-4.5 w-4.5" />
                        </div>
                        <span>2. Processo Comercial e Usuários</span>
                      </legend>
                      <p className="clear-left text-xs text-zinc-400 mb-8 border-b border-zinc-800/80 pb-4">
                        {STEPS[1].description}
                      </p>

                      <div className="space-y-6">
                        {/* Current Process */}
                        <div>
                          <label htmlFor="currentProcess" className="block text-xs font-semibold text-zinc-300 mb-2">
                            Como as vendas, clientes, pedidos e estoque são gerenciados hoje?
                          </label>
                          <textarea
                            id="currentProcess"
                            name="currentProcess"
                            value={formData.currentProcess}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Ex: Usamos planilhas do Excel para estoque, tiramos pedidos em talão de papel ou e-mail, e um faturista digita manualmente no sistema de notas fiscais no fim do dia."
                            className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-600 focus:border-emerald-500 transition-all resize-y"
                          />
                        </div>

                        {/* Target Users */}
                        <div>
                          <label htmlFor="targetUsers" className="block text-xs font-semibold text-zinc-300 mb-2">
                            Quem usará o sistema e em quais aparelhos/dispositivos (desktop, celular, tablet)?
                          </label>
                          <textarea
                            id="targetUsers"
                            name="targetUsers"
                            value={formData.targetUsers}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Ex: Representantes de venda externos (usam 100% celular/Android na rua), gerentes comerciais no escritório (usam computadores/desktop) e clientes finais para acompanhar pedidos (celular/web)."
                            className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-600 focus:border-emerald-500 transition-all resize-y"
                          />
                        </div>
                      </div>
                    </fieldset>
                  )}

                  {/* 3. PASSO: RECURSOS E FUNCIONALIDADES */}
                  {currentStep === 3 && (
                    <fieldset className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-xl hover:border-white/15 transition-all duration-300">
                      <legend className="float-left w-full flex items-center gap-3 text-lg md:text-xl font-bold text-white mb-2">
                        <div className="h-8 w-8 bg-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-400">
                          <Layers className="h-4.5 w-4.5" />
                        </div>
                        <span>3. Recursos e Relatórios</span>
                      </legend>
                      <p className="clear-left text-xs text-zinc-400 mb-8 border-b border-zinc-800/80 pb-4">
                        {STEPS[2].description}
                      </p>

                      <div className="space-y-6">
                        {/* Key Features */}
                        <div>
                          <label htmlFor="keyFeatures" className="block text-xs font-semibold text-zinc-300 mb-2">
                            Quais são os recursos funcionais indispensáveis? (Descreva o que os usuários precisam fazer)
                          </label>
                          <textarea
                            id="keyFeatures"
                            name="keyFeatures"
                            value={formData.keyFeatures}
                            onChange={handleChange}
                            rows={4}
                            placeholder="Ex: Catálogo de produtos com fotos, busca por categorias, controle de saldo de estoque, cadastro rápido de novos clientes com validação de CNPJ, carrinho de compras, controle de comissão de cada vendedor, e aprovação de desconto por gerentes."
                            className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-600 focus:border-emerald-500 transition-all resize-y"
                          />
                        </div>

                        {/* Sales Reports */}
                        <div>
                          <label htmlFor="salesReports" className="block text-xs font-semibold text-zinc-300 mb-2">
                            Que tipo de painéis visuais (dashboards) ou relatórios de vendas são fundamentais?
                          </label>
                          <textarea
                            id="salesReports"
                            name="salesReports"
                            value={formData.salesReports}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Ex: Gráfico de vendas mensal, ranking dos produtos mais vendidos, relatório de comissão a pagar para cada vendedor, meta de vendas vs. realizado por período."
                            className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-600 focus:border-emerald-500 transition-all resize-y"
                          />
                        </div>
                      </div>
                    </fieldset>
                  )}

                  {/* 4. PASSO: INTEGRAÇÕES E NOTIFICAÇÕES */}
                  {currentStep === 4 && (
                    <fieldset className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-xl hover:border-white/15 transition-all duration-300">
                      <legend className="float-left w-full flex items-center gap-3 text-lg md:text-xl font-bold text-white mb-2">
                        <div className="h-8 w-8 bg-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-400">
                          <Database className="h-4.5 w-4.5" />
                        </div>
                        <span>4. Integrações e Notificações</span>
                      </legend>
                      <p className="clear-left text-xs text-zinc-400 mb-8 border-b border-zinc-800/80 pb-4">
                        {STEPS[3].description}
                      </p>

                      <div className="space-y-6">
                        {/* Payment Gateways */}
                        <div>
                          <label htmlFor="paymentGateways" className="block text-xs font-semibold text-zinc-300 mb-2">
                            Quais serão os meios de pagamento disponibilizados no sistema? (Ex: PIX automático, Boleto, Cartão)
                          </label>
                          <input
                            type="text"
                            id="paymentGateways"
                            name="paymentGateways"
                            value={formData.paymentGateways}
                            onChange={handleChange}
                            placeholder="Ex: Pagamento faturado em boleto de 30 dias (padrão), PIX gerado via API (Asaas/Stripe) ou Cartão de Crédito."
                            className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-600 focus:border-emerald-500 transition-all"
                          />
                        </div>

                        {/* Integrations */}
                        <div>
                          <label htmlFor="integrations" className="block text-xs font-semibold text-zinc-300 mb-2">
                            O sistema precisa se comunicar com ERP, CRM ou outras APIs (ex: WhatsApp, Notas Fiscais)?
                          </label>
                          <textarea
                            id="integrations"
                            name="integrations"
                            value={formData.integrations}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Ex: Envio automático de confirmação de pedido via WhatsApp para o cliente, sincronização de pedidos e estoque com ERP Tiny/Bling, e notificação por e-mail quando o pedido for despachado."
                            className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-600 focus:border-emerald-500 transition-all resize-y"
                          />
                        </div>
                      </div>
                    </fieldset>
                  )}

                  {/* 5. PASSO: DESIGN, REFERÊNCIAS E PRAZO */}
                  {currentStep === 5 && (
                    <fieldset className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-xl hover:border-white/15 transition-all duration-300">
                      <legend className="float-left w-full flex items-center gap-3 text-lg md:text-xl font-bold text-white mb-2">
                        <div className="h-8 w-8 bg-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-400">
                          <Palette className="h-4.5 w-4.5" />
                        </div>
                        <span>5. Design, Referências e Prazo</span>
                      </legend>
                      <p className="clear-left text-xs text-zinc-400 mb-8 border-b border-zinc-800/80 pb-4">
                        {STEPS[4].description}
                      </p>

                      <div className="space-y-6">
                        {/* Brand Identity */}
                        <div>
                          <label htmlFor="brandIdentity" className="block text-xs font-semibold text-zinc-300 mb-2">
                            A empresa possui manual de marca, logotipo vetorizado ou paleta de cores definida?
                          </label>
                          <input
                            type="text"
                            id="brandIdentity"
                            name="brandIdentity"
                            value={formData.brandIdentity}
                            onChange={handleChange}
                            placeholder="Ex: Sim, possuímos manual de marca em PDF e logo em SVG. A cor predominante é azul escuro (#0d47a1)."
                            className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-600 focus:border-emerald-500 transition-all"
                          />
                        </div>

                        {/* References */}
                        <div>
                          <div className="flex justify-between items-baseline mb-2">
                            <label htmlFor="references" className="block text-xs font-semibold text-zinc-300">
                              Existem sistemas concorrentes ou outras ferramentas de vendas que você usa como referência visual?
                            </label>
                            <span className="text-[10px] text-zinc-500">URL ou texto opcional</span>
                          </div>
                          <input
                            type="text"
                            id="references"
                            name="references"
                            value={formData.references}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="Ex: Gostamos do painel de controle do Pipedrive (pipedrive.com) e do fluxo de checkout do Mercado Livre."
                            aria-invalid={!!errors.references}
                            aria-describedby={errors.references ? "references-error" : undefined}
                            className={`w-full bg-zinc-900/60 border rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-600 transition-all ${
                              errors.references && touched.references
                                ? 'border-rose-500/50 bg-rose-500/5 focus:border-rose-500'
                                : 'border-zinc-800 focus:border-emerald-500'
                            }`}
                          />
                          {errors.references && touched.references && (
                            <div id="references-error" className="flex items-center gap-1.5 mt-2 text-[10px] text-rose-400 font-medium" role="alert">
                              <AlertCircle className="h-3 w-3" />
                              <span>{errors.references}</span>
                            </div>
                          )}
                        </div>

                        {/* Deadline */}
                        <div>
                          <label htmlFor="deadline" className="block text-xs font-semibold text-zinc-300 mb-2">
                            Qual é o prazo estimado ou data-limite ideal para o lançamento deste sistema?
                          </label>
                          <input
                            type="text"
                            id="deadline"
                            name="deadline"
                            value={formData.deadline}
                            onChange={handleChange}
                            placeholder="Ex: Precisamos de uma versão MVP rodando até o final do terceiro trimestre (fim de Setembro)."
                            className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-600 focus:border-emerald-500 transition-all"
                          />
                        </div>
                      </div>
                    </fieldset>
                  )}

                  {/* Mensagem Geral de Erro do State do Envio */}
                  {status.state === 'error' && (
                    <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 flex items-center gap-3 text-rose-400 animate-fade-in" role="alert">
                      <AlertCircle className="h-5 w-5 flex-shrink-0" />
                      <span className="text-xs font-medium">{status.errorMessage}</span>
                    </div>
                  )}

                  {/* BOTÕES DE NAVEGAÇÃO DA ETAPA */}
                  <div className="flex justify-between items-center gap-4 pt-4 border-t border-zinc-800/80">
                    <button
                      type="button"
                      onClick={handleBack}
                      disabled={currentStep === 1 || status.state === 'loading'}
                      className="inline-flex items-center justify-center gap-2 bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/50 text-zinc-300 text-xs font-semibold py-3.5 px-6 rounded-xl active:scale-98 disabled:opacity-30 disabled:cursor-not-allowed disabled:active:scale-100 transition-all"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span>Voltar</span>
                    </button>

                    {currentStep < 5 ? (
                      <button
                        type="button"
                        onClick={handleNext}
                        className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-brand-600 hover:from-emerald-500 hover:to-brand-500 text-white text-xs font-semibold py-3.5 px-8 rounded-xl shadow-lg active:scale-98 transition-all duration-300"
                      >
                        <span>Continuar</span>
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={status.state === 'loading'}
                        className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-brand-600 hover:from-emerald-500 hover:to-brand-500 text-white text-xs font-semibold py-3.5 px-10 rounded-xl shadow-lg hover:shadow-emerald-500/25 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                      >
                        {status.state === 'loading' ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin text-white" />
                            <span>Enviando Briefing...</span>
                          </>
                        ) : (
                          <>
                            <span>Finalizar e Enviar</span>
                            <CheckCircle2 className="h-4 w-4 group-hover:scale-105 transition-transform" />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </form>
              )}

              {/* Rodapé Mobile */}
              <div className="mt-12 text-center text-[10px] text-zinc-700 lg:hidden">
                &copy; {new Date().getFullYear()} Anderson José. Todos os direitos reservados.
              </div>

            </div>

          </div>
        </main>
      </div>

      {/* AREA DE IMPRESSÃO (Visível apenas ao imprimir/salvar PDF) */}
      <div className="hidden print:block print:bg-white print:text-black p-8 font-sans">
        <div className="border-b-2 border-black pb-4 mb-8">
          <h1 className="text-2xl font-bold tracking-tight uppercase">Briefing de Sistema de Gestão de Vendas</h1>
          <p className="text-xs font-bold text-zinc-600 mt-1">PROJETO DE ENGENHARIA DE SISTEMAS // ANDERSON JOSÉ BRANDING</p>
          <div className="flex justify-between text-[10px] text-zinc-500 mt-4">
            <span>Sistema: <strong>{formData.projectName}</strong></span>
            <span>Data de Envio: <strong>{new Date().toLocaleDateString('pt-BR')}</strong></span>
          </div>
        </div>

        <div className="space-y-6">
          {/* 1. O Básico */}
          <section className="avoid-break">
            <h2 className="text-sm font-bold uppercase border-b border-zinc-300 pb-1 mb-3 text-zinc-800">1. O Básico (Escopo e Modelo)</h2>
            <table className="w-full text-xs border-collapse">
              <tbody>
                <tr className="border-b border-zinc-100">
                  <td className="py-2 font-bold text-zinc-600 w-1/3">Nome do Projeto/Sistema:</td>
                  <td className="py-2 text-zinc-900 w-2/3">{formData.projectName}</td>
                </tr>
                <tr className="border-b border-zinc-100">
                  <td className="py-2 font-bold text-zinc-600">Modelo comercial e atuação:</td>
                  <td className="py-2 text-zinc-900 whitespace-pre-wrap">{formData.businessDescription}</td>
                </tr>
                <tr className="border-b border-zinc-100">
                  <td className="py-2 font-bold text-zinc-600">Objetivos do sistema:</td>
                  <td className="py-2 text-zinc-900 whitespace-pre-wrap">{formData.projectGoals}</td>
                </tr>
              </tbody>
            </table>
          </section>

          {/* 2. Processo e Usuários */}
          <section className="avoid-break">
            <h2 className="text-sm font-bold uppercase border-b border-zinc-300 pb-1 mb-3 text-zinc-800">2. Processo Comercial e Usuários</h2>
            <table className="w-full text-xs border-collapse">
              <tbody>
                {formData.currentProcess && (
                  <tr className="border-b border-zinc-100">
                    <td className="py-2 font-bold text-zinc-600 w-1/3">Como é gerenciado hoje:</td>
                    <td className="py-2 text-zinc-900 whitespace-pre-wrap">{formData.currentProcess}</td>
                  </tr>
                )}
                {formData.targetUsers && (
                  <tr className="border-b border-zinc-100">
                    <td className="py-2 font-bold text-zinc-600">Usuários e dispositivos:</td>
                    <td className="py-2 text-zinc-900 whitespace-pre-wrap">{formData.targetUsers}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>

          {/* 3. Recursos */}
          <section className="avoid-break">
            <h2 className="text-sm font-bold uppercase border-b border-zinc-300 pb-1 mb-3 text-zinc-800">3. Recursos e Relatórios</h2>
            <table className="w-full text-xs border-collapse">
              <tbody>
                {formData.keyFeatures && (
                  <tr className="border-b border-zinc-100">
                    <td className="py-2 font-bold text-zinc-600 w-1/3">Funcionalidades essenciais:</td>
                    <td className="py-2 text-zinc-900 whitespace-pre-wrap">{formData.keyFeatures}</td>
                  </tr>
                )}
                {formData.salesReports && (
                  <tr className="border-b border-zinc-100">
                    <td className="py-2 font-bold text-zinc-600">Relatórios fundamentais:</td>
                    <td className="py-2 text-zinc-900 whitespace-pre-wrap">{formData.salesReports}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>

          {/* 4. Integrações */}
          <section className="avoid-break">
            <h2 className="text-sm font-bold uppercase border-b border-zinc-300 pb-1 mb-3 text-zinc-800">4. Integrações e Notificações</h2>
            <table className="w-full text-xs border-collapse">
              <tbody>
                {formData.paymentGateways && (
                  <tr className="border-b border-zinc-100">
                    <td className="py-2 font-bold text-zinc-600 w-1/3">Meios de pagamento:</td>
                    <td className="py-2 text-zinc-900">{formData.paymentGateways}</td>
                  </tr>
                )}
                {formData.integrations && (
                  <tr className="border-b border-zinc-100">
                    <td className="py-2 font-bold text-zinc-600">Sistemas integrados:</td>
                    <td className="py-2 text-zinc-900 whitespace-pre-wrap">{formData.integrations}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>

          {/* 5. Design e Prazo */}
          <section className="avoid-break">
            <h2 className="text-sm font-bold uppercase border-b border-zinc-300 pb-1 mb-3 text-zinc-800">5. Design, Referências e Prazo</h2>
            <table className="w-full text-xs border-collapse">
              <tbody>
                {formData.brandIdentity && (
                  <tr className="border-b border-zinc-100">
                    <td className="py-2 font-bold text-zinc-600 w-1/3">Identidade visual / cores:</td>
                    <td className="py-2 text-zinc-900">{formData.brandIdentity}</td>
                  </tr>
                )}
                {formData.references && (
                  <tr className="border-b border-zinc-100">
                    <td className="py-2 font-bold text-zinc-600">Referências de sistemas:</td>
                    <td className="py-2 text-zinc-900">{formData.references}</td>
                  </tr>
                )}
                {formData.deadline && (
                  <tr className="border-b border-zinc-100">
                    <td className="py-2 font-bold text-zinc-600">Prazo de lançamento:</td>
                    <td className="py-2 text-zinc-900">{formData.deadline}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>
        </div>

        <div className="border-t border-zinc-300 mt-8 pt-2 text-center text-[10px] text-zinc-400 avoid-break hidden print:block">
          <p>© {new Date().getFullYear()} Anderson José. Documento de Briefing Técnico de Sistemas. Todos os direitos reservados.</p>
        </div>
      </div>
    </>
  );
}
