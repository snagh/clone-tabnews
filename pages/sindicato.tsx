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
  ChevronRight,
  ShieldCheck,
  CreditCard,
  Receipt
} from 'lucide-react';
import type { UnionBriefingFormData, UnionBriefingFormErrors, SubmissionStatus, UnionBriefingField } from '../types/sindicato';

const initialFormData: UnionBriefingFormData = {
  // 1. Contexto e Rotina Atual
  projectName: '',
  currentProcess: '',
  mainBottlenecks: '',

  // 2. Fluxo Financeiro
  paymentMethods: '',
  billingRules: '',
  overdueActions: '',

  // 3. Perfis e Acesso
  adminProfiles: '',
  memberPortal: '',

  // 4. Integrações e Relatórios
  receiptsGeneration: '',
  mainReports: '',
  externalSystems: '',

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
    title: '1. Contexto e Rotina Atual',
    shortTitle: 'Contexto e Rotina',
    icon: Building2,
    description: 'Como o sindicato gerencia a arrecadação hoje e os principais problemas a resolver.'
  },
  {
    number: 2,
    title: '2. Fluxo Financeiro (O Core)',
    shortTitle: 'Fluxo Financeiro',
    icon: CreditCard,
    description: 'Métodos de pagamento, regras de cobrança e tratativas para inadimplência.'
  },
  {
    number: 3,
    title: '3. Perfis de Acesso e Portal',
    shortTitle: 'Perfis e Acessos',
    icon: Users2,
    description: 'Níveis de permissão da equipe interna e recursos da área restrita do filiado.'
  },
  {
    number: 4,
    title: '4. Integrações e Relatórios',
    shortTitle: 'Integrações',
    icon: Receipt,
    description: 'Emissão de recibos, relatórios do Dashboard e comunicação com sistemas externos.'
  },
  {
    number: 5,
    title: '5. Design, Referências e Prazo',
    shortTitle: 'Design e Prazo',
    icon: Palette,
    description: 'Identidade visual existente, sistemas de referência e cronograma.'
  }
];

