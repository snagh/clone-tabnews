export interface UnionBriefingFormData {
  // 1. Contexto e Rotina Atual
  projectName: string;
  currentProcess: string;
  mainBottlenecks: string;

  // 2. Fluxo Financeiro
  paymentMethods: string;
  billingRules: string;
  overdueActions: string;

  // 3. Perfis e Acesso
  adminProfiles: string;
  memberPortal: string;

  // 4. Integrações e Relatórios
  receiptsGeneration: string;
  mainReports: string;
  externalSystems: string;

  // 5. Design e Prazo
  brandIdentity: string;
  references: string;
  deadline: string;
}

export type UnionBriefingField = keyof UnionBriefingFormData;

export type UnionBriefingFormErrors = {
  [K in UnionBriefingField]?: string;
};

export interface SubmissionStatus {
  state: 'idle' | 'loading' | 'success' | 'error';
  errorMessage?: string;
}
