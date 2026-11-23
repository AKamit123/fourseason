export interface AiGenerationRequest {
  generationType: 'IMAGE' | 'VIDEO';
  prompt: string;
  instructions?: string;
  visualTheme?: string;
  aspectRatio?: string;
  durationSeconds?: number;
  itemIds: string[];
  itemDetails: Array<{
    id: string;
    name: string;
    theme?: string;
    coverImage?: string;
    category?: string;
  }>;
}

export interface AiGenerationResult {
  resultUrl: string;
  thumbnailUrls: string[];
  provider: string;
  providerModel: string;
  rawResponse?: any;
}

export interface IAiProvider {
  name: string;
  generateImage(req: AiGenerationRequest): Promise<AiGenerationResult>;
  generateVideo(req: AiGenerationRequest): Promise<AiGenerationResult>;
}

