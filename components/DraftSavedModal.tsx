import React, { useState } from 'react';
import { Check, Copy, ExternalLink, BookmarkCheck, X, Sparkles, Share2 } from 'lucide-react';

interface DraftSavedModalProps {
  isOpen: boolean;
  onClose: () => void;
  token: string;
  resumeUrl: string;
  questionnaireTitle?: string;
  lastSavedAt?: string;
}

export const DraftSavedModal: React.FC<DraftSavedModalProps> = ({
  isOpen,
  onClose,
  token,
  resumeUrl,
  questionnaireTitle = "Questionario",
  lastSavedAt
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(resumeUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      // fallback
      const textArea = document.createElement("textarea");
      textArea.value = resumeUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-gray-900 rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-gray-100 dark:border-gray-800 relative space-y-6 text-left"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          title="Chiudi"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl shrink-0">
            <BookmarkCheck size={32} />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-primary/10 text-primary mb-1">
              <Sparkles size={12} /> Bozza Salvata
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Bozza salvata con successo
            </h3>
          </div>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
          Tutti i dati inseriti finora per <strong className="text-gray-900 dark:text-white">{questionnaireTitle}</strong> sono stati registrati. 
          Puoi chiudere questa pagina e riprendere la compilazione in qualsiasi momento dal punto in cui ti trovi.
        </p>

        {/* Link container */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Il tuo link di ripresa unico:
          </label>
          <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800/80 p-2.5 rounded-2xl border border-gray-200 dark:border-gray-700">
            <input
              type="text"
              readOnly
              value={resumeUrl}
              onClick={e => (e.target as HTMLInputElement).select()}
              className="flex-grow bg-transparent text-xs font-mono font-semibold text-gray-800 dark:text-gray-200 outline-none px-2 truncate"
            />
            <button
              onClick={handleCopy}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all duration-200 shrink-0 shadow-sm ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-primary hover:bg-primary/90 text-white active:scale-95'
              }`}
            >
              {copied ? (
                <>
                  <Check size={14} /> Copiato!
                </>
              ) : (
                <>
                  <Copy size={14} /> Copia Link
                </>
              )}
            </button>
          </div>
        </div>

        {/* Tip banner */}
        <div className="p-4 bg-amber-500/10 rounded-2xl border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-3">
          <Share2 size={18} className="shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">Consiglio pratico:</p>
            <p className="text-amber-800/90 dark:text-amber-300">
              Copia il link e invialo alla tua email o in una chat WhatsApp per ritrovarlo facilmente quando vuoi proseguire.
            </p>
          </div>
        </div>

        {/* Footer actions */}
        <div className="pt-2 flex items-center justify-between gap-3 border-t border-gray-100 dark:border-gray-800">
          <a
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors"
          >
            <ExternalLink size={14} /> Testa il link in una nuova scheda
          </a>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-brandDark hover:bg-gray-800 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md hover:shadow-lg"
          >
            Continua Compilazione
          </button>
        </div>
      </div>
    </div>
  );
};
