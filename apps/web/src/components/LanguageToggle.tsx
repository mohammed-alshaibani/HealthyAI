'use client';

type Props = {
  lang: 'en' | 'ar';
  setLang: (lang: 'en' | 'ar') => void;
};

export function LanguageToggle({ lang, setLang }: Props) {
  return (
    <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
      <button
        onClick={() => setLang('en')}
        className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
          lang === 'en'
            ? 'bg-white dark:bg-slate-700 shadow text-blue-600 dark:text-blue-400'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
        }`}
      >
        English
      </button>
      <button
        onClick={() => setLang('ar')}
        className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
          lang === 'ar'
            ? 'bg-white dark:bg-slate-700 shadow text-blue-600 dark:text-blue-400'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
        }`}
      >
        العربية
      </button>
    </div>
  );
}
