import { Volume2, VolumeX } from 'lucide-react';
import { useSpeech } from '../hooks/useSpeech';

interface SpeechButtonProps {
  text: string;
}

export function SpeechButton({ text }: SpeechButtonProps) {
  const { speak, stop, speaking, supported } = useSpeech();

  if (!supported) return null;

  return (
    <button
      onClick={() => speaking ? stop() : speak(text)}
      className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all"
      title={speaking ? 'Остановить чтение' : 'Прослушать статью'}
    >
      {speaking ? (
        <VolumeX className="w-6 h-6 text-white" />
      ) : (
        <Volume2 className="w-6 h-6 text-white" />
      )}
    </button>
  );
} 