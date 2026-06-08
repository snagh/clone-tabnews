import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { 
  Sparkles, 
  Building2, 
  HelpCircle, 
  Bookmark,
  History,
  TrendingUp,
  Frown,
  Users2,
  HeartHandshake,
  ShieldCheck,
  Palette,
  MapPin,
  Clock,
  ArrowRight, 
  ArrowLeft,
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  RefreshCw,
  ExternalLink,
  MessageSquare,
  Volume2,
  Printer,
  FileText
} from 'lucide-react';
import type { BriefingFormData, BriefingFormErrors, SubmissionStatus, BriefingField } from '../types/briefing';

const initialFormData: BriefingFormData = {
  // 1. O Básico
  logoName: '',
  slogan: '',
  businessDescription: '',
  rebrandingReason: '',
  currentBrandIssues: '',
  keepFromOldIdentity: '',

  // 2. Raio-X
  companyHistory: '',
  whyChooseUs: '',
  worstComplaint: '',
  brandPositioningStatement: '',

  // 3. Público e Concorrência
  targetAudience: '',
  customerPainPoints: '',
  competitorsAnalysis: '',

  // 4. Personalidade
  brandPartyHosting: '',
  brandPersonaAvatar: '',
  brandCommunicationTone: '',
  brandDesirableAdjectives: '',
  brandUndesirableAdjectives: '',

  // 5. Direção Visual
  brandFirstImpression: '',
  visualsToAvoid: '',
  brandPrimaryTouchpoints: '',
  immediateDeliverables: '',
  referenceLinks: '',
  deadlineOrLaunchDate: '',
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
    title: '1. O Básico (Estrutura e Escopo)',
    shortTitle: 'O Básico',
    icon: Building2,
    description: 'Definição do nome do logotipo, escopo da empresa e motivos do projeto.'
  },
  {
    number: 2,
    title: '2. Raio-X do Negócio (Posicionamento Oculto)',
    shortTitle: 'Raio-X do Negócio',
    icon: History,
    description: 'A alma e história da empresa, seus pontos de orgulho e posicionamento.'
  },
  {
    number: 3,
    title: '3. Público-Alvo e Concorrência',
    shortTitle: 'Público e Concorrência',
    icon: Users2,
    description: 'Quem é seu cliente ideal e o ecossistema de concorrentes.'
  },
  {
    number: 4,
    title: '4. Personalidade da Marca (Extração Psicológica)',
    shortTitle: 'Personalidade da Marca',
    icon: Volume2,
    description: 'A voz, arquétipo, adjetivos e a personificação da sua empresa.'
  },
  {
    number: 5,
    title: '5. Direção Visual e Entregáveis (A Aplicação Prática)',
    shortTitle: 'Direção Visual',
    icon: Palette,
    description: 'Estética visual, materiais necessários, links de referência e prazos.'
  }
];

