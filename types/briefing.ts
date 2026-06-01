export interface BriefingFormData {
  companyName: string;
  businessDescription: string;
  rebrandingReason: string;
  targetAudience: string;
  colorPreferences: string;
  referenceLinks: string;
}

export type BriefingField = keyof BriefingFormData;

export interface BriefingFormErrors {
  companyName?: string;
  businessDescription?: string;
  rebrandingReason?: string;
  targetAudience?: string;
  colorPreferences?: string;
  referenceLinks?: string;
}

export interface SubmissionStatus {
  state: 'idle' | 'loading' | 'success' | 'error';
  errorMessage?: string;
}
