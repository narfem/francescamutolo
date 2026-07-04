import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { 
  Send, CheckCircle, ArrowRight, ArrowLeft, Sparkles, 
  Building, Users, Target, Palette, Shield, Monitor, FileText 
} from 'lucide-react';

const DEFAULT_QUESTIONS = {
  step1: {
    title: "1. Il tuo Brand / Attività",
    company_name_label: "Come si chiama l'azienda o il brand?",
    company_name_placeholder: "Nome ufficiale del brand",
    name_meaning_label: "Qual è il significato del nome?",
    name_meaning_placeholder: "Raccontami l'origine, l'ispirazione o la storia del nome...",
    business_description_label: "Di cosa si occupa esattamente?",
    business_description_placeholder: "Descrivi la missione del brand e il suo posizionamento generale...",
    products_services_label: "Quali prodotti o servizi offre?",
    products_services_placeholder: "Elenchi o descrizioni dei principali prodotti/servizi offerti...",
    strength_point_label: "Qual è il suo principale punto di forza rispetto ai concorrenti?",
    strength_point_placeholder: "Cosa vi rende unici o speciali?",
    slogan_label: "Esiste uno slogan o payoff?",
    slogan_placeholder: "Es: Just do it, Think different..."
  },
  step2: {
    title: "2. Target Clienti",
    target_customers_label: "Chi sono i clienti ideali?",
    target_customers_placeholder: "Descrivi i tuoi clienti ideali (interessi, stile di vita, desideri)...",
    age_range_label: "Fascia d'età prevalente?",
    age_range_placeholder: "Es: 18-35 anni, adulti, famiglie, ragazzi...",
    customer_type_label: "La clientela è principalmente composta da:",
    customer_type_options: ["Privati", "Aziende", "Entrambi"],
    market_scope_label: "Ambito del mercato di riferimento:",
    market_scope_options: ["Locale", "Nazionale", "Internazionale"],
    brand_perception_target_label: "Che percezione vuoi trasmettere ai tuoi clienti?",
    brand_perception_target_placeholder: "Es: Fiducia, lusso, freschezza, innovazione, sicurezza..."
  },
  step3: {
    title: "3. Posizionamento & Personalità",
    keywords_label: "Seleziona le parole chiave che definiscono il tuo Brand (Seleziona max 4):",
    keywords_options: ["Professionale", "Elegante", "Moderno", "Premium", "Minimal", "Innovativo", "Tecnologico", "Affidabile", "Creativo", "Artigianale", "Giovane", "Esclusivo"],
    brand_perception_label: "Come vuoi che il cliente percepisca il tuo brand?",
    brand_perception_placeholder: "In che modo vuoi posizionarti nella mente della clientela?",
    brand_personified_label: "Se il brand fosse una persona, come sarebbe? (Facoltativo)",
    brand_personified_placeholder: "Età, carattere, come si veste, come parla (es. raffinata e sicura, oppure sportiva ed estroversa)..."
  },
  step4: {
    title: "4. Preferenze Estetiche",
    palette_favorite_label: "Hai colori preferiti?",
    palette_favorite_placeholder: "Es: Rosso ciliegia, nero grafite, oro satinato...",
    palette_avoid_label: "Ci sono colori che vorresti evitare? (Perché?)",
    palette_avoid_placeholder: "Es: Evitare il verde perché associato a un competitor specifico...",
    logo_style_label: "Stile del logo preferito:",
    logo_style_options: ["Minimal", "Elaborato", "Indifferente"],
    logo_composition_label: "Composizione del logo:",
    logo_composition_options: ["Simbolo + Testo", "Solo Testo", "Entrambi / Dipende"],
    logos_liked_label: "Hai esempi di loghi che ti piacciono?",
    logos_liked_placeholder: "Descrivili o cita marchi noti che ammiri...",
    logos_disliked_label: "Hai esempi di loghi che NON ti piacciono?",
    logos_disliked_placeholder: "Marchi o soluzioni stilistiche che preferiresti evitare..."
  },
  step5: {
    title: "5. Analisi della Concorrenza",
    competitors_label: "Chi sono i tuoi principali concorrenti?",
    competitors_placeholder: "Nomi, siti web o riferimenti dei competitor diretti o indiretti...",
    admired_companies_label: "Ci sono aziende del tuo settore che apprezzi particolarmente?",
    admired_companies_placeholder: "Anche marchi non concorrenti, ma che hanno una comunicazione che trovi vincente...",
    differentiation_strategy_label: "Strategia di differenziazione desiderata:",
    differentiation_strategy_options: ["Distinguerci nettamente dai concorrenti", "Rimanere allineati nel linguaggio visivo del settore"]
  },
  step6: {
    title: "6. Applicazioni e Utilizzo",
    logo_applications_label: "Dove verrà utilizzato principalmente il logo? (Seleziona uno o più):",
    logo_applications_options: ["Online", "Social", "Sito web", "Biglietti da visita", "Insegne", "Veicoli", "Abbigliamento", "Packaging"]
  },
  step7: {
    title: "7. Consegna & Brand Manual",
    deadline_label: "Entro quando serve il progetto?",
    deadline_placeholder: "Es: Entro 2 settimane, entro un mese, nessuna fretta...",
    extra_deliverables_label: "Insieme al logo, hai bisogno di (Seleziona uno o più):",
    extra_deliverables_options: ["palette colori", "versioni monocromatiche", "logo orizzontale", "logo verticale", "favicon", "biglietto da visita", "carta intestata", "pagina web", "grafica insegna", "flyer, locandina, menu o simili"]
  },
  step8: {
    title: "Ultima Domanda Importante",
    five_years_vision_label: "Se tra 5 anni il tuo brand avrà successo, quale immagine vorresti che le persone avessero in mente quando vedono il logo?",
    five_years_vision_placeholder: "Scrivi qui la tua visione a lungo termine...",
    notes_label: "Note aggiuntive (facoltativo)",
    notes_placeholder: "Aggiungi eventualmente qualche pensiero, direttiva, idea..."
  }
};

