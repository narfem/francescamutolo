import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { 
  Music, Sparkles, Send, CheckCircle, ArrowRight, ArrowLeft, 
  User, Heart, Target, Compass, BookOpen, Star, Award, Copy, Check
} from 'lucide-react';

interface Question {
  id: string;
  number: number;
  text: string;
  subtext?: string;
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
    title: "1. Chi sei oggi?",
    icon: <User className="w-5 h-5 text-primary" />,
    questions: [
      {
        id: "q1",
        number: 1,
        text: "Raccontami chi sei in poche righe. Non come artista, ma come persona."
      },
      {
        id: "q2",
        number: 2,
        text: "Quali sono tre parole che i tuoi amici userebbero per descriverti?"
      },
      {
        id: "q3",
        number: 3,
        text: "C'è qualcosa del tuo carattere che ritieni ti distingua davvero dagli altri?"
      }
    ]
  },
  {
    id: 2,
    title: "2. Perché fai musica?",
    icon: <Heart className="w-5 h-5 text-primary" />,
    questions: [
      {
        id: "q4",
        number: 4,
        text: "Quando hai capito che volevi fare musica? Raccontami quel momento."
      },
      {
        id: "q5",
        number: 5,
        text: "Se domani non potessi guadagnare un euro con la musica, continueresti comunque a farla? Perché?"
      },
      {
        id: "q6",
        number: 6,
        text: "Cosa provi quando scrivi o registri un brano?"
      }
    ]
  },
  {
    id: 3,
    title: "3. Dove vuoi arrivare?",
    icon: <Target className="w-5 h-5 text-primary" />,
    questions: [
      {
        id: "q7",
        number: 7,
        text: "Immagina di essere tra cinque anni sul palco davanti a migliaia di persone. Qual è la prima cosa che vorresti che il pubblico pensasse vedendoti entrare?"
      },
      {
        id: "q8",
        number: 8,
        text: "Quale frase ti piacerebbe leggere nei commenti sotto una tua canzone?"
      },
      {
        id: "q9",
        number: 9,
        text: "Quando qualcuno sentirà il tuo nome, cosa vorresti che gli venisse subito in mente?"
      }
    ]
  },
  {
    id: 4,
    title: "4. La tua identità",
    icon: <Compass className="w-5 h-5 text-primary" />,
    questions: [
      {
        id: "q10",
        number: 10,
        text: "Se la tua musica fosse una persona, come sarebbe?",
        subtext: "Non descrivere l'aspetto fisico. Descrivi il carattere."
      },
      {
        id: "q11",
        number: 11,
        text: "Se dovessi scegliere una sola emozione da lasciare a chi ascolta le tue canzoni, quale sarebbe? Perché?"
      },
      {
        id: "q12",
        number: 12,
        text: "C'è un messaggio che vorresti trasmettere con la tua musica? Anche se ancora non riesci a esprimerlo perfettamente."
      }
    ]
  },
  {
    id: 5,
    title: "5. I tuoi riferimenti",
    icon: <BookOpen className="w-5 h-5 text-primary" />,
    questions: [
      {
        id: "q13",
        number: 13,
        text: "Quali artisti ti ispirano davvero? Per ognuno spiegami cosa ammiri.",
        subtext: "Non limitarti solo al genere musicale."
      },
      {
        id: "q14",
        number: 14,
        text: "C'è un artista a cui non vorresti mai essere associato? Perché?"
      }
    ]
  },
  {
    id: 6,
    title: "6. La tua unicità",
    icon: <Star className="w-5 h-5 text-primary" />,
    questions: [
      {
        id: "q15",
        number: 15,
        text: "Se eliminassimo il tuo nome dalla copertina di un tuo brano, come potrebbe una persona capire che quella canzone è tua?",
        subtext: "Non esiste una risposta giusta. Mi interessa capire cosa rende il tuo modo di fare musica riconoscibile."
      },
      {
        id: "q16",
        number: 16,
        text: "Cosa pensi che nessun altro artista faccia come lo fai tu?"
      },
      {
        id: "q17",
        number: 17,
        text: "Cosa vuoi che il pubblico ricordi di te anche dopo tanti anni?"
      }
    ]
  },
  {
    id: 7,
    title: "7. Il tuo futuro",
    icon: <Award className="w-5 h-5 text-primary" />,
    questions: [
      {
        id: "q18",
        number: 18,
        text: "Quando la tua carriera sarà avviata, quale sarà il motivo più importante per cui dirai: \"Ce l'ho fatta\"?"
      },
      {
        id: "q19",
        number: 19,
        text: "C'è qualcosa su cui non scenderesti mai a compromessi, anche se ti aiutasse ad avere più successo?"
      },
      {
        id: "q20",
        number: 20,
        text: "Se dovessi riassumere l'artista che vuoi diventare in una sola frase, quale sarebbe?"
      }
    ]
  }
];

