export interface ExtractedProfile {
  id?: string;
  filename: string;
  username: string;
  displayName: string;
  platform: string;
  followers: string;
  bio: string;
  bioLinks: string[];
  extractedLinks: ExtractedLink[];
  generatedPageUrl?: string;
  revenue: number;
  status: 'pending' | 'processing' | 'completed' | 'error';
  processedAt: string;
}

export interface ExtractedLink {
  url: string;
  type: 'social' | 'monetization' | 'business' | 'contact';
  title: string;
}

export interface OCRResponse {
  success: boolean;
  profiles?: ExtractedProfile[];
  error?: string;
}
