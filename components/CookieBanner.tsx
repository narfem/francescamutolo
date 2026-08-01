import React, { useState, useEffect } from 'react';
import { ShieldAlert, Settings, Check, X } from 'lucide-react';
import { getSavedConsent, applyAndSaveConsent, initConsentOnLoad } from '../lib/cookieConsentManager';
import { CookiePreferencesModal } from './CookiePreferencesModal';

export const CookieBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Inizializza Consent Mode in base allo stato esistente
    initConsentOnLoad();

    // Mostra il banner solo se l'utente non ha mai salvato le sue preferenze
    const saved = getSavedConsent();
    if (!saved) {
      setIsVisible(true);
    }
  }, []);

  const handleAcceptAll = () => {
    applyAndSaveConsent(true);
    setIsVisible(false);
  };

  const handleRejectAll = () => {
    applyAndSaveConsent(false);
    setIsVisible(false);
  };

  const handleCustomise = () => {
    setIsModalOpen(true);
  };

  const handleModalSaved = () => {
    setIsVisible(false);
  };

  if (!isVisible && !isModalOpen) return null;

  return (
    <>
      {isVisible && (
        <aside
          role="region"
          aria-label="Informativa gestione cookie e privacy"
          className="fixed bottom-0 inset-x-0 z-[100] p-4 md:p-6 bg-white/95 dark:bg-brandDark/95 backdrop-blur-md border-t border-gray-200/80 shadow-2xl animate-in slide-in-from-bottom duration-300"
        >
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 text-left">
            {/* Description */}
            <div className="space-y-1.5 max-w-4xl">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-primary/10 text-primary rounded-xl inline-flex">
                  <ShieldAlert size={18} />
                </span>
                <h3 className="text-base font-black text-gray-900 dark:text-white">
                  Informativa sui Cookie & Privacy
                </h3>
              </div>
              <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                Questo sito utilizza <strong className="text-gray-800 dark:text-gray-100">cookie tecnici essenziali</strong> per garantirne il corretto funzionamento e, previo tuo consenso, <strong className="text-gray-800 dark:text-gray-100">cookie statistici anonimi (Google Analytics 4)</strong> per analizzare il traffico. Puoi accettare tutti i cookie, rifiutare quelli opzionali oppure personalizzare le tue scelte in qualsiasi momento.
              </p>
            </div>

            {/* Actions (Equal prominence for Reject / Accept) */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full lg:w-auto justify-end pt-2 lg:pt-0 border-t lg:border-t-0 border-gray-100 dark:border-gray-800">
              <button
                type="button"
                onClick={handleCustomise}
                className="px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5 flex-1 lg:flex-none"
              >
                <Settings size={14} />
                <span>Personalizza</span>
              </button>

              <button
                type="button"
                onClick={handleRejectAll}
                className="px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 flex-1 lg:flex-none"
              >
                <X size={14} />
                <span>Rifiuta tutti</span>
              </button>

              <button
                type="button"
                onClick={handleAcceptAll}
                className="px-5 py-2.5 bg-gradient-brand text-white rounded-xl text-xs font-extrabold hover:shadow-lg hover:shadow-primary/20 transition-all flex items-center justify-center gap-1.5 flex-1 lg:flex-none"
              >
                <Check size={14} />
                <span>Accetta tutti</span>
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* Preferences Modal */}
      <CookiePreferencesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaved={handleModalSaved}
      />
    </>
  );
};
