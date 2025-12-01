export interface AIModel {
  key: string;
  provider: string;
  providerName: string;
  id: string;
  name: string;
  contextWindow: number;
  description: string;
  category?: string;
  available: boolean;
}

export interface GeneratedFile {
  language: string;
  filename: string;
  content: string;
}

export type GenerationMode = 'frontend' | 'fullstack' | 'designClone';

export interface AIRequest {
  prompt: string;
  html?: string;
  previousPrompt?: string;
  mode?: GenerationMode;
  modelKey?: string;
  designUrl?: string;
}

export interface StreamChunk {
  content?: string;
  done?: boolean;
  fullContent?: string;
  mode?: GenerationMode;
  error?: string;
}