const ArtistQuestionnaire: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [artistName, setArtistName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const topCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleAnswerChange = (qId: string, value: string, element?: HTMLTextAreaElement) => {
    setAnswers(prev => ({ ...prev, [qId]: value }));
    if (element) {
      element.style.height = 'auto';
      element.style.height = `${Math.max(120, element.scrollHeight)}px`;
    }
  };

  const currentSection = SECTIONS.find(s => s.id === currentStep) || SECTIONS[0];
  const progressPercent = Math.round((currentStep / SECTIONS.length) * 100);

  const scrollToTopForm = () => {
    if (topCardRef.current) {
      topCardRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextSection = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (currentStep < SECTIONS.length) {
      setCurrentStep(prev => prev + 1);
      scrollToTopForm();
    }
  };

  const handlePrevSection = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      scrollToTopForm();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    const structuredAnswers = SECTIONS.map(sec => ({
      section_id: sec.id,
      section_title: sec.title,
      questions: sec.questions.map(q => ({
        id: q.id,
        number: q.number,
        question: q.text,
        subtext: q.subtext || null,
        answer: answers[q.id] || ''
      }))
    }));

    const payload = {
      artist_name: artistName.trim() || 'Artista Anonimo',
      email: contactEmail.trim() || null,
      answers: answers,
      structured_data: structuredAnswers,
      created_at: new Date().toISOString()
    };

    const formattedNotes = `=== QUESTIONARIO IDENTITÀ ARTISTICA ===\n` +
      `Nome Artista: ${artistName.trim() || 'Artista Anonimo'}\n` +
      `Email: ${contactEmail.trim() || 'Non indicata'}\n\n` +
      SECTIONS.map(sec => 
        `--- ${sec.title} ---\n` + 
        sec.questions.map(q => `[Domanda ${q.number}]: ${q.text}\n[Risposta]: ${answers[q.id] || '(Nessuna risposta)'}`).join('\n\n')
      ).join('\n\n');

    const jsonNotes = JSON.stringify({
      type: 'artist_questionnaire',
      artist_name: artistName.trim() || 'Artista Anonimo',
      email: contactEmail.trim() || '',
      structured_data: structuredAnswers,
      answers: answers,
      formatted_text: formattedNotes
    });

    const mainPayload = {
      company_name: artistName.trim() ? `[ARTISTA] ${artistName.trim()}` : '[ARTISTA] Artista Anonimo',
      business_description: `Sessione di Scoperta dell'Identità Artistica • Email: ${contactEmail.trim() || 'Non indicata'}`,
      slogan: answers['q20'] || '',
      brand_perception: answers['q11'] || '',
      brand_personified: answers['q10'] || '',
      keywords: ['Identità Artistica', 'Musica'],
      five_years_vision: answers['q7'] || '',
      notes: jsonNotes
    };

    try {
      const { error: questErr } = await supabase
        .from('questionnaires')
        .insert([mainPayload]);

      if (questErr) {
        console.warn("Errore inserimento in 'questionnaires', provo salvataggio con note testuali:", questErr.message);
        await supabase
          .from('questionnaires')
          .insert([{
            company_name: mainPayload.company_name,
            business_description: mainPayload.business_description,
            notes: formattedNotes
          }]);
      }

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
      window.scrollTo({ top: 0, behavior: 'instant' });
    } catch (err: any) {
      console.error("Errore durante l'invio del questionario artista:", err);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'instant' });
    } finally {
      setLoading(false);
    }
  };

  const copyShareableLink = () => {
    const url = `${window.location.origin}/questionario-artista`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
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
            Grazie per aver dedicato il tuo tempo a questo percorso di introspezione. 
            Le tue risposte permetteranno di costruire una direzione visiva autentica e profonda, perfettamente allineata al tuo valore artistico.
          </p>

          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 mb-8 text-left space-y-2">
            <p className="text-xs uppercase tracking-wider font-bold text-gray-400">Prossimi passi</p>
            <p className="text-sm text-gray-700 font-medium">
              Le tue risposte sono state registrate. Francesca analizzerà ogni dettaglio con cura per la fase strategica della tua identità visiva.
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
    <div className="min-h-screen bg-gray-50 py-12 md:py-16 px-4 sm:px-6 lg:px-8">
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

        {/* HERO INITIAL */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
            <Music size={14} />
            <span>Identità Artistica & Branding</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight">
            Sessione di Scoperta dell'Identità Artistica
          </h1>
          
          <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Un breve percorso strutturato per comprendere la persona e la visione dietro l'artista, prima di costruire la direzione visiva ufficiale.
          </p>
        </div>

        {/* TESTO INTRODUTTIVO OBBLIGATORIO */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-3 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-gradient-brand"></div>
          <div className="space-y-2 text-gray-700 text-sm md:text-base leading-relaxed">
            <p className="font-semibold text-gray-900">
              Prima di iniziare, prenditi un momento solo per te.
            </p>
            <p>
              Rispondi alle domande con calma, in un ambiente in cui ti senti profondamente a tuo agio e senza fretta.
            </p>
            <p className="italic text-gray-600">
              Le risposte più importanti nasceranno dalla sincerità: questa sessione serve a scoprire ciò che rende unica la tua identità artistica.
            </p>
          </div>
        </div>

        {/* MAIN FORM CARD */}
        <div ref={topCardRef} className="bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">

          {/* Dati Generali dell'Artista (Nome / Email) */}
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
                const isAnswered = sec.questions.some(q => !!answers[q.id]?.trim());

                return (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => {
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

          {/* FORM CONTENT BY SECTION */}
          <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-10">

            {/* SEC TITLE */}
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <div className="p-2.5 rounded-2xl bg-primary/10 text-primary">
                {currentSection.icon}
              </div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                {currentSection.title}
              </h2>
            </div>

            {/* DOMANDE DELLA SEZIONE CORRENTE */}
            <div className="space-y-8">
              {currentSection.questions.map((q) => (
                <div key={q.id} className="space-y-3 text-left animate-in fade-in duration-300">
                  <div className="space-y-1">
                    <label className="block text-base font-bold text-gray-900 leading-snug">
                      <span className="text-primary mr-1">{q.number}.</span> {q.text}
                    </label>

                    {q.subtext && (
                      <div className="text-xs text-gray-500 font-medium italic whitespace-pre-line bg-gray-50 p-2.5 rounded-lg border border-gray-100 inline-block mt-1">
                        {q.subtext}
                      </div>
                    )}
                  </div>

                  {/* CAMPO TESTUALE LIBERO TEXTAREA ESPANDIBILE */}
                  <textarea
                    rows={4}
                    value={answers[q.id] || ''}
                    onChange={(e) => handleAnswerChange(q.id, e.target.value, e.target)}
                    placeholder="Scrivi qui liberamente la tua risposta..."
                    className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-gray-900 font-normal leading-relaxed text-sm md:text-base resize-y min-h-[120px] bg-white shadow-inner"
                  />
                </div>
              ))}
            </div>

            {/* BOTTOM NAVIGATION BUTTONS */}
            <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                type="button"
                onClick={handlePrevSection}
                disabled={currentStep === 1}
                className={`w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                  currentStep === 1
                    ? 'opacity-40 cursor-not-allowed bg-gray-100 text-gray-400'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                <ArrowLeft size={16} />
                <span>Sezione Precedente</span>
              </button>

              {currentStep < SECTIONS.length ? (
                <button
                  key={`next-btn-step-${currentStep}`}
                  type="button"
                  onClick={handleNextSection}
                  className="w-full sm:w-auto bg-gradient-brand text-white px-8 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-primary/20 transition-all hover:-translate-y-0.5 active:translate-y-0"
                >
                  <span>Prosegui alla Sezione {currentStep + 1}</span>
                  <ArrowRight size={16} />
                </button>
              ) : (
                <button
                  key="submit-form-btn"
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
    </div>
  );
};

export default ArtistQuestionnaire;
