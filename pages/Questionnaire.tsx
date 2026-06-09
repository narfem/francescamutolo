import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { 
  Send, CheckCircle, ArrowRight, ArrowLeft, Sparkles, 
  Building, Users, Target, Palette, Shield, Monitor, FileText 
} from 'lucide-react';

const Questionnaire: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formData, setFormData] = useState({
    company_name: '',
    name_meaning: '',
    business_description: '',
    products_services: '',
    strength_point: '',
    slogan: '',
    target_customers: '',
    age_range: '',
    customer_type: '',
    market_scope: '',
    brand_perception_target: '',
    keywords: [] as string[],
    brand_perception: '',
    brand_personified: '',
    palette_favorite: '',
    palette_avoid: '',
    logo_style: '',
    logo_composition: '',
    logos_liked: '',
    logos_disliked: '',
    competitors: '',
    admired_companies: '',
    differentiation_strategy: '',
    logo_applications: [] as string[],
    deadline: '',
    extra_deliverables: [] as string[],
    five_years_vision: '',
    notes: ''
  });

  const totalSteps = 8;

  const keywordOptions = [
    'Professionale', 'Elegante', 'Moderno', 'Premium', 'Minimal', 
    'Innovativo', 'Tecnologico', 'Affidabile', 'Creativo', 
    'Artigianale', 'Giovane', 'Esclusivo'
  ];

  const logoApplicationsList = [
    'Online', 'Social', 'Sito web', 'Biglietti da visita', 
    'Insegne', 'Veicoli', 'Abbigliamento', 'Packaging'
  ];

  const extraDeliverablesList = [
    'palette colori', 
    'versioni monocromatiche', 
    'logo orizzontale', 
    'logo verticale', 
    'favicon',
    'biglietto da visita', 
    'carta intestata', 
    'landing page', 
    'grafica insegna', 
    'flyer, locandina, menu o simili'
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field: 'keywords' | 'logo_applications' | 'extra_deliverables', item: string) => {
    setFormData(prev => {
      const arr = prev[field] as string[];
      if (field === 'keywords' && !arr.includes(item) && arr.length >= 4) {
        return prev;
      }
      return {
        ...prev,
        [field]: arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item]
      };
    });
  };

  const nextStep = () => {
    if (currentStep === 1 && !formData.company_name.trim()) {
      alert("Il nome dell'azienda o del brand è richiesto per continuare.");
      return;
    }
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const submitQuestionnaire = async () => {
    if (!formData.company_name.trim()) {
      alert("Il nome dell'azienda o del brand è richiesto.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const { error } = await supabase
        .from('questionnaires')
        .insert([formData]);

      if (error) {
        // Se la colonna 'notes' non esiste nel database (es. schema cache vecchio o non ancora aggiornato)
        if (error.message && error.message.includes("'notes'")) {
          console.warn("Colonna 'notes' non trovata nel database. Tento l'invio alternativo unendo le note alla visione a 5 anni...");
          const fallbackData = { ...formData };
          if (fallbackData.notes) {
            fallbackData.five_years_vision = `${fallbackData.five_years_vision || ''}\n\n[Note aggiuntive]: ${fallbackData.notes}`;
          }
          // @ts-ignore
          delete fallbackData.notes;

          const { error: retryError } = await supabase
            .from('questionnaires')
            .insert([fallbackData]);

          if (retryError) {
            throw retryError;
          }
        } else {
          throw error;
        }
      }
      setSubmitted(true);
    } catch (error: any) {
      console.error("Errore salvataggio questionario:", error);
      const systemError = error?.message || error?.details || JSON.stringify(error);
      setErrorMessage(
        `Si è verificato un errore durante l'invio (${systemError}). Assicurati che lo schema del database sia aggiornato e la tabella 'questionnaires' sia stata creata.`
      );
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => {
    return (
      <div className="flex items-center justify-between max-w-xl mx-auto mb-10 px-4">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNum = index + 1;
          const isActive = stepNum === currentStep;
          const isCompleted = stepNum < currentStep;

          return (
            <React.Fragment key={stepNum}>
              <button
                type="button"
                onClick={() => {
                  if (stepNum < currentStep || (stepNum > currentStep && formData.company_name.trim())) {
                    setCurrentStep(stepNum);
                  }
                }}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                  isActive 
                    ? 'bg-gradient-brand text-white ring-4 ring-primary/20 scale-110' 
                    : isCompleted 
                      ? 'bg-primary text-white' 
                      : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                }`}
              >
                {stepNum}
              </button>
              {stepNum < totalSteps && (
                <div className={`flex-grow h-1 mx-2 rounded-full transition-all duration-500 ${
                  isCompleted ? 'bg-primary' : 'bg-gray-200'
                }`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  if (submitted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 bg-gray-50 py-16">
        <div className="max-w-xl w-full text-center bg-white p-10 md:p-16 rounded-[2.5rem] shadow-xl border border-gray-100">
          <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 text-green-500">
            <CheckCircle size={56} className="animate-bounce" />
          </div>
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Questionario Inviato!</h2>
          <div className="w-16 h-1 bg-gradient-brand mx-auto rounded-full mb-6"></div>
          <p className="text-gray-600 mb-10 text-lg leading-relaxed">
            Grazie per aver compilato la richiesta approfondita. Ho ricevuto tutte le informazioni del tuo brand e inizierò presto l'analisi preliminare.
          </p>
          <a
            href="/"
            className="inline-block bg-gradient-brand text-white px-8 py-4 rounded-xl font-bold tracking-wide shadow-lg hover:shadow-primary/20 transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            Torna alla Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-start mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-3 text-xs font-bold text-slate-500 hover:text-primary transition-colors bg-white py-3 px-8 rounded-full border border-gray-100 shadow-sm"
          >
            <ArrowLeft size={14} /> Indietro
          </Link>
        </div>
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight leading-none">
            Progetta la Tua Identità Visiva
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Questo questionario guiderà il processo di design strategico del tuo brand. Prenditi il tempo necessario per rispondere a ogni domanda.
          </p>
        </div>

        {renderStepIndicator()}

        {errorMessage && (
          <div className="bg-red-50 text-red-600 border border-red-100 p-6 rounded-2xl mb-8 text-sm font-semibold">
            {errorMessage}
          </div>
        )}

        <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-8 md:p-12 space-y-8">
            
            {/* STEP 1: Attività */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
                  <Building className="text-primary w-6 h-6" />
                  <h2 className="text-2xl font-bold text-gray-900">1. Il tuo Brand / Attività</h2>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Come si chiama l'azienda o il brand?</label>
                  <input
                    required
                    type="text"
                    value={formData.company_name}
                    onChange={e => handleInputChange('company_name', e.target.value)}
                    placeholder="Nome ufficiale del brand"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all dark:text-white dark:bg-gray-800 dark:border-gray-700"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Qual è il significato del nome?</label>
                  <textarea
                    rows={4}
                    value={formData.name_meaning}
                    onChange={e => handleInputChange('name_meaning', e.target.value)}
                    placeholder="Raccontami l'origine, l'ispirazione o la storia del nome..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none transition-all dark:text-white dark:bg-gray-800 dark:border-gray-700"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Di cosa si occupa esattamente?</label>
                  <textarea
                    rows={4}
                    value={formData.business_description}
                    onChange={e => handleInputChange('business_description', e.target.value)}
                    placeholder="Descrivi la missione del brand e il suo posizionamento generale..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none transition-all dark:text-white dark:bg-gray-800 dark:border-gray-700"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Quali prodotti o servizi offre?</label>
                  <textarea
                    rows={3}
                    value={formData.products_services}
                    onChange={e => handleInputChange('products_services', e.target.value)}
                    placeholder="Elenchi o descrizioni dei principali prodotti/servizi offerti..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none transition-all dark:text-white dark:bg-gray-800 dark:border-gray-700"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Qual è il suo principale punto di forza rispetto ai concorrenti?</label>
                  <textarea
                    rows={3}
                    value={formData.strength_point}
                    onChange={e => handleInputChange('strength_point', e.target.value)}
                    placeholder="Cosa vi rende unici o speciali?"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none transition-all dark:text-white dark:bg-gray-800 dark:border-gray-700"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Esiste uno slogan o payoff?</label>
                  <input
                    type="text"
                    value={formData.slogan}
                    onChange={e => handleInputChange('slogan', e.target.value)}
                    placeholder="Es: Just do it, Think different..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all dark:text-white dark:bg-gray-800 dark:border-gray-700"
                  />
                </div>
              </div>
            )}

            {/* STEP 2: Target */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
                  <Users className="text-primary w-6 h-6" />
                  <h2 className="text-2xl font-bold text-gray-900">2. Target Clienti</h2>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Chi sono i clienti ideali?</label>
                  <textarea
                    rows={4}
                    value={formData.target_customers}
                    onChange={e => handleInputChange('target_customers', e.target.value)}
                    placeholder="Descrivi i tuoi clienti ideali (interessi, stile di vita, desideri)..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none transition-all dark:text-white dark:bg-gray-800 dark:border-gray-700"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Fascia d'età prevalente?</label>
                  <input
                    type="text"
                    value={formData.age_range}
                    onChange={e => handleInputChange('age_range', e.target.value)}
                    placeholder="Es: 18-35 anni, adulti, famiglie, ragazzi..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all dark:text-white dark:bg-gray-800 dark:border-gray-700"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">La clientela è principalmente composta da:</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {['Privati', 'Aziende', 'Entrambi'].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => handleInputChange('customer_type', type)}
                        className={`p-4 border rounded-xl font-semibold text-sm text-center transition-all ${
                          formData.customer_type === type
                            ? 'border-primary bg-primary/5 text-primary shadow-sm'
                            : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">Ambito del mercato di riferimento:</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {['Locale', 'Nazionale', 'Internazionale'].map((scope) => (
                      <button
                        key={scope}
                        type="button"
                        onClick={() => handleInputChange('market_scope', scope)}
                        className={`p-4 border rounded-xl font-semibold text-sm text-center transition-all ${
                          formData.market_scope === scope
                            ? 'border-primary bg-primary/5 text-primary shadow-sm'
                            : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {scope}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Che percezione vuoi trasmettere ai tuoi clienti?</label>
                  <textarea
                    rows={4}
                    value={formData.brand_perception_target}
                    onChange={e => handleInputChange('brand_perception_target', e.target.value)}
                    placeholder="Es: Fiducia, lusso, freschezza, innovazione, sicurezza..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none transition-all dark:text-white dark:bg-gray-800 dark:border-gray-700"
                  />
                </div>
              </div>
            )}

            {/* STEP 3: Posizionamento e personalità */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
                  <Target className="text-primary w-6 h-6" />
                  <h2 className="text-2xl font-bold text-gray-900">3. Posizionamento & Personalità</h2>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">Seleziona le parole chiave che definiscono il tuo Brand (Seleziona max 4):</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {keywordOptions.map((keyword) => {
                      const isSelected = formData.keywords.includes(keyword);
                      const isLimitReached = !isSelected && formData.keywords.length >= 4;
                      return (
                        <button
                          key={keyword}
                          type="button"
                          disabled={isLimitReached}
                          onClick={() => toggleArrayItem('keywords', keyword)}
                          className={`p-3 border rounded-xl text-xs font-bold transition-all text-center ${
                            isSelected
                              ? 'bg-gradient-brand text-white border-transparent shadow-md shadow-primary/10'
                              : isLimitReached
                                ? 'border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed opacity-60'
                                : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {keyword}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Come vuoi che il cliente percepisca il tuo brand?</label>
                  <textarea
                    rows={4}
                    value={formData.brand_perception}
                    onChange={e => handleInputChange('brand_perception', e.target.value)}
                    placeholder="In che modo vuoi posizionarti nella mente della clientela?"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none transition-all dark:text-white dark:bg-gray-800 dark:border-gray-700"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Se il brand fosse una persona, come sarebbe? (Facoltativo)</label>
                  <textarea
                    rows={4}
                    value={formData.brand_personified}
                    onChange={e => handleInputChange('brand_personified', e.target.value)}
                    placeholder="Età, carattere, come si veste, come parla (es. raffinata e sicura, oppure sportiva ed estroversa)..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none transition-all dark:text-white dark:bg-gray-800 dark:border-gray-700"
                  />
                </div>
              </div>
            )}

            {/* STEP 4: Preferenze estetiche */}
            {currentStep === 4 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
                  <Palette className="text-primary w-6 h-6" />
                  <h2 className="text-2xl font-bold text-gray-900">4. Preferenze Estetiche</h2>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Hai colori preferiti?</label>
                  <input
                    type="text"
                    value={formData.palette_favorite}
                    onChange={e => handleInputChange('palette_favorite', e.target.value)}
                    placeholder="Es: Rosso ciliegia, nero grafite, oro satinato..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all dark:text-white dark:bg-gray-800 dark:border-gray-700"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Ci sono colori che vorresti evitare? (Perché?)</label>
                  <textarea
                    rows={3}
                    value={formData.palette_avoid}
                    onChange={e => handleInputChange('palette_avoid', e.target.value)}
                    placeholder="Es: Evitare il verde perché associato a un competitor specifico..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none transition-all dark:text-white dark:bg-gray-800 dark:border-gray-700"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">Stile del logo preferito:</label>
                    <div className="flex flex-col gap-3">
                      {['Minimal', 'Elaborato', 'Indifferente'].map((style) => (
                        <button
                          key={style}
                          type="button"
                          onClick={() => handleInputChange('logo_style', style)}
                          className={`p-4 border rounded-xl font-semibold text-sm text-left transition-all ${
                            formData.logo_style === style
                              ? 'border-primary bg-primary/5 text-primary'
                              : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {style}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">Composizione del logo:</label>
                    <div className="flex flex-col gap-3">
                      {['Simbolo + Testo', 'Solo Testo', 'Entrambi / Dipende'].map((composition) => (
                        <button
                          key={composition}
                          type="button"
                          onClick={() => handleInputChange('logo_composition', composition)}
                          className={`p-4 border rounded-xl font-semibold text-sm text-left transition-all ${
                            formData.logo_composition === composition
                              ? 'border-primary bg-primary/5 text-primary'
                              : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {composition}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Hai esempi di loghi che ti piacciono?</label>
                  <textarea
                    rows={3}
                    value={formData.logos_liked}
                    onChange={e => handleInputChange('logos_liked', e.target.value)}
                    placeholder="Descrivili o cita marchi noti che ammiri..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none transition-all dark:text-white dark:bg-gray-800 dark:border-gray-700"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Hai esempi di loghi che NON ti piacciono?</label>
                  <textarea
                    rows={3}
                    value={formData.logos_disliked}
                    onChange={e => handleInputChange('logos_disliked', e.target.value)}
                    placeholder="Marchi o soluzioni stilistiche che preferiresti evitare..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none transition-all dark:text-white dark:bg-gray-800 dark:border-gray-700"
                  />
                </div>
              </div>
            )}

            {/* STEP 5: Concorrenza */}
            {currentStep === 5 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
                  <Shield className="text-primary w-6 h-6" />
                  <h2 className="text-2xl font-bold text-gray-900">5. Analisi della Concorrenza</h2>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Chi sono i tuoi principali concorrenti?</label>
                  <textarea
                    rows={4}
                    value={formData.competitors}
                    onChange={e => handleInputChange('competitors', e.target.value)}
                    placeholder="Nomi, siti web o riferimenti dei competitor diretti o indiretti..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none transition-all dark:text-white dark:bg-gray-800 dark:border-gray-700"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Ci sono aziende del tuo settore che apprezzi particolarmente?</label>
                  <textarea
                    rows={4}
                    value={formData.admired_companies}
                    onChange={e => handleInputChange('admired_companies', e.target.value)}
                    placeholder="Anche marchi non concorrenti, ma che hanno una comunicazione che trovi vincente..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none transition-all dark:text-white dark:bg-gray-800 dark:border-gray-700"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">Strategia di differenziazione desiderata:</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { id: 'distinguish', label: 'Distinguerci nettamente dai concorrenti' },
                      { id: 'aligned', label: 'Rimanere allineati nel linguaggio visivo del settore' }
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleInputChange('differentiation_strategy', opt.label)}
                        className={`p-5 border rounded-xl font-semibold text-sm text-left transition-all ${
                          formData.differentiation_strategy === opt.label
                            ? 'border-primary bg-primary/5 text-primary shadow-sm'
                            : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 6: Utilizzo del logo */}
            {currentStep === 6 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
                  <Monitor className="text-primary w-6 h-6" />
                  <h2 className="text-2xl font-bold text-gray-900">6. Applicazioni e Utilizzo</h2>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">Dove verrà utilizzato principalmente il logo? (Seleziona uno o più):</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {logoApplicationsList.map((app) => {
                      const isSelected = formData.logo_applications.includes(app);
                      return (
                        <label 
                          key={app} 
                          className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${
                            isSelected 
                              ? 'border-primary bg-primary/5 text-primary' 
                              : 'border-gray-100 hover:bg-gray-50'
                          }`}
                        >
                          <input 
                            type="checkbox" 
                            className="w-5 h-5 shrink-0 accent-primary"
                            checked={isSelected}
                            onChange={() => toggleArrayItem('logo_applications', app)}
                          />
                          <span className="text-sm font-medium">{app}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 7: Consegna e brand manual */}
            {currentStep === 7 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
                  <FileText className="text-primary w-6 h-6" />
                  <h2 className="text-2xl font-bold text-gray-900">7. Consegna & Brand Manual</h2>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Entro quando serve il progetto?</label>
                  <input
                    type="text"
                    value={formData.deadline}
                    onChange={e => handleInputChange('deadline', e.target.value)}
                    placeholder="Es: Entro 2 settimane, entro un mese, nessuna fretta..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all dark:text-white dark:bg-gray-800 dark:border-gray-700"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">Insieme al logo, hai bisogno di (Seleziona uno o più):</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {extraDeliverablesList.map((deliv) => {
                      const isSelected = formData.extra_deliverables.includes(deliv);
                      return (
                        <label 
                          key={deliv} 
                          className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${
                            isSelected 
                              ? 'border-primary bg-primary/5 text-primary' 
                              : 'border-gray-100 hover:bg-gray-50'
                          }`}
                        >
                          <input 
                            type="checkbox" 
                            className="w-5 h-5 shrink-0 accent-primary"
                            checked={isSelected}
                            onChange={() => toggleArrayItem('extra_deliverables', deliv)}
                          />
                          <span className="text-sm font-medium capitalize">{deliv}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
                
                <div className="p-6 bg-slate-50 border border-slate-100 rounded-3xl space-y-4">
                  <h4 className="font-extrabold text-sm text-slate-800 uppercase tracking-widest">Compreso nella consegna standard:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600 font-medium">
                    <div className="flex items-center gap-2">✓ Manuale del Brand (PDF)</div>
                    <div className="flex items-center gap-2">✓ Formato vettoriale SVG</div>
                    <div className="flex items-center gap-2">✓ Formato pronto stampa EPS/PDF</div>
                    <div className="flex items-center gap-2">✓ Immagini PNG (sfondo trasparente)</div>
                    <div className="flex items-center gap-2">✓ Immagini ad alta risoluzione JPG</div>
                    <div className="flex items-center gap-2">✓ Link ai font raccomandati</div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 8: Ultima domanda importante */}
            {currentStep === 8 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
                  <Sparkles className="text-primary w-6 h-6" />
                  <h2 className="text-2xl font-bold text-gray-900">Ultima Domanda Importante</h2>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-4 leading-relaxed">
                    Se tra 5 anni il tuo brand avrà successo, quale immagine vorresti che le persone avessero in mente quando vedono il logo?
                  </label>
                  <textarea
                    rows={6}
                    value={formData.five_years_vision}
                    onChange={e => handleInputChange('five_years_vision', e.target.value)}
                    placeholder="Scrivi qui la tua visione a lungo termine..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none transition-all dark:text-white dark:bg-gray-800 dark:border-gray-700"
                  />
                </div>

                <div className="pt-4">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Note aggiuntive (facoltativo)
                  </label>
                  <textarea
                    rows={4}
                    value={formData.notes}
                    onChange={e => handleInputChange('notes', e.target.value)}
                    placeholder="Aggiungi eventualmente qualche pensiero, direttiva, idea..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none transition-all dark:text-white dark:bg-gray-800 dark:border-gray-700"
                  />
                </div>
              </div>
            )}

            {/* Navigation Controls */}
            <div className="flex items-center justify-between gap-4 pt-6 border-t border-gray-100">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex items-center justify-center h-12 text-sm sm:text-base font-bold text-slate-600 hover:text-slate-900 border border-slate-200 rounded-xl transition-all hover:bg-slate-50 flex-1 sm:flex-initial min-w-[125px] sm:min-w-[145px]"
                >
                  <span>Indietro</span>
                </button>
              ) : (
                <div className="flex-1 sm:flex-initial" />
              )}

              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center justify-center bg-gradient-brand text-white h-12 text-sm sm:text-base font-bold tracking-wide rounded-xl hover:opacity-95 transition-all shadow-md shadow-primary/10 flex-1 sm:flex-initial min-w-[125px] sm:min-w-[145px]"
                >
                  <span>Continua</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={submitQuestionnaire}
                  disabled={loading}
                  className="relative flex items-center justify-center bg-gradient-brand text-white h-12 text-sm sm:text-base font-black tracking-wide rounded-xl hover:opacity-95 transition-all shadow-lg hover:scale-[1.02] active:scale-95 disabled:opacity-50 flex-1 sm:flex-initial min-w-[125px] sm:min-w-[145px]"
                >
                  <span>{loading ? 'Invio...' : 'Invia Questionario'}</span>
                  {!loading && (
                    <span className="absolute right-4 flex items-center">
                      <Send size={18} />
                    </span>
                  )}
                </button>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Questionnaire;