export default function BrandingBriefingForm() {
  const [formData, setFormData] = useState<BriefingFormData>(initialFormData);
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<BriefingFormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<SubmissionStatus>({ state: 'idle' });
  const [progress, setProgress] = useState(0);

  // Calculates completion progress percentage out of all 24 fields (2 required, others optional)
  useEffect(() => {
    const totalFields = 24;
    let filledFields = 0;
    
    Object.keys(formData).forEach((key) => {
      if (formData[key as BriefingField]?.trim()) {
        filledFields++;
      }
    });
    
    setProgress(Math.round((filledFields / totalFields) * 100));
  }, [formData]);

  // Real-time single field validation
  const validateField = (name: BriefingField, value: string): string => {
    // Step 1 Required Fields
    if (name === 'logoName') {
      if (!value.trim()) return 'O nome exato a constar no logo é obrigatório.';
      if (value.trim().length < 2) return 'O nome deve ter pelo menos 2 caracteres.';
    }
    
    if (name === 'businessDescription') {
      if (!value.trim()) return 'A explicação da atuação é obrigatória.';
      if (value.trim().length < 10) return 'Por favor, detalhe em pelo menos 10 caracteres.';
    }
    
    if (name === 'rebrandingReason') {
      if (!value.trim()) return 'A razão do rebranding neste momento é obrigatória.';
      if (value.trim().length < 10) return 'Por favor, descreva em pelo menos 10 caracteres.';
    }
    
    // Step 5 URL Field Validation - Relaxed to allow free-form references
    if (name === 'referenceLinks' && value.trim()) {
      return '';
    }
    
    return '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target as { name: BriefingField; value: string };
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (touched[name]) {
      const errorMsg = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: errorMsg || undefined }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target as { name: BriefingField; value: string };
    setTouched(prev => ({ ...prev, [name]: true }));
    const errorMsg = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: errorMsg || undefined }));
  };

  const selectTone = (tone: string) => {
    setFormData(prev => ({ ...prev, brandCommunicationTone: tone }));
    setTouched(prev => ({ ...prev, brandCommunicationTone: true }));
  };

  // Pure helper to check if a step is valid without updating state (no re-renders)
  const isStepValid = (stepNum: number): boolean => {
    if (stepNum === 1) {
      return !!formData.logoName.trim() && 
             !!formData.businessDescription.trim() && 
             !!formData.rebrandingReason.trim() &&
             formData.logoName.trim().length >= 2 &&
             formData.businessDescription.trim().length >= 10 &&
             formData.rebrandingReason.trim().length >= 10;
    }
    return true;
  };

  // Helper to validate all fields in a specific step
  const validateStep = (step: number): boolean => {
    const stepErrors: BriefingFormErrors = {};
    let fieldsToValidate: BriefingField[] = [];

    if (step === 1) {
      fieldsToValidate = ['logoName', 'businessDescription', 'rebrandingReason'];
    } else if (step === 5) {
      fieldsToValidate = ['referenceLinks'];
    }

    fieldsToValidate.forEach(field => {
      const errorMsg = validateField(field, formData[field]);
      if (errorMsg) {
        stepErrors[field] = errorMsg;
      }
    });

    setErrors(prev => ({ ...prev, ...stepErrors }));

    // Mark these step fields as touched
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
      // Focus the first error field in the current step
      const firstError = Object.keys(errors).find(key => {
        if (currentStep === 1) return ['logoName', 'businessDescription', 'rebrandingReason'].includes(key);
        if (currentStep === 5) return ['referenceLinks'].includes(key);
        return false;
      }) as BriefingField | undefined;

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
    
    // Se o usuário pressionar Enter em qualquer input antes da etapa 5, apenas avançamos de etapa em vez de submeter
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
          ['logoName', 'businessDescription', 'rebrandingReason'].includes(key)
        );
        const errorField = document.getElementById(firstError || 'logoName');
        errorField?.focus();
        errorField?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
      return;
    }
    
    if (!isStep5Valid) {
      setCurrentStep(5);
      setTimeout(() => {
        const errorField = document.getElementById('referenceLinks');
        errorField?.focus();
        errorField?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
      return;
    }
    
    setStatus({ state: 'loading' });
    console.log('%c[Briefing Submission Initiated]', 'color: #8b5cf6; font-weight: bold;', formData);
    
    const reportText = `==================================================
BRIEFING ESTRATÉGICO DE BRANDING - ANDERSON JOSÉ BRANDING
==================================================
Empresa / Logotipo: ${formData.logoName}
Data de Envio: ${new Date().toLocaleDateString('pt-BR')}

1. O BÁSICO (ESTRUTURA E ESCOPO)
--------------------------------------------------
* Nome exato no logo: ${formData.logoName}
* Slogan/Frase de apoio: ${formData.slogan || 'Não informado'}
* O que a empresa faz: 
  ${formData.businessDescription}
* Razão do Rebranding: 
  ${formData.rebrandingReason}
* O que incomoda na marca atual: 
  ${formData.currentBrandIssues || 'Não informado'}
* Elemento obrigatório a manter: 
  ${formData.keepFromOldIdentity || 'Não informado'}

2. RAIO-X DO NEGÓCIO (POSICIONAMENTO OCULTO)
--------------------------------------------------
* História/Inspiração: 
  ${formData.companyHistory || 'Não informado'}
* Por que o cliente nos escolhe: 
  ${formData.whyChooseUs || 'Não informado'}
* Pior reclamação/dor no orgulho: 
  ${formData.worstComplaint || 'Não informado'}
* Declaração de posicionamento: 
  ${formData.brandPositioningStatement || 'Não informado'}

3. PÚBLICO-ALVO E CONCORRÊNCIA
--------------------------------------------------
* Cliente Ideal: 
  ${formData.targetAudience || 'Não informado'}
* Principal dor do cliente: 
  ${formData.customerPainPoints || 'Não informado'}
* Análise de Concorrentes: 
  ${formData.competitorsAnalysis || 'Não informado'}

4. PERSONALIDADE DA MARCA (EXTRAÇÃO PSICOLÓGICA)
--------------------------------------------------
* Marca como anfitriã de festa: 
  ${formData.brandPartyHosting || 'Não informado'}
* Personificação/Avatar: 
  ${formData.brandPersonaAvatar || 'Não informado'}
* Tom de Voz/Comunicação: 
  ${formData.brandCommunicationTone || 'Não informado'}
* Adjetivos desejados: 
  ${formData.brandDesirableAdjectives || 'Não informado'}
* Adjetivos indesejados: 
  ${formData.brandUndesirableAdjectives || 'Não informado'}

5. DIREÇÃO VISUAL E ENTREGÁVEIS (APLICAÇÃO PRÁTICA)
--------------------------------------------------
* Primeira sensação desejada: 
  ${formData.brandFirstImpression || 'Não informado'}
* Elementos a evitar: 
  ${formData.visualsToAvoid || 'Não informado'}
* Onde a marca será mais vista: 
  ${formData.brandPrimaryTouchpoints || 'Não informado'}
* Materiais prioritários/de imediato: 
  ${formData.immediateDeliverables || 'Não informado'}
* Links de Referência: 
  ${formData.referenceLinks || 'Não informado'}
* Prazo limite/Data de lançamento: 
  ${formData.deadlineOrLaunchDate || 'Não informado'}

==================================================
Relatório gerado em ${new Date().toLocaleString('pt-BR')} por Anderson José Branding.
==================================================`;
    
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'branding',
          subject: `Novo Briefing de Rebranding: ${formData.logoName}`,
          content: reportText,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao processar o envio do e-mail.');
      }
      
      const resData = await response.json();
      console.log('%c[Briefing Submission API Response]', 'color: #10b981; font-weight: bold;', resData);
      
      setStatus({ state: 'success' });
    } catch (error: any) {
      console.error('%c[Briefing Submission Failure]', 'color: #ef4444; font-weight: bold;', error);
      setStatus({ 
        state: 'error', 
        errorMessage: error?.message || 'Erro ao enviar o briefing. Por favor, tente novamente ou verifique sua conexão.' 
      });
    }
  };

  const downloadTxtReport = () => {
    const report = `==================================================
BRIEFING ESTRATÉGICO DE BRANDING - ANDERSON JOSÉ BRANDING
==================================================
Empresa / Logotipo: ${formData.logoName}
Data de Envio: ${new Date().toLocaleDateString('pt-BR')}

1. O BÁSICO (ESTRUTURA E ESCOPO)
--------------------------------------------------
* Nome exato no logo: ${formData.logoName}
* Slogan/Frase de apoio: ${formData.slogan || 'Não informado'}
* O que a empresa faz: 
  ${formData.businessDescription}
* Razão do Rebranding: 
  ${formData.rebrandingReason}
* O que incomoda na marca atual: 
  ${formData.currentBrandIssues || 'Não informado'}
* Elemento obrigatório a manter: 
  ${formData.keepFromOldIdentity || 'Não informado'}

2. RAIO-X DO NEGÓCIO (POSICIONAMENTO OCULTO)
--------------------------------------------------
* História/Inspiração: 
  ${formData.companyHistory || 'Não informado'}
* Por que o cliente nos escolhe: 
  ${formData.whyChooseUs || 'Não informado'}
* Pior reclamação/dor no orgulho: 
  ${formData.worstComplaint || 'Não informado'}
* Declaração de posicionamento: 
  ${formData.brandPositioningStatement || 'Não informado'}

3. PÚBLICO-ALVO E CONCORRÊNCIA
--------------------------------------------------
* Cliente Ideal: 
  ${formData.targetAudience || 'Não informado'}
* Principal dor do cliente: 
  ${formData.customerPainPoints || 'Não informado'}
* Análise de Concorrentes: 
  ${formData.competitorsAnalysis || 'Não informado'}

4. PERSONALIDADE DA MARCA (EXTRAÇÃO PSICOLÓGICA)
--------------------------------------------------
* Marca como anfitriã de festa: 
  ${formData.brandPartyHosting || 'Não informado'}
* Personificação/Avatar: 
  ${formData.brandPersonaAvatar || 'Não informado'}
* Tom de Voz/Comunicação: 
  ${formData.brandCommunicationTone || 'Não informado'}
* Adjetivos desejados: 
  ${formData.brandDesirableAdjectives || 'Não informado'}
* Adjetivos indesejados: 
  ${formData.brandUndesirableAdjectives || 'Não informado'}

5. DIREÇÃO VISUAL E ENTREGÁVEIS (APLICAÇÃO PRÁTICA)
--------------------------------------------------
* Primeira sensação desejada: 
  ${formData.brandFirstImpression || 'Não informado'}
* Elementos a evitar: 
  ${formData.visualsToAvoid || 'Não informado'}
* Onde a marca será mais vista: 
  ${formData.brandPrimaryTouchpoints || 'Não informado'}
* Materiais prioritários/de imediato: 
  ${formData.immediateDeliverables || 'Não informado'}
* Links de Referência: 
  ${formData.referenceLinks || 'Não informado'}
* Prazo limite/Data de lançamento: 
  ${formData.deadlineOrLaunchDate || 'Não informado'}

==================================================
Relatório gerado em ${new Date().toLocaleString('pt-BR')} por Anderson José Branding.
==================================================`;

    const element = document.createElement("a");
    const file = new Blob([report], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `Briefing-${formData.logoName.replace(/\s+/g, '-').toLowerCase()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    // Bloqueia o envio do formulário ao pressionar Enter em qualquer input da página
    if (e.key === 'Enter') {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT') {
        e.preventDefault(); // Impede o envio indesejado da página
        
        // Se estiver nas etapas 1 a 4, avança para a próxima etapa de forma limpa
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
        <title>Briefing de Branding Avançado // Anderson José</title>
        <meta name="description" content="Formulário avançado de briefing estratégico de branding." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* STICKY HEADER MOBILE */}
        <header className="lg:hidden sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-900/60 px-4 py-3 shadow-lg -mx-4 sm:-mx-6 mb-4">
          <div className="flex items-center justify-between gap-3 mb-2.5">
            <div className="flex items-center gap-1.5">
              <div className="h-6 w-6 rounded-md bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center shadow-md shadow-brand-500/10">
                <Sparkles className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="font-extrabold tracking-wide text-xs bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-zinc-400">
                AJ <span className="text-brand-400 font-light">//</span> BRANDING
              </span>
            </div>
            {status.state !== 'success' && (
              <span className="text-[10px] font-bold text-brand-400 uppercase tracking-widest bg-brand-500/10 px-2 py-0.5 rounded-md border border-brand-500/20">
                Passo {currentStep}/5
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 bg-zinc-900/60 border border-zinc-800 p-0.5 rounded-lg w-full overflow-x-auto whitespace-nowrap [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <Link 
              href="/" 
              className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-brand-500 text-white shadow-sm transition-all"
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
              className="px-2.5 py-1 rounded-md text-[10px] font-semibold text-zinc-400 hover:text-zinc-200 transition-all"
            >
              Sindicato
            </Link>
          </div>

          {status.state !== 'success' && (
            <div className="w-full bg-zinc-900 rounded-full h-1 mt-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-brand-500 to-indigo-400 h-full rounded-full transition-all duration-300 ease-out" 
                style={{ width: `${progress}%` }} 
              />
            </div>
          )}
        </header>

        <div className="lg:grid lg:grid-cols-12 lg:gap-12 min-h-screen">
          
          {/* COLUNA ESQUERDA: Logo, Slogan e Menu do Navegador Multietapas */}
          <div className="hidden lg:flex lg:col-span-5 lg:sticky lg:top-0 lg:h-screen flex-col justify-between pt-12 pb-6 lg:py-16 text-zinc-100 z-10">
            <div>
              {/* Logo */}
              <div className="flex items-center gap-2 mb-8 group cursor-default">
                <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform duration-300">
                  <Sparkles className="h-5 w-5 text-white animate-pulse-subtle" />
                </div>
                <span className="font-extrabold tracking-wider text-lg bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-zinc-400">
                  ANDERSON JOSÉ <span className="text-brand-400 font-light">//</span> BRANDING
                </span>
              </div>

              {/* Seletor de Briefing */}
              <div className="flex items-center gap-1 bg-zinc-900/80 border border-zinc-800 p-1 rounded-xl mb-8 w-full sm:w-fit overflow-x-auto whitespace-nowrap [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <Link 
                  href="/" 
                  className="px-3 py-1.5 rounded-lg text-[11px] font-bold bg-brand-500 text-white shadow-md shadow-brand-500/10 transition-all"
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
                  className="px-3 py-1.5 rounded-lg text-[11px] font-semibold text-zinc-400 hover:text-zinc-200 transition-all"
                >
                  Gestão de Pagamentos
                </Link>
              </div>

              {/* Informações Principais */}
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight mb-4">
                Briefing Estratégico <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-400 via-indigo-300 to-indigo-500">
                  de Rebranding.
                </span>
              </h1>
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed mb-8 max-w-sm">
                Responda com sinceridade e paixão. Cada detalhe ajuda nossos designers e estrategistas a moldarem uma identidade de marca marcante e única.
              </p>
            </div>

            {/* Menu Lateral de Passos e Progresso */}
            <div className="space-y-6">
              {/* Progresso Geral */}
              {status.state !== 'success' && (
                <div className="hidden lg:block bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md shadow-2xl">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Preenchimento Geral</span>
                    <span className="text-xs font-bold text-brand-400">{progress}%</span>
                  </div>
                  <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-brand-500 to-indigo-400 h-full rounded-full transition-all duration-500 ease-out"
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
                            ? 'bg-brand-500/10 border-brand-500/30 text-white shadow-lg shadow-brand-500/5'
                            : isCompleted
                              ? 'bg-zinc-900/40 border-zinc-800 text-brand-400 hover:border-zinc-700'
                              : 'bg-transparent border-transparent text-zinc-500 cursor-not-allowed'
                        }`}
                        disabled={step.number > currentStep && !isStepValid(currentStep)}
                      >
                        <div className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 border transition-all ${
                          isActive
                            ? 'bg-brand-500/20 border-brand-500/30 text-brand-400'
                            : isCompleted
                              ? 'bg-brand-500/15 border-brand-500/25 text-brand-400'
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
              /* ================= SUCEESS STATE CARD ================= */
              <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-10 backdrop-blur-md shadow-2xl text-center relative overflow-hidden animate-slide-up">
                <div className="absolute -top-12 -right-12 w-48 h-48 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="mx-auto h-16 w-16 bg-brand-500/20 border border-brand-500/30 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-brand-500/10">
                  <CheckCircle2 className="h-9 w-9 text-brand-400" />
                </div>
                
                <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
                  Briefing Avançado Recebido!
                </h2>
                <p className="text-zinc-400 text-sm max-w-md mx-auto mb-8 leading-relaxed">
                  Agradecemos a dedicação. Este briefing completo nos dá todas as ferramentas estratégicas e artísticas necessárias para criar um rebranding extraordinário para sua marca.
                </p>

                {/* Resumo visual compacto dos dados */}
                <div className="text-left bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 mb-8 max-w-lg mx-auto text-xs md:text-sm">
                  <h3 className="text-[11px] font-bold uppercase tracking-wider text-brand-400 mb-4 border-b border-zinc-800 pb-2">
                    Resumo do Registro de Envio
                  </h3>
                  <dl className="space-y-3.5">
                    <div>
                      <dt className="text-zinc-500 font-medium">Nome no Logo</dt>
                      <dd className="text-zinc-200 font-semibold mt-0.5">{formData.logoName}</dd>
                    </div>
                    <div>
                      <dt className="text-zinc-500 font-medium">O que a empresa faz</dt>
                      <dd className="text-zinc-300 mt-0.5 line-clamp-2">{formData.businessDescription}</dd>
                    </div>
                    {formData.brandCommunicationTone && (
                      <div>
                        <dt className="text-zinc-500 font-medium">Tom de Voz Preferido</dt>
                        <dd className="text-zinc-300 mt-0.5 flex items-center gap-1.5">
                          <div className="h-1.5 w-1.5 rounded-full bg-brand-500" />
                          <span>{formData.brandCommunicationTone}</span>
                        </dd>
                      </div>
                    )}
                    {formData.deadlineOrLaunchDate && (
                      <div>
                        <dt className="text-zinc-500 font-medium">Prazo Limite / Lançamento</dt>
                        <dd className="text-zinc-300 mt-0.5">{formData.deadlineOrLaunchDate}</dd>
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
                    <Printer className="h-4 w-4 text-brand-400" />
                    Imprimir ou Salvar PDF
                  </button>

                  <button
                    onClick={downloadTxtReport}
                    type="button"
                    className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 border border-white/10 text-white text-xs font-semibold py-3.5 px-6 rounded-xl transition-all"
                  >
                    <FileText className="h-4 w-4 text-brand-400" />
                    Baixar Relatório (.txt)
                  </button>
                </div>

                <button
                  onClick={handleReset}
                  type="button"
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-xs font-semibold py-3.5 px-8 rounded-xl shadow-lg active:scale-98 transition-all duration-300 w-full sm:w-auto"
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
                  <span className="text-[11px] font-bold text-brand-400 uppercase tracking-wider">Passo {currentStep} de 5</span>
                  <span className="text-xs font-semibold text-zinc-300">{STEPS[currentStep - 1].shortTitle}</span>
                </div>
                
                {/* 1. PASSO: O BÁSICO */}
                {currentStep === 1 && (
                  <fieldset className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-xl hover:border-white/15 transition-all duration-300">
                    <legend className="float-left w-full flex items-center gap-3 text-lg md:text-xl font-bold text-white mb-2">
                      <div className="h-8 w-8 bg-brand-500/20 rounded-lg flex items-center justify-center text-brand-400">
                        <Building2 className="h-4.5 w-4.5" />
                      </div>
                      <span>1. O Básico (Estrutura e Escopo)</span>
                    </legend>
                    <p className="clear-left text-sm md:text-xs text-zinc-400 mb-8 border-b border-zinc-800/80 pb-4">
                      {STEPS[0].description}
                    </p>
                    
                    <div className="space-y-6">
                      {/* Logo Name */}
                      <div>
                        <div className="flex justify-between items-baseline mb-2">
                          <label htmlFor="logoName" className="block text-base md:text-sm font-semibold text-zinc-300">
                            Qual é o nome exato que deve constar no logo? <span className="text-rose-500" aria-hidden="true">*</span>
                          </label>
                          <span className="text-xs md:text-[10px] text-zinc-500">Obrigatório</span>
                        </div>
                        <input
                          type="text"
                          id="logoName"
                          name="logoName"
                          value={formData.logoName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Ex: Anderson José (Preferência por caixa alta em ANDERSON)"
                          aria-required="true"
                          aria-invalid={!!errors.logoName}
                          aria-describedby={errors.logoName ? "logoName-error" : undefined}
                          className={`w-full bg-zinc-900/60 border rounded-xl px-4 py-3 text-base md:text-sm text-white placeholder-zinc-600 transition-all ${
                            errors.logoName && touched.logoName
                              ? 'border-rose-500/50 bg-rose-500/5 focus:border-rose-500'
                              : 'border-zinc-800 focus:border-brand-500'
                          }`}
                        />
                        {errors.logoName && touched.logoName && (
                          <div id="logoName-error" className="flex items-center gap-1.5 mt-2 text-xs md:text-[10px] text-rose-400 font-medium" role="alert">
                            <AlertCircle className="h-3 w-3" />
                            <span>{errors.logoName}</span>
                          </div>
                        )}
                      </div>

                      {/* Slogan */}
                      <div>
                        <label htmlFor="slogan" className="block text-base md:text-sm font-semibold text-zinc-300 mb-2">
                          A marca possui algum slogan ou frase de apoio? Deve estar junto ao logo?
                        </label>
                        <input
                          type="text"
                          id="slogan"
                          name="slogan"
                          value={formData.slogan}
                          onChange={handleChange}
                          placeholder="Ex: 'Moldando o amanhã'. Sim, preferencialmente abaixo do logo."
                          className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 text-base md:text-sm text-white placeholder-zinc-600 focus:border-brand-500 transition-all"
                        />
                      </div>

                      {/* Business Description */}
                      <div>
                        <div className="flex justify-between items-baseline mb-2">
                          <label htmlFor="businessDescription" className="block text-base md:text-sm font-semibold text-zinc-300">
                            Em um ou dois parágrafos, explique: o que a empresa faz e quais os serviços principais? <span className="text-rose-500" aria-hidden="true">*</span>
                          </label>
                          <span className="text-xs md:text-[10px] text-zinc-500">Mínimo 10 caracteres</span>
                        </div>
                        <textarea
                          id="businessDescription"
                          name="businessDescription"
                          value={formData.businessDescription}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          rows={4}
                          placeholder="Explique resumidamente o core business do seu negócio e o catálogo principal de produtos..."
                          aria-required="true"
                          aria-invalid={!!errors.businessDescription}
                          aria-describedby={errors.businessDescription ? "businessDescription-error" : undefined}
                          className={`w-full bg-zinc-900/60 border rounded-xl px-4 py-3 text-base md:text-sm text-white placeholder-zinc-600 transition-all resize-y ${
                            errors.businessDescription && touched.businessDescription
                              ? 'border-rose-500/50 bg-rose-500/5 focus:border-rose-500'
                              : 'border-zinc-800 focus:border-brand-500'
                          }`}
                        />
                        {errors.businessDescription && touched.businessDescription && (
                          <div id="businessDescription-error" className="flex items-center gap-1.5 mt-2 text-xs md:text-[10px] text-rose-400 font-medium" role="alert">
                            <AlertCircle className="h-3 w-3" />
                            <span>{errors.businessDescription}</span>
                          </div>
                        )}
                      </div>

                      {/* Rebranding Reason */}
                      <div>
                        <div className="flex justify-between items-baseline mb-2">
                          <label htmlFor="rebrandingReason" className="block text-base md:text-sm font-semibold text-zinc-300">
                            Por que você decidiu buscar uma nova identidade visual (rebranding) neste exato momento? <span className="text-rose-500" aria-hidden="true">*</span>
                          </label>
                          <span className="text-xs md:text-[10px] text-zinc-500">Obrigatório</span>
                        </div>
                        <textarea
                          id="rebrandingReason"
                          name="rebrandingReason"
                          value={formData.rebrandingReason}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          rows={3}
                          placeholder="Ex: Estamos captando uma rodada de investimentos e a imagem atual não transmite o valor tecnológico que oferecemos..."
                          aria-required="true"
                          aria-invalid={!!errors.rebrandingReason}
                          aria-describedby={errors.rebrandingReason ? "rebrandingReason-error" : undefined}
                          className={`w-full bg-zinc-900/60 border rounded-xl px-4 py-3 text-base md:text-sm text-white placeholder-zinc-600 transition-all resize-y ${
                            errors.rebrandingReason && touched.rebrandingReason
                              ? 'border-rose-500/50 bg-rose-500/5 focus:border-rose-500'
                              : 'border-zinc-800 focus:border-brand-500'
                          }`}
                        />
                        {errors.rebrandingReason && touched.rebrandingReason && (
                          <div id="rebrandingReason-error" className="flex items-center gap-1.5 mt-2 text-xs md:text-[10px] text-rose-400 font-medium" role="alert">
                            <AlertCircle className="h-3 w-3" />
                            <span>{errors.rebrandingReason}</span>
                          </div>
                        )}
                      </div>

                      {/* Current Brand Issues */}
                      <div>
                        <label htmlFor="currentBrandIssues" className="block text-base md:text-sm font-semibold text-zinc-300 mb-2">
                          O que você sente que não funciona mais ou te incomoda profundamente na marca atual?
                        </label>
                        <textarea
                          id="currentBrandIssues"
                          name="currentBrandIssues"
                          value={formData.currentBrandIssues}
                          onChange={handleChange}
                          rows={3}
                          placeholder="Ex: A logo atual parece muito infantil, e as cores parecem desbotadas e antiquadas."
                          className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 text-base md:text-sm text-white placeholder-zinc-600 focus:border-brand-500 transition-all resize-y"
                        />
                      </div>

                      {/* Keep From Old Identity */}
                      <div>
                        <label htmlFor="keepFromOldIdentity" className="block text-base md:text-sm font-semibold text-zinc-300 mb-2">
                          Existe algo da identidade antiga que deve ser obrigatoriamente mantido?
                        </label>
                        <input
                          type="text"
                          id="keepFromOldIdentity"
                          name="keepFromOldIdentity"
                          value={formData.keepFromOldIdentity}
                          onChange={handleChange}
                          placeholder="Ex: Manter a cor azul principal, ou manter o símbolo de estrela."
                          className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 text-base md:text-sm text-white placeholder-zinc-600 focus:border-brand-500 transition-all"
                        />
                      </div>
                    </div>
                  </fieldset>
                )}

                {/* 2. PASSO: RAIO-X DO NEGÓCIO */}
                {currentStep === 2 && (
                  <fieldset className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-xl hover:border-white/15 transition-all duration-300">
                    <legend className="float-left w-full flex items-center gap-3 text-lg md:text-xl font-bold text-white mb-2">
                      <div className="h-8 w-8 bg-brand-500/20 rounded-lg flex items-center justify-center text-brand-400">
                        <History className="h-4.5 w-4.5" />
                      </div>
                      <span>2. Raio-X do Negócio (Posicionamento Oculto)</span>
                    </legend>
                    <p className="clear-left text-sm md:text-xs text-zinc-400 mb-8 border-b border-zinc-800/80 pb-4">
                      {STEPS[1].description}
                    </p>

                    <div className="space-y-6">
                      {/* Company History */}
                      <div>
                        <label htmlFor="companyHistory" className="block text-base md:text-sm font-semibold text-zinc-300 mb-2">
                          Qual é a história, motivação ou inspiração principal por trás do surgimento da empresa?
                        </label>
                        <textarea
                          id="companyHistory"
                          name="companyHistory"
                          value={formData.companyHistory}
                          onChange={handleChange}
                          rows={3}
                          placeholder="Nos conte como tudo começou. O que inspirou a criação da empresa?"
                          className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 text-base md:text-sm text-white placeholder-zinc-600 focus:border-brand-500 transition-all resize-y"
                        />
                      </div>

                      {/* Why Choose Us */}
                      <div>
                        <label htmlFor="whyChooseUs" className="block text-base md:text-sm font-semibold text-zinc-300 mb-2">
                          Por que o seu cliente favorito escolheu comprar de você e não do seu concorrente?
                        </label>
                        <textarea
                          id="whyChooseUs"
                          name="whyChooseUs"
                          value={formData.whyChooseUs}
                          onChange={handleChange}
                          rows={3}
                          placeholder="Qual diferencial único ele enxerga no seu serviço/atendimento?"
                          className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 text-base md:text-sm text-white placeholder-zinc-600 focus:border-brand-500 transition-all resize-y"
                        />
                      </div>

                      {/* Worst Complaint */}
                      <div>
                        <label htmlFor="worstComplaint" className="block text-base md:text-sm font-semibold text-zinc-300 mb-2">
                          Se um cliente fosse reclamar da empresa, qual seria a pior frase que machucaria seu orgulho?
                        </label>
                        <textarea
                          id="worstComplaint"
                          name="worstComplaint"
                          value={formData.worstComplaint}
                          onChange={handleChange}
                          rows={3}
                          placeholder="Ex: 'Eles cobram caro mas o produto parece comum e sem identidade...'"
                          className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 text-base md:text-sm text-white placeholder-zinc-600 focus:border-brand-500 transition-all resize-y"
                        />
                      </div>

                      {/* Brand Positioning Statement */}
                      <div>
                        <label htmlFor="brandPositioningStatement" className="block text-base md:text-sm font-semibold text-zinc-300 mb-2">
                          Complete a frase: &quot;Eu prefiro que a minha marca seja conhecida por ser [A] do que por ser [B].&quot;
                        </label>
                        <input
                          type="text"
                          id="brandPositioningStatement"
                          name="brandPositioningStatement"
                          value={formData.brandPositioningStatement}
                          onChange={handleChange}
                          placeholder="Ex: conhecida por ser Inovadora do que por ser Barata."
                          className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 text-base md:text-sm text-white placeholder-zinc-600 focus:border-brand-500 transition-all"
                        />
                      </div>
                    </div>
                  </fieldset>
                )}

                {/* 3. PASSO: PÚBLICO-ALVO E CONCORRÊNCIA */}
                {currentStep === 3 && (
                  <fieldset className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-xl hover:border-white/15 transition-all duration-300">
                    <legend className="float-left w-full flex items-center gap-3 text-lg md:text-xl font-bold text-white mb-2">
                      <div className="h-8 w-8 bg-brand-500/20 rounded-lg flex items-center justify-center text-brand-400">
                        <Users2 className="h-4.5 w-4.5" />
                      </div>
                      <span>3. Público-Alvo e Concorrência</span>
                    </legend>
                    <p className="clear-left text-sm md:text-xs text-zinc-400 mb-8 border-b border-zinc-800/80 pb-4">
                      {STEPS[2].description}
                    </p>

                    <div className="space-y-6">
                      {/* Target Audience */}
                      <div>
                        <label htmlFor="targetAudience" className="block text-base md:text-sm font-semibold text-zinc-300 mb-2">
                          Quem é o seu cliente ideal? (Descreva idade, profissão, estilo de vida e interesses)
                        </label>
                        <textarea
                          id="targetAudience"
                          name="targetAudience"
                          value={formData.targetAudience}
                          onChange={handleChange}
                          rows={3}
                          placeholder="Ex: Profissionais liberais de 28-45 anos, buscam otimização de tempo, consomem marcas sustentáveis..."
                          className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 text-base md:text-sm text-white placeholder-zinc-600 focus:border-brand-500 transition-all resize-y"
                        />
                      </div>

                      {/* Customer Pain Points */}
                      <div>
                        <label htmlFor="customerPainPoints" className="block text-base md:text-sm font-semibold text-zinc-300 mb-2">
                          Qual é a principal &quot;dor&quot; (problema ou desejo) do seu cliente que seu negócio resolve?
                        </label>
                        <textarea
                          id="customerPainPoints"
                          name="customerPainPoints"
                          value={formData.customerPainPoints}
                          onChange={handleChange}
                          rows={3}
                          placeholder="Ex: Falta de transparência nos processos de outras agências. Ele quer um serviço rápido e confiável."
                          className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 text-base md:text-sm text-white placeholder-zinc-600 focus:border-brand-500 transition-all resize-y"
                        />
                      </div>

                      {/* Competitors Analysis */}
                      <div>
                        <label htmlFor="competitorsAnalysis" className="block text-base md:text-sm font-semibold text-zinc-300 mb-2">
                          Quem são seus concorrentes (diretos e indiretos)? Comente o que admira ou abomina neles.
                        </label>
                        <textarea
                          id="competitorsAnalysis"
                          name="competitorsAnalysis"
                          value={formData.competitorsAnalysis}
                          onChange={handleChange}
                          rows={3}
                          placeholder="Ex: Concorrente X (admiro a rapidez, abomino o atendimento ruim); Concorrente Y (logo antiquada)..."
                          className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 text-base md:text-sm text-white placeholder-zinc-600 focus:border-brand-500 transition-all resize-y"
                        />
                      </div>
                    </div>
                  </fieldset>
                )}

                {/* 4. PASSO: PERSONALIDADE DA MARCA */}
                {currentStep === 4 && (
                  <fieldset className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-xl hover:border-white/15 transition-all duration-300">
                    <legend className="float-left w-full flex items-center gap-3 text-lg md:text-xl font-bold text-white mb-2">
                      <div className="h-8 w-8 bg-brand-500/20 rounded-lg flex items-center justify-center text-brand-400">
                        <Volume2 className="h-4.5 w-4.5" />
                      </div>
                      <span>4. Personalidade da Marca (Extração Psicológica)</span>
                    </legend>
                    <p className="clear-left text-sm md:text-xs text-zinc-400 mb-8 border-b border-zinc-800/80 pb-4">
                      {STEPS[3].description}
                    </p>

                    <div className="space-y-6">
                      {/* Brand Party Hosting */}
                      <div>
                        <label htmlFor="brandPartyHosting" className="block text-base md:text-sm font-semibold text-zinc-300 mb-2">
                          Se a marca fosse anfitriã de uma festa, onde seria, que música tocaria e o que serviriam?
                        </label>
                        <textarea
                          id="brandPartyHosting"
                          name="brandPartyHosting"
                          value={formData.brandPartyHosting}
                          onChange={handleChange}
                          rows={3}
                          placeholder="Ex: Seria em um rooftop moderno ao entardecer, tocando Jazz/Lo-fi, servindo drinks autorais e finger-foods."
                          className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 text-base md:text-sm text-white placeholder-zinc-600 focus:border-brand-500 transition-all resize-y"
                        />
                      </div>

                      {/* Brand Persona Avatar */}
                      <div>
                        <label htmlFor="brandPersonaAvatar" className="block text-base md:text-sm font-semibold text-zinc-300 mb-2">
                          Se a empresa fosse uma pessoa famosa ou personagem de filme, quem seria e por quê?
                        </label>
                        <textarea
                          id="brandPersonaAvatar"
                          name="brandPersonaAvatar"
                          value={formData.brandPersonaAvatar}
                          onChange={handleChange}
                          rows={3}
                          placeholder="Ex: Steve Jobs pela simplicidade e foco na inovação; ou Tony Stark pelo tom tecnológico e arrojado."
                          className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 text-base md:text-sm text-white placeholder-zinc-600 focus:border-brand-500 transition-all resize-y"
                        />
                      </div>

                      {/* Brand Communication Tone (Interactive Select Cards!) */}
                      <div>
                        <span className="block text-base md:text-sm font-semibold text-zinc-300 mb-3">
                          Como a marca se comunica com o cliente? (Escolha o tom de voz principal)
                        </span>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4" role="radiogroup" aria-label="Tom de voz da marca">
                          {[
                            {
                              id: 'O Professor',
                              title: 'O Professor',
                              icon: MessageSquare,
                              desc: 'Ensina com autoridade, clareza e autoridade no assunto.'
                            },
                            {
                              id: 'O Amigo',
                              title: 'O Amigo',
                              icon: HeartHandshake,
                              desc: 'Abraça, escuta com atenção e acolhe com proximidade.'
                            },
                            {
                              id: 'O Herói / Guia',
                              title: 'O Herói / Guia',
                              icon: ShieldCheck,
                              desc: 'Mostra a direção a seguir e lidera o caminho.'
                            }
                          ].map(card => {
                            const CardIcon = card.icon;
                            const isSelected = formData.brandCommunicationTone === card.id;
                            
                            return (
                              <button
                                key={card.id}
                                type="button"
                                onClick={() => selectTone(card.id)}
                                role="radio"
                                aria-checked={isSelected}
                                className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between h-36 ${
                                  isSelected
                                    ? 'bg-brand-500/10 border-brand-500 text-white shadow-lg shadow-brand-500/5'
                                    : 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                                }`}
                              >
                                <CardIcon className={`h-5 w-5 ${isSelected ? 'text-brand-400' : 'text-zinc-500'}`} />
                                <div>
                                  <p className="text-sm md:text-xs font-bold text-white mb-1">{card.title}</p>
                                  <p className="text-xs md:text-[10px] text-zinc-500 leading-normal">{card.desc}</p>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Brand Desirable Adjectives */}
                      <div>
                        <label htmlFor="brandDesirableAdjectives" className="block text-base md:text-sm font-semibold text-zinc-300 mb-2">
                          Escolha 3 a 5 adjetivos que melhor representam a imagem a ser transmitida.
                        </label>
                        <input
                          type="text"
                          id="brandDesirableAdjectives"
                          name="brandDesirableAdjectives"
                          value={formData.brandDesirableAdjectives}
                          onChange={handleChange}
                          placeholder="Ex: Minimalista, Sofisticado, Transparente, Ágil."
                          className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 text-base md:text-sm text-white placeholder-zinc-600 focus:border-brand-500 transition-all"
                        />
                      </div>

                      {/* Brand Undesirable Adjectives */}
                      <div>
                        <label htmlFor="brandUndesirableAdjectives" className="block text-base md:text-sm font-semibold text-zinc-300 mb-2">
                          Escolha 3 adjetivos que a sua marca definitivamente NÃO é.
                        </label>
                        <input
                          type="text"
                          id="brandUndesirableAdjectives"
                          name="brandUndesirableAdjectives"
                          value={formData.brandUndesirableAdjectives}
                          onChange={handleChange}
                          placeholder="Ex: Infantil, Barata, Burocrática, Lenta."
                          className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 text-base md:text-sm text-white placeholder-zinc-600 focus:border-brand-500 transition-all"
                        />
                      </div>
                    </div>
                  </fieldset>
                )}

                {/* 5. PASSO: DIREÇÃO VISUAL E ENTREGÁVEIS */}
                {currentStep === 5 && (
                  <fieldset className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-xl hover:border-white/15 transition-all duration-300">
                    <legend className="float-left w-full flex items-center gap-3 text-lg md:text-xl font-bold text-white mb-2">
                      <div className="h-8 w-8 bg-brand-500/20 rounded-lg flex items-center justify-center text-brand-400">
                        <Palette className="h-4.5 w-4.5" />
                      </div>
                      <span>5. Direção Visual e Entregáveis (A Aplicação Prática)</span>
                    </legend>
                    <p className="clear-left text-sm md:text-xs text-zinc-400 mb-8 border-b border-zinc-800/80 pb-4">
                      {STEPS[4].description}
                    </p>

                    <div className="space-y-6">
                      {/* Brand First Impression */}
                      <div>
                        <label htmlFor="brandFirstImpression" className="block text-base md:text-sm font-semibold text-zinc-300 mb-2">
                          Qual é a primeira sensação/emoção que o cliente deve sentir ao bater o olho na marca?
                        </label>
                        <textarea
                          id="brandFirstImpression"
                          name="brandFirstImpression"
                          value={formData.brandFirstImpression}
                          onChange={handleChange}
                          rows={2}
                          placeholder="Ex: Confiança imediata, segurança, autoridade extrema ou deslumbramento visual..."
                          className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 text-base md:text-sm text-white placeholder-zinc-600 focus:border-brand-500 transition-all resize-y"
                        />
                      </div>

                      {/* Visuals to Avoid */}
                      <div>
                        <label htmlFor="visualsToAvoid" className="block text-base md:text-sm font-semibold text-zinc-300 mb-2">
                          Existe alguma cor, forma ou elemento visual que você odeia e que devemos evitar a todo custo?
                        </label>
                        <input
                          type="text"
                          id="visualsToAvoid"
                          name="visualsToAvoid"
                          value={formData.visualsToAvoid}
                          onChange={handleChange}
                          placeholder="Ex: Evitar degradês multicoloridos, cor laranja, símbolos de folha..."
                          className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 text-base md:text-sm text-white placeholder-zinc-600 focus:border-brand-500 transition-all"
                        />
                      </div>

                      {/* Brand Primary Touchpoints */}
                      <div>
                        <label htmlFor="brandPrimaryTouchpoints" className="block text-base md:text-sm font-semibold text-zinc-300 mb-2">
                          Onde a sua marca será mais vista no dia a dia? (Ex: Fachada física, Instagram, uniformes, site...)
                        </label>
                        <input
                          type="text"
                          id="brandPrimaryTouchpoints"
                          name="brandPrimaryTouchpoints"
                          value={formData.brandPrimaryTouchpoints}
                          onChange={handleChange}
                          placeholder="Ex: Instagram da marca, site da plataforma Web, crachás e caixas de papelão."
                          className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 text-base md:text-sm text-white placeholder-zinc-600 focus:border-brand-500 transition-all"
                        />
                      </div>

                      {/* Immediate Deliverables */}
                      <div>
                        <label htmlFor="immediateDeliverables" className="block text-base md:text-sm font-semibold text-zinc-300 mb-2">
                          Quais são os materiais prioritários que você precisa de imediato junto com a marca?
                        </label>
                        <input
                          type="text"
                          id="immediateDeliverables"
                          name="immediateDeliverables"
                          value={formData.immediateDeliverables}
                          onChange={handleChange}
                          placeholder="Ex: Capa do Linkedin, template para posts de feed de Instagram, papel timbrado."
                          className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 text-base md:text-sm text-white placeholder-zinc-600 focus:border-brand-500 transition-all"
                        />
                      </div>

                      {/* Reference Links */}
                      <div>
                        <div className="flex justify-between items-baseline mb-2">
                          <label htmlFor="referenceLinks" className="block text-base md:text-sm font-semibold text-zinc-300">
                            Cole aqui links de referências visuais (Pinterest, Behance, Perfis de marcas que admira...)
                          </label>
                          <span className="text-xs md:text-[10px] text-zinc-500">URL opcional</span>
                        </div>
                        <input
                          type="url"
                          id="referenceLinks"
                          name="referenceLinks"
                          value={formData.referenceLinks}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Ex: https://pinterest.com/exemplo ou behance.net/design-referencia"
                          aria-invalid={!!errors.referenceLinks}
                          aria-describedby={errors.referenceLinks ? "referenceLinks-error" : undefined}
                          className={`w-full bg-zinc-900/60 border rounded-xl px-4 py-3 text-base md:text-sm text-white placeholder-zinc-600 transition-all ${
                            errors.referenceLinks && touched.referenceLinks
                              ? 'border-rose-500/50 bg-rose-500/5 focus:border-rose-500'
                              : 'border-zinc-800 focus:border-brand-500'
                          }`}
                        />
                        {errors.referenceLinks && touched.referenceLinks && (
                          <div id="referenceLinks-error" className="flex items-center gap-1.5 mt-2 text-xs md:text-[10px] text-rose-400 font-medium" role="alert">
                            <AlertCircle className="h-3 w-3" />
                            <span>{errors.referenceLinks}</span>
                          </div>
                        )}
                      </div>

                      {/* Deadline or Launch Date */}
                      <div>
                        <label htmlFor="deadlineOrLaunchDate" className="block text-base md:text-sm font-semibold text-zinc-300 mb-2">
                          Existe um prazo limite ou uma data de lançamento (evento/inauguração) estipulada?
                        </label>
                        <input
                          type="text"
                          id="deadlineOrLaunchDate"
                          name="deadlineOrLaunchDate"
                          value={formData.deadlineOrLaunchDate}
                          onChange={handleChange}
                          placeholder="Ex: Lançamento em 10 de Setembro na convenção anual da empresa."
                          className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 text-base md:text-sm text-white placeholder-zinc-600 focus:border-brand-500 transition-all"
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
                    className="inline-flex items-center justify-center gap-2 bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/50 text-zinc-300 text-sm md:text-xs font-semibold py-3.5 px-6 rounded-xl active:scale-98 disabled:opacity-30 disabled:cursor-not-allowed disabled:active:scale-100 transition-all"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Voltar</span>
                  </button>

                  {currentStep < 5 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-sm md:text-xs font-semibold py-3.5 px-8 rounded-xl shadow-lg active:scale-98 transition-all duration-300"
                    >
                      <span>Continuar</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={status.state === 'loading'}
                      className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-sm md:text-xs font-semibold py-3.5 px-10 rounded-xl shadow-lg hover:shadow-brand-500/25 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
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
        <h1 className="text-2xl font-bold tracking-tight uppercase">Briefing de Branding</h1>
        <p className="text-xs font-bold text-zinc-600 mt-1">PROJETO DE IDENTIDADE VISUAL // ANDERSON JOSÉ BRANDING</p>
        <div className="flex justify-between text-[10px] text-zinc-500 mt-4">
          <span>Marca/Empresa: <strong>{formData.logoName}</strong></span>
          <span>Data de Envio: <strong>{new Date().toLocaleDateString('pt-BR')}</strong></span>
        </div>
      </div>

      <div className="space-y-6">
        {/* 1. O Básico */}
        <section className="avoid-break">
          <h2 className="text-sm font-bold uppercase border-b border-zinc-300 pb-1 mb-3 text-zinc-800">1. O Básico (Estrutura e Escopo)</h2>
          <table className="w-full text-xs border-collapse">
            <tbody>
              <tr className="border-b border-zinc-100">
                <td className="py-2 font-bold text-zinc-600 w-1/3">Nome exato no logo:</td>
                <td className="py-2 text-zinc-900 w-2/3">{formData.logoName}</td>
              </tr>
              {formData.slogan && (
                <tr className="border-b border-zinc-100">
                  <td className="py-2 font-bold text-zinc-600">Slogan/Frase de apoio:</td>
                  <td className="py-2 text-zinc-900">{formData.slogan}</td>
                </tr>
              )}
              <tr className="border-b border-zinc-100">
                <td className="py-2 font-bold text-zinc-600">O que a empresa faz:</td>
                <td className="py-2 text-zinc-900 whitespace-pre-wrap">{formData.businessDescription}</td>
              </tr>
              <tr className="border-b border-zinc-100">
                <td className="py-2 font-bold text-zinc-600">Razão do rebranding:</td>
                <td className="py-2 text-zinc-900 whitespace-pre-wrap">{formData.rebrandingReason}</td>
              </tr>
              {formData.currentBrandIssues && (
                <tr className="border-b border-zinc-100">
                  <td className="py-2 font-bold text-zinc-600">O que te incomoda na marca atual:</td>
                  <td className="py-2 text-zinc-900 whitespace-pre-wrap">{formData.currentBrandIssues}</td>
                </tr>
              )}
              {formData.keepFromOldIdentity && (
                <tr className="border-b border-zinc-100">
                  <td className="py-2 font-bold text-zinc-600">Identidade antiga a ser mantida:</td>
                  <td className="py-2 text-zinc-900 whitespace-pre-wrap">{formData.keepFromOldIdentity}</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        {/* 2. Raio-X */}
        <section className="avoid-break">
          <h2 className="text-sm font-bold uppercase border-b border-zinc-300 pb-1 mb-3 text-zinc-800">2. Raio-X do Negócio (Posicionamento Oculto)</h2>
          <table className="w-full text-xs border-collapse">
            <tbody>
              {formData.companyHistory && (
                <tr className="border-b border-zinc-100">
                  <td className="py-2 font-bold text-zinc-600 w-1/3">História e inspiração:</td>
                  <td className="py-2 text-zinc-900 whitespace-pre-wrap">{formData.companyHistory}</td>
                </tr>
              )}
              {formData.whyChooseUs && (
                <tr className="border-b border-zinc-100">
                  <td className="py-2 font-bold text-zinc-600">Diferencial competitivo principal:</td>
                  <td className="py-2 text-zinc-900 whitespace-pre-wrap">{formData.whyChooseUs}</td>
                </tr>
              )}
              {formData.worstComplaint && (
                <tr className="border-b border-zinc-100">
                  <td className="py-2 font-bold text-zinc-600">Reclamação mais temida:</td>
                  <td className="py-2 text-zinc-900 whitespace-pre-wrap">{formData.worstComplaint}</td>
                </tr>
              )}
              {formData.brandPositioningStatement && (
                <tr className="border-b border-zinc-100">
                  <td className="py-2 font-bold text-zinc-600">Declaração de posicionamento:</td>
                  <td className="py-2 text-zinc-900">{formData.brandPositioningStatement}</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        {/* 3. Público */}
        <section className="avoid-break">
          <h2 className="text-sm font-bold uppercase border-b border-zinc-300 pb-1 mb-3 text-zinc-800">3. Público-Alvo e Concorrência</h2>
          <table className="w-full text-xs border-collapse">
            <tbody>
              {formData.targetAudience && (
                <tr className="border-b border-zinc-100">
                  <td className="py-2 font-bold text-zinc-600 w-1/3">Cliente ideal:</td>
                  <td className="py-2 text-zinc-900 whitespace-pre-wrap">{formData.targetAudience}</td>
                </tr>
              )}
              {formData.customerPainPoints && (
                <tr className="border-b border-zinc-100">
                  <td className="py-2 font-bold text-zinc-600">Dor principal resolvida:</td>
                  <td className="py-2 text-zinc-900 whitespace-pre-wrap">{formData.customerPainPoints}</td>
                </tr>
              )}
              {formData.competitorsAnalysis && (
                <tr className="border-b border-zinc-100">
                  <td className="py-2 font-bold text-zinc-600">Principais concorrentes:</td>
                  <td className="py-2 text-zinc-900 whitespace-pre-wrap">{formData.competitorsAnalysis}</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        {/* 4. Personalidade */}
        <section className="avoid-break">
          <h2 className="text-sm font-bold uppercase border-b border-zinc-300 pb-1 mb-3 text-zinc-800">4. Personalidade da Marca (Extração Psicológica)</h2>
          <table className="w-full text-xs border-collapse">
            <tbody>
              {formData.brandPartyHosting && (
                <tr className="border-b border-zinc-100">
                  <td className="py-2 font-bold text-zinc-600 w-1/3">Metáfora da festa:</td>
                  <td className="py-2 text-zinc-900 whitespace-pre-wrap">{formData.brandPartyHosting}</td>
                </tr>
              )}
              {formData.brandPersonaAvatar && (
                <tr className="border-b border-zinc-100">
                  <td className="py-2 font-bold text-zinc-600">Personificação da empresa:</td>
                  <td className="py-2 text-zinc-900 whitespace-pre-wrap">{formData.brandPersonaAvatar}</td>
                </tr>
              )}
              {formData.brandCommunicationTone && (
                <tr className="border-b border-zinc-100">
                  <td className="py-2 font-bold text-zinc-600">Tom de voz da comunicação:</td>
                  <td className="py-2 text-zinc-900">{formData.brandCommunicationTone}</td>
                </tr>
              )}
              {formData.brandDesirableAdjectives && (
                <tr className="border-b border-zinc-100">
                  <td className="py-2 font-bold text-zinc-600">Adjetivos representativos:</td>
                  <td className="py-2 text-zinc-900">{formData.brandDesirableAdjectives}</td>
                </tr>
              )}
              {formData.brandUndesirableAdjectives && (
                <tr className="border-b border-zinc-100">
                  <td className="py-2 font-bold text-zinc-600">Adjetivos evitados:</td>
                  <td className="py-2 text-zinc-900">{formData.brandUndesirableAdjectives}</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        {/* 5. Direção Visual */}
        <section className="avoid-break">
          <h2 className="text-sm font-bold uppercase border-b border-zinc-300 pb-1 mb-3 text-zinc-800">5. Direção Visual e Entregáveis (A Aplicação Prática)</h2>
          <table className="w-full text-xs border-collapse">
            <tbody>
              {formData.brandFirstImpression && (
                <tr className="border-b border-zinc-100">
                  <td className="py-2 font-bold text-zinc-600 w-1/3">Primeira sensação desejada:</td>
                  <td className="py-2 text-zinc-900 whitespace-pre-wrap">{formData.brandFirstImpression}</td>
                </tr>
              )}
              {formData.visualsToAvoid && (
                <tr className="border-b border-zinc-100">
                  <td className="py-2 font-bold text-zinc-600">Elementos a evitar:</td>
                  <td className="py-2 text-zinc-900">{formData.visualsToAvoid}</td>
                </tr>
              )}
              {formData.brandPrimaryTouchpoints && (
                <tr className="border-b border-zinc-100">
                  <td className="py-2 font-bold text-zinc-600">Onde a marca será mais vista:</td>
                  <td className="py-2 text-zinc-900">{formData.brandPrimaryTouchpoints}</td>
                </tr>
              )}
              {formData.immediateDeliverables && (
                <tr className="border-b border-zinc-100">
                  <td className="py-2 font-bold text-zinc-600">Materiais imediatos prioritários:</td>
                  <td className="py-2 text-zinc-900">{formData.immediateDeliverables}</td>
                </tr>
              )}
              {formData.referenceLinks && (
                <tr className="border-b border-zinc-100">
                  <td className="py-2 font-bold text-zinc-600">Links de referências:</td>
                  <td className="py-2 text-zinc-900">{formData.referenceLinks}</td>
                </tr>
              )}
              {formData.deadlineOrLaunchDate && (
                <tr className="border-b border-zinc-100">
                  <td className="py-2 font-bold text-zinc-600">Prazo / Data de lançamento:</td>
                  <td className="py-2 text-zinc-900">{formData.deadlineOrLaunchDate}</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </div>
    </div>

      <div className="border-t border-zinc-300 mt-8 pt-2 text-center text-[10px] text-zinc-400 avoid-break hidden print:block">
        <p>© {new Date().getFullYear()} Anderson José. Documento de Briefing Estratégico. Todos os direitos reservados.</p>
      </div>
    </>
  );
}
