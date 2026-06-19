import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Star, Send, CheckCircle, ChevronLeft, Award, ThumbsUp, Heart, Smile } from 'lucide-react';

const ClientFeedback: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  
  // Ratings (1-5 stars)
  const [ratingDesign, setRatingDesign] = useState<number>(5);
  const [ratingComm, setRatingComm] = useState<number>(5);
  const [ratingProf, setRatingProf] = useState<number>(5);
  const [ratingVision, setRatingVision] = useState<number>(5);

  const [hoverDesign, setHoverDesign] = useState<number | null>(null);
  const [hoverComm, setHoverComm] = useState<number | null>(null);
  const [hoverProf, setHoverProf] = useState<number | null>(null);
  const [hoverVision, setHoverVision] = useState<number | null>(null);

  // Text feedback
  const [whatWentWell, setWhatWentWell] = useState('');
  const [whatCouldImprove, setWhatCouldImprove] = useState('');
  const [aiValue, setAiValue] = useState('');
  const [mainMessage, setMainMessage] = useState('');
  const [canPublish, setCanPublish] = useState<boolean>(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [submitted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Il tuo nome è richiesto.");
      return;
    }
    if (!mainMessage.trim()) {
      alert("Una breve descrizione della tua esperienza (Testimonial) è richiesta.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    // Compute average rating to save as the primary numeric "rating" in Supabase feedbacks table
    const computedAverage = Math.round((ratingDesign + ratingComm + ratingProf + ratingVision) / 4);

    // Format all detailed answers into a beautiful structured message text reports
    const structuredReport = `📝 VALUTAZIONE COMPLETA DEL CLIENTE:

⭐ DETTAGLIO PUNTEGGI (1-5):
- Qualità del Design: ${ratingDesign}/5
- Comunicazione & Tempismo: ${ratingComm}/5
- Professionalità & Competenza: ${ratingProf}/5
- Allineamento Visione del Brand: ${ratingVision}/5

💭 RISPOSTE DETTAGLIATE:

1. Cosa ti è piaciuto di più nel processo lavorativo?
↳ "${whatWentWell.trim() || 'Nessuna risposta fornita.'}"

2. C'è qualcosa che avrei potuto gestire meglio?
↳ "${whatCouldImprove.trim() || 'Nessuna risposta fornita.'}"

3. Come ha influito l'uso dell'Intelligenza Artificiale sul risultato?
↳ "${aiValue.trim() || 'Nessuna risposta fornita.'}"

✍️ TESTIMONIAL PUBBLICO AUTORIZZATO:
"${mainMessage.trim()}"

🔒 Consenso Pubblicazione Testimonial sul Portfolio: ${canPublish ? 'SÌ, AUTORIZZATO' : 'NO, RISERVATO'}`;

    try {
      const { error } = await supabase.from('feedbacks').insert([{
        name: name.trim(),
        company: company.trim() || null,
        rating: computedAverage,
        message: structuredReport,
        is_deleted: false,
        is_approved: false // Pending approval by Francesca in the Dashboard
      }]);

      if (error) throw error;
      setSubmitted(true);
    } catch (err: any) {
      console.error("Errore salvataggio feedback dettagliato:", err);
      setErrorMessage(err?.message || "Si è verificato un errore durante l'invio della valutazione. Riprova più tardi.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto w-full text-center space-y-8 my-auto p-8 md:p-14 bg-white rounded-[2.5rem] border border-gray-100 shadow-xl animate-in fade-in duration-500">
          <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-2 group shadow-inner">
            <CheckCircle className="w-14 h-14 text-green-500 group-hover:scale-110 transition-transform duration-300" />
          </div>
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-black text-gray-950 tracking-tight leading-tight">
              Grazie di cuore per il tuo feedback!
            </h1>
            <p className="text-gray-600 max-w-lg mx-auto text-sm md:text-base leading-relaxed">
              La tua testimonianza è memorizzata con successo. La tua soddisfazione è l'obiettivo principale del mio percorso creativo come Graphic & AI Product Designer.
            </p>
          </div>

          <div className="p-6 bg-gray-50/50 rounded-2xl border border-gray-100 max-w-md mx-auto flex items-center gap-4 text-left">
            <div className="text-primary shrink-0 bg-primary/10 p-3 rounded-xl">
              <Smile size={24} />
            </div>
            <p className="text-xs text-gray-500 leading-normal">
              Il tuo feedback è stato caricato nella dashboard privata e verrà esaminato per essere eventualmente pubblicato tra le recensioni del portfolio.
            </p>
          </div>

          <div className="pt-6 border-t border-gray-100">
            <Link 
              to="/" 
              className="px-8 py-3.5 bg-brandDark text-white font-extrabold rounded-xl transition-all hover:opacity-90 inline-block text-sm uppercase tracking-wider"
            >
              Torna alla Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-24">
      {/* Top minimalistic header/bar */}
      <div className="bg-white border-b border-gray-100 py-5 sticky top-0 z-40 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors font-bold text-sm">
            <ChevronLeft size={16} />
            <span>Esci</span>
          </Link>
          <div className="flex flex-col items-end">
            <span className="text-xs font-black tracking-widest text-primary uppercase">Francesca Mutolo</span>
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Graphic & AI Designer</span>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 mt-12">
        {/* Intro */}
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex p-3 rounded-2xl bg-primary/10 text-primary mb-2 shadow-inner">
            <Award size={32} />
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-gray-950 tracking-tight leading-tight">
            Valutazione Lavoro Collaborativo
          </h1>
          <p className="text-gray-500 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Abbiamo completato e consegnato con successo il tuo progetto! Dedica qualche istante alla compilazione di questo modulo strategico per condividere la tua opinione.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-8 p-4 bg-red-50 text-red-700 border border-red-100 rounded-xl text-xs font-bold font-mono">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
          {/* Section 1: Client Metadata */}
          <div className="p-6 md:p-10 border-b border-gray-100 space-y-6">
            <h2 className="text-lg font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs">1</span>
              <span>Informazioni sul Cliente</span>
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-black text-gray-800 uppercase tracking-wider mb-2">Il tuo Nome / Referente *</label>
                <input 
                  required
                  type="text" 
                  placeholder="Es: Marco Rossi"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-gray-900 bg-white placeholder-gray-400 text-sm font-semibold"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-black text-gray-800 uppercase tracking-wider mb-2">Azienda o Nome Progetto <span className="text-gray-400 font-normal lowercase">(opzionale)</span></label>
                <input 
                  type="text" 
                  placeholder="Es: Startup Snc o Brand Identity"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-gray-900 bg-white placeholder-gray-400 text-sm font-semibold"
                  value={company}
                  onChange={e => setCompany(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Star Ratings */}
          <div className="p-6 md:p-10 border-b border-gray-100 space-y-6 bg-gray-50/20">
            <h2 className="text-lg font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs">2</span>
              <span>Valutazione delle performance</span>
            </h2>

            <div className="space-y-6">
              {/* Question A: Design Quality */}
              <div className="bg-white p-5 rounded-2xl border border-gray-100 space-y-3">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="text-sm font-extrabold text-gray-900">Qualità del design ricevuto</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Estetica, unicità dei concetti grafici e precisione tecnica.</p>
                  </div>
                  <span className="text-xs font-black text-primary bg-primary/10 px-2 py-1 rounded-md shrink-0">{ratingDesign}/5</span>
                </div>
                <div className="flex items-center gap-1.5 pt-1">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isFilled = hoverDesign !== null ? star <= hoverDesign : star <= ratingDesign;
                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRatingDesign(star)}
                        onMouseEnter={() => setHoverDesign(star)}
                        onMouseLeave={() => setHoverDesign(null)}
                        className="transition-all hover:scale-110 focus:outline-none p-0.5"
                      >
                        <Star 
                          size={24} 
                          className={`transition-colors ${isFilled ? 'fill-[#F39637] text-[#F39637]' : 'text-gray-200'}`} 
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Question B: Communication */}
              <div className="bg-white p-5 rounded-2xl border border-gray-100 space-y-3">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="text-sm font-extrabold text-gray-900">Efficacia e tempestività della comunicazione</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Velocità di risposta, chiarezza nell'esposizione e interazione.</p>
                  </div>
                  <span className="text-xs font-black text-primary bg-primary/10 px-2 py-1 rounded-md shrink-0">{ratingComm}/5</span>
                </div>
                <div className="flex items-center gap-1.5 pt-1">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isFilled = hoverComm !== null ? star <= hoverComm : star <= ratingComm;
                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRatingComm(star)}
                        onMouseEnter={() => setHoverComm(star)}
                        onMouseLeave={() => setHoverComm(null)}
                        className="transition-all hover:scale-110 focus:outline-none p-0.5"
                      >
                        <Star 
                          size={24} 
                          className={`transition-colors ${isFilled ? 'fill-[#F39637] text-[#F39637]' : 'text-gray-200'}`} 
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Question C: Professionalism */}
              <div className="bg-white p-5 rounded-2xl border border-gray-100 space-y-3">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="text-sm font-extrabold text-gray-900">Competenza e professionalità dimostrate</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Gestione dei tempi di consegna, affidabilità e suggerimenti strategici.</p>
                  </div>
                  <span className="text-xs font-black text-primary bg-primary/10 px-2 py-1 rounded-md shrink-0">{ratingProf}/5</span>
                </div>
                <div className="flex items-center gap-1.5 pt-1">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isFilled = hoverProf !== null ? star <= hoverProf : star <= ratingProf;
                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRatingProf(star)}
                        onMouseEnter={() => setHoverProf(star)}
                        onMouseLeave={() => setHoverProf(null)}
                        className="transition-all hover:scale-110 focus:outline-none p-0.5"
                      >
                        <Star 
                          size={24} 
                          className={`transition-colors ${isFilled ? 'fill-[#F39637] text-[#F39637]' : 'text-gray-200'}`} 
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Question D: Vision alignment */}
              <div className="bg-white p-5 rounded-2xl border border-gray-100 space-y-3">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="text-sm font-extrabold text-gray-900">Coerenza con la tua visione iniziale</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Capacità di tradurre in realtà grafica la personalità del tuo brand.</p>
                  </div>
                  <span className="text-xs font-black text-primary bg-primary/10 px-2 py-1 rounded-md shrink-0">{ratingVision}/5</span>
                </div>
                <div className="flex items-center gap-1.5 pt-1">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isFilled = hoverVision !== null ? star <= hoverVision : star <= ratingVision;
                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRatingVision(star)}
                        onMouseEnter={() => setHoverVision(star)}
                        onMouseLeave={() => setHoverVision(null)}
                        className="transition-all hover:scale-110 focus:outline-none p-0.5"
                      >
                        <Star 
                          size={24} 
                          className={`transition-colors ${isFilled ? 'fill-[#F39637] text-[#F39637]' : 'text-gray-200'}`} 
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Narrative Questions */}
          <div className="p-6 md:p-10 border-b border-gray-100 space-y-6">
            <h2 className="text-lg font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs">3</span>
              <span>Domande di approfondimento</span>
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-2">1. Cosa ti è piaciuto di più del processo lavorativo con me?</label>
                <textarea 
                  rows={3}
                  placeholder="Es: La creatività nelle risposte, l'ascolto, la flessibilità, ecc..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-gray-900 bg-white placeholder-gray-400 text-sm resize-none"
                  value={whatWentWell}
                  onChange={e => setWhatWentWell(e.target.value)}
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-2">2. C'è qualche aspetto che avrei potuto gestire o definire meglio?</label>
                <textarea 
                  rows={3}
                  placeholder="La tua critica costruttiva mi aiuterà a crescere professionale e ad affinare i flussi per i prossimi clienti."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-gray-900 bg-white placeholder-gray-400 text-sm resize-none"
                  value={whatCouldImprove}
                  onChange={e => setWhatCouldImprove(e.target.value)}
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-2">3. L'utilizzo di strumenti di Intelligenza Artificiale (AI) ha portato valore aggiunto al tuo brand?</label>
                <textarea 
                  rows={3}
                  placeholder="In che modo hai percepito l'integrazione tecnologica generativa?"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-gray-900 bg-white placeholder-gray-400 text-sm resize-none"
                  value={aiValue}
                  onChange={e => setAiValue(e.target.value)}
                ></textarea>
              </div>
            </div>
          </div>

          {/* Section 4: Testimonial & Consenso */}
          <div className="p-6 md:p-10 bg-gray-50/30 space-y-6">
            <h2 className="text-lg font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs">4</span>
              <span>Testimonianza Pubblica</span>
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-xs font-black text-gray-800 uppercase tracking-wider mb-2">Scrivi qui il tuo messaggio o testimonial *</label>
                <p className="text-xs text-gray-400 mb-3">Questo testo rappresenterà la tua recensione sul sito portfolio di Francesca.</p>
                <textarea 
                  required
                  rows={4}
                  placeholder="Esempio: Lavorare con Francesca è stata un'esperienza fantastica. Ha capito sin da subito la direzione del brand e ha saputo sintetizzare idee complesse in elementi visivi puliti e memorabili. Fortemente consigliata!"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-gray-900 bg-white placeholder-gray-400 text-sm resize-none font-medium"
                  value={mainMessage}
                  onChange={e => setMainMessage(e.target.value)}
                ></textarea>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-gray-100 flex items-start gap-4">
                <input 
                  type="checkbox" 
                  id="canPublish"
                  className="mt-1 h-4.5 w-4.5 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2 transition-all cursor-pointer"
                  checked={canPublish}
                  onChange={e => setCanPublish(e.target.checked)}
                />
                <label htmlFor="canPublish" className="text-xs text-gray-600 leading-relaxed font-semibold cursor-pointer select-none">
                  Autorizzo Francesca Mutolo ad inserire questa testimonianza (con il mio nome/azienda e valutazione in stelle) all'interno della sezione recensioni del sito portfolio pubblico.
                </label>
              </div>
            </div>
          </div>

          {/* Submit container */}
          <div className="p-6 md:p-10 border-t border-gray-100 flex justify-end bg-white">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-4 bg-gradient-brand text-white font-black rounded-xl flex items-center gap-2 hover:opacity-95 shadow-lg shadow-primary/20 disabled:opacity-50 text-sm uppercase tracking-wider transition-all duration-300"
            >
              {loading ? 'Invio in corso...' : 'Invia Valutazione'}
              <Send size={16} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientFeedback;
