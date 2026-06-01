import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { 
  Building2, 
  Sparkles, 
  Users2, 
  Palette, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  RefreshCw,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import type { BriefingFormData, BriefingFormErrors, SubmissionStatus } from '../types/briefing';

const initialFormData: BriefingFormData = {
  companyName: '',
  businessDescription: '',
  rebrandingReason: '',
  targetAudience: '',
  colorPreferences: '',
  referenceLinks: '',
};

export default function BrandingBriefingForm() {
  const [formData, setFormData] = useState<BriefingFormData>(initialFormData);
  const [errors, setErrors] = useState<BriefingFormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<SubmissionStatus>({ state: 'idle' });
  const [progress, setProgress] = useState(0);

  // Calculates completion progress percentage
  useEffect(() => {
    const totalFields = 6;
    let filledFields = 0;
    
    if (formData.companyName.trim()) filledFields++;
    if (formData.businessDescription.trim()) filledFields++;
    if (formData.rebrandingReason.trim()) filledFields++;
    if (formData.targetAudience.trim()) filledFields++;
    if (formData.colorPreferences.trim()) filledFields++;
    if (formData.referenceLinks.trim()) filledFields++;
    
    setProgress(Math.round((filledFields / totalFields) * 100));
  }, [formData]);

  // Real-time single field validation
  const validateField = (name: keyof BriefingFormData, value: string): string => {
    if (name === 'companyName') {
      if (!value.trim()) return 'O nome da empresa é obrigatório.';
      if (value.trim().length < 2) return 'O nome deve ter pelo menos 2 caracteres.';
    }
    
    if (name === 'businessDescription') {
      if (!value.trim()) return 'A descrição das atividades é obrigatória.';
      if (value.trim().length < 10) return 'Por favor, detalhe um pouco mais o que a empresa faz (mínimo 10 caracteres).';
    }
    
    if (name === 'referenceLinks' && value.trim()) {
      // Regex for simple URL validation if the user enters something
      const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/i;
      if (!urlPattern.test(value.trim())) {
        return 'Insira um link/URL válido (ex: https://exemplo.com).';
      }
    }
    
    return '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target as { name: keyof BriefingFormData; value: string };
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // If the field was already touched, validate it on keypress/change
    if (touched[name]) {
      const errorMsg = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: errorMsg || undefined }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target as { name: keyof BriefingFormData; value: string };
    setTouched(prev => ({ ...prev, [name]: true }));
    const errorMsg = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: errorMsg || undefined }));
  };

  const validateAll = (): boolean => {
    const newErrors: BriefingFormErrors = {};
    
    // Validate required fields
    const companyError = validateField('companyName', formData.companyName);
    if (companyError) newErrors.companyName = companyError;
    
    const businessError = validateField('businessDescription', formData.businessDescription);
    if (businessError) newErrors.businessDescription = businessError;
    
    // Validate optional field (URL only if not empty)
    const linksError = validateField('referenceLinks', formData.referenceLinks);
    if (linksError) newErrors.referenceLinks = linksError;
    
    setErrors(newErrors);
    
    // Mark all as touched to show errors visually
    const allTouched: Record<string, boolean> = {};
    Object.keys(formData).forEach(key => {
      allTouched[key] = true;
    });
    setTouched(allTouched);
    
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateAll()) {
      // Focus on the first element with error for accessibility
      const firstErrorKey = Object.keys(errors)[0] || 'companyName';
      const errorElement = document.getElementById(firstErrorKey);
      if (errorElement) {
        errorElement.focus();
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    setStatus({ state: 'loading' });
    console.log('%c[Briefing Submission Initiated]', 'color: #8b5cf6; font-weight: bold;', formData);
    
    try {
      // Simulating a network delay of 1.5 seconds for the premium loading feedback
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      /* 
        Simulação de Integração com Banco de Dados / Supabase:
        
        import { createClient } from '@supabase/supabase-js'
        const supabase = createClient('SUPABASE_URL', 'SUPABASE_ANON_KEY')
        
        const { data, error } = await supabase
          .from('briefings')
          .insert([
            { 
              company_name: formData.companyName,
              business_description: formData.businessDescription,
              rebranding_reason: formData.rebrandingReason,
              target_audience: formData.targetAudience,
              color_preferences: formData.colorPreferences,
              reference_links: formData.referenceLinks,
              created_at: new Date().toISOString()
            }
          ])
          
        if (error) throw error;
      */
      
      console.log('%c[Briefing Successfully Inserted / Simulated POST Done]', 'color: #10b981; font-weight: bold;', {
        status: 201,
        statusText: 'Created',
        data: formData
      });
      
      setStatus({ state: 'success' });
    } catch (error: any) {
      console.error('%c[Briefing Submission Error]', 'color: #ef4444; font-weight: bold;', error);
      setStatus({ 
        state: 'error', 
        errorMessage: error?.message || 'Ocorreu um erro ao enviar o formulário. Por favor, tente novamente.' 
      });
    }
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setErrors({});
    setTouched({});
    setStatus({ state: 'idle' });
  };

  return (
    <div className="min-h-screen selection:bg-brand-500/30">
      <Head>
        <title>Briefing de Branding // Nexus Studio</title>
        <meta name="description" content="Formulário moderno de captação de briefing de rebranding. Desenvolvido para marcas visionárias." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-12 min-h-screen">
          
          {/* Coluna da Esquerda: Painel Fixo de Apresentação / Progresso */}
          <div className="lg:col-span-5 lg:sticky lg:top-0 lg:h-screen flex flex-col justify-between py-12 lg:py-16 text-zinc-100 z-10">
            <div>
              {/* Logo / Marca */}
              <div className="flex items-center gap-2 mb-8 group cursor-default">
                <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform duration-300">
                  <Sparkles className="h-5 w-5 text-white animate-pulse-subtle" />
                </div>
                <span className="font-extrabold tracking-wider text-xl bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-zinc-400">
                  NEXUS <span className="text-brand-400 font-light">//</span> STUDIO
                </span>
              </div>

              {/* Informações Principais */}
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight mb-4">
                Construa uma marca <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-400 via-indigo-300 to-indigo-500">
                  que dita o amanhã.
                </span>
              </h1>
              <p className="text-zinc-400 text-base leading-relaxed mb-8 max-w-md">
                O briefing é o alicerce estratégico da sua nova identidade. Ao compartilhar seus valores e visão, você guia nossos designers rumo à excelência visual.
              </p>
            </div>

            {/* Progresso Dinâmico (Só exibe se não estiver no estado de sucesso) */}
            {status.state !== 'success' && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-2xl shadow-black/30 mb-8 lg:mb-0 transition-all duration-300">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-medium text-zinc-300">Progresso do Briefing</span>
                  <span className="text-sm font-bold text-brand-400 transition-all duration-300">{progress}%</span>
                </div>
                
                {/* Barra de Progresso Animada */}
                <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden mb-6">
                  <div 
                    className="bg-gradient-to-r from-brand-500 to-indigo-400 h-full rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                    role="progressbar"
                    aria-valuenow={progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  />
                </div>

                {/* Lista de Seções Concluídas */}
                <ul className="space-y-3 text-xs" aria-label="Progresso por seção">
                  <li className="flex items-center gap-2 transition-colors duration-200">
                    <div className={`h-4 w-4 rounded-full flex items-center justify-center border transition-all duration-300 ${
                      formData.companyName.trim() && formData.businessDescription.trim()
                        ? 'border-brand-500 bg-brand-500/20 text-brand-400' 
                        : 'border-zinc-700 text-zinc-500'
                    }`}>
                      {formData.companyName.trim() && formData.businessDescription.trim() ? (
                        <CheckCircle2 className="h-3 w-3" />
                      ) : (
                        <span className="text-[10px]">1</span>
                      )}
                    </div>
                    <span className={formData.companyName.trim() && formData.businessDescription.trim() ? 'text-zinc-300 font-medium' : 'text-zinc-500'}>
                      Sobre a Empresa (Obrigatório)
                    </span>
                  </li>

                  <li className="flex items-center gap-2 transition-colors duration-200">
                    <div className={`h-4 w-4 rounded-full flex items-center justify-center border transition-all duration-300 ${
                      formData.rebrandingReason.trim()
                        ? 'border-brand-500 bg-brand-500/20 text-brand-400' 
                        : 'border-zinc-700 text-zinc-500'
                    }`}>
                      {formData.rebrandingReason.trim() ? (
                        <CheckCircle2 className="h-3 w-3" />
                      ) : (
                        <span className="text-[10px]">2</span>
                      )}
                    </div>
                    <span className={formData.rebrandingReason.trim() ? 'text-zinc-300 font-medium' : 'text-zinc-500'}>
                      Motivo do Projeto (Opcional)
                    </span>
                  </li>

                  <li className="flex items-center gap-2 transition-colors duration-200">
                    <div className={`h-4 w-4 rounded-full flex items-center justify-center border transition-all duration-300 ${
                      formData.targetAudience.trim()
                        ? 'border-brand-500 bg-brand-500/20 text-brand-400' 
                        : 'border-zinc-700 text-zinc-500'
                    }`}>
                      {formData.targetAudience.trim() ? (
                        <CheckCircle2 className="h-3 w-3" />
                      ) : (
                        <span className="text-[10px]">3</span>
                      )}
                    </div>
                    <span className={formData.targetAudience.trim() ? 'text-zinc-300 font-medium' : 'text-zinc-500'}>
                      Público-Alvo (Opcional)
                    </span>
                  </li>

                  <li className="flex items-center gap-2 transition-colors duration-200">
                    <div className={`h-4 w-4 rounded-full flex items-center justify-center border transition-all duration-300 ${
                      formData.colorPreferences.trim() || formData.referenceLinks.trim()
                        ? 'border-brand-500 bg-brand-500/20 text-brand-400' 
                        : 'border-zinc-700 text-zinc-500'
                    }`}>
                      {formData.colorPreferences.trim() || formData.referenceLinks.trim() ? (
                        <CheckCircle2 className="h-3 w-3" />
                      ) : (
                        <span className="text-[10px]">4</span>
                      )}
                    </div>
                    <span className={formData.colorPreferences.trim() || formData.referenceLinks.trim() ? 'text-zinc-300 font-medium' : 'text-zinc-500'}>
                      Direção Visual (Opcional)
                    </span>
                  </li>
                </ul>
              </div>
            )}

            {/* Rodapé da Marca */}
            <div className="hidden lg:block text-xs text-zinc-600">
              &copy; {new Date().getFullYear()} Nexus Studio S.A. Todos os direitos reservados.
            </div>
          </div>

          {/* Coluna da Direita: O Formulário / Mensagem de Sucesso */}
          <div className="lg:col-span-7 pb-16 pt-4 lg:pt-16 flex flex-col justify-center">
            
            {status.state === 'success' ? (
              /* ================= TELA DE SUCESSO ================= */
              <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-10 backdrop-blur-md shadow-2xl shadow-black/40 animate-slide-up text-center relative overflow-hidden">
                {/* Efeitos decorativos de fundo */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="mx-auto h-16 w-16 bg-brand-500/20 border border-brand-500/30 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-brand-500/10">
                  <CheckCircle2 className="h-9 w-9 text-brand-400" />
                </div>
                
                <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
                  Briefing enviado com sucesso!
                </h2>
                
                <p className="text-zinc-400 text-sm md:text-base max-w-md mx-auto mb-8 leading-relaxed">
                  Agradecemos imensamente o envio. Nossa equipe de estrategistas de branding já foi notificada e entrará em contato em até 48 horas úteis.
                </p>

                {/* Card de Resumo de Dados Enviados (Visual Premium) */}
                <div className="text-left bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 mb-8 max-w-lg mx-auto">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-brand-400 mb-4 border-b border-zinc-800 pb-2">
                    Resumo do Registro de Envio
                  </h3>
                  <dl className="space-y-3 text-xs md:text-sm">
                    <div>
                      <dt className="text-zinc-500 font-medium">Nome da Empresa</dt>
                      <dd className="text-zinc-200 font-semibold mt-0.5">{formData.companyName}</dd>
                    </div>
                    <div>
                      <dt className="text-zinc-500 font-medium">O que a empresa faz</dt>
                      <dd className="text-zinc-300 mt-0.5 line-clamp-2">{formData.businessDescription}</dd>
                    </div>
                    {formData.colorPreferences && (
                      <div>
                        <dt className="text-zinc-500 font-medium">Cores de Preferência / Evitar</dt>
                        <dd className="text-zinc-300 mt-0.5">{formData.colorPreferences}</dd>
                      </div>
                    )}
                    {formData.referenceLinks && (
                      <div>
                        <dt className="text-zinc-500 font-medium">Links de Referência</dt>
                        <dd className="text-brand-400 font-medium mt-0.5 flex items-center gap-1">
                          <span className="truncate max-w-[280px]">{formData.referenceLinks}</span>
                          <ExternalLink className="h-3 w-3" />
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>

                <button
                  onClick={handleReset}
                  type="button"
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-sm font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-brand-500/20 active:scale-98 transition-all duration-300"
                >
                  <RefreshCw className="h-4 w-4" />
                  Enviar outro Briefing
                </button>
              </div>
            ) : (
              /* ================= FORMULÁRIO DE BRIEFING ================= */
              <form onSubmit={handleSubmit} noValidate className="space-y-8 animate-slide-up">
                
                {/* 1. SEÇÃO: SOBRE A EMPRESA */}
                <fieldset className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-xl shadow-black/10 hover:border-white/15 transition-colors duration-300">
                  <legend className="float-left w-full flex items-center gap-3 text-lg md:text-xl font-bold text-white mb-6">
                    <div className="h-8 w-8 bg-brand-500/20 rounded-lg flex items-center justify-center text-brand-400">
                      <Building2 className="h-4.5 w-4.5" />
                    </div>
                    <span>1. Sobre a Empresa</span>
                  </legend>
                  
                  <div className="clear-left space-y-6">
                    {/* Campo: Nome da Empresa */}
                    <div>
                      <div className="flex justify-between items-baseline mb-2">
                        <label htmlFor="companyName" className="block text-sm font-semibold text-zinc-200">
                          Nome da Empresa <span className="text-rose-500 font-bold" aria-hidden="true">*</span>
                        </label>
                        <span className="text-[10px] text-zinc-500">Campo obrigatório</span>
                      </div>
                      
                      <input
                        type="text"
                        id="companyName"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={status.state === 'loading'}
                        placeholder="Ex: Nexus Studio Ltda."
                        aria-required="true"
                        aria-invalid={!!errors.companyName}
                        aria-describedby={errors.companyName ? "companyName-error" : undefined}
                        className={`w-full bg-zinc-900/60 border rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 hover:border-zinc-700 transition-all ${
                          errors.companyName && touched.companyName
                            ? 'border-rose-500/50 bg-rose-500/5 focus:border-rose-500'
                            : 'border-zinc-800 focus:border-brand-500'
                        }`}
                      />
                      
                      {errors.companyName && touched.companyName && (
                        <div id="companyName-error" className="flex items-center gap-1.5 mt-2 text-xs text-rose-400 font-medium" role="alert">
                          <AlertCircle className="h-3.5 w-3.5" />
                          <span>{errors.companyName}</span>
                        </div>
                      )}
                    </div>

                    {/* Campo: O que a empresa faz? */}
                    <div>
                      <div className="flex justify-between items-baseline mb-2">
                        <label htmlFor="businessDescription" className="block text-sm font-semibold text-zinc-200">
                          O que a empresa faz? <span className="text-rose-500 font-bold" aria-hidden="true">*</span>
                        </label>
                        <span className="text-[10px] text-zinc-500">Mínimo 10 caracteres</span>
                      </div>
                      
                      <textarea
                        id="businessDescription"
                        name="businessDescription"
                        value={formData.businessDescription}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={status.state === 'loading'}
                        rows={4}
                        placeholder="Descreva as principais atividades, produtos ou serviços que você oferece..."
                        aria-required="true"
                        aria-invalid={!!errors.businessDescription}
                        aria-describedby={errors.businessDescription ? "businessDescription-error" : undefined}
                        className={`w-full bg-zinc-900/60 border rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 hover:border-zinc-700 transition-all resize-y ${
                          errors.businessDescription && touched.businessDescription
                            ? 'border-rose-500/50 bg-rose-500/5 focus:border-rose-500'
                            : 'border-zinc-800 focus:border-brand-500'
                        }`}
                      />
                      
                      {errors.businessDescription && touched.businessDescription && (
                        <div id="businessDescription-error" className="flex items-center gap-1.5 mt-2 text-xs text-rose-400 font-medium" role="alert">
                          <AlertCircle className="h-3.5 w-3.5" />
                          <span>{errors.businessDescription}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </fieldset>

                {/* 2. SEÇÃO: MOTIVO DO PROJETO */}
                <fieldset className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-xl shadow-black/10 hover:border-white/15 transition-colors duration-300">
                  <legend className="float-left w-full flex items-center gap-3 text-lg md:text-xl font-bold text-white mb-6">
                    <div className="h-8 w-8 bg-brand-500/20 rounded-lg flex items-center justify-center text-brand-400">
                      <Sparkles className="h-4.5 w-4.5" />
                    </div>
                    <span>2. Motivo do Projeto</span>
                  </legend>
                  
                  <div className="clear-left space-y-6">
                    <div>
                      <label htmlFor="rebrandingReason" className="block text-sm font-semibold text-zinc-200 mb-2">
                        Por que busca o rebranding? <span className="text-zinc-500 font-normal text-xs">(Opcional)</span>
                      </label>
                      
                      <textarea
                        id="rebrandingReason"
                        name="rebrandingReason"
                        value={formData.rebrandingReason}
                        onChange={handleChange}
                        disabled={status.state === 'loading'}
                        rows={3}
                        placeholder="Ex: Mudança de público-alvo, nova linha de produtos, modernização da marca que parece obsoleta..."
                        className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 hover:border-zinc-700 focus:border-brand-500 transition-all resize-y"
                      />
                    </div>
                  </div>
                </fieldset>

                {/* 3. SEÇÃO: PÚBLICO-ALVO */}
                <fieldset className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-xl shadow-black/10 hover:border-white/15 transition-colors duration-300">
                  <legend className="float-left w-full flex items-center gap-3 text-lg md:text-xl font-bold text-white mb-6">
                    <div className="h-8 w-8 bg-brand-500/20 rounded-lg flex items-center justify-center text-brand-400">
                      <Users2 className="h-4.5 w-4.5" />
                    </div>
                    <span>3. Público-Alvo</span>
                  </legend>
                  
                  <div className="clear-left space-y-6">
                    <div>
                      <label htmlFor="targetAudience" className="block text-sm font-semibold text-zinc-200 mb-2">
                        Quem é o cliente ideal? <span className="text-zinc-500 font-normal text-xs">(Opcional)</span>
                      </label>
                      
                      <textarea
                        id="targetAudience"
                        name="targetAudience"
                        value={formData.targetAudience}
                        onChange={handleChange}
                        disabled={status.state === 'loading'}
                        rows={3}
                        placeholder="Descreva idade, gênero, interesses, desafios ou comportamento de compra do seu público principal..."
                        className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 hover:border-zinc-700 focus:border-brand-500 transition-all resize-y"
                      />
                    </div>
                  </div>
                </fieldset>

                {/* 4. SEÇÃO: DIREÇÃO VISUAL */}
                <fieldset className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-xl shadow-black/10 hover:border-white/15 transition-colors duration-300">
                  <legend className="float-left w-full flex items-center gap-3 text-lg md:text-xl font-bold text-white mb-6">
                    <div className="h-8 w-8 bg-brand-500/20 rounded-lg flex items-center justify-center text-brand-400">
                      <Palette className="h-4.5 w-4.5" />
                    </div>
                    <span>4. Direção Visual</span>
                  </legend>
                  
                  <div className="clear-left space-y-6">
                    {/* Campo: Cores preferidas / a evitar */}
                    <div>
                      <label htmlFor="colorPreferences" className="block text-sm font-semibold text-zinc-200 mb-2">
                        Cores preferidas / Cores a evitar <span className="text-zinc-500 font-normal text-xs">(Opcional)</span>
                      </label>
                      
                      <input
                        type="text"
                        id="colorPreferences"
                        name="colorPreferences"
                        value={formData.colorPreferences}
                        onChange={handleChange}
                        disabled={status.state === 'loading'}
                        placeholder="Ex: Preferência por Azul-petróleo e Cinza; Evitar Amarelo e Laranja."
                        className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 hover:border-zinc-700 focus:border-brand-500 transition-all"
                      />
                    </div>

                    {/* Campo: Links de referência */}
                    <div>
                      <div className="flex justify-between items-baseline mb-2">
                        <label htmlFor="referenceLinks" className="block text-sm font-semibold text-zinc-200">
                          Links de referência <span className="text-zinc-500 font-normal text-xs">(Opcional)</span>
                        </label>
                        <span className="text-[10px] text-zinc-500">URL opcional</span>
                      </div>
                      
                      <input
                        type="url"
                        id="referenceLinks"
                        name="referenceLinks"
                        value={formData.referenceLinks}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={status.state === 'loading'}
                        placeholder="Ex: https://behance.net/exemplo ou pinterest.com/pasta"
                        aria-invalid={!!errors.referenceLinks}
                        aria-describedby={errors.referenceLinks ? "referenceLinks-error" : undefined}
                        className={`w-full bg-zinc-900/60 border rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 hover:border-zinc-700 transition-all ${
                          errors.referenceLinks && touched.referenceLinks
                            ? 'border-rose-500/50 bg-rose-500/5 focus:border-rose-500'
                            : 'border-zinc-800 focus:border-brand-500'
                        }`}
                      />
                      
                      {errors.referenceLinks && touched.referenceLinks && (
                        <div id="referenceLinks-error" className="flex items-center gap-1.5 mt-2 text-xs text-rose-400 font-medium" role="alert">
                          <AlertCircle className="h-3.5 w-3.5" />
                          <span>{errors.referenceLinks}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </fieldset>

                {/* Mensagem Geral de Erro (Se aplicável no estado do envio) */}
                {status.state === 'error' && (
                  <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 flex items-center gap-3 text-rose-400" role="alert">
                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                    <span className="text-sm font-medium">{status.errorMessage}</span>
                  </div>
                )}

                {/* Botão de Envio (Com Loading Feedback e Hover/Active States) */}
                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={status.state === 'loading'}
                    className={`group w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-sm font-semibold py-4 px-10 rounded-xl shadow-lg hover:shadow-brand-500/25 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-brand-600 disabled:hover:to-indigo-600 disabled:active:scale-100 transition-all duration-300`}
                  >
                    {status.state === 'loading' ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin text-white" />
                        <span>Enviando briefing...</span>
                      </>
                    ) : (
                      <>
                        <span>Enviar Briefing</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Rodapé Mobile da Marca */}
            <div className="mt-12 text-center text-xs text-zinc-700 lg:hidden">
              &copy; {new Date().getFullYear()} Nexus Studio S.A. Todos os direitos reservados.
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