const Questionnaire: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [authorized, setAuthorized] = useState(false);

  const [questions, setQuestions] = useState<any>(null);

  useEffect(() => {
    const loadCustomQuestions = async () => {
      try {
        const { data, error } = await supabase
          .from('settings')
          .select('mutey_rules')
          .eq('id', 'questionnaire_questions')
          .maybeSingle();
        if (data && data.mutey_rules) {
          setQuestions(JSON.parse(data.mutey_rules));
        } else {
          setQuestions(DEFAULT_QUESTIONS);
        }
      } catch (e) {
        console.error("Errore recupero domande custom, uso default:", e);
        setQuestions(DEFAULT_QUESTIONS);
      }
    };
    loadCustomQuestions();
  }, []);

  const [hasOtherKeyword, setHasOtherKeyword] = useState(false);
  const [otherKeywordText, setOtherKeywordText] = useState('');

  const [customAnswers, setCustomAnswers] = useState<Record<string, { label: string, value: string }>>({});

  const isLabelOptional = (label: string) => {
    if (!label) return false;
    const l = label.toLowerCase();
    return l.includes('(facoltativo)') || l.includes('(facoltativa)') || l.includes('facoltativo') || l.includes('facoltativa');
  };

  const renderFieldLabel = (label: string) => {
    const isOptional = isLabelOptional(label);
    return (
      <span className="inline-flex items-center gap-1">
        <span>{label}</span>
        {!isOptional && <span className="text-red-500 font-bold" title="Obbligatorio">*</span>}
      </span>
    );
  };

  const handleCustomAnswerChange = (cqId: string, label: string, value: string) => {
    setCustomAnswers(prev => ({
      ...prev,
      [cqId]: { label, value }
    }));
  };

  const isFieldHidden = (stepNum: number, field: string) => {
    return questions?.[`step${stepNum}`]?.deleted_fields?.includes(field) || false;
  };

  const renderCustomQuestionsForStep = (stepNum: number) => {
    const customQs = questions?.[`step${stepNum}`]?.custom_questions || [];
    if (customQs.length === 0) return null;

    return (
      <div className="mt-8 pt-6 border-t border-dashed border-gray-200 space-y-6">
        {customQs.map((cq: any) => {
          const valObj = customAnswers[cq.id] || { label: cq.label, value: '' };
          return (
            <div key={cq.id} className="space-y-2 text-left">
              <label className="block text-sm font-bold text-gray-700">{renderFieldLabel(cq.label)}</label>
              {cq.type === 'textarea' ? (
                <textarea
                  rows={4}
                  value={valObj.value}
                  onChange={e => handleCustomAnswerChange(cq.id, cq.label, e.target.value)}
                  placeholder={cq.placeholder || ''}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none transition-all dark:text-white dark:bg-gray-800 dark:border-gray-700 font-semibold"
                />
              ) : (
                <input
                  type="text"
                  value={valObj.value}
                  onChange={e => handleCustomAnswerChange(cq.id, cq.label, e.target.value)}
                  placeholder={cq.placeholder || ''}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all dark:text-white dark:bg-gray-800 dark:border-gray-700 font-semibold"
                />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const [hasOtherLogoApp, setHasOtherLogoApp] = useState(false);
  const [otherLogoAppText, setOtherLogoAppText] = useState('');

  const [hasOtherDeliverable, setHasOtherDeliverable] = useState(false);
  const [otherDeliverableText, setOtherDeliverableText] = useState('');

  const toggleOtherKeyword = () => {
    if (!hasOtherKeyword && formData.keywords.length >= 4) {
      alert("Puoi selezionare al massimo 4 parole chiave.");
      return;
    }
    setHasOtherKeyword(!hasOtherKeyword);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [submitted]);

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

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field: 'keywords' | 'logo_applications' | 'extra_deliverables', item: string) => {
    setFormData(prev => {
      const arr = prev[field] as string[];
      if (field === 'keywords' && !arr.includes(item) && arr.length + (hasOtherKeyword ? 1 : 0) >= 4) {
        return prev;
      }
      return {
        ...prev,
        [field]: arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item]
      };
    });
  };

  const validateStep = (stepNum: number) => {
    const qSource = questions || DEFAULT_QUESTIONS;
    const stepKey = `step${stepNum}` as 'step1' | 'step2' | 'step3' | 'step4' | 'step5' | 'step6' | 'step7' | 'step8';
    const stepConfig = qSource[stepKey];
    if (!stepConfig) return true;

    // Check custom questions first
    const customQs = stepConfig.custom_questions || [];
    for (const cq of customQs) {
      if (!isLabelOptional(cq.label)) {
        const valObj = customAnswers[cq.id];
        if (!valObj || !valObj.value || !valObj.value.trim()) {
          alert(`La risposta alla domanda "${cq.label}" è richiesta.`);
          return false;
        }
      }
    }

    const isFieldActive = (field: string) => !isFieldHidden(stepNum, field);

    if (stepNum === 1) {
      if (isFieldActive('company_name') && !formData.company_name.trim()) {
        alert(`Il campo "${stepConfig.company_name_label}" è richiesto.`);
        return false;
      }
      if (isFieldActive('name_meaning') && !formData.name_meaning.trim() && !isLabelOptional(stepConfig.name_meaning_label)) {
        alert(`Il campo "${stepConfig.name_meaning_label}" è richiesto.`);
        return false;
      }
      if (isFieldActive('business_description') && !formData.business_description.trim() && !isLabelOptional(stepConfig.business_description_label)) {
        alert(`Il campo "${stepConfig.business_description_label}" è richiesto.`);
        return false;
      }
      if (isFieldActive('products_services') && !formData.products_services.trim() && !isLabelOptional(stepConfig.products_services_label)) {
        alert(`Il campo "${stepConfig.products_services_label}" è richiesto.`);
        return false;
      }
      if (isFieldActive('strength_point') && !formData.strength_point.trim() && !isLabelOptional(stepConfig.strength_point_label)) {
        alert(`Il campo "${stepConfig.strength_point_label}" è richiesto.`);
        return false;
      }
      if (isFieldActive('slogan') && !formData.slogan.trim() && !isLabelOptional(stepConfig.slogan_label)) {
        alert(`Il campo "${stepConfig.slogan_label}" è richiesto.`);
        return false;
      }
    }

    if (stepNum === 2) {
      if (isFieldActive('target_customers') && !formData.target_customers.trim() && !isLabelOptional(stepConfig.target_customers_label)) {
        alert(`Il campo "${stepConfig.target_customers_label}" è richiesto.`);
        return false;
      }
      if (isFieldActive('age_range') && !formData.age_range.trim() && !isLabelOptional(stepConfig.age_range_label)) {
        alert(`Il campo "${stepConfig.age_range_label}" è richiesto.`);
        return false;
      }
      if (isFieldActive('customer_type') && !formData.customer_type && !isLabelOptional(stepConfig.customer_type_label)) {
        alert(`La selezione per "${stepConfig.customer_type_label}" è richiesta.`);
        return false;
      }
      if (isFieldActive('market_scope') && !formData.market_scope && !isLabelOptional(stepConfig.market_scope_label)) {
        alert(`La selezione per "${stepConfig.market_scope_label}" è richiesta.`);
        return false;
      }
      if (isFieldActive('brand_perception_target') && !formData.brand_perception_target.trim() && !isLabelOptional(stepConfig.brand_perception_target_label)) {
        alert(`Il campo "${stepConfig.brand_perception_target_label}" è richiesto.`);
        return false;
      }
    }

    if (stepNum === 3) {
      if (isFieldActive('keywords') && !isLabelOptional(stepConfig.keywords_label)) {
        const totalKeywords = formData.keywords.length + (hasOtherKeyword && otherKeywordText.trim() ? 1 : 0);
        if (totalKeywords === 0) {
          alert(`È necessario selezionare almeno una parola chiave.`);
          return false;
        }
      }
      if (isFieldActive('brand_perception') && !formData.brand_perception.trim() && !isLabelOptional(stepConfig.brand_perception_label)) {
        alert(`Il campo "${stepConfig.brand_perception_label}" è richiesto.`);
        return false;
      }
      if (isFieldActive('brand_personified') && !isLabelOptional(stepConfig.brand_personified_label) && !formData.brand_personified.trim()) {
        alert(`Il campo "${stepConfig.brand_personified_label}" è richiesto.`);
        return false;
      }
    }

    if (stepNum === 4) {
      if (isFieldActive('palette_favorite') && !formData.palette_favorite.trim() && !isLabelOptional(stepConfig.palette_favorite_label)) {
        alert(`Il campo "${stepConfig.palette_favorite_label}" è richiesto.`);
        return false;
      }
      if (isFieldActive('palette_avoid') && !formData.palette_avoid.trim() && !isLabelOptional(stepConfig.palette_avoid_label)) {
        alert(`Il campo "${stepConfig.palette_avoid_label}" è richiesto.`);
        return false;
      }
      if (isFieldActive('logo_style') && !formData.logo_style && !isLabelOptional(stepConfig.logo_style_label)) {
        alert(`La selezione per "${stepConfig.logo_style_label}" è richiesta.`);
        return false;
      }
      if (isFieldActive('logo_composition') && !formData.logo_composition && !isLabelOptional(stepConfig.logo_composition_label)) {
        alert(`La selezione per "${stepConfig.logo_composition_label}" è richiesta.`);
        return false;
      }
      if (isFieldActive('logos_liked') && !formData.logos_liked.trim() && !isLabelOptional(stepConfig.logos_liked_label)) {
        alert(`Il campo "${stepConfig.logos_liked_label}" è richiesto.`);
        return false;
      }
      if (isFieldActive('logos_disliked') && !formData.logos_disliked.trim() && !isLabelOptional(stepConfig.logos_disliked_label)) {
        alert(`Il campo "${stepConfig.logos_disliked_label}" è richiesto.`);
        return false;
      }
    }

    if (stepNum === 5) {
      if (isFieldActive('competitors') && !formData.competitors.trim() && !isLabelOptional(stepConfig.competitors_label)) {
        alert(`Il campo "${stepConfig.competitors_label}" è richiesto.`);
        return false;
      }
      if (isFieldActive('admired_companies') && !formData.admired_companies.trim() && !isLabelOptional(stepConfig.admired_companies_label)) {
        alert(`Il campo "${stepConfig.admired_companies_label}" è richiesto.`);
        return false;
      }
      if (isFieldActive('differentiation_strategy') && !formData.differentiation_strategy && !isLabelOptional(stepConfig.differentiation_strategy_label)) {
        alert(`La selezione per "${stepConfig.differentiation_strategy_label}" è richiesta.`);
        return false;
      }
    }

    if (stepNum === 6) {
      if (isFieldActive('logo_applications') && !isLabelOptional(stepConfig.logo_applications_label)) {
        const totalApps = formData.logo_applications.length + (hasOtherLogoApp && otherLogoAppText.trim() ? 1 : 0);
        if (totalApps === 0) {
          alert(`È necessario selezionare almeno un'applicazione d'uso per il logo.`);
          return false;
        }
      }
    }

    if (stepNum === 7) {
      if (isFieldActive('deadline') && !formData.deadline.trim() && !isLabelOptional(stepConfig.deadline_label)) {
        alert(`Il campo "${stepConfig.deadline_label}" è richiesto.`);
        return false;
      }
      if (isFieldActive('extra_deliverables') && !isLabelOptional(stepConfig.extra_deliverables_label)) {
        const totalDelivs = formData.extra_deliverables.length + (hasOtherDeliverable && otherDeliverableText.trim() ? 1 : 0);
        if (totalDelivs === 0) {
          alert(`È necessario selezionare almeno una delle voci richieste.`);
          return false;
        }
      }
    }

    if (stepNum === 8) {
      if (isFieldActive('five_years_vision') && !formData.five_years_vision.trim() && !isLabelOptional(stepConfig.five_years_vision_label)) {
        alert(`Il campo "${stepConfig.five_years_vision_label}" è richiesto.`);
        return false;
      }
      if (isFieldActive('notes') && !isLabelOptional(stepConfig.notes_label) && !formData.notes.trim()) {
        alert(`Il campo "${stepConfig.notes_label}" è richiesto.`);
        return false;
      }
    }

    return true;
  };

  const nextStep = () => {
    if (!validateStep(currentStep)) {
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
    if (!validateStep(currentStep)) {
      return;
    }

    if (!authorized) {
      alert("È necessario autorizzare l'utilizzo delle informazioni e dei dati inseriti per poter inviare il questionario.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    const finalKeywords = [...formData.keywords];
    if (hasOtherKeyword && otherKeywordText.trim()) {
      finalKeywords.push(`Altro: ${otherKeywordText.trim()}`);
    }

    const finalLogoApps = [...formData.logo_applications];
    if (hasOtherLogoApp && otherLogoAppText.trim()) {
      finalLogoApps.push(`Altro: ${otherLogoAppText.trim()}`);
    }

    const finalDeliverables = [...formData.extra_deliverables];
    if (hasOtherDeliverable && otherDeliverableText.trim()) {
      finalDeliverables.push(`Altro: ${otherDeliverableText.trim()}`);
    }

    let finalNotes = formData.notes || '';
    const customEntries = Object.values(customAnswers);
    if (customEntries.length > 0) {
      const customSection = "\n\n=== RISPOSTE PERSONALIZZATE AGGIUNTIVE ===\n" + 
        customEntries.map((entry: any) => `${entry.label}: ${entry.value || '(Nessuna risposta)'}`).join('\n');
      finalNotes += customSection;
    }

    const payload = {
      ...formData,
      keywords: finalKeywords,
      logo_applications: finalLogoApps,
      extra_deliverables: finalDeliverables,
      notes: finalNotes
    };

    try {
      const { error } = await supabase
        .from('questionnaires')
        .insert([payload]);

      if (error) {
        // Se la colonna 'notes' non esiste nel database (es. schema cache vecchio o non ancora aggiornato)
        if (error.message && error.message.includes("'notes'")) {
          console.warn("Colonna 'notes' non trovata nel database. Tento l'invio alternativo unendo le note alla visione a 5 anni...");
          const fallbackData = { ...payload };
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
      window.scrollTo({ top: 0, behavior: 'instant' });
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

  const q = questions || DEFAULT_QUESTIONS;

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
                  <h2 className="text-2xl font-bold text-gray-900">{q.step1.title}</h2>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">{renderFieldLabel(q.step1.company_name_label)}</label>
                  <input
                    required
                    type="text"
                    value={formData.company_name}
                    onChange={e => handleInputChange('company_name', e.target.value)}
                    placeholder={q.step1.company_name_placeholder}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all dark:text-white dark:bg-gray-800 dark:border-gray-700 font-semibold"
                  />
                </div>

                {!isFieldHidden(1, 'name_meaning') && (
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">{renderFieldLabel(q.step1.name_meaning_label)}</label>
                    <textarea
                      rows={4}
                      value={formData.name_meaning}
                      onChange={e => handleInputChange('name_meaning', e.target.value)}
                      placeholder={q.step1.name_meaning_placeholder}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none transition-all dark:text-white dark:bg-gray-800 dark:border-gray-700 font-semibold"
                    />
                  </div>
                )}

                {!isFieldHidden(1, 'business_description') && (
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">{renderFieldLabel(q.step1.business_description_label)}</label>
                    <textarea
                      rows={4}
                      value={formData.business_description}
                      onChange={e => handleInputChange('business_description', e.target.value)}
                      placeholder={q.step1.business_description_placeholder}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none transition-all dark:text-white dark:bg-gray-800 dark:border-gray-700 font-semibold"
                    />
                  </div>
                )}

                {!isFieldHidden(1, 'products_services') && (
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">{renderFieldLabel(q.step1.products_services_label)}</label>
                    <textarea
                      rows={3}
                      value={formData.products_services}
                      onChange={e => handleInputChange('products_services', e.target.value)}
                      placeholder={q.step1.products_services_placeholder}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none transition-all dark:text-white dark:bg-gray-800 dark:border-gray-700 font-semibold"
                    />
                  </div>
                )}

                {!isFieldHidden(1, 'strength_point') && (
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">{renderFieldLabel(q.step1.strength_point_label)}</label>
                    <textarea
                      rows={3}
                      value={formData.strength_point}
                      onChange={e => handleInputChange('strength_point', e.target.value)}
                      placeholder={q.step1.strength_point_placeholder}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none transition-all dark:text-white dark:bg-gray-800 dark:border-gray-700 font-semibold"
                    />
                  </div>
                )}

                {!isFieldHidden(1, 'slogan') && (
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">{renderFieldLabel(q.step1.slogan_label)}</label>
                    <input
                      type="text"
                      value={formData.slogan}
                      onChange={e => handleInputChange('slogan', e.target.value)}
                      placeholder={q.step1.slogan_placeholder}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all dark:text-white dark:bg-gray-800 dark:border-gray-700 font-semibold"
                    />
                  </div>
                )}

                {renderCustomQuestionsForStep(1)}
              </div>
            )}

            {/* STEP 2: Target */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
                  <Users className="text-primary w-6 h-6" />
                  <h2 className="text-2xl font-bold text-gray-900">{q.step2.title}</h2>
                </div>

                {!isFieldHidden(2, 'target_customers') && (
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">{renderFieldLabel(q.step2.target_customers_label)}</label>
                    <textarea
                      rows={4}
                      value={formData.target_customers}
                      onChange={e => handleInputChange('target_customers', e.target.value)}
                      placeholder={q.step2.target_customers_placeholder}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none transition-all dark:text-white dark:bg-gray-800 dark:border-gray-700 font-semibold"
                    />
                  </div>
                )}

                {!isFieldHidden(2, 'age_range') && (
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">{renderFieldLabel(q.step2.age_range_label)}</label>
                    <input
                      type="text"
                      value={formData.age_range}
                      onChange={e => handleInputChange('age_range', e.target.value)}
                      placeholder={q.step2.age_range_placeholder}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all dark:text-white dark:bg-gray-800 dark:border-gray-700 font-semibold"
                    />
                  </div>
                )}

                {!isFieldHidden(2, 'customer_type') && (
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">{renderFieldLabel(q.step2.customer_type_label)}</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {q.step2.customer_type_options.map((type: string) => (
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
                )}

                {!isFieldHidden(2, 'market_scope') && (
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">{renderFieldLabel(q.step2.market_scope_label)}</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {q.step2.market_scope_options.map((scope: string) => (
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
                )}

                {!isFieldHidden(2, 'brand_perception_target') && (
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">{renderFieldLabel(q.step2.brand_perception_target_label)}</label>
                    <textarea
                      rows={4}
                      value={formData.brand_perception_target}
                      onChange={e => handleInputChange('brand_perception_target', e.target.value)}
                      placeholder={q.step2.brand_perception_target_placeholder}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none transition-all dark:text-white dark:bg-gray-800 dark:border-gray-700 font-semibold"
                    />
                  </div>
                )}

                {renderCustomQuestionsForStep(2)}
              </div>
            )}

            {/* STEP 3: Posizionamento e personalità */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
                  <Target className="text-primary w-6 h-6" />
                  <h2 className="text-2xl font-bold text-gray-900">{q.step3.title}</h2>
                </div>

                {!isFieldHidden(3, 'keywords') && (
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">{renderFieldLabel(q.step3.keywords_label)}</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {q.step3.keywords_options.map((keyword: string) => {
                        const isSelected = formData.keywords.includes(keyword);
                        const isLimitReached = !isSelected && formData.keywords.length + (hasOtherKeyword ? 1 : 0) >= 4;
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
                      <button
                        type="button"
                        onClick={toggleOtherKeyword}
                        className={`p-3 border rounded-xl text-xs font-bold transition-all text-center ${
                          hasOtherKeyword
                            ? 'bg-gradient-brand text-white border-transparent shadow-md shadow-primary/10'
                            : (formData.keywords.length >= 4)
                              ? 'border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed opacity-60'
                              : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                        disabled={!hasOtherKeyword && (formData.keywords.length >= 4)}
                      >
                        Altro
                      </button>
                    </div>
                    {hasOtherKeyword && (
                      <div className="mt-3 animate-in fade-in duration-200">
                        <input
                          type="text"
                          value={otherKeywordText}
                          onChange={e => setOtherKeywordText(e.target.value)}
                          placeholder="Specifica altre parole chiave..."
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all dark:text-white dark:bg-gray-800 dark:border-gray-700 font-semibold"
                        />
                      </div>
                    )}
                  </div>
                )}

                {!isFieldHidden(3, 'brand_perception') && (
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">{renderFieldLabel(q.step3.brand_perception_label)}</label>
                    <textarea
                      rows={4}
                      value={formData.brand_perception}
                      onChange={e => handleInputChange('brand_perception', e.target.value)}
                      placeholder={q.step3.brand_perception_placeholder}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none transition-all dark:text-white dark:bg-gray-800 dark:border-gray-700 font-semibold"
                    />
                  </div>
                )}

                {!isFieldHidden(3, 'brand_personified') && (
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">{renderFieldLabel(q.step3.brand_personified_label)}</label>
                    <textarea
                      rows={4}
                      value={formData.brand_personified}
                      onChange={e => handleInputChange('brand_personified', e.target.value)}
                      placeholder={q.step3.brand_personified_placeholder}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none transition-all dark:text-white dark:bg-gray-800 dark:border-gray-700 font-semibold"
                    />
                  </div>
                )}

                {renderCustomQuestionsForStep(3)}
              </div>
            )}

            {/* STEP 4: Preferenze estetiche */}
            {currentStep === 4 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
                  <Palette className="text-primary w-6 h-6" />
                  <h2 className="text-2xl font-bold text-gray-900">{q.step4.title}</h2>
                </div>

                {!isFieldHidden(4, 'palette_favorite') && (
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">{renderFieldLabel(q.step4.palette_favorite_label)}</label>
                    <input
                      type="text"
                      value={formData.palette_favorite}
                      onChange={e => handleInputChange('palette_favorite', e.target.value)}
                      placeholder={q.step4.palette_favorite_placeholder}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all dark:text-white dark:bg-gray-800 dark:border-gray-700 font-semibold"
                    />
                  </div>
                )}

                {!isFieldHidden(4, 'palette_avoid') && (
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">{renderFieldLabel(q.step4.palette_avoid_label)}</label>
                    <textarea
                      rows={3}
                      value={formData.palette_avoid}
                      onChange={e => handleInputChange('palette_avoid', e.target.value)}
                      placeholder={q.step4.palette_avoid_placeholder}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none transition-all dark:text-white dark:bg-gray-800 dark:border-gray-700 font-semibold"
                    />
                  </div>
                )}

                {(!isFieldHidden(4, 'logo_style') || !isFieldHidden(4, 'logo_composition')) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {!isFieldHidden(4, 'logo_style') && (
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3">{renderFieldLabel(q.step4.logo_style_label)}</label>
                        <div className="flex flex-col gap-3">
                          {q.step4.logo_style_options.map((style: string) => (
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
                    )}

                    {!isFieldHidden(4, 'logo_composition') && (
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3">{renderFieldLabel(q.step4.logo_composition_label)}</label>
                        <div className="flex flex-col gap-3">
                          {q.step4.logo_composition_options.map((composition: string) => (
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
                    )}
                  </div>
                )}

                {!isFieldHidden(4, 'logos_liked') && (
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">{renderFieldLabel(q.step4.logos_liked_label)}</label>
                    <textarea
                      rows={3}
                      value={formData.logos_liked}
                      onChange={e => handleInputChange('logos_liked', e.target.value)}
                      placeholder={q.step4.logos_liked_placeholder}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none transition-all dark:text-white dark:bg-gray-800 dark:border-gray-700 font-semibold"
                    />
                  </div>
                )}

                {!isFieldHidden(4, 'logos_disliked') && (
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">{renderFieldLabel(q.step4.logos_disliked_label)}</label>
                    <textarea
                      rows={3}
                      value={formData.logos_disliked}
                      onChange={e => handleInputChange('logos_disliked', e.target.value)}
                      placeholder={q.step4.logos_disliked_placeholder}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none transition-all dark:text-white dark:bg-gray-800 dark:border-gray-700 font-semibold"
                    />
                  </div>
                )}

                {renderCustomQuestionsForStep(4)}
              </div>
            )}

            {/* STEP 5: Concorrenza */}
            {currentStep === 5 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
                  <Shield className="text-primary w-6 h-6" />
                  <h2 className="text-2xl font-bold text-gray-900">{q.step5.title}</h2>
                </div>

                {!isFieldHidden(5, 'competitors') && (
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">{renderFieldLabel(q.step5.competitors_label)}</label>
                    <textarea
                      rows={4}
                      value={formData.competitors}
                      onChange={e => handleInputChange('competitors', e.target.value)}
                      placeholder={q.step5.competitors_placeholder}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none transition-all dark:text-white dark:bg-gray-800 dark:border-gray-700 font-semibold"
                    />
                  </div>
                )}

                {!isFieldHidden(5, 'admired_companies') && (
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">{renderFieldLabel(q.step5.admired_companies_label)}</label>
                    <textarea
                      rows={4}
                      value={formData.admired_companies}
                      onChange={e => handleInputChange('admired_companies', e.target.value)}
                      placeholder={q.step5.admired_companies_placeholder}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none transition-all dark:text-white dark:bg-gray-800 dark:border-gray-700 font-semibold"
                    />
                  </div>
                )}

                {!isFieldHidden(5, 'differentiation_strategy') && (
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">{renderFieldLabel(q.step5.differentiation_strategy_label)}</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {q.step5.differentiation_strategy_options.map((opt: string) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => handleInputChange('differentiation_strategy', opt)}
                          className={`p-5 border rounded-xl font-semibold text-sm text-left transition-all ${
                            formData.differentiation_strategy === opt
                              ? 'border-primary bg-primary/5 text-primary shadow-sm'
                              : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {renderCustomQuestionsForStep(5)}
              </div>
            )}

            {/* STEP 6: Utilizzo del logo */}
            {currentStep === 6 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
                  <Monitor className="text-primary w-6 h-6" />
                  <h2 className="text-2xl font-bold text-gray-900">{q.step6.title}</h2>
                </div>

                {!isFieldHidden(6, 'logo_applications') && (
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">{renderFieldLabel(q.step6.logo_applications_label)}</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {q.step6.logo_applications_options.map((app: string) => {
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
                      <label 
                        className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${
                          hasOtherLogoApp 
                            ? 'border-primary bg-primary/5 text-primary' 
                            : 'border-gray-100 hover:bg-gray-50'
                        }`}
                      >
                        <input 
                          type="checkbox" 
                          className="w-5 h-5 shrink-0 accent-primary"
                          checked={hasOtherLogoApp}
                          onChange={() => setHasOtherLogoApp(!hasOtherLogoApp)}
                        />
                        <span className="text-sm font-medium">Altro</span>
                      </label>
                    </div>
                    {hasOtherLogoApp && (
                      <div className="mt-4 animate-in fade-in duration-200">
                        <input
                          type="text"
                          value={otherLogoAppText}
                          onChange={e => setOtherLogoAppText(e.target.value)}
                          placeholder="Specifica altre applicazioni..."
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all dark:text-white dark:bg-gray-800 dark:border-gray-700 font-semibold"
                        />
                      </div>
                    )}
                  </div>
                )}

                {renderCustomQuestionsForStep(6)}
              </div>
            )}

            {/* STEP 7: Consegna e brand manual */}
            {currentStep === 7 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
                  <FileText className="text-primary w-6 h-6" />
                  <h2 className="text-2xl font-bold text-gray-900">{q.step7.title}</h2>
                </div>

                {!isFieldHidden(7, 'deadline') && (
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">{renderFieldLabel(q.step7.deadline_label)}</label>
                    <input
                      type="text"
                      value={formData.deadline}
                      onChange={e => handleInputChange('deadline', e.target.value)}
                      placeholder={q.step7.deadline_placeholder}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all dark:text-white dark:bg-gray-800 dark:border-gray-700 font-semibold"
                    />
                  </div>
                )}

                {!isFieldHidden(7, 'extra_deliverables') && (
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">{renderFieldLabel(q.step7.extra_deliverables_label)}</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {q.step7.extra_deliverables_options.map((deliv: string) => {
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
                      <label 
                        className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${
                          hasOtherDeliverable 
                            ? 'border-primary bg-primary/5 text-primary' 
                            : 'border-gray-100 hover:bg-gray-50'
                        }`}
                      >
                        <input 
                          type="checkbox" 
                          className="w-5 h-5 shrink-0 accent-primary"
                          checked={hasOtherDeliverable}
                          onChange={() => setHasOtherDeliverable(!hasOtherDeliverable)}
                        />
                        <span className="text-sm font-medium">Altro</span>
                      </label>
                    </div>
                    {hasOtherDeliverable && (
                      <div className="mt-4 animate-in fade-in duration-200">
                        <input
                          type="text"
                          value={otherDeliverableText}
                          onChange={e => setOtherDeliverableText(e.target.value)}
                          placeholder="Specifica altri materiali o servizi..."
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all dark:text-white dark:bg-gray-800 dark:border-gray-750 font-semibold"
                        />
                      </div>
                    )}
                  </div>
                )}
                

                {renderCustomQuestionsForStep(7)}
              </div>
            )}

            {/* STEP 8: Ultima domanda importante */}
            {currentStep === 8 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
                  <Sparkles className="text-primary w-6 h-6" />
                  <h2 className="text-2xl font-bold text-gray-900">{q.step8.title}</h2>
                </div>

                {!isFieldHidden(8, 'five_years_vision') && (
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-4 leading-relaxed">
                      {renderFieldLabel(q.step8.five_years_vision_label)}
                    </label>
                    <textarea
                      rows={6}
                      value={formData.five_years_vision}
                      onChange={e => handleInputChange('five_years_vision', e.target.value)}
                      placeholder={q.step8.five_years_vision_placeholder}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none transition-all dark:text-white dark:bg-gray-800 dark:border-gray-700 font-semibold"
                    />
                  </div>
                )}

                {!isFieldHidden(8, 'notes') && (
                  <div className="pt-4">
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      {renderFieldLabel(q.step8.notes_label)}
                    </label>
                    <textarea
                      rows={4}
                      value={formData.notes}
                      onChange={e => handleInputChange('notes', e.target.value)}
                      placeholder={q.step8.notes_placeholder}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none transition-all dark:text-white dark:bg-gray-800 dark:border-gray-700 font-semibold"
                    />
                  </div>
                )}

                {renderCustomQuestionsForStep(8)}

                <div className="pt-6 mt-6 border-t border-gray-100">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      required
                      className="mt-1 w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary accent-primary shrink-0 cursor-pointer"
                      checked={authorized}
                      onChange={e => setAuthorized(e.target.checked)}
                    />
                    <span className="text-sm text-gray-600 leading-relaxed font-semibold select-none">
                      Autorizzo Francesca Mutolo all'utilizzo e al trattamento delle informazioni e dei dati personali inseriti in questo questionario, ai sensi del GDPR, al fine esclusivo di poter procedere alla lavorazione e allo sviluppo del mio progetto.
                    </span>
                  </label>
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
                  className="flex items-center justify-center gap-2 bg-gradient-brand text-white px-6 h-12 text-sm sm:text-base font-black tracking-wide rounded-xl hover:opacity-95 transition-all shadow-lg hover:scale-[1.02] active:scale-95 disabled:opacity-50 flex-1 sm:flex-initial min-w-[125px] sm:min-w-[145px]"
                >
                  <span>{loading ? 'Invio...' : 'Invia'}</span>
                  {!loading && (
                    <Send size={18} className="shrink-0" />
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
