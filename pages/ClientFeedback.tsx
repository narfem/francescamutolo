import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { 
  ArrowLeft, CheckCircle, Send, Award, FileText, 
  User, Target, ThumbsUp, MessageSquare, Shield, Smile 
} from 'lucide-react';

const ClientFeedback: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // --- STATE FIELDS ---
  
  // Section 1: Dati cliente & Progetto
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [age, setAge] = useState(''); // Empty string or positive number
  const [gender, setGender] = useState(''); // SELECT: "Maschio" | "Femmina" | "Preferisco non rispondere"

  // Section 2: Informazioni Progetto
  const [projectType, setProjectType] = useState(''); // SELECT: "Logo" | "Brand identity" | "Materiali social" | "Locandina" | "Altro"
  const [clientType, setClientType] = useState(''); // SELECT: "Libero professionista" | "Piccola attività" | "Azienda strutturata"
  const [sourceChannel, setSourceChannel] = useState(''); // SELECT: "Google" | "Instagram" | "Passaparola" | "Altro"
  const [projectTypeOther, setProjectTypeOther] = useState('');
  const [clientTypeOther, setClientTypeOther] = useState('');
  const [sourceChannelOther, setSourceChannelOther] = useState('');

  // Section 3: Valutazione 1-5 (Scaled ratings)
  const [ratingSatisfaction, setRatingSatisfaction] = useState<number | null>(null);
  const [ratingExpectations, setRatingExpectations] = useState<number | null>(null);
  const [ratingDeliveryTimes, setRatingDeliveryTimes] = useState<number | null>(null);
  const [ratingProcessSimplicity, setRatingProcessSimplicity] = useState<number | null>(null);

  // Section 4: Valore Percepito
  const [improvedBusiness, setImprovedBusiness] = useState(''); // Buttons: "Sì" | "No" | "In parte"
  const [pricePerception, setPricePerception] = useState(''); // Buttons: "Basso" | "Adeguato" | "Alto"

  // Section 5: Feedback Aperto
  const [whatAppreciated, setWhatAppreciated] = useState('');
  const [whatDifferent, setWhatDifferent] = useState('');
  const [suggestions, setSuggestions] = useState('');

  // Section 6: Testimonianza Pubblicabile
  const [wantLeaveReview, setWantLeaveReview] = useState(''); // Buttons: "Sì" | "No"
  const [reviewText, setReviewText] = useState(''); // Textarea shown only if wantLeaveReview === 'Sì'

  // Section 7: Consenso utilizzo contenuti
  const [authorizeCaseStudy, setAuthorizeCaseStudy] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [submitted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Il tuo nome è richiesto.");
      return;
    }

    if (!company.trim()) {
      alert("L'azienda o nome del progetto è richiesta.");
      return;
    }

    if (!age) {
      alert("L'età è richiesta.");
      return;
    }

    if (!gender) {
      alert("La selezione del sesso è richiesta.");
      return;
    }

    if (!projectType) {
      alert("La selezione del tipo di progetto è richiesta.");
      return;
    }
    if (projectType === 'Altro' && !projectTypeOther.trim()) {
      alert("Specifica il tipo di progetto.");
      return;
    }

    if (!clientType) {
      alert("La selezione del tipo di attività è richiesta.");
      return;
    }
    if (clientType === 'Altro' && !clientTypeOther.trim()) {
      alert("Specifica il tipo di attività.");
      return;
    }

    if (!sourceChannel) {
      alert("La selezione di come hai trovato il servizio è richiesta.");
      return;
    }
    if (sourceChannel === 'Altro' && !sourceChannelOther.trim()) {
      alert("Specifica come hai trovato il servizio.");
      return;
    }

    if (ratingSatisfaction === null) {
      alert("La valutazione sulla soddisfazione generale è richiesta.");
      return;
    }

    if (ratingExpectations === null) {
      alert("La valutazione sul rispetto delle aspettative è richiesta.");
      return;
    }

    if (ratingDeliveryTimes === null) {
      alert("La valutazione sul rispetto dei tempi di consegna è richiesta.");
      return;
    }

    if (ratingProcessSimplicity === null) {
      alert("La valutazione sulla semplicità del processo è richiesta.");
      return;
    }

    if (!improvedBusiness) {
      alert("La risposta alla domanda sul miglioramento della percezione dell'attività è richiesta.");
      return;
    }

    if (!pricePerception) {
      alert("La risposta alla domanda sulla percezione del prezzo è richiesta.");
      return;
    }

    if (!whatAppreciated.trim()) {
      alert("Il campo 'Cosa hai apprezzato di più?' è richiesto.");
      return;
    }

    if (!whatDifferent.trim()) {
      alert("Il campo 'Cosa avresti voluto fosse diverso?' è richiesto.");
      return;
    }

    if (!suggestions.trim()) {
      alert("Il campo 'Suggerimenti' è richiesto.");
      return;
    }

    if (!wantLeaveReview) {
      alert("La risposta sulla volontà di lasciare una recensione è richiesta.");
      return;
    }

    if (wantLeaveReview === 'Sì' && !reviewText.trim()) {
      alert("Per favore, compila il testo della recensione prima di inviare.");
      return;
    }

    if (!authorizeCaseStudy) {
      alert("L'autorizzazione all'utilizzo come case study è richiesta.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    // Compute average rating (excluding ratingCommunication, divided by 4) to save as the primary numeric "rating" in Supabase feedbacks table
    const computedAverage = Math.round(
      (ratingSatisfaction! + ratingExpectations! + ratingDeliveryTimes! + ratingProcessSimplicity!) / 4
    );

    // Format all detailed answers into a beautiful structured message text reports
    const structuredReport = `📝 VALUTAZIONE COMPLETA DEL CLIENTE:

👤 DATI CLIENTE:
- Nome del Cliente: ${name.trim()}
- Azienda o Progetto: ${company.trim() || 'Non specificata'}
- Età: ${age ? `${age} anni` : 'Non specificata'}
- Sesso: ${gender || 'Non specificato'}

📁 PROGETTO:
- Tipo di progetto: ${projectType === 'Altro' ? `Altro: ${projectTypeOther.trim()}` : (projectType || 'Non specificato')}
- Tipo di attività cliente: ${clientType === 'Altro' ? `Altro: ${clientTypeOther.trim()}` : (clientType || 'Non specificato')}
- Canale di acquisizione (Come ci ha trovati): ${sourceChannel === 'Altro' ? `Altro: ${sourceChannelOther.trim()}` : (sourceChannel || 'Non specificato')}

⭐ PUNTEGGI DI VALUTAZIONE (1-5):
- Soddisfazione generale del risultato: ${ratingSatisfaction}/5
- Rispetto delle aspettative iniziali: ${ratingExpectations}/5
- Rispetto dei tempi di consegna: ${ratingDeliveryTimes}/5
- Semplicità del processo di lavoro (brief, revisioni, consegna): ${ratingProcessSimplicity}/5

💎 VALORE PERCEPITO:
- Il risultato ha migliorato concretamente la percezione della tua attività? ${improvedBusiness || 'Non espresso'}
- Percezione del prezzo: ${pricePerception || 'Non espressa'}

💭 FEEDBACK APERTO:
- Cosa hai apprezzato di più?:
  ↳ "${whatAppreciated.trim() || 'Nessun commento.'}"
- Cosa avresti voluto fosse diverso?:
  ↳ "${whatDifferent.trim() || 'Nessun commento.'}"
- Suggerimenti per migliorare il servizio:
  ↳ "${suggestions.trim() || 'Nessun commento.'}"

🗣️ RECENSIONE UTILIZZABILE SUL SITO:
- Acconsente a lasciare una testimonianza?: ${wantLeaveReview || 'No'}
${wantLeaveReview === 'Sì' ? `- Testo Recensione: "${reviewText.trim()}"` : ''}

🔒 CONSENSO UTILIZZO CONTENUTI:
- Autorizzazione Case Study: ${authorizeCaseStudy ? 'SÌ, CONSENTITO' : 'NO, NON AUTORIZZATO'}`;

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
            <p className="text-xs text-gray-500 leading-normal font-semibold">
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
    <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <div className="flex justify-start mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-3 text-xs font-bold text-slate-500 hover:text-primary transition-colors bg-white py-3 px-8 rounded-full border border-gray-100 shadow-sm"
          >
            <ArrowLeft size={14} /> Indietro
          </Link>
        </div>

        {/* Intro */}
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex p-3 rounded-2xl bg-primary/10 text-primary mb-2 shadow-inner">
            <Award size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight leading-none text-center">
            Valutazione Servizio
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Ora che il tuo progetto è stato completato e consegnato, dedica qualche istante alla compilazione di questo modulo strategico per condividere la tua opinione.
          </p>
        </div>

        {errorMessage && (
          <div className="bg-red-50 text-red-650 border border-red-100 p-6 rounded-2xl mb-8 text-sm font-semibold">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-8 md:p-12 space-y-12">
            
            {/* SEZIONE 1: Dati cliente */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-gray-150 pb-4 mb-2">
                <User className="text-primary w-6 h-6 shrink-0" />
                <h2 className="text-xl font-bold text-gray-950">Dati cliente</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Il tuo nome</label>
                  <input
                    required
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Es: Marco Rossi"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-gray-900 bg-white placeholder-gray-400 text-sm font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Azienda o nome progetto</label>
                  <input
                    required
                    type="text"
                    value={company}
                    onChange={e => setCompany(e.target.value)}
                    placeholder="Es: Startup Snc o Brand Identity"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-gray-900 bg-white placeholder-gray-400 text-sm font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Età</label>
                  <input
                    required
                    type="number"
                    min="18"
                    max="99"
                    value={age}
                    onChange={e => setAge(e.target.value)}
                    placeholder="Es: 35"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-gray-900 bg-white placeholder-gray-400 text-sm font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Sesso</label>
                  <select
                    required
                    value={gender}
                    onChange={e => setGender(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-gray-900 bg-white text-sm font-semibold cursor-pointer"
                  >
                    <option value="">Seleziona sesso...</option>
                    <option value="Maschio">Maschio</option>
                    <option value="Femmina">Femmina</option>
                    <option value="Preferisco non rispondere">Preferisco non rispondere</option>
                  </select>
                </div>
              </div>
            </div>

            {/* SEZIONE 2: Progetto */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-gray-150 pb-4 mb-2">
                <Target className="text-primary w-6 h-6 shrink-0" />
                <h2 className="text-xl font-bold text-gray-950">Progetto</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Tipo di progetto</label>
                  <select
                    required
                    value={projectType}
                    onChange={e => {
                      setProjectType(e.target.value);
                      if (e.target.value !== 'Altro') {
                        setProjectTypeOther('');
                      }
                    }}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-gray-900 bg-white text-sm font-semibold cursor-pointer"
                  >
                    <option value="">Seleziona tipo...</option>
                    <option value="Logo">Logo</option>
                    <option value="Brand identity">Brand identity</option>
                    <option value="Materiali social">Materiali social</option>
                    <option value="Locandina">Locandina</option>
                    <option value="Altro">Altro</option>
                  </select>
                  {projectType === 'Altro' && (
                    <input
                      type="text"
                      placeholder="Specifica tipo di progetto..."
                      value={projectTypeOther}
                      onChange={e => setProjectTypeOther(e.target.value)}
                      className="mt-2 w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-gray-900 bg-white text-sm font-semibold"
                      required
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Tipo di attività cliente</label>
                  <select
                    required
                    value={clientType}
                    onChange={e => {
                      setClientType(e.target.value);
                      if (e.target.value !== 'Altro') {
                        setClientTypeOther('');
                      }
                    }}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-gray-900 bg-white text-sm font-semibold cursor-pointer"
                  >
                    <option value="">Seleziona attività...</option>
                    <option value="Libero professionista">Libero professionista</option>
                    <option value="Piccola attività">Piccola attività</option>
                    <option value="Azienda strutturata">Azienda strutturata</option>
                    <option value="Altro">Altro</option>
                  </select>
                  {clientType === 'Altro' && (
                    <input
                      type="text"
                      placeholder="Specifica attività..."
                      value={clientTypeOther}
                      onChange={e => setClientTypeOther(e.target.value)}
                      className="mt-2 w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-gray-900 bg-white text-sm font-semibold"
                      required
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Come hai trovato il servizio?</label>
                  <select
                    required
                    value={sourceChannel}
                    onChange={e => {
                      setSourceChannel(e.target.value);
                      if (e.target.value !== 'Altro') {
                        setSourceChannelOther('');
                      }
                    }}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-gray-900 bg-white text-sm font-semibold cursor-pointer"
                  >
                    <option value="">Seleziona canale...</option>
                    <option value="Google">Google</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Passaparola">Passaparola</option>
                    <option value="Altro">Altro</option>
                  </select>
                  {sourceChannel === 'Altro' && (
                    <input
                      type="text"
                      placeholder="Specifica come..."
                      value={sourceChannelOther}
                      onChange={e => setSourceChannelOther(e.target.value)}
                      className="mt-2 w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-gray-900 bg-white text-sm font-semibold"
                      required
                    />
                  )}
                </div>
              </div>
            </div>

            {/* SEZIONE 3: Valutazione delle performance */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-gray-150 pb-4 mb-2">
                <ThumbsUp className="text-primary w-6 h-6 shrink-0" />
                <h2 className="text-xl font-bold text-gray-950">Valutazione delle performance</h2>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {/* 1. Soddisfazione generale */}
                <div className="bg-white p-5 rounded-2xl border border-gray-100 space-y-3">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="text-sm font-extrabold text-gray-905">Soddisfazione generale del risultato</h3>
                      <p className="text-xs text-gray-400 mt-1">Come valuti l'esito complessivo del progetto consegnato?</p>
                    </div>
                    <span className="text-xs font-black text-primary bg-primary/10 px-2.5 py-1 rounded-md shrink-0">
                      {ratingSatisfaction !== null ? `${ratingSatisfaction}/5` : '-/5'}
                    </span>
                  </div>
                  <div className="grid grid-cols-5 gap-2 max-w-xs pt-1">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setRatingSatisfaction(num)}
                        className={`py-2 rounded-xl border font-bold text-sm text-center transition-all ${
                          ratingSatisfaction === num
                            ? 'border-primary bg-primary/5 text-primary shadow-sm'
                            : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Rispetto aspettative */}
                <div className="bg-white p-5 rounded-2xl border border-gray-100 space-y-3">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="text-sm font-extrabold text-gray-905">Rispetto delle aspettative iniziali</h3>
                      <p className="text-xs text-gray-400 mt-1">Il risultato finale rispetta i tuoi obiettivi iniziali?</p>
                    </div>
                    <span className="text-xs font-black text-primary bg-primary/10 px-2.5 py-1 rounded-md shrink-0">
                      {ratingExpectations !== null ? `${ratingExpectations}/5` : '-/5'}
                    </span>
                  </div>
                  <div className="grid grid-cols-5 gap-2 max-w-xs pt-1">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setRatingExpectations(num)}
                        className={`py-2 rounded-xl border font-bold text-sm text-center transition-all ${
                          ratingExpectations === num
                            ? 'border-primary bg-primary/5 text-primary shadow-sm'
                            : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. Rispetto dei tempi */}
                <div className="bg-white p-5 rounded-2xl border border-gray-100 space-y-3">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="text-sm font-extrabold text-gray-905">Rispetto dei tempi di consegna</h3>
                      <p className="text-xs text-gray-400 mt-1">Puntualità nelle tappe e nella consegna finale.</p>
                    </div>
                    <span className="text-xs font-black text-primary bg-primary/10 px-2.5 py-1 rounded-md shrink-0">
                      {ratingDeliveryTimes !== null ? `${ratingDeliveryTimes}/5` : '-/5'}
                    </span>
                  </div>
                  <div className="grid grid-cols-5 gap-2 max-w-xs pt-1">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setRatingDeliveryTimes(num)}
                        className={`py-2 rounded-xl border font-bold text-sm text-center transition-all ${
                          ratingDeliveryTimes === num
                            ? 'border-primary bg-primary/5 text-primary shadow-sm'
                            : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 5. Semplicità del processo */}
                <div className="bg-white p-5 rounded-2xl border border-gray-100 space-y-3">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="text-sm font-extrabold text-gray-905">Semplicità del processo di lavoro (brief, revisioni, consegna)</h3>
                      <p className="text-xs text-gray-400 mt-1">Naturalezza nello svolgimento, condivisione idee e passaggi.</p>
                    </div>
                    <span className="text-xs font-black text-primary bg-primary/10 px-2.5 py-1 rounded-md shrink-0">
                      {ratingProcessSimplicity !== null ? `${ratingProcessSimplicity}/5` : '-/5'}
                    </span>
                  </div>
                  <div className="grid grid-cols-5 gap-2 max-w-xs pt-1">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setRatingProcessSimplicity(num)}
                        className={`py-2 rounded-xl border font-bold text-sm text-center transition-all ${
                          ratingProcessSimplicity === num
                            ? 'border-primary bg-primary/5 text-primary shadow-sm'
                            : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* SEZIONE 4: Valore percepito */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-gray-150 pb-4 mb-2">
                <Award className="text-primary w-6 h-6 shrink-0" />
                <h2 className="text-xl font-bold text-gray-950">Valore percepito</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col justify-between">
                  <label className="block text-sm font-bold text-gray-700 mb-3">Il risultato ha migliorato concretamente la percezione della tua attività?</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['Sì', 'No', 'In parte'].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setImprovedBusiness(val)}
                        className={`p-4 border rounded-xl font-semibold text-sm text-center transition-all ${
                          improvedBusiness === val
                            ? 'border-primary bg-primary/5 text-primary shadow-sm'
                            : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col justify-between">
                  <label className="block text-sm font-bold text-gray-700 mb-3">Il prezzo è stato percepito come:</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['Basso', 'Adeguato', 'Alto'].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setPricePerception(val)}
                        className={`p-4 border rounded-xl font-semibold text-sm text-center transition-all ${
                          pricePerception === val
                            ? 'border-primary bg-primary/5 text-primary shadow-sm'
                            : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* SEZIONE 5: Feedback aperto (textarea) */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-gray-150 pb-4 mb-2">
                <MessageSquare className="text-primary w-6 h-6 shrink-0" />
                <h2 className="text-xl font-bold text-gray-950">Feedback aperto</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Cosa hai apprezzato di più?</label>
                  <textarea
                    required
                    rows={4}
                    value={whatAppreciated}
                    onChange={e => setWhatAppreciated(e.target.value)}
                    placeholder="Raccontami l'eccellenza che ti ha colpito maggiormente nel mio metodo..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none transition-all text-gray-900 placeholder-gray-400 text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Cosa avresti voluto fosse diverso?</label>
                  <textarea
                    required
                    rows={4}
                    value={whatDifferent}
                    onChange={e => setWhatDifferent(e.target.value)}
                    placeholder="Le tue idee costruttive mi aiuteranno a migliorare per il futuro..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none transition-all text-gray-900 placeholder-gray-400 text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Suggerimenti per migliorare il servizio</label>
                  <textarea
                    required
                    rows={4}
                    value={suggestions}
                    onChange={e => setSuggestions(e.target.value)}
                    placeholder="Consigli specifici sui flussi di lavoro, contatto o organizzazione..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none transition-all text-gray-900 placeholder-gray-400 text-sm font-medium"
                  />
                </div>
              </div>
            </div>

            {/* SEZIONE 6: Testimonianza pubblicabile */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-gray-150 pb-4 mb-2">
                <Smile className="text-primary w-6 h-6 shrink-0" />
                <h2 className="text-xl font-bold text-gray-950">Testimonianza pubblicabile</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">Vuoi lasciare una recensione utilizzabile sul sito?</label>
                  <div className="grid grid-cols-2 gap-3 max-w-xs mb-4">
                    {['Sì', 'No'].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => {
                          setWantLeaveReview(val);
                          if (val === 'No') setReviewText('');
                        }}
                        className={`p-4 border rounded-xl font-semibold text-sm text-center transition-all ${
                          wantLeaveReview === val
                            ? 'border-primary bg-primary/5 text-primary shadow-sm'
                            : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>

                {wantLeaveReview === 'Sì' && (
                  <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Scrivi una breve recensione</label>
                    <textarea
                      required
                      rows={4}
                      value={reviewText}
                      onChange={e => setReviewText(e.target.value)}
                      placeholder="Esempio: Lavorare con Francesca è stata un'esperienza fantastica. Ha capito sin da subito la direzione del brand..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none transition-all text-gray-900 placeholder-gray-400 text-sm font-medium"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* SEZIONE 7: Consenso utilizzo contenuti */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-gray-150 pb-4 mb-2">
                <Shield className="text-primary w-6 h-6 shrink-0" />
                <h2 className="text-xl font-bold text-gray-950">Consenso utilizzo contenuti</h2>
              </div>

              <div className="space-y-4">
                <div className="p-5 bg-gray-50/50 rounded-2xl border border-gray-100 flex items-start gap-4">
                  <input
                    required
                    type="checkbox"
                    id="authorizeCaseStudy"
                    className="mt-1 h-5 w-5 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2 transition-all cursor-pointer"
                    checked={authorizeCaseStudy}
                    onChange={e => setAuthorizeCaseStudy(e.target.checked)}
                  />
                  <label htmlFor="authorizeCaseStudy" className="text-xs text-gray-650 leading-relaxed font-semibold cursor-pointer select-none">
                    Autorizzo l’utilizzo del feedback e del progetto come case study su questo sito e sui miei canali professionali.
                  </label>
                </div>
              </div>
            </div>

          </div>

          {/* Submit button */}
          <div className="p-8 md:p-12 border-t border-gray-100 flex justify-end bg-gray-50/20">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-4 bg-gradient-brand text-white font-black rounded-xl flex items-center gap-2 hover:opacity-95 shadow-lg shadow-primary/20 disabled:opacity-50 text-sm uppercase tracking-wider transition-all duration-300 cursor-pointer"
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
