import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Check, BarChart3, Lock, Info } from 'lucide-react';
import { getSavedConsent, applyAndSaveConsent } from '../lib/cookieConsentManager';

interface CookiePreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

export const CookiePreferencesModal: React.FC<CookiePreferencesModalProps> = ({
  isOpen,
  onClose,
  onSaved,
}) => {
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const saved = getSavedConsent();
      // Default a true solo se non ancora specificato o se espressamente accettato
      setAnalyticsEnabled(saved ? saved.analytics : false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSavePreferences = () => {
    applyAndSaveConsent(analyticsEnabled);
    if (onSaved) onSaved();
    onClose();
  };

  const handleAcceptAll = () => {
    applyAndSaveConsent(true);
    if (onSaved) onSaved();
    onClose();
  };

  const handleRejectAll = () => {
    applyAndSaveConsent(false);
    if (onSaved) onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white text-gray-900 rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col p-6 md:p-8 shadow-2xl relative border border-gray-100 animate-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-primary/10 text-primary rounded-2xl">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-900 leading-tight">
                Centro Preferenze Cookie
              </h3>
              <p className="text-xs text-gray-500 font-medium mt-0.5">
                Gestisci e personalizza i consensi privacy secondo il GDPR
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100"
            aria-label="Chiudi"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto py-5 pr-1 space-y-5 text-sm leading-relaxed flex-grow text-left">
          <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100 flex items-start space-x-3 text-xs text-gray-600">
            <Info size={18} className="text-primary shrink-0 mt-0.5" />
            <p>
              Rispettiamo la tua privacy. Puoi scegliere liberamente quali categorie di cookie attivare. I cookie tecnici essenziali non possono essere disattivati in quanto fondamentali per erogare il servizio.
            </p>
          </div>

          {/* Categoria 1: Tecnici */}
          <div className="p-5 bg-white border border-gray-200/80 rounded-2xl shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <Lock size={18} className="text-emerald-600" />
                <h4 className="font-extrabold text-gray-900 text-sm">
                  Cookie Tecnici ed Essenziali
                </h4>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Check size={13} /> Sempre Attivi
              </span>
            </div>
            <p className="text-xs text-gray-500 leading-normal">
              Indispensabili per il funzionamento tecnico del sito web, la sicurezza, la gestione dei moduli di contatto, il salvataggio in bozza dei questionari e la memorizzazione della scelta del consenso cookie. Non raccolgono informazioni a fini pubblicitari.
            </p>
          </div>

          {/* Categoria 2: Statistiche e Analytics */}
          <div className="p-5 bg-white border border-gray-200/80 rounded-2xl shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <BarChart3 size={18} className="text-primary" />
                <h4 className="font-extrabold text-gray-900 text-sm">
                  Cookie Statistica e Analytics (Google Analytics 4)
                </h4>
              </div>

              {/* Custom Toggle Switch */}
              <label className="relative inline-flex items-center cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={analyticsEnabled}
                  onChange={(e) => setAnalyticsEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            <p className="text-xs text-gray-500 leading-normal">
              Ci aiutano a comprendere come i visitatori interagiscono con il sito raccogliendo e riportando informazioni in forma anonima e aggregata (es. conteggio visite, pagine più consultate). L'indirizzo IP viene anonimizzato ed è attivo Google Consent Mode v2.
            </p>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleRejectAll}
            className="px-4 py-2.5 rounded-xl border border-gray-300 hover:bg-gray-100 text-gray-700 text-xs font-bold transition-all text-center"
          >
            Rifiuta Opzionali
          </button>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <button
              type="button"
              onClick={handleSavePreferences}
              className="px-5 py-2.5 bg-gray-800 hover:bg-gray-900 text-white rounded-xl text-xs font-bold transition-all text-center"
            >
              Salva Selezione
            </button>
            <button
              type="button"
              onClick={handleAcceptAll}
              className="px-5 py-2.5 bg-gradient-brand text-white rounded-xl text-xs font-bold hover:shadow-lg transition-all text-center"
            >
              Accetta Tutti
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
