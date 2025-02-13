interface ResponsiveVoice {
  speak: (
    text: string,
    voice: string,
    parameters?: {
      pitch?: number;
      rate?: number;
      volume?: number;
      onstart?: () => void;
      onend?: () => void;
      onerror?: () => void;
    }
  ) => void;
  cancel: () => void;
  voiceSupport: () => boolean;
  getVoices: () => string[];
}

interface Window {
  responsiveVoice: ResponsiveVoice;
}