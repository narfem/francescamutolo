export interface CookiePreferences {
  technical: boolean; // Sempre true (obbligatorio per il funzionamento del sito)
  analytics: boolean; // Google Analytics 4
  timestamp: string;
}

const STORAGE_KEY = 'fm_cookie_consent_preferences_v1';
const GA_MEASUREMENT_ID = 'G-ZR560949E3';

// Dichiarazione globale per TypeScript
declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
  }
}

/**
 * Recupera le preferenze salvate in localStorage
 */
export const getSavedConsent = (): CookiePreferences | null => {
  if (typeof window === 'undefined') return null;
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;
    return JSON.parse(data) as CookiePreferences;
  } catch (e) {
    console.error('Errore durante la lettura delle preferenze cookie:', e);
    return null;
  }
};

/**
 * Pulisce i cookie generati da Google Analytics se il consenso viene revocato
 */
export const clearGA4Cookies = () => {
  if (typeof document === 'undefined') return;
  const hostname = window.location.hostname;
  const cookies = document.cookie.split(';');

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i];
    const eqPos = cookie.indexOf('=');
    const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();

    if (name.startsWith('_ga') || name.startsWith('_gid') || name.startsWith('_gat')) {
      // Rimuove per dominio corrente, sotto-domini e root path
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${hostname};`;
      if (hostname.includes('.')) {
        const rootDomain = '.' + hostname.split('.').slice(-2).join('.');
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${rootDomain};`;
      }
    }
  }
};

/**
 * Aggiorna lo stato di Google Consent Mode v2
 */
export const updateGoogleConsentMode = (analyticsGranted: boolean) => {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  
  if (!window.gtag) {
    window.gtag = function () {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer.push(arguments);
    };
  }

  const status = analyticsGranted ? 'granted' : 'denied';

  window.gtag('consent', 'update', {
    analytics_storage: status,
    ad_storage: status,
    ad_user_data: status,
    ad_personalization: status,
  });
};

/**
 * Inietta lo script di GA4 solo se il consenso è accordato ed è la prima volta che viene abilitato
 */
export const loadGA4Script = () => {
  if (typeof window === 'undefined') return;
  
  if (!window.gtag) {
    window.gtag = function () {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer.push(arguments);
    };
  }

  // Se lo script esiste già, non re-iniettarlo
  if (!document.getElementById('ga4-script')) {
    const script = document.createElement('script');
    script.id = 'ga4-script';
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);
  }

  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, {
    anonymize_ip: true,
    send_page_view: true
  });
};

/**
 * Applica le preferenze (salvataggio, consent mode, iniezione/rimozione GA4)
 */
export const applyAndSaveConsent = (analyticsGranted: boolean): CookiePreferences => {
  const preferences: CookiePreferences = {
    technical: true,
    analytics: analyticsGranted,
    timestamp: new Date().toISOString(),
  };

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    } catch (e) {
      console.error('Errore nel salvataggio preferenze cookie:', e);
    }
  }

  // 1. Aggiorna Consent Mode v2
  updateGoogleConsentMode(analyticsGranted);

  // 2. Se abilitato carica lo script GA4, altrimenti cancella eventuali cookie analitici
  if (analyticsGranted) {
    loadGA4Script();
  } else {
    clearGA4Cookies();
  }

  return preferences;
};

/**
 * Inizializzazione automatica all'avvio dell'applicazione
 */
export const initConsentOnLoad = () => {
  const saved = getSavedConsent();
  if (saved) {
    // Se c'è già un consenso memorizzato, lo riapplica
    updateGoogleConsentMode(saved.analytics);
    if (saved.analytics) {
      loadGA4Script();
    } else {
      clearGA4Cookies();
    }
  } else {
    // Se non c'è consenso memorizzato, garantisce che Consent Mode v2 sia in modalità 'denied'
    updateGoogleConsentMode(false);
  }
};
