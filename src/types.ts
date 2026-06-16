export interface GeneratorInput {
  songName: string;
  musicStyle: string;
  lyrics?: string;
  links?: { platform: string; url: string }[];
}

export interface GeneratorOutput {
  titles: {
    clickbait: string;
    seo: string;
    aesthetic: string;
  };
  description: {
    narrative: string;
    hashtags: string[];
  };
  thumbnail: {
    prompt: string;
    recommendedFonts: string[];
    layoutTips: string;
  };
  seoChecklist?: {
    genre: string;
    suggestedTags: string[];
    pacingAdvice: string;
    actionableTips: string[];
  };
}

export interface SavedRelease {
  id: string;
  songName: string;
  musicStyle: string;
  lyrics: string;
  links?: { platform: string; url: string }[];
  result: GeneratorOutput;
  timestamp: string;
  isMock: boolean;
  isFallback?: boolean;
  fallbackReason?: string;
}

