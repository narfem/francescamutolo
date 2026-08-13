import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { 
  Music, Sparkles, Send, CheckCircle, ArrowRight, ArrowLeft, 
  User, Heart, Target, Compass, BookOpen, Star, Award,
  BookmarkCheck, Sliders, Eye, Palette, Maximize2, X, ChevronUp, ChevronDown, Check, Info
} from 'lucide-react';
import { useQuestionnaireDraft } from '../hooks/useQuestionnaireDraft';
import { DraftSavedModal } from '../components/DraftSavedModal';
import { QuestionnaireDraft } from '../lib/draftService';
import { PrivacyConsentCheckbox } from '../components/PrivacyConsentCheckbox';

interface ArtistQuestionnaireProps {
  initialDraft?: QuestionnaireDraft;
}

// Struttura Sezioni
interface Question {
  id: string;
  number: number;
  text: string;
  subtext?: string;
  type: 'text' | 'textarea' | 'checkbox_group' | 'bipolar_slider' | 'q14_select' | 'q15_rank' | 'select_and_rank' | 'visual_gallery';
  maxSelect?: number;
  options?: string[];
  leftLabel?: string;
  rightLabel?: string;
  galleryType?: 'moods' | 'symbols';
  hasOther?: boolean;
}

interface Section {
  id: number;
  title: string;
  icon: React.ReactNode;
  questions: Question[];
}

