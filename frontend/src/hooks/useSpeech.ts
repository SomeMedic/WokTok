import { useState, useEffect, useCallback } from 'react';
import { useLocalization } from './useLocalization';

export function useSpeech() {
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);
  const { currentLanguage } = useLocalization();
  
  useEffect(() => {
    setSupported('speechSynthesis' in window);
  }, []);

  const speak = useCallback((text: string) => {
    if (!supported) return;

    // Остановить предыдущее воспроизведение
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Установить язык в соответствии с текущим языком приложения
    if (currentLanguage.code) {
      utterance.lang = currentLanguage.code;
    } else {
      utterance.lang = 'en-US'; // Fallback на английский язык
    }
    
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, [supported, currentLanguage]);

  const stop = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, [supported]);

  return {
    speak,
    stop,
    speaking,
    supported
  };
} 