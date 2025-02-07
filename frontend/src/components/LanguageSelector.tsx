import { LANGUAGES } from '../languages';
import { useLocalization } from '../hooks/useLocalization';

export function LanguageSelector() {
  const { currentLanguage, setLanguage } = useLocalization();

  return (
    <div className="relative w-full">
      <select
        value={currentLanguage.id}
        onChange={(e) => {
          const selectedLanguage = LANGUAGES.find(lang => lang.id === e.target.value);
          if (selectedLanguage) {
            setLanguage(selectedLanguage);
          }
        }}
        className="w-full appearance-none bg-white/10 text-white px-4 py-2 pr-8 rounded-lg hover:bg-white/20 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {LANGUAGES.map((language) => (
          <option key={language.id} value={language.id} className="bg-gray-800 text-white">
            {language.name}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
        <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}