const SECTIONS: Section[] = [
  {
    id: 1,
    title: "1. L'artista che vuoi essere",
    icon: <User className="w-5 h-5 text-primary" />,
    questions: [
      {
        id: "q1",
        number: 1,
        text: "Quando sei con le persone con cui ti senti più a tuo agio, come ti comporti di solito?",
        subtext: "Scegli massimo 3 risposte.",
        type: 'checkbox_group',
        maxSelect: 3,
        hasOther: true,
        options: [
          "Parlo molto",
          "Ascolto più di quanto parlo",
          "Faccio ridere gli altri",
          "Dico quello che penso",
          "Cerco di farmi notare",
          "Sono tranquillo",
          "Sono molto energico",
          "Mi piace provocare",
          "Mi piace osservare",
          "Tendo a prendere l'iniziativa"
        ]
      },
      {
        id: "q2",
        number: 2,
        text: "Quali caratteristiche senti più vicine al tuo modo di essere?",
        subtext: "Scegli massimo 3 risposte.",
        type: 'checkbox_group',
        maxSelect: 3,
        hasOther: true,
        options: [
          "Sicuro di me",
          "Ambizioso",
          "Determinato",
          "Curioso",
          "Sensibile",
          "Ironico",
          "Testardo",
          "Impulsivo",
          "Riflessivo",
          "Competitivo",
          "Riservato",
          "Socievole",
          "Creativo",
          "Indipendente"
        ]
      },
      {
        id: "q3",
        number: 3,
        text: "Quali artisti ti ispirano maggiormente?",
        type: 'textarea'
      },
      {
        id: "q4",
        number: 4,
        text: "Cosa ti piace di loro?",
        subtext: "Può essere il modo di fare musica, il carattere, l'immagine, il modo di stare sul palco o qualsiasi altra cosa.",
        type: 'textarea'
      },
      {
        id: "q5",
        number: 5,
        text: "C'è un artista al quale non vorresti essere associato? Perché?",
        type: 'textarea'
      },
      {
        id: "q6",
        number: 6,
        text: "Se potessi prendere una caratteristica di un artista che ammiri e farla diventare parte della tua identità, quale sceglieresti?",
        type: 'textarea'
      }
    ]
  },
  {
    id: 2,
    title: "2. Come sei e come ti viene naturale esprimerti",
    icon: <Sliders className="w-5 h-5 text-primary" />,
    questions: [
      {
        id: "q7",
        number: 7,
        text: "Indicatore di personalità 1",
        type: 'bipolar_slider',
        leftLabel: "Introverso",
        rightLabel: "Estroverso"
      },
      {
        id: "q8",
        number: 8,
        text: "Indicatore di personalità 2",
        type: 'bipolar_slider',
        leftLabel: "Calmo",
        rightLabel: "Esplosivo"
      },
      {
        id: "q9",
        number: 9,
        text: "Indicatore di personalità 3",
        type: 'bipolar_slider',
        leftLabel: "Razionale",
        rightLabel: "Istintivo"
      },
      {
        id: "q10",
        number: 10,
        text: "Indicatore di personalità 4",
        type: 'bipolar_slider',
        leftLabel: "Serio",
        rightLabel: "Ironico"
      },
      {
        id: "q11",
        number: 11,
        text: "Indicatore di personalità 5",
        type: 'bipolar_slider',
        leftLabel: "Spontaneo",
        rightLabel: "Controllato"
      },
      {
        id: "q12",
        number: 12,
        text: "Indicatore di personalità 6",
        type: 'bipolar_slider',
        leftLabel: "Discreto",
        rightLabel: "Protagonista"
      },
      {
        id: "q13",
        number: 13,
        text: "Indicatore di personalità 7",
        type: 'bipolar_slider',
        leftLabel: "Diretto",
        rightLabel: "Misterioso"
      }
    ]
  },
  {
    id: 3,
    title: "3. Come vuoi essere percepito",
    icon: <Eye className="w-5 h-5 text-primary" />,
    questions: [
      {
        id: "q14",
        number: 14,
        text: "Scegli 5 parole che descrivono meglio la sensazione che vorresti trasmettere quando le persone entrano nel tuo universo artistico.",
        subtext: "Seleziona esattamente 5 parole.",
        type: 'q14_select',
        maxSelect: 5,
        options: [
          "Potente", "Libero", "Sicuro", "Inquietante", "Affascinante", 
          "Autentico", "Ribelle", "Ambizioso", "Elegante", "Imponente", 
          "Sfrontato", "Profondo", "Energico", "Inaspettato", "Inconfondibile"
        ]
      },
      {
        id: "q15",
        number: 15,
        text: "Metti in classifica le 3 parole più importanti che hai scelto alla domanda precedente.",
        subtext: "Ordina le 3 parole principali per livello di importanza.",
        type: 'q15_rank'
      },
      {
        id: "q16",
        number: 16,
        text: "Quando una persona ascolta per la prima volta una tua canzone, quali sensazioni vorresti che provasse?",
        subtext: "Scegli e metti in classifica le 5 più importanti.",
        type: 'select_and_rank',
        maxSelect: 5,
        options: [
          "Voglia di muoversi", "Adrenalina", "Carica", "Sicurezza", "Curiosità", 
          "Libertà", "Emozione", "Nostalgia", "Tensione", "Divertimento", 
          "Rabbia", "Motivazione", "Sorpresa", "Voglia di riascoltarla"
        ]
      }
    ]
  },
  {
    id: 4,
    title: "4. Cosa vuoi trasmettere",
    icon: <Heart className="w-5 h-5 text-primary" />,
    questions: [
      {
        id: "q17",
        number: 17,
        text: "Scegli 5 concetti che senti più vicini alla tua identità artistica e mettili in classifica.",
        subtext: "Seleziona massimo 5 elementi e successivo ordinamento.",
        type: 'select_and_rank',
        maxSelect: 5,
        options: [
          "Energia", "Ambizione", "Libertà", "Rivalsa", "Forza", 
          "Autenticità", "Successo", "Indipendenza", "Passione", "Coraggio", 
          "Rispetto", "Determinazione", "Appartenenza", "Crescita", "Trasformazione"
        ]
      }
    ]
  },
  {
    id: 5,
    title: "5. La tua storia",
    icon: <BookOpen className="w-5 h-5 text-primary" />,
    questions: [
      {
        id: "q18",
        number: 18,
        text: "C'è un'esperienza, una persona o un periodo della tua vita che ha contribuito a renderti la persona e l'artista che sei oggi?",
        subtext: "In che modo ha influenzato il tuo carattere, il tuo modo di vedere le cose o il tuo modo di fare musica?",
        type: 'textarea'
      },
      {
        id: "q19",
        number: 19,
        text: "Qual è una cosa che hai fatto o raggiunto e di cui sei realmente orgoglioso?",
        subtext: "Cosa rappresenta per te?",
        type: 'textarea'
      },
      {
        id: "q20",
        number: 20,
        text: "C'è qualcosa che senti di dover dimostrare attraverso la musica?",
        subtext: "Se sì, a chi o a te stesso?",
        type: 'textarea'
      },
      {
        id: "q21",
        number: 21,
        text: "Quale caratteristica di te vorresti mantenere anche se la tua carriera dovesse cambiare completamente la tua vita?",
        type: 'textarea'
      }
    ]
  },
  {
    id: 6,
    title: "6. Cosa vuoi ottenere attraverso la musica",
    icon: <Target className="w-5 h-5 text-primary" />,
    questions: [
      {
        id: "q22",
        number: 22,
        text: "Quale effetto vorresti che la tua musica avesse sulle persone?",
        subtext: "Scegli e metti in classifica i 3 più importanti.",
        type: 'select_and_rank',
        maxSelect: 3,
        hasOther: true,
        options: [
          "Farle divertire",
          "Dar loro motivazione",
          "Farle evadere dalla realtà",
          "Farle riflettere",
          "Farle emozionare",
          "Dar loro energia",
          "Farle sentire libere",
          "Farle provocare o scuotere"
        ]
      },
      {
        id: "q23",
        number: 23,
        text: "Quali elementi vorresti diventassero riconoscibili e associabili al tuo nome nel tempo?",
        subtext: "Scegli massimo 4.",
        type: 'checkbox_group',
        maxSelect: 4,
        hasOther: true,
        options: [
          "La mia voce",
          "I miei testi",
          "Il mio stile visivo",
          "Il mio modo di vestire",
          "I simboli associati al mio nome",
          "Il mio sound",
          "La mia presenza scenica",
          "Il mio atteggiamento"
        ]
      },
      {
        id: "q24",
        number: 24,
        text: "Qual è la cosa che desideri di più ottenere attraverso la musica?",
        subtext: "Scegli massimo 3.",
        type: 'checkbox_group',
        maxSelect: 3,
        hasOther: true,
        options: [
          "Successo",
          "Riconoscibilità",
          "Rispetto",
          "Indipendenza economica",
          "Realizzazione personale",
          "Riscatto",
          "Diventare un punto di riferimento",
          "Dimostrare il mio valore"
        ]
      }
    ]
  },
  {
    id: 7,
    title: "7. Mood Visivi e Simboli",
    icon: <Palette className="w-5 h-5 text-primary" />,
    questions: [
      {
        id: "q25",
        number: 25,
        text: "I MOOD VISIVI",
        subtext: "Osserva tutti i mood visivi e scegli quelli che senti più vicini a te e al tipo di artista che vorresti diventare.",
        type: 'visual_gallery',
        galleryType: 'moods'
      },
      {
        id: "q26",
        number: 26,
        text: "I SIMBOLI",
        subtext: "Osserva tutti i simboli e scegli quelli che senti più vicini a te. Non pensare al significato del simbolo in relazione alla musica: concentrati semplicemente sulla forma, sul carattere e sulla sensazione che ti trasmette.",
        type: 'visual_gallery',
        galleryType: 'symbols'
      }
    ]
  }
];

