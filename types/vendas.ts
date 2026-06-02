export interface SalesBriefingFormData {
  // 1. O Básico (Escopo e Modelo)
  projectName: string;
  businessDescription: string;
  projectGoals: string;

  // 2. Processo e Usuários
  currentProcess: string;
  targetUsers: string;

  // 3. Recursos e Relatórios
  keyFeatures: string;
  salesReports: string;

  // 4. Integrações
  paymentGateways: string;
  integrations: string;

  // 5. Design e Prazo
  brandIdentity: string;
  references: string;
  deadline: string;
}

export type SalesBriefingField = keyof SalesBriefingFormData;

export type SalesBriefingFormErrors = {
  [K in SalesBriefingField]?: string;
};

export interface SubmissionStatus {
  state: 'idle' | 'loading' | 'success' | 'error';
  errorMessage?: string;
}
