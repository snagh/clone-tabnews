export interface BriefingFormData {
  // 1. O Básico (Estrutura e Escopo)
  logoName: string;
  slogan: string;
  businessDescription: string;
  rebrandingReason: string;
  currentBrandIssues: string;
  keepFromOldIdentity: string;

  // 2. Raio-X do Negócio (Posicionamento Oculto)
  companyHistory: string;
  whyChooseUs: string;
  worstComplaint: string;
  brandPositioningStatement: string;

  // 3. Público-Alvo e Concorrência
  targetAudience: string;
  customerPainPoints: string;
  competitorsAnalysis: string;

  // 4. Personalidade da Marca (Extração Psicológica)
  brandPartyHosting: string;
  brandPersonaAvatar: string;
  brandCommunicationTone: string;
  brandDesirableAdjectives: string;
  brandUndesirableAdjectives: string;

  // 5. Direção Visual e Entregáveis (A Aplicação Prática)
  brandFirstImpression: string;
  visualsToAvoid: string;
  brandPrimaryTouchpoints: string;
  immediateDeliverables: string;
  referenceLinks: string;
  deadlineOrLaunchDate: string;
}

export type BriefingField = keyof BriefingFormData;

export type BriefingFormErrors = {
  [K in BriefingField]?: string;
};

export interface SubmissionStatus {
  state: 'idle' | 'loading' | 'success' | 'error';
  errorMessage?: string;
}