const ArtistQuestionnaire: React.FC<ArtistQuestionnaireProps> = ({ initialDraft }) => {
  const initialPayload = initialDraft?.payload || {};
  const [currentStep, setCurrentStep] = useState(initialDraft?.current_step || 1);
  const [artistName, setArtistName] = useState(initialDraft?.company_or_artist_name || initialPayload.companyName || initialPayload.artistName || '');
  const [contactEmail, setContactEmail] = useState(initialDraft?.contact_email || initialPayload.email || '');
  
  // Risposte principali (memorizzate come dictionary key-value)
  const [answers, setAnswers] = useState<Record<string, any>>(initialPayload.formData || initialPayload.answers || {});
  
  // Stato per slider bipolari (4 posizioni discrete: 1, 2, 3, 4)
  const [sliders, setSliders] = useState<Record<string, number>>(() => {
    const savedSliders = initialPayload.sliders || {};
    const normalize = (val: any) => {
      if (val === undefined || val === null) return 0;
      const num = Number(val);
      if (num >= 1 && num <= 4) return num;
      if (num <= 25) return 1;
      if (num <= 50) return 2;
      if (num <= 75) return 3;
      return 4;
    };
    return {
      q7: normalize(savedSliders.q7),
      q8: normalize(savedSliders.q8),
      q9: normalize(savedSliders.q9),
      q10: normalize(savedSliders.q10),
      q11: normalize(savedSliders.q11),
      q12: normalize(savedSliders.q12),
      q13: normalize(savedSliders.q13),
    };
  });

  // Stato per "Altro" nei campi multipli
  const [otherInputs, setOtherInputs] = useState<Record<string, string>>(initialPayload.otherInputs || {});

  // Lightbox immagini
  const [lightboxImage, setLightboxImage] = useState<{ src: string; title: string } | null>(null);

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [privacyError, setPrivacyError] = useState(false);

  const {
    activeToken,
    isSaving,
    lastSavedTime,
    isModalOpen,
    setIsModalOpen,
    resumeUrl,
    saveCurrentDraft,
    markDraftAsCompleted
  } = useQuestionnaireDraft({
    questionnaireType: 'artist',
    formData: { ...answers, sliders, otherInputs },
    currentStep,
    totalSteps: 7,
    companyOrArtistName: artistName,
    contactEmail: contactEmail,
    extraState: { artistName, contactEmail, sliders, otherInputs },
    initialToken: initialDraft?.token || null
  });

  const topCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const currentSection = SECTIONS.find(s => s.id === currentStep) || SECTIONS[0];
  const progressPercent = Math.round((currentStep / SECTIONS.length) * 100);

  const scrollToTopForm = () => {
    if (topCardRef.current) {
      topCardRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Handler aggiornamento risposta testo
  const handleTextAnswerChange = (qId: string, val: string, element?: HTMLTextAreaElement) => {
    setAnswers(prev => ({ ...prev, [qId]: val }));
    if (errorMessage) setErrorMessage(null);
    if (element) {
      element.style.height = 'auto';
      element.style.height = `${Math.max(120, element.scrollHeight)}px`;
    }
  };

  // Handler Checkbox Group (Selezioni multiple)
  const handleCheckboxToggle = (qId: string, option: string, maxSelect: number = 3) => {
    const currentSelections: string[] = Array.isArray(answers[qId]) ? answers[qId] : (answers[qId] ? String(answers[qId]).split(', ') : []);
    
    let updated: string[];
    if (currentSelections.includes(option)) {
      updated = currentSelections.filter(o => o !== option);
    } else {
      if (currentSelections.length >= maxSelect) {
        setErrorMessage(`Puoi selezionare al massimo ${maxSelect} opzioni per questa domanda.`);
        return;
      }
      updated = [...currentSelections, option];
    }
    setErrorMessage(null);
    setAnswers(prev => ({ ...prev, [qId]: updated }));
  };

  // Handler Slider Bipolare (4 posizioni discrete)
  const handleSliderChange = (qId: string, value: number) => {
    setSliders(prev => ({ ...prev, [qId]: value }));
    const q = SECTIONS[1].questions.find(item => item.id === qId);
    if (q) {
      let desc = '';
      if (value === 1) desc = `Molto vicino a "${q.leftLabel}"`;
      else if (value === 2) desc = `Più vicino a "${q.leftLabel}"`;
      else if (value === 3) desc = `Più vicino a "${q.rightLabel}"`;
      else if (value === 4) desc = `Molto vicino a "${q.rightLabel}"`;
      
      setAnswers(prev => ({ ...prev, [qId]: `${q.leftLabel} ↔ ${q.rightLabel}: ${desc}` }));
    }
  };

  // Handler Domanda 14 (Scegli 5 parole)
  const handleQ14Toggle = (word: string) => {
    const current: string[] = Array.isArray(answers['q14']) ? answers['q14'] : [];
    if (current.includes(word)) {
      const updated = current.filter(w => w !== word);
      setAnswers(prev => ({
        ...prev,
        q14: updated,
        q15: (Array.isArray(prev.q15) ? prev.q15 : []).filter((w: string) => updated.includes(w))
      }));
    } else {
      if (current.length >= 5) {
        setErrorMessage("Devi selezionare esattamente 5 parole.");
        return;
      }
      setErrorMessage(null);
      setAnswers(prev => ({ ...prev, q14: [...current, word] }));
    }
  };

  // Handler Ranking (Q15, Q16, Q17, Q22)
  const handleRankingAddOrRemove = (qId: string, item: string, maxItems: number) => {
    const currentRank: string[] = Array.isArray(answers[qId]) ? answers[qId] : [];
    let updated: string[];
    if (currentRank.includes(item)) {
      updated = currentRank.filter(x => x !== item);
    } else {
      if (currentRank.length >= maxItems) {
        setErrorMessage(`Puoi selezionare e ordinare al massimo ${maxItems} elementi.`);
        return;
      }
      updated = [...currentRank, item];
    }
    setErrorMessage(null);
    setAnswers(prev => ({ ...prev, [qId]: updated }));
  };

  const handleMoveRank = (qId: string, index: number, direction: 'up' | 'down') => {
    const currentRank: string[] = [...(Array.isArray(answers[qId]) ? answers[qId] : [])];
    if (direction === 'up' && index > 0) {
      const temp = currentRank[index];
      currentRank[index] = currentRank[index - 1];
      currentRank[index - 1] = temp;
    } else if (direction === 'down' && index < currentRank.length - 1) {
      const temp = currentRank[index];
      currentRank[index] = currentRank[index + 1];
      currentRank[index + 1] = temp;
    }
    setAnswers(prev => ({ ...prev, [qId]: currentRank }));
  };

  // Validazione Sezione Corrente
  const validateCurrentSection = (): boolean => {
    if (!artistName.trim()) {
      setErrorMessage("Inserisci il tuo Nome d'arte / Nome e Cognome per proseguire.");
      scrollToTopForm();
      return false;
    }

    for (const q of currentSection.questions) {
      if (q.type === 'checkbox_group' || q.type === 'q14_select') {
        const selected = Array.isArray(answers[q.id]) ? answers[q.id] : [];
        if (selected.length === 0) {
          setErrorMessage(`Seleziona almeno un'opzione per la domanda ${q.number}.`);
          scrollToTopForm();
          return false;
        }
        if (q.type === 'q14_select' && selected.length !== 5) {
          setErrorMessage(`Seleziona esattamente 5 parole per la domanda 14.`);
          scrollToTopForm();
          return false;
        }
      } else if (q.type === 'q15_rank') {
        const q14Words = Array.isArray(answers['q14']) ? answers['q14'] : [];
        const q15Rank = Array.isArray(answers['q15']) ? answers['q15'] : [];
        if (q14Words.length < 5) {
          setErrorMessage("Ritorna alla domanda 14 e seleziona 5 parole prima di procedere al ranking.");
          scrollToTopForm();
          return false;
        }
        if (q15Rank.length < 3) {
          setErrorMessage("Seleziona e metti in classifica esattamente le 3 parole più importanti per la domanda 15.");
          scrollToTopForm();
          return false;
        }
      } else if (q.type === 'select_and_rank') {
        const selected = Array.isArray(answers[q.id]) ? answers[q.id] : [];
        if (selected.length === 0) {
          setErrorMessage(`Seleziona e metti in classifica le opzioni per la domanda ${q.number}.`);
          scrollToTopForm();
          return false;
        }
      } else if (q.type === 'bipolar_slider') {
        if (!sliders[q.id] || sliders[q.id] === 0) {
          setErrorMessage(`Seleziona una delle 4 posizioni per la domanda ${q.number} (${q.leftLabel} / ${q.rightLabel}).`);
          scrollToTopForm();
          return false;
        }
      } else {
        const textVal = answers[q.id];
        if (!textVal || (typeof textVal === 'string' && !textVal.trim())) {
          setErrorMessage(`Rispondi alla domanda ${q.number} per proseguire.`);
          scrollToTopForm();
          return false;
        }
      }
    }

    setErrorMessage(null);
    return true;
  };

  const handleNextSection = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (validateCurrentSection()) {
      if (currentStep < SECTIONS.length) {
        setCurrentStep(prev => prev + 1);
        scrollToTopForm();
      }
    }
  };

  const handlePrevSection = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setErrorMessage(null);
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      scrollToTopForm();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateCurrentSection()) return;

    if (!privacyConsent) {
      setPrivacyError(true);
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    // Formattazione risposte strutturate
    const structuredAnswers = SECTIONS.map(sec => ({
      section_id: sec.id,
      section_title: sec.title,
      questions: sec.questions.map(q => {
        let answerVal = answers[q.id];
        if (Array.isArray(answerVal)) {
          answerVal = answerVal.join(', ');
        } else if (typeof answerVal === 'object') {
          answerVal = JSON.stringify(answerVal);
        }

        if (q.hasOther && otherInputs[q.id]?.trim()) {
          answerVal = `${answerVal ? answerVal + ', ' : ''}Altro: ${otherInputs[q.id].trim()}`;
        }

        return {
          id: q.id,
          number: q.number,
          question: q.text,
          subtext: q.subtext || null,
          answer: answerVal || '(Nessuna risposta)'
        };
      })
    }));

    const formattedNotes = `=== SESSIONE SCOPERTA IDENTITÀ ARTISTICA ===\n` +
      `Nome Artista: ${artistName.trim() || 'Artista Anonimo'}\n` +
      `Email: ${contactEmail.trim() || 'Non indicata'}\n\n` +
      SECTIONS.map(sec => 
        `--- ${sec.title} ---\n` + 
        sec.questions.map(q => {
          let ans = answers[q.id];
          if (Array.isArray(ans)) ans = ans.join(' → ');
          if (q.hasOther && otherInputs[q.id]?.trim()) ans = `${ans || ''} [Altro: ${otherInputs[q.id].trim()}]`;
          return `[Domanda ${q.number}]: ${q.text}\n[Risposta]: ${ans || '(Nessuna risposta)'}`;
        }).join('\n\n')
      ).join('\n\n');

    const jsonNotes = JSON.stringify({
      type: 'artist_questionnaire',
      artist_name: artistName.trim() || 'Artista Anonimo',
      email: contactEmail.trim() || '',
      structured_data: structuredAnswers,
      answers: answers,
      sliders: sliders,
      otherInputs: otherInputs,
      formatted_text: formattedNotes
    });

    const mainPayload = {
      company_name: artistName.trim() ? `[ARTISTA] ${artistName.trim()}` : '[ARTISTA] Artista Anonimo',
      business_description: `Sessione di Scoperta dell'Identità Artistica • Email: ${contactEmail.trim() || 'Non indicata'}`,
      slogan: answers['q20'] || '',
      keywords: ['Identità Artistica', 'Musica'],
      brand_perception: answers['q14'] ? (Array.isArray(answers['q14']) ? answers['q14'].join(', ') : answers['q14']) : '',
      brand_personified: answers['q2'] ? (Array.isArray(answers['q2']) ? answers['q2'].join(', ') : answers['q2']) : '',
      five_years_vision: answers['q24'] ? (Array.isArray(answers['q24']) ? answers['q24'].join(', ') : answers['q24']) : '',
      notes: jsonNotes
    };

    // Backup locale immediato
    const backupItem = {
      ...mainPayload,
      id: 'local-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      is_deleted: false,
      is_read: false,
      created_at: new Date().toISOString()
    };

    try {
      const existingRaw = localStorage.getItem('local_questionnaires_backup');
      const existing = existingRaw ? JSON.parse(existingRaw) : [];
      if (Array.isArray(existing)) {
        existing.unshift(backupItem);
        localStorage.setItem('local_questionnaires_backup', JSON.stringify(existing));
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new Event('local_questionnaire_submitted'));
      }
    } catch (e) {
      console.warn("Impossibile salvare il backup locale in localStorage:", e);
    }

    try {
      // 1. Invio primario in 'questionnaires'
      const { error: questErr } = await supabase
        .from('questionnaires')
        .insert([mainPayload]);

      if (questErr) {
        console.warn("Inserimento 'questionnaires' fallback:", questErr.message);
        const fallbackData = { ...mainPayload } as any;
        fallbackData.five_years_vision = `[NOTE JSON]: ${jsonNotes}\n\n${fallbackData.five_years_vision || ''}`;
        delete fallbackData.notes;
        await supabase.from('questionnaires').insert([fallbackData]);
      }

      // 2. Invio secondario in 'artist_questionnaires'
      try {
        await supabase
          .from('artist_questionnaires')
          .insert([{
            artist_name: artistName.trim() || 'Artista Anonimo',
            email: contactEmail.trim() || null,
            answers: answers,
            structured_data: structuredAnswers
          }]);
      } catch (e) {
        // silent
      }

      setSubmitted(true);
      await markDraftAsCompleted();
      window.scrollTo({ top: 0, behavior: 'instant' });
    } catch (err: any) {
      console.error("Errore invio questionario artista:", err);
      setSubmitted(true);
      await markDraftAsCompleted();
      window.scrollTo({ top: 0, behavior: 'instant' });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
        <div className="max-w-2xl w-full text-center bg-white p-8 md:p-14 rounded-[2.5rem] shadow-xl border border-gray-100">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
            <CheckCircle size={48} className="animate-bounce" />
          </div>
          
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
            Risposte Inviate con Successo!
          </h2>
          <div className="w-16 h-1 bg-gradient-brand mx-auto rounded-full mb-6"></div>
          
          <p className="text-gray-600 mb-6 text-base md:text-lg leading-relaxed font-normal">
            Grazie per aver dedicato il tuo tempo a questa sessione di scoperta. 
            Le tue risposte permetteranno di costruire un'identità visiva e artistica autentica e profonda.
          </p>

          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 mb-8 text-left space-y-2">
            <p className="text-xs uppercase tracking-wider font-bold text-gray-400">Prossimi passi</p>
            <p className="text-sm text-gray-700 font-medium">
              Francesca analizzerà ogni risposta per la definizione strategica del tuo posizionamento visivo.
            </p>
          </div>

          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-gradient-brand text-white px-8 py-4 rounded-xl font-bold tracking-wide shadow-lg hover:shadow-primary/20 transition-all hover:-translate-y-0.5"
          >
            Torna al Sito
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Pulsante Torna Indietro */}
        <div className="flex justify-start items-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-primary transition-colors bg-white py-2.5 px-5 rounded-full border border-gray-200 shadow-sm"
          >
            <ArrowLeft size={14} /> Indietro
          </Link>
        </div>

        {/* HERO TITLE & INTRO */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
            <Music size={14} />
            <span>Identità Artistica & Branding</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight">
            Sessione di Scoperta dell'Identità Artistica
          </h1>
        </div>

        {/* TESTO INTRODUTTIVO OBBLIGATORIO */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-3 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-gradient-brand"></div>
          <p className="text-gray-700 text-sm md:text-base leading-relaxed font-medium">
            Questa sessione serve a capire meglio chi sei come persona e quale artista vuoi diventare. 
            Non ci sono risposte giuste o sbagliate: prenditi il tempo necessario e scegli ciò che senti più vicino a te.
          </p>
        </div>

        {/* MAIN FORM CARD */}
        <div ref={topCardRef} className="bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">

          {/* Dati dell'Artista */}
          <div className="p-6 md:p-8 bg-gray-50/80 border-b border-gray-100 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Nome d'arte / Nome e Cognome *
                </label>
                <input
                  type="text"
                  required
                  value={artistName}
                  onChange={e => setArtistName(e.target.value)}
                  placeholder="Es. Marco Rossi / Mononimo"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-white font-semibold text-gray-900 transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  E-mail o Contatto di riferimento
                </label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={e => setContactEmail(e.target.value)}
                  placeholder="Es. nome@email.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-white font-semibold text-gray-900 transition-all text-sm"
                />
              </div>
            </div>
          </div>

          {/* PROGRESS & NAVIGATION TABS */}
          <div className="p-6 md:p-8 border-b border-gray-100 bg-white">
            <div className="flex items-center justify-between mb-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
              <span>Sezione {currentStep} di {SECTIONS.length} — {currentSection.title}</span>
              <span className="text-primary">{progressPercent}% Completato</span>
            </div>

            {/* Barra di progresso */}
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-6">
              <div 
                className="h-full bg-gradient-brand transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>

            {/* Pulsanti Rapidi Sezione */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 chat-scrollbar">
              {SECTIONS.map((sec) => {
                const isActive = sec.id === currentStep;
                const isAnswered = sec.questions.some(q => {
                  const a = answers[q.id];
                  if (Array.isArray(a)) return a.length > 0;
                  return !!a && String(a).trim() !== '';
                });

                return (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => {
                      if (sec.id > currentStep) {
                        if (!validateCurrentSection()) return;
                      }
                      setErrorMessage(null);
                      setCurrentStep(sec.id);
                      scrollToTopForm();
                    }}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                      isActive
                        ? 'bg-primary text-white border-primary shadow-sm'
                        : isAnswered
                          ? 'bg-primary/5 text-primary border-primary/20 hover:bg-primary/10'
                          : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <span>{sec.id}.</span>
                    <span className="hidden sm:inline">{sec.title.replace(/^\d+\.\s*/, '')}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* FORM CONTENT */}
          <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-10">

            {errorMessage && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-sm font-semibold animate-in fade-in flex items-center gap-2">
                <Info size={18} className="shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* TITOLO SEZIONE */}
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <div className="p-2.5 rounded-2xl bg-primary/10 text-primary">
                {currentSection.icon}
              </div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                {currentSection.title}
              </h2>
            </div>

            {/* DOMANDE SEZIONE CORRENTE */}
            <div className="space-y-10">
              {currentSection.questions.map((q) => {
                const selectedList: string[] = Array.isArray(answers[q.id]) ? answers[q.id] : [];

                return (
                  <div key={q.id} className="space-y-4 text-left animate-in fade-in duration-300">
                    <div className="space-y-1">
                      <label className="block text-base md:text-lg font-bold text-gray-900 leading-snug">
                        <span className="text-primary mr-1">{q.number}.</span> {q.text}
                      </label>

                      {q.subtext && (
                        <p className="text-xs md:text-sm text-gray-500 font-medium italic">
                          {q.subtext}
                        </p>
                      )}
                    </div>

                    {/* TYPE 1: TEXTAREA STANDARD */}
                    {q.type === 'textarea' && (
                      <textarea
                        rows={4}
                        required
                        value={typeof answers[q.id] === 'string' ? answers[q.id] : ''}
                        onChange={(e) => handleTextAnswerChange(q.id, e.target.value, e.target)}
                        placeholder="Scrivi qui liberamente la tua risposta..."
                        className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-gray-900 font-normal leading-relaxed text-sm md:text-base resize-y min-h-[120px] bg-white shadow-inner"
                      />
                    )}

                    {/* TYPE 2: CHECKBOX GROUP (SELEZIONE MULTIPLA CON MAX) */}
                    {q.type === 'checkbox_group' && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs font-semibold text-gray-500">
                          <span>Seleziona fino a {q.maxSelect} opzioni</span>
                          <span className={selectedList.length === q.maxSelect ? 'text-amber-600 font-bold' : ''}>
                            {selectedList.length} / {q.maxSelect} selezionate
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {q.options?.map((opt) => {
                            const isChecked = selectedList.includes(opt);
                            return (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => handleCheckboxToggle(q.id, opt, q.maxSelect)}
                                className={`p-3.5 rounded-xl border text-left text-sm font-semibold transition-all flex items-center justify-between gap-3 ${
                                  isChecked
                                    ? 'bg-primary/10 border-primary text-primary shadow-sm'
                                    : 'bg-gray-50/60 border-gray-200 text-gray-700 hover:bg-gray-100'
                                }`}
                              >
                                <span>{opt}</span>
                                <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                                  isChecked ? 'bg-primary border-primary text-white' : 'border-gray-300 bg-white'
                                }`}>
                                  {isChecked && <Check size={14} />}
                                </div>
                              </button>
                            );
                          })}
                        </div>

                        {q.hasOther && (
                          <div className="pt-2">
                            <label className="block text-xs font-bold text-gray-500 mb-1">
                              Altro (specifica se non presente tra le opzioni):
                            </label>
                            <input
                              type="text"
                              value={otherInputs[q.id] || ''}
                              onChange={(e) => setOtherInputs(prev => ({ ...prev, [q.id]: e.target.value }))}
                              placeholder="Scrivi qui un'altra opzione..."
                              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary outline-none"
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {/* TYPE 3: BIPOLAR SLIDER (4 POSIZIONI DISCRETE) */}
                    {q.type === 'bipolar_slider' && (() => {
                      const selectedVal = sliders[q.id];
                      const options = [
                        { value: 1, label: `Molto ${q.leftLabel}` },
                        { value: 2, label: `Più ${q.leftLabel}` },
                        { value: 3, label: `Più ${q.rightLabel}` },
                        { value: 4, label: `Molto ${q.rightLabel}` },
                      ];

                      return (
                        <div className="bg-gray-50/80 p-5 rounded-2xl border border-gray-200/80 space-y-4">
                          <div className="flex items-center justify-between text-sm md:text-base font-bold text-gray-900">
                            <span className="text-primary font-black">{q.leftLabel}</span>
                            <span className="text-xs px-3 py-1 bg-white rounded-full border border-gray-200 shadow-xs font-semibold text-gray-600">
                              {selectedVal === 1 && `Molto vicino a "${q.leftLabel}"`}
                              {selectedVal === 2 && `Più vicino a "${q.leftLabel}"`}
                              {selectedVal === 3 && `Più vicino a "${q.rightLabel}"`}
                              {selectedVal === 4 && `Molto vicino a "${q.rightLabel}"`}
                              {(!selectedVal || selectedVal === 0) && 'Seleziona una posizione'}
                            </span>
                            <span className="text-primary font-black">{q.rightLabel}</span>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                            {options.map((opt) => {
                              const isSelected = selectedVal === opt.value;
                              return (
                                <button
                                  key={opt.value}
                                  type="button"
                                  onClick={() => handleSliderChange(q.id, opt.value)}
                                  className={`p-3.5 rounded-xl border text-center text-xs font-bold transition-all flex flex-col items-center justify-center gap-1.5 ${
                                    isSelected
                                      ? 'bg-primary text-white border-primary shadow-md scale-[1.02]'
                                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-gray-300'
                                  }`}
                                >
                                  <span>{opt.label}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })()}

                    {/* TYPE 4: DOMANDA 14 - SELECT EXACTLY 5 WORDS */}
                    {q.type === 'q14_select' && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs font-semibold text-gray-500">
                          <span>Seleziona esattamente 5 parole</span>
                          <span className={selectedList.length === 5 ? 'text-green-600 font-bold' : 'text-primary font-bold'}>
                            {selectedList.length} / 5 Selezionate
                          </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                          {q.options?.map((word) => {
                            const isChecked = selectedList.includes(word);
                            return (
                              <button
                                key={word}
                                type="button"
                                onClick={() => handleQ14Toggle(word)}
                                className={`p-3 rounded-xl border text-center text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                                  isChecked
                                    ? 'bg-primary text-white border-primary shadow-sm scale-[1.02]'
                                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                                }`}
                              >
                                <span>{word}</span>
                                {isChecked && <Check size={14} />}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* TYPE 5: DOMANDA 15 - RANKING TOP 3 FROM Q14 */}
                    {q.type === 'q15_rank' && (() => {
                      const q14Words: string[] = Array.isArray(answers['q14']) ? answers['q14'] : [];
                      const q15Rank: string[] = Array.isArray(answers['q15']) ? answers['q15'] : [];

                      if (q14Words.length < 5) {
                        return (
                          <div className="p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl text-xs md:text-sm">
                            Scegli prima le 5 parole alla Domanda 14 per poter sbloccare questa classifica.
                          </div>
                        );
                      }

                      return (
                        <div className="space-y-4 bg-gray-50/80 p-5 rounded-2xl border border-gray-200">
                          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                            Metti in ordine di importanza le 3 parole principali (Clicca sulle 5 parole scelte al punto 14):
                          </p>

                          {/* 3 POSIZIONI */}
                          <div className="space-y-2">
                            {[1, 2, 3].map((pos, idx) => {
                              const wordAtPos = q15Rank[idx];
                              return (
                                <div key={pos} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-200 shadow-xs">
                                  <span className="w-7 h-7 rounded-full bg-primary/10 text-primary font-black text-xs flex items-center justify-center shrink-0">
                                    {pos}°
                                  </span>
                                  <span className="font-bold text-sm text-gray-800 flex-1">
                                    {wordAtPos || '--- (Seleziona una parola sotto)'}
                                  </span>
                                  {wordAtPos && (
                                    <button
                                      type="button"
                                      onClick={() => handleRankingAddOrRemove('q15', wordAtPos, 3)}
                                      className="text-xs text-red-500 hover:text-red-700 font-semibold px-2 py-1"
                                    >
                                      Rimuovi
                                    </button>
                                  )}
                                </div>
                              );
                            })}
                          </div>

                          {/* CHIPS DISPONIBILI */}
                          <div className="pt-2">
                            <span className="text-xs font-semibold text-gray-500 block mb-2">Le 5 parole che hai scelto:</span>
                            <div className="flex flex-wrap gap-2">
                              {q14Words.map((word) => {
                                const isRanked = q15Rank.includes(word);
                                const rankPos = q15Rank.indexOf(word) + 1;
                                return (
                                  <button
                                    key={word}
                                    type="button"
                                    onClick={() => handleRankingAddOrRemove('q15', word, 3)}
                                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                                      isRanked
                                        ? 'bg-primary text-white shadow-xs'
                                        : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                                    }`}
                                  >
                                    <span>{word}</span>
                                    {isRanked && <span className="bg-white/20 px-1.5 py-0.5 rounded text-[10px]">{rankPos}°</span>}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                    {/* TYPE 6: SELECT AND RANK (Q16, Q17, Q22) */}
                    {q.type === 'select_and_rank' && (() => {
                      const maxItems = q.maxSelect || 5;
                      const currentRank: string[] = Array.isArray(answers[q.id]) ? answers[q.id] : [];

                      return (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between text-xs font-semibold text-gray-500">
                            <span>Scegli fino a {maxItems} e poi ordinali in classifica</span>
                            <span className={currentRank.length === maxItems ? 'text-amber-600 font-bold' : ''}>
                              {currentRank.length} / {maxItems} selezionati
                            </span>
                          </div>

                          {/* CLASSIFICA CORRENTE CON FRECCE ORDINAMENTO */}
                          {currentRank.length > 0 && (
                            <div className="p-4 bg-primary/5 border border-primary/20 rounded-2xl space-y-2">
                              <span className="text-xs font-bold text-primary uppercase tracking-wider block mb-1">
                                Classifica corrente (Usa le frecce per riordinare):
                              </span>
                              {currentRank.map((item, idx) => (
                                <div key={item} className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-900 shadow-xs">
                                  <div className="flex items-center gap-2.5">
                                    <span className="w-6 h-6 rounded-full bg-primary text-white text-xs font-black flex items-center justify-center">
                                      {idx + 1}
                                    </span>
                                    <span>{item}</span>
                                  </div>

                                  <div className="flex items-center gap-1">
                                    <button
                                      type="button"
                                      disabled={idx === 0}
                                      onClick={() => handleMoveRank(q.id, idx, 'up')}
                                      className="p-1 hover:bg-gray-100 rounded disabled:opacity-20 text-gray-600"
                                    >
                                      <ChevronUp size={16} />
                                    </button>
                                    <button
                                      type="button"
                                      disabled={idx === currentRank.length - 1}
                                      onClick={() => handleMoveRank(q.id, idx, 'down')}
                                      className="p-1 hover:bg-gray-100 rounded disabled:opacity-20 text-gray-600"
                                    >
                                      <ChevronDown size={16} />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleRankingAddOrRemove(q.id, item, maxItems)}
                                      className="p-1 text-red-500 hover:bg-red-50 rounded ml-1"
                                    >
                                      <X size={16} />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* OPZIONI SELEZIONABILI */}
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {q.options?.map((opt) => {
                              const isSelected = currentRank.includes(opt);
                              const rankIdx = currentRank.indexOf(opt);
                              return (
                                <button
                                  key={opt}
                                  type="button"
                                  onClick={() => handleRankingAddOrRemove(q.id, opt, maxItems)}
                                  className={`p-3 rounded-xl border text-left text-xs sm:text-sm font-semibold transition-all flex items-center justify-between gap-2 ${
                                    isSelected
                                      ? 'bg-primary text-white border-primary shadow-xs'
                                      : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                                  }`}
                                >
                                  <span>{opt}</span>
                                  {isSelected && (
                                    <span className="w-5 h-5 rounded-full bg-white text-primary font-black text-[10px] flex items-center justify-center shrink-0">
                                      {rankIdx + 1}
                                    </span>
                                  )}
                                </button>
                              );
                            })}
                          </div>

                          {q.hasOther && (
                            <div className="pt-2">
                              <label className="block text-xs font-bold text-gray-500 mb-1">
                                Altro (specifica):
                              </label>
                              <input
                                type="text"
                                value={otherInputs[q.id] || ''}
                                onChange={(e) => setOtherInputs(prev => ({ ...prev, [q.id]: e.target.value }))}
                                placeholder="Scrivi qui..."
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary outline-none"
                              />
                            </div>
                          )}
                        </div>
                      );
                    })()}

                    {/* TYPE 7: VISUAL GALLERY (DOMANDE 25 & 26) */}
                    {q.type === 'visual_gallery' && (
                      <div className="space-y-6">
                        <div className="p-4 bg-primary/5 border border-primary/20 rounded-2xl space-y-4">
                          <p className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                            <Sparkles size={14} /> Tavole da osservare (Tocca per ingrandire)
                          </p>

                          {q.galleryType === 'moods' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <span className="text-xs font-bold text-gray-600 block text-center">Tavola 1 (Mood 01 - 12)</span>
                                <div 
                                  onClick={() => setLightboxImage({ src: '/images/artist-questionnaire/moods-board-1.jpg', title: 'Mood Visivi - Tavola 1' })}
                                  className="relative group cursor-pointer overflow-hidden rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all"
                                >
                                  <img 
                                    src="/images/artist-questionnaire/moods-board-1.jpg" 
                                    alt="Mood Visivi Tavola 1" 
                                    className="w-full h-auto object-cover group-hover:scale-102 transition-transform duration-300"
                                  />
                                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-xs gap-2">
                                    <Maximize2 size={16} /> Clicca per ingrandire
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <span className="text-xs font-bold text-gray-600 block text-center">Tavola 2 (Mood 01 - 12)</span>
                                <div 
                                  onClick={() => setLightboxImage({ src: '/images/artist-questionnaire/moods-board-2.jpg', title: 'Mood Visivi - Tavola 2' })}
                                  className="relative group cursor-pointer overflow-hidden rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all"
                                >
                                  <img 
                                    src="/images/artist-questionnaire/moods-board-2.jpg" 
                                    alt="Mood Visivi Tavola 2" 
                                    className="w-full h-auto object-cover group-hover:scale-102 transition-transform duration-300"
                                  />
                                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-xs gap-2">
                                    <Maximize2 size={16} /> Clicca per ingrandire
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <span className="text-xs font-bold text-gray-600 block text-center">Tavola 1 (Simboli 01 - 24)</span>
                                <div 
                                  onClick={() => setLightboxImage({ src: '/images/artist-questionnaire/symbols-board-1.jpg', title: 'Simboli - Tavola 1' })}
                                  className="relative group cursor-pointer overflow-hidden rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all"
                                >
                                  <img 
                                    src="/images/artist-questionnaire/symbols-board-1.jpg" 
                                    alt="Simboli Tavola 1" 
                                    className="w-full h-auto object-cover group-hover:scale-102 transition-transform duration-300"
                                  />
                                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-xs gap-2">
                                    <Maximize2 size={16} /> Clicca per ingrandire
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <span className="text-xs font-bold text-gray-600 block text-center">Tavola 2 (Simboli 01 - 24)</span>
                                <div 
                                  onClick={() => setLightboxImage({ src: '/images/artist-questionnaire/symbols-board-2.jpg', title: 'Simboli - Tavola 2' })}
                                  className="relative group cursor-pointer overflow-hidden rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all"
                                >
                                  <img 
                                    src="/images/artist-questionnaire/symbols-board-2.jpg" 
                                    alt="Simboli Tavola 2" 
                                    className="w-full h-auto object-cover group-hover:scale-102 transition-transform duration-300"
                                  />
                                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-xs gap-2">
                                    <Maximize2 size={16} /> Clicca per ingrandire
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* CAMPO RISPOSTA LIBERO TEXTAREA */}
                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                            {q.galleryType === 'moods'
                              ? "Scrivi qui i numeri dei mood che ti rappresentano maggiormente e, se vuoi, aggiungi una breve spiegazione del perché."
                              : "Scrivi qui i numeri dei simboli che ti piacciono maggiormente e, se vuoi, aggiungi una breve spiegazione del perché."
                            }
                          </label>

                          <textarea
                            rows={4}
                            required
                            value={typeof answers[q.id] === 'string' ? answers[q.id] : ''}
                            onChange={(e) => handleTextAnswerChange(q.id, e.target.value, e.target)}
                            placeholder="Es. Tavola 1: 02, 06. Tavola 2: 09. Mi piacciono perché..."
                            className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-gray-900 font-normal leading-relaxed text-sm md:text-base resize-y min-h-[120px] bg-white shadow-inner"
                          />
                        </div>
                      </div>
                    )}

                  </div>
                );
              })}
            </div>

            {currentStep === SECTIONS.length && (
              <div className="pt-6 border-t border-gray-100">
                <PrivacyConsentCheckbox
                  id="artist-privacy-consent"
                  checked={privacyConsent}
                  onChange={(val) => {
                    setPrivacyConsent(val);
                    if (val) setPrivacyError(false);
                  }}
                  error={privacyError}
                />
              </div>
            )}

            {/* BOTTOM NAVIGATION BUTTONS */}
            <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handlePrevSection}
                  disabled={currentStep === 1}
                  className={`px-5 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all flex-1 sm:flex-initial ${
                    currentStep === 1
                      ? 'opacity-40 cursor-not-allowed bg-gray-100 text-gray-400'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  <ArrowLeft size={16} />
                  <span>Precedente</span>
                </button>

                <button
                  type="button"
                  onClick={() => saveCurrentDraft(true)}
                  disabled={isSaving}
                  className="px-4 py-3.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 border border-amber-500/30 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all flex-1 sm:flex-initial shadow-xs"
                  title="Salva i dati compilati finora per riprendere in seguito"
                >
                  <BookmarkCheck size={18} className="shrink-0" />
                  <span>{isSaving ? 'Salvataggio...' : 'Salva in bozza'}</span>
                </button>
              </div>

              {currentStep < SECTIONS.length ? (
                <button
                  type="button"
                  onClick={handleNextSection}
                  className="w-full sm:w-auto bg-gradient-brand text-white px-8 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-primary/20 transition-all hover:-translate-y-0.5 active:translate-y-0"
                >
                  <span>Prosegui alla Sezione {currentStep + 1}</span>
                  <ArrowRight size={16} />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto bg-gradient-brand text-white px-10 py-4 rounded-xl font-bold text-base flex items-center justify-center gap-3 shadow-xl hover:shadow-primary/30 transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
                >
                  {loading ? (
                    <span className="animate-pulse">Invio in corso...</span>
                  ) : (
                    <>
                      <Send size={18} />
                      <span>Invia</span>
                    </>
                  )}
                </button>
              )}
            </div>

          </form>

        </div>

      </div>

      {/* LIGHTBOX MODAL IMMAGINI TAVOLE */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setLightboxImage(null)}
        >
          <div className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center">
            <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setLightboxImage(null)}
                className="p-2.5 rounded-full bg-white/20 hover:bg-white/40 text-white transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <div className="text-white text-center mb-3 font-bold text-lg">
              {lightboxImage.title}
            </div>

            <img
              src={lightboxImage.src}
              alt={lightboxImage.title}
              className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl border border-white/10"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      {/* Modal Bozza Salvata */}
      <DraftSavedModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        token={activeToken || ''}
        resumeUrl={resumeUrl}
        questionnaireTitle={artistName ? `Identità Artistica: ${artistName}` : "Identità Artistica"}
        lastSavedAt={lastSavedTime || undefined}
      />
    </div>
  );
};

export default ArtistQuestionnaire;