export default function UnionBriefingForm() {
  const [formData, setFormData] = useState<UnionBriefingFormData>(initialFormData);
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<UnionBriefingFormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<SubmissionStatus>({ state: 'idle' });
  const [progress, setProgress] = useState(0);

  // Calculates completion progress percentage out of all 14 fields
  useEffect(() => {
    const totalFields = 14;
    let filledFields = 0;
    
    Object.keys(formData).forEach((key) => {
      if (formData[key as UnionBriefingField]?.trim()) {
        filledFields++;
      }
    });
    
    setProgress(Math.round((filledFields / totalFields) * 100));
  }, [formData]);

  // Real-time single field validation
  const validateField = (name: UnionBriefingField, value: string): string => {
    if (name === 'projectName') {
      if (!value.trim()) return 'O nome do sindicato ou projeto é obrigatório.';
      if (value.trim().length < 2) return 'O nome deve ter pelo menos 2 caracteres.';
    }
    
    if (name === 'currentProcess') {
      if (!value.trim()) return 'A explicação da rotina atual é obrigatória.';
      if (value.trim().length < 10) return 'Por favor, detalhe em pelo menos 10 caracteres.';
    }
    
    if (name === 'mainBottlenecks') {
      if (!value.trim()) return 'Os maiores gargalos são obrigatórios de informar.';
      if (value.trim().length < 10) return 'Por favor, descreva em pelo menos 10 caracteres.';
    }
    
    // Relaxed to allow any free-form references
    if (name === 'references' && value.trim()) {
      return '';
    }
    
    return '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target as { name: UnionBriefingField; value: string };
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (touched[name]) {
      const errorMsg = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: errorMsg || undefined }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target as { name: UnionBriefingField; value: string };
    setTouched(prev => ({ ...prev, [name]: true }));
    const errorMsg = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: errorMsg || undefined }));
  };

  const isStepValid = (stepNum: number): boolean => {
    if (stepNum === 1) {
      return !!formData.projectName.trim() && 
             !!formData.currentProcess.trim() && 
             !!formData.mainBottlenecks.trim() &&
             formData.projectName.trim().length >= 2 &&
             formData.currentProcess.trim().length >= 10 &&
             formData.mainBottlenecks.trim().length >= 10;
    }
    return true;
  };

  const validateStep = (step: number): boolean => {
    const stepErrors: UnionBriefingFormErrors = {};
    let fieldsToValidate: UnionBriefingField[] = [];

    if (step === 1) {
      fieldsToValidate = ['projectName', 'currentProcess', 'mainBottlenecks'];
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
        if (currentStep === 1) return ['projectName', 'currentProcess', 'mainBottlenecks'].includes(key);
        if (currentStep === 5) return ['references'].includes(key);
        return false;
      }) as UnionBriefingField | undefined;

      if (firstError) {
        document.getElementById(firstError)?.focus();
      }
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const generateReportText = () => {
    return `==================================================
BRIEFING DE SISTEMA DE GESTÃO DE PAGAMENTOS DE SINDICATO - ANDERSON JOSÉ
==================================================
Nome do Sindicato/Projeto: ${formData.projectName}
Data de Envio: ${new Date().toLocaleDateString('pt-BR')}

1. CONTEXTO E ROTINA ATUAL
--------------------------------------------------
* Nome do Sindicato/Projeto: ${formData.projectName}
* Como é feito o controle de pagamentos hoje: 
  ${formData.currentProcess}
* Maiores gargalos a resolver: 
  ${formData.mainBottlenecks}

2. FLUXO FINANCEIRO (O CORE DO SISTEMA)
--------------------------------------------------
* Métodos de pagamento aceitos: 
  ${formData.paymentMethods || 'Não informado'}
* Funcionamento das cobranças/recorrência: 
  ${formData.billingRules || 'Não informado'}
* Ações em caso de inadimplência/atraso: 
  ${formData.overdueActions || 'Não informado'}

3. PERFIS DE USUÁRIO E ACESSOS
--------------------------------------------------
* Perfis internos e níveis de acesso: 
  ${formData.adminProfiles || 'Não informado'}
* Portal do filiado e recursos oferecidos: 
  ${formData.memberPortal || 'Não informado'}

4. INTEGRAÇÕES E RELATÓRIOS
--------------------------------------------------
* Geração de Notas Fiscais ou Recibos: 
  ${formData.receiptsGeneration || 'Não informado'}
* Relatórios mais importantes (Dashboard): 
  ${formData.mainReports || 'Não informado'}
* Sistemas externos a integrar: 
  ${formData.externalSystems || 'Não informado'}

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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentStep < 5) {
      handleNext();
      return;
    }
    
    // Validate final step & general required fields
    const isStep1Valid = validateStep(1);
    const isStep5Valid = validateStep(5);
    
    if (!isStep1Valid) {
      setCurrentStep(1);
      setTimeout(() => {
        const firstError = Object.keys(errors).find(key => 
          ['projectName', 'currentProcess', 'mainBottlenecks'].includes(key)
        );
        const errorField = document.getElementById(firstError || 'projectName');
        errorField?.focus();
        errorField?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
      return;
    }
    
    if (!isStep5Valid) {
      setCurrentStep(5);
      setTimeout(() => {
        const errorField = document.getElementById('references');
        errorField?.focus();
        errorField?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
      return;
    }
    
    setStatus({ state: 'loading' });
    console.log('%c[Union Briefing Submission Initiated]', 'color: #3b82f6; font-weight: bold;', formData);
    
    const reportText = generateReportText();

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'sindicato',
          subject: `Novo Briefing de Pagamentos Sindicato: ${formData.projectName}`,
          content: reportText,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao processar o envio do e-mail.');
      }
      
      const resData = await response.json();
      console.log('%c[Union Briefing Simulated API Response]', 'color: #3b82f6; font-weight: bold;', resData);
      
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
    const report = generateReportText();
    const element = document.createElement("a");
    const file = new Blob([report], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `Briefing-Sindicato-${formData.projectName.replace(/\s+/g, '-').toLowerCase()}.txt`;
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
      <div className="min-h-screen selection:bg-blue-500/30 print:hidden">
        <Head>
          <title>Briefing de Gestão de Pagamentos // Sindicato</title>
          <meta name="description" content="Briefing estratégico para sistema de cobranças, mensalidades e gestão de pagamentos de sindicatos." />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* STICKY HEADER MOBILE */}
          <header className="lg:hidden sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-900/60 px-4 py-3 shadow-lg -mx-4 sm:-mx-6 mb-4">
            <div className="flex items-center justify-between gap-3 mb-2.5">
              <div className="flex items-center gap-1.5">
                <div className="h-6 w-6 rounded-md bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/10">
                  <ShieldCheck className="h-3.5 w-3.5 text-white" />
                </div>
                <span className="font-extrabold tracking-wide text-xs bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-zinc-400">
                  AJ <span className="text-brand-400 font-light">//</span> SINDICATO
                </span>
              </div>
              {status.state !== 'success' && (
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20">
                  Passo {currentStep}/5
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 bg-zinc-900/60 border border-zinc-800 p-0.5 rounded-lg w-full overflow-x-auto whitespace-nowrap [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <Link 
                href="/" 
                className="px-2.5 py-1 rounded-md text-[10px] font-semibold text-zinc-400 hover:text-zinc-200 transition-all"
              >
                Branding
              </Link>
              <Link 
                href="/vendas" 
                className="px-2.5 py-1 rounded-md text-[10px] font-semibold text-zinc-400 hover:text-zinc-200 transition-all"
              >
                Vendas
              </Link>
              <Link 
                href="/sindicato" 
                className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-brand-500 text-white shadow-sm transition-all"
              >
                Sindicato
              </Link>
            </div>

            {status.state !== 'success' && (
              <div className="w-full bg-zinc-900 rounded-full h-1 mt-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-indigo-400 h-full rounded-full transition-all duration-300 ease-out" 
                  style={{ width: `${progress}%` }} 
                />
              </div>
            )}
          </header>

          <div className="lg:grid lg:grid-cols-12 lg:gap-12 min-h-screen">
            
            {/* COLUNA ESQUERDA: Logo, Seletor e Menu Lateral */}
            <div className="hidden lg:flex lg:col-span-5 lg:sticky lg:top-0 lg:h-screen flex-col justify-between pt-12 pb-6 lg:py-16 text-zinc-100 z-10">
              <div>
                {/* Logo */}
                <div className="flex items-center gap-2 mb-8 group cursor-default">
                  <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
                    <ShieldCheck className="h-5 w-5 text-white animate-pulse-subtle" />
                  </div>
                  <span className="font-extrabold tracking-wider text-lg bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-zinc-400">
                    ANDERSON JOSÉ <span className="text-brand-400 font-light">//</span> BRANDING
                  </span>
                </div>

                {/* Seletor de Briefing */}
                <div className="flex items-center gap-1 bg-zinc-900/80 border border-zinc-800 p-1 rounded-xl mb-8 w-full sm:w-fit overflow-x-auto whitespace-nowrap [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  <Link 
                    href="/" 
                    className="px-3 py-1.5 rounded-lg text-[11px] font-semibold text-zinc-400 hover:text-zinc-200 transition-all"
                  >
                    Branding
                  </Link>
                  <Link 
                    href="/vendas" 
                    className="px-3 py-1.5 rounded-lg text-[11px] font-semibold text-zinc-400 hover:text-zinc-200 transition-all"
                  >
                    Gestão de Vendas
                  </Link>
                  <Link 
                    href="/sindicato" 
                    className="px-3 py-1.5 rounded-lg text-[11px] font-bold bg-brand-500 text-white shadow-md shadow-brand-500/10 transition-all"
                  >
                    Gestão de Pagamentos
                  </Link>
                </div>

                {/* Informações Principais */}
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight mb-4">
                  Briefing de Sistema <br />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400">
                    de Cobrança de Sindicato.
                  </span>
                </h1>
                <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed mb-8 max-w-sm">
                  Defina as regras financeiras, as formas de cobrança, a rotina de inadimplência e os perfis de acesso para desenharmos a plataforma de pagamentos ideal do seu sindicato.
                </p>
              </div>

              {/* Menu Lateral de Passos e Progresso */}
              <div className="space-y-6">
                {/* Progresso Geral */}
                {status.state !== 'success' && (
                  <div className="hidden lg:block bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md shadow-2xl">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Preenchimento Geral</span>
                      <span className="text-xs font-bold text-blue-400">{progress}%</span>
                    </div>
                    <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-indigo-400 h-full rounded-full transition-all duration-500 ease-out"
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
                  <nav className="hidden lg:block space-y-3" aria-label="Navegação do formulário">
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
                              ? 'bg-blue-500/10 border-blue-500/30 text-white shadow-lg shadow-blue-500/5'
                              : isCompleted
                                ? 'bg-zinc-900/40 border-zinc-800 text-blue-400 hover:border-zinc-700'
                                : 'bg-transparent border-transparent text-zinc-500 cursor-not-allowed'
                          }`}
                          disabled={step.number > currentStep && !isStepValid(currentStep)}
                        >
                          <div className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 border transition-all ${
                            isActive
                              ? 'bg-blue-500/20 border-blue-500/30 text-blue-400'
                              : isCompleted
                                ? 'bg-blue-500/15 border-blue-500/25 text-blue-400'
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
            <div className="lg:col-span-7 pb-16 pt-2 lg:pt-16 flex flex-col justify-center">
              
              {status.state === 'success' ? (
                /* ================= SUCCESS STATE CARD ================= */
                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-10 backdrop-blur-md shadow-2xl text-center relative overflow-hidden animate-slide-up">
                  <div className="absolute -top-12 -right-12 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

                  <div className="mx-auto h-16 w-16 bg-blue-500/20 border border-blue-500/30 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-blue-500/10">
                    <CheckCircle2 className="h-9 w-9 text-blue-400" />
                  </div>
                  
                  <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
                    Briefing Recebido com Sucesso!
                  </h2>
                  <p className="text-zinc-400 text-sm max-w-md mx-auto mb-8 leading-relaxed">
                    Agradecemos o envio das respostas. Esses dados nos darão o embasamento estratégico e financeiro necessário para planejar a infraestrutura de pagamento e as regras de negócio para o portal e administração do sindicato.
                  </p>

                  {/* Resumo visual compacto dos dados */}
                  <div className="text-left bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 mb-8 max-w-lg mx-auto text-xs md:text-sm">
                    <h3 className="text-[11px] font-bold uppercase tracking-wider text-blue-400 mb-4 border-b border-zinc-800 pb-2">
                      Resumo das Informações Registradas
                    </h3>
                    <dl className="space-y-3.5">
                      <div>
                        <dt className="text-zinc-500 font-medium">Nome do Sindicato / Sistema</dt>
                        <dd className="text-zinc-200 font-semibold mt-0.5">{formData.projectName}</dd>
                      </div>
                      <div>
                        <dt className="text-zinc-500 font-medium">Situação / Processo Atual</dt>
                        <dd className="text-zinc-300 mt-0.5 line-clamp-2">{formData.currentProcess}</dd>
                      </div>
                      {formData.paymentMethods && (
                        <div>
                          <dt className="text-zinc-500 font-medium">Meios de Pagamento</dt>
                          <dd className="text-zinc-300 mt-0.5 line-clamp-2">{formData.paymentMethods}</dd>
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
                      <Printer className="h-4 w-4 text-blue-400" />
                      Imprimir ou Salvar PDF
                    </button>

                    <button
                      onClick={downloadTxtReport}
                      type="button"
                      className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 border border-white/10 text-white text-xs font-semibold py-3.5 px-6 rounded-xl transition-all"
                    >
                      <FileText className="h-4 w-4 text-blue-400" />
                      Baixar Relatório (.txt)
                    </button>
                  </div>

                  <button
                    onClick={handleReset}
                    type="button"
                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-brand-600 hover:from-blue-500 hover:to-brand-500 text-white text-xs font-semibold py-3.5 px-8 rounded-xl shadow-lg active:scale-98 transition-all duration-300 w-full sm:w-auto"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Enviar outro Briefing
                  </button>
                </div>
              ) : (
                /* ================= MULTI-STEP WIZARD FORM ================= */
                <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} noValidate className="space-y-8 animate-slide-up">
                  
                  {/* Stepper compacto para mobile */}
                  <div className="lg:hidden flex items-center justify-between mb-4 bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md">
                    <span className="text-xs md:text-[11px] font-bold text-blue-400 uppercase tracking-wider">Passo {currentStep} de 5</span>
                    <span className="text-sm md:text-xs font-semibold text-zinc-300">{STEPS[currentStep - 1].shortTitle}</span>
                  </div>
                  
                  {/* 1. PASSO: CONTEXTO E ROTINA ATUAL */}
                  {currentStep === 1 && (
                    <fieldset className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-xl hover:border-white/15 transition-all duration-300">
                      <legend className="float-left w-full flex items-center gap-3 text-lg md:text-xl font-bold text-white mb-2">
                        <div className="h-8 w-8 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400">
                          <Building2 className="h-4.5 w-4.5" />
                        </div>
                        <span>1. Contexto e Rotina Atual</span>
                      </legend>
                      <p className="clear-left text-sm md:text-xs text-zinc-400 mb-8 border-b border-zinc-800/80 pb-4">
                        {STEPS[0].description}
                      </p>
                      
                      <div className="space-y-6">
                        {/* Project Name */}
                        <div>
                          <div className="flex justify-between items-baseline mb-2">
                            <label htmlFor="projectName" className="block text-base md:text-sm font-semibold text-zinc-300">
                              Qual é o nome oficial do Sindicato ou do projeto? <span className="text-rose-500" aria-hidden="true">*</span>
                            </label>
                            <span className="text-xs md:text-[10px] text-zinc-500">Obrigatório</span>
                          </div>
                          <input
                            type="text"
                            id="projectName"
                            name="projectName"
                            value={formData.projectName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="Ex: Sindicato dos Transportadores do Estado, Sindisul"
                            aria-required="true"
                            aria-invalid={!!errors.projectName}
                            aria-describedby={errors.projectName ? "projectName-error" : undefined}
                            className={`w-full bg-zinc-900/60 border rounded-xl px-4 py-3 text-base md:text-sm text-white placeholder-zinc-600 transition-all ${
                              errors.projectName && touched.projectName
                                ? 'border-rose-500/50 bg-rose-500/5 focus:border-rose-500'
                                : 'border-zinc-800 focus:border-blue-500'
                            }`}
                          />
                          {errors.projectName && touched.projectName && (
                            <div id="projectName-error" className="flex items-center gap-1.5 mt-2 text-xs md:text-[10px] text-rose-400 font-medium" role="alert">
                              <AlertCircle className="h-3 w-3" />
                              <span>{errors.projectName}</span>
                            </div>
                          )}
                        </div>

                        {/* Current Process */}
                        <div>
                          <div className="flex justify-between items-baseline mb-2">
                            <label htmlFor="currentProcess" className="block text-base md:text-sm font-semibold text-zinc-300">
                              Como é feito o controle de pagamentos e arrecadação dos filiados hoje? <span className="text-rose-500" aria-hidden="true">*</span>
                            </label>
                            <span className="text-xs md:text-[10px] text-zinc-500">Mínimo 10 caracteres</span>
                          </div>
                          <textarea
                            id="currentProcess"
                            name="currentProcess"
                            value={formData.currentProcess}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            rows={3}
                            placeholder="Ex: Controlamos por planilhas de Excel. Um funcionário gera boletos manualmente no banco e envia por e-mail, e as baixas dos pagamentos são anotadas manualmente uma a uma..."
                            aria-required="true"
                            aria-invalid={!!errors.currentProcess}
                            aria-describedby={errors.currentProcess ? "currentProcess-error" : undefined}
                            className={`w-full bg-zinc-900/60 border rounded-xl px-4 py-3 text-base md:text-sm text-white placeholder-zinc-600 transition-all resize-y ${
                              errors.currentProcess && touched.currentProcess
                                ? 'border-rose-500/50 bg-rose-500/5 focus:border-rose-500'
                                : 'border-zinc-800 focus:border-blue-500'
                            }`}
                          />
                          {errors.currentProcess && touched.currentProcess && (
                            <div id="currentProcess-error" className="flex items-center gap-1.5 mt-2 text-xs md:text-[10px] text-rose-400 font-medium" role="alert">
                              <AlertCircle className="h-3 w-3" />
                              <span>{errors.currentProcess}</span>
                            </div>
                          )}
                        </div>

                        {/* Main Bottlenecks */}
                        <div>
                          <div className="flex justify-between items-baseline mb-2">
                            <label htmlFor="mainBottlenecks" className="block text-base md:text-sm font-semibold text-zinc-300">
                              Quais são os maiores gargalos financeiros atuais que o sistema precisa resolver obrigatoriamente? <span className="text-rose-500" aria-hidden="true">*</span>
                            </label>
                            <span className="text-xs md:text-[10px] text-zinc-500">Obrigatório</span>
                          </div>
                          <textarea
                            id="mainBottlenecks"
                            name="mainBottlenecks"
                            value={formData.mainBottlenecks}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            rows={3}
                            placeholder="Ex: Muito tempo gasto gerando e reenviando boletos vencidos, dificuldade de identificar filiados inadimplentes para fazer cobranças e falta de relatórios de receitas futuras."
                            aria-required="true"
                            aria-invalid={!!errors.mainBottlenecks}
                            aria-describedby={errors.mainBottlenecks ? "mainBottlenecks-error" : undefined}
                            className={`w-full bg-zinc-900/60 border rounded-xl px-4 py-3 text-base md:text-sm text-white placeholder-zinc-600 transition-all resize-y ${
                              errors.mainBottlenecks && touched.mainBottlenecks
                                ? 'border-rose-500/50 bg-rose-500/5 focus:border-rose-500'
                                : 'border-zinc-800 focus:border-blue-500'
                            }`}
                          />
                          {errors.mainBottlenecks && touched.mainBottlenecks && (
                            <div id="mainBottlenecks-error" className="flex items-center gap-1.5 mt-2 text-xs md:text-[10px] text-rose-400 font-medium" role="alert">
                              <AlertCircle className="h-3 w-3" />
                              <span>{errors.mainBottlenecks}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </fieldset>
                  )}

                  {/* 2. PASSO: FLUXO FINANCEIRO */}
                  {currentStep === 2 && (
                    <fieldset className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-xl hover:border-white/15 transition-all duration-300">
                      <legend className="float-left w-full flex items-center gap-3 text-lg md:text-xl font-bold text-white mb-2">
                        <div className="h-8 w-8 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400">
                          <CreditCard className="h-4.5 w-4.5" />
                        </div>
                        <span>2. Fluxo Financeiro (O Core do Sistema)</span>
                      </legend>
                      <p className="clear-left text-sm md:text-xs text-zinc-400 mb-8 border-b border-zinc-800/80 pb-4">
                        {STEPS[1].description}
                      </p>

                      <div className="space-y-6">
                        {/* Payment Methods */}
                        <div>
                          <label htmlFor="paymentMethods" className="block text-base md:text-sm font-semibold text-zinc-300 mb-2">
                            Quais serão os métodos de pagamento aceitos pelo sistema?
                          </label>
                          <textarea
                            id="paymentMethods"
                            name="paymentMethods"
                            value={formData.paymentMethods}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Ex: Pix automatizado com baixa imediata, Boleto Bancário e Cartão de Crédito recorrente."
                            className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 text-base md:text-sm text-white placeholder-zinc-600 focus:border-blue-500 transition-all resize-y"
                          />
                        </div>

                        {/* Billing Rules */}
                        <div>
                          <label htmlFor="billingRules" className="block text-base md:text-sm font-semibold text-zinc-300 mb-2">
                            Como funcionam as cobranças do sindicato? (Recorrência, taxas pontuais, valores por categoria)
                          </label>
                          <textarea
                            id="billingRules"
                            name="billingRules"
                            value={formData.billingRules}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Ex: Mensalidades recorrentes. Motoristas autônomos pagam R$ 50/mês, e transportadoras pagam R$ 150/mês. Há também uma taxa anual de homologação de convenção."
                            className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 text-base md:text-sm text-white placeholder-zinc-600 focus:border-blue-500 transition-all resize-y"
                          />
                        </div>

                        {/* Overdue Actions */}
                        <div>
                          <label htmlFor="overdueActions" className="block text-base md:text-sm font-semibold text-zinc-300 mb-2">
                            O que o sistema deve fazer quando um pagamento atrasa?
                          </label>
                          <textarea
                            id="overdueActions"
                            name="overdueActions"
                            value={formData.overdueActions}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Ex: Calcular juros diários de 0,33% e multa de 2%, enviar e-mail e WhatsApp automático após 2, 5 e 10 dias de atraso, e bloquear o download da carteirinha após 15 dias de atraso."
                            className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 text-base md:text-sm text-white placeholder-zinc-600 focus:border-blue-500 transition-all resize-y"
                          />
                        </div>
                      </div>
                    </fieldset>
                  )}

                  {/* 3. PASSO: PERFIS DE ACESSO E PORTAL */}
                  {currentStep === 3 && (
                    <fieldset className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-xl hover:border-white/15 transition-all duration-300">
                      <legend className="float-left w-full flex items-center gap-3 text-lg md:text-xl font-bold text-white mb-2">
                        <div className="h-8 w-8 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400">
                          <Users2 className="h-4.5 w-4.5" />
                        </div>
                        <span>3. Perfis de Usuário e Acessos</span>
                      </legend>
                      <p className="clear-left text-sm md:text-xs text-zinc-400 mb-8 border-b border-zinc-800/80 pb-4">
                        {STEPS[2].description}
                      </p>

                      <div className="space-y-6">
                        {/* Admin Profiles */}
                        <div>
                          <label htmlFor="adminProfiles" className="block text-base md:text-sm font-semibold text-zinc-300 mb-2">
                            Quem vai operar o sistema internamente no Sindicato e quais os perfis de acesso?
                          </label>
                          <textarea
                            id="adminProfiles"
                            name="adminProfiles"
                            value={formData.adminProfiles}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Ex: Administrador Geral (acesso total), Setor Financeiro (vê pagamentos e gera relatórios) e Auditoria (apenas visualização dos lançamentos)."
                            className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 text-base md:text-sm text-white placeholder-zinc-600 focus:border-blue-500 transition-all resize-y"
                          />
                        </div>

                        {/* Member Portal */}
                        <div>
                          <label htmlFor="memberPortal" className="block text-base md:text-sm font-semibold text-zinc-300 mb-2">
                            O filiado (motorista/transportador) terá um portal próprio? Quais ações ele poderá fazer nele?
                          </label>
                          <textarea
                            id="memberPortal"
                            name="memberPortal"
                            value={formData.memberPortal}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Ex: Sim, portal logado (CPF/CNPJ + senha). Nele ele pode atualizar os dados cadastrais, emitir 2ª via de boletos, pagar via PIX copiando o código e fazer o download da carteirinha digital."
                            className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 text-base md:text-sm text-white placeholder-zinc-600 focus:border-blue-500 transition-all resize-y"
                          />
                        </div>
                      </div>
                    </fieldset>
                  )}

                  {/* 4. PASSO: INTEGRAÇÕES E RELATÓRIOS */}
                  {currentStep === 4 && (
                    <fieldset className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-xl hover:border-white/15 transition-all duration-300">
                      <legend className="float-left w-full flex items-center gap-3 text-lg md:text-xl font-bold text-white mb-2">
                        <div className="h-8 w-8 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400">
                          <Receipt className="h-4.5 w-4.5" />
                        </div>
                        <span>4. Integrações e Relatórios</span>
                      </legend>
                      <p className="clear-left text-sm md:text-xs text-zinc-400 mb-8 border-b border-zinc-800/80 pb-4">
                        {STEPS[3].description}
                      </p>

                      <div className="space-y-6">
                        {/* Receipts Generation */}
                        <div>
                          <label htmlFor="receiptsGeneration" className="block text-base md:text-sm font-semibold text-zinc-300 mb-2">
                            O sistema precisa gerar Notas Fiscais ou Recibos automatizados?
                          </label>
                          <textarea
                            id="receiptsGeneration"
                            name="receiptsGeneration"
                            value={formData.receiptsGeneration}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Ex: Recibos automatizados enviados por e-mail após a confirmação. Notas fiscais de serviço (NFS-e) para as homologações pagas por transportadoras."
                            className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 text-base md:text-sm text-white placeholder-zinc-600 focus:border-blue-500 transition-all resize-y"
                          />
                        </div>

                        {/* Main Reports */}
                        <div>
                          <label htmlFor="mainReports" className="block text-base md:text-sm font-semibold text-zinc-300 mb-2">
                            Quais relatórios são mais importantes para a diretoria visualizar no painel inicial (Dashboard)?
                          </label>
                          <textarea
                            id="mainReports"
                            name="mainReports"
                            value={formData.mainReports}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Ex: Receita arrecadada do mês corrente, Taxa de inadimplência ativa e Gráfico de Novos Filiados vs Desfiliações."
                            className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 text-base md:text-sm text-white placeholder-zinc-600 focus:border-blue-500 transition-all resize-y"
                          />
                        </div>

                        {/* External Systems */}
                        <div>
                          <label htmlFor="externalSystems" className="block text-base md:text-sm font-semibold text-zinc-300 mb-2">
                            Existe algum sistema externo com o qual precisaremos nos integrar? (Contabilidade, bancos, etc.)
                          </label>
                          <textarea
                            id="externalSystems"
                            name="externalSystems"
                            value={formData.externalSystems}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Ex: Integração via arquivo de remessa/retorno ou API direta com o Banco do Brasil, e exportação mensal em Excel formatado para enviar ao sistema do contador."
                            className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 text-base md:text-sm text-white placeholder-zinc-600 focus:border-blue-500 transition-all resize-y"
                          />
                        </div>
                      </div>
                    </fieldset>
                  )}

                  {/* 5. PASSO: DESIGN E PRAZO */}
                  {currentStep === 5 && (
                    <fieldset className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-xl hover:border-white/15 transition-all duration-300">
                      <legend className="float-left w-full flex items-center gap-3 text-lg md:text-xl font-bold text-white mb-2">
                        <div className="h-8 w-8 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400">
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
                          <label htmlFor="brandIdentity" className="block text-base md:text-sm font-semibold text-zinc-300 mb-2">
                            Existe uma identidade visual, logotipo ou cores institucionais a seguir?
                          </label>
                          <textarea
                            id="brandIdentity"
                            name="brandIdentity"
                            value={formData.brandIdentity}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Ex: Sim, possuímos manual de marca. A cor principal é azul escuro (#0a2540) com detalhes em amarelo."
                            className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 text-base md:text-sm text-white placeholder-zinc-600 focus:border-blue-500 transition-all resize-y"
                          />
                        </div>

                        {/* References */}
                        <div>
                          <div className="flex justify-between items-baseline mb-2">
                            <label htmlFor="references" className="block text-base md:text-sm font-semibold text-zinc-300">
                              Indique sistemas de pagamento ou painéis de gestão que você considera referências estéticas ou funcionais.
                            </label>
                            <span className="text-xs md:text-[10px] text-zinc-500">Opcional</span>
                          </div>
                          <textarea
                            id="references"
                            name="references"
                            value={formData.references}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            rows={3}
                            placeholder="Ex: Gostamos do estilo limpo da dashboard do Asaas, e da simplicidade do fluxo de pagamento da Stripe..."
                            aria-invalid={!!errors.references}
                            aria-describedby={errors.references ? "references-error" : undefined}
                            className={`w-full bg-zinc-900/60 border rounded-xl px-4 py-3 text-base md:text-sm text-white placeholder-zinc-600 transition-all resize-y ${
                              errors.references && touched.references
                                ? 'border-rose-500/50 bg-rose-500/5 focus:border-rose-500'
                                : 'border-zinc-800 focus:border-blue-500'
                            }`}
                          />
                          {errors.references && touched.references && (
                            <div id="references-error" className="flex items-center gap-1.5 mt-2 text-xs md:text-[10px] text-rose-400 font-medium" role="alert">
                              <AlertCircle className="h-3 w-3" />
                              <span>{errors.references}</span>
                            </div>
                          )}
                        </div>

                        {/* Deadline */}
                        <div>
                          <label htmlFor="deadline" className="block text-xs md:text-sm font-semibold text-zinc-300 mb-2">
                            Qual é o prazo limite ideal ou a data planejada para o lançamento do sistema?
                          </label>
                          <input
                            type="text"
                            id="deadline"
                            name="deadline"
                            value={formData.deadline}
                            onChange={handleChange}
                            placeholder="Ex: Em até 3 meses, ou até o fim de setembro para coincidir com a próxima assembleia."
                            className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 text-base md:text-sm text-white placeholder-zinc-600 focus:border-blue-500 transition-all"
                          />
                        </div>
                      </div>
                    </fieldset>
                  )}

                  {/* BOTOES DE AÇÃO */}
                  <div className="flex justify-between items-center pt-4 border-t border-zinc-800/60">
                    <button
                      type="button"
                      onClick={handleBack}
                      disabled={currentStep === 1 || status.state === 'loading'}
                      className="inline-flex items-center justify-center gap-2 bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/50 text-zinc-300 text-sm md:text-xs font-semibold py-3.5 px-6 rounded-xl active:scale-98 disabled:opacity-30 disabled:cursor-not-allowed disabled:active:scale-100 transition-all"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span>Voltar</span>
                    </button>

                    {currentStep < 5 ? (
                      <button
                        type="button"
                        onClick={handleNext}
                        className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-brand-600 hover:from-blue-500 hover:to-brand-500 text-white text-sm md:text-xs font-semibold py-3.5 px-8 rounded-xl shadow-lg active:scale-98 transition-all duration-300"
                      >
                        <span>Continuar</span>
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={status.state === 'loading'}
                        className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-brand-600 hover:from-blue-500 hover:to-brand-500 text-white text-sm md:text-xs font-semibold py-3.5 px-10 rounded-xl shadow-lg hover:shadow-blue-500/25 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
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
          <h1 className="text-2xl font-bold tracking-tight uppercase">Briefing de Gestão de Pagamentos</h1>
          <p className="text-xs font-bold text-zinc-600 mt-1">SISTEMA FINANCEIRO PARA SINDICATO // ANDERSON JOSÉ BRANDING</p>
          <div className="flex justify-between text-[10px] text-zinc-500 mt-4">
            <span>Sindicato: <strong>{formData.projectName}</strong></span>
            <span>Data de Envio: <strong>{new Date().toLocaleDateString('pt-BR')}</strong></span>
          </div>
        </div>

        <div className="space-y-6">
          {/* 1. Contexto e Rotina Atual */}
          <section className="avoid-break animate-fade-in">
            <h2 className="text-sm font-bold uppercase border-b border-zinc-300 pb-1 mb-3 text-zinc-800">1. Contexto e Rotina Atual</h2>
            <table className="w-full text-xs border-collapse">
              <tbody>
                <tr className="border-b border-zinc-100">
                  <td className="py-2 font-semibold text-zinc-600 w-1/3">Nome do Sindicato/Projeto</td>
                  <td className="py-2 text-zinc-900">{formData.projectName}</td>
                </tr>
                <tr className="border-b border-zinc-100">
                  <td className="py-2 font-semibold text-zinc-600 w-1/3 valign-top">Rotina de Pagamento Atual</td>
                  <td className="py-2 text-zinc-900 whitespace-pre-wrap">{formData.currentProcess}</td>
                </tr>
                <tr className="border-b border-zinc-100">
                  <td className="py-2 font-semibold text-zinc-600 w-1/3 valign-top">Maiores Gargalos Financeiros</td>
                  <td className="py-2 text-zinc-900 whitespace-pre-wrap">{formData.mainBottlenecks}</td>
                </tr>
              </tbody>
            </table>
          </section>

          {/* 2. Fluxo Financeiro */}
          <section className="avoid-break">
            <h2 className="text-sm font-bold uppercase border-b border-zinc-300 pb-1 mb-3 text-zinc-800">2. Fluxo Financeiro (O Core)</h2>
            <table className="w-full text-xs border-collapse">
              <tbody>
                <tr className="border-b border-zinc-100">
                  <td className="py-2 font-semibold text-zinc-600 w-1/3 valign-top">Métodos de Pagamento Aceitos</td>
                  <td className="py-2 text-zinc-900 whitespace-pre-wrap">{formData.paymentMethods || 'Não informado'}</td>
                </tr>
                <tr className="border-b border-zinc-100">
                  <td className="py-2 font-semibold text-zinc-600 w-1/3 valign-top">Funcionamento das Cobranças</td>
                  <td className="py-2 text-zinc-900 whitespace-pre-wrap">{formData.billingRules || 'Não informado'}</td>
                </tr>
                <tr className="border-b border-zinc-100">
                  <td className="py-2 font-semibold text-zinc-600 w-1/3 valign-top">Ações para Inadimplência/Atrasos</td>
                  <td className="py-2 text-zinc-900 whitespace-pre-wrap">{formData.overdueActions || 'Não informado'}</td>
                </tr>
              </tbody>
            </table>
          </section>

          {/* 3. Perfis e Acesso */}
          <section className="avoid-break">
            <h2 className="text-sm font-bold uppercase border-b border-zinc-300 pb-1 mb-3 text-zinc-800">3. Perfis de Usuário e Acessos</h2>
            <table className="w-full text-xs border-collapse">
              <tbody>
                <tr className="border-b border-zinc-100">
                  <td className="py-2 font-semibold text-zinc-600 w-1/3 valign-top">Níveis de Permissões (Interno)</td>
                  <td className="py-2 text-zinc-900 whitespace-pre-wrap">{formData.adminProfiles || 'Não informado'}</td>
                </tr>
                <tr className="border-b border-zinc-100">
                  <td className="py-2 font-semibold text-zinc-600 w-1/3 valign-top">Portal do Filiado (Recursos)</td>
                  <td className="py-2 text-zinc-900 whitespace-pre-wrap">{formData.memberPortal || 'Não informado'}</td>
                </tr>
              </tbody>
            </table>
          </section>

          {/* 4. Integrações e Relatórios */}
          <section className="avoid-break">
            <h2 className="text-sm font-bold uppercase border-b border-zinc-300 pb-1 mb-3 text-zinc-800">4. Integrações e Relatórios</h2>
            <table className="w-full text-xs border-collapse">
              <tbody>
                <tr className="border-b border-zinc-100">
                  <td className="py-2 font-semibold text-zinc-600 w-1/3 valign-top">Geração de Notas/Recibos</td>
                  <td className="py-2 text-zinc-900 whitespace-pre-wrap">{formData.receiptsGeneration || 'Não informado'}</td>
                </tr>
                <tr className="border-b border-zinc-100">
                  <td className="py-2 font-semibold text-zinc-600 w-1/3 valign-top">Relatórios Fundamentais</td>
                  <td className="py-2 text-zinc-900 whitespace-pre-wrap">{formData.mainReports || 'Não informado'}</td>
                </tr>
                <tr className="border-b border-zinc-100">
                  <td className="py-2 font-semibold text-zinc-600 w-1/3 valign-top">Sistemas Externos / Conexões</td>
                  <td className="py-2 text-zinc-900 whitespace-pre-wrap">{formData.externalSystems || 'Não informado'}</td>
                </tr>
              </tbody>
            </table>
          </section>

          {/* 5. Design, Referências e Prazo */}
          <section className="avoid-break">
            <h2 className="text-sm font-bold uppercase border-b border-zinc-300 pb-1 mb-3 text-zinc-800">5. Design, Referências e Prazo</h2>
            <table className="w-full text-xs border-collapse">
              <tbody>
                <tr className="border-b border-zinc-100">
                  <td className="py-2 font-semibold text-zinc-600 w-1/3 valign-top">Identidade Visual Existente</td>
                  <td className="py-2 text-zinc-900 whitespace-pre-wrap">{formData.brandIdentity || 'Não informado'}</td>
                </tr>
                <tr className="border-b border-zinc-100">
                  <td className="py-2 font-semibold text-zinc-600 w-1/3 valign-top">Referências Visuais/Sistemas</td>
                  <td className="py-2 text-zinc-900 whitespace-pre-wrap">{formData.references || 'Não informado'}</td>
                </tr>
                <tr className="border-b border-zinc-100">
                  <td className="py-2 font-semibold text-zinc-600 w-1/3">Prazo Estimado de Lançamento</td>
                  <td className="py-2 text-zinc-900">{formData.deadline || 'Não informado'}</td>
                </tr>
              </tbody>
            </table>
          </section>
        </div>

        <div className="mt-12 pt-4 border-t border-zinc-200 text-center text-[9px] text-zinc-400">
          Documento gerado eletronicamente em {new Date().toLocaleString('pt-BR')} por Anderson José Branding. Todos os direitos reservados.
        </div>
      </div>
    </>
  );
}
