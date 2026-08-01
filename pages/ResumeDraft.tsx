import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getDraftByToken, QuestionnaireDraft } from '../lib/draftService';
import Questionnaire from './Questionnaire';
import ArtistQuestionnaire from './ArtistQuestionnaire';
import { Loader2, CheckCircle2, Clock, AlertCircle, ArrowLeft, FileText, Sparkles } from 'lucide-react';

export const ResumeDraft: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState<QuestionnaireDraft | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const loadDraft = async () => {
      if (!token) {
        setErrorMsg('Token mancante');
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const res = await getDraftByToken(token);
        if (res.success && res.draft) {
          setDraft(res.draft);
        } else {
          setErrorMsg(res.error || 'Impossibile trovare la bozza specificata.');
        }
      } catch (err) {
        console.error("Error loading draft in ResumeDraft:", err);
        setErrorMsg('Errore durante il recupero della bozza.');
      } finally {
        setLoading(false);
      }
    };

    loadDraft();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-6">
        <div className="text-center space-y-4 max-w-md bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto animate-bounce">
            <Loader2 size={32} className="animate-spin" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Ripristino Bozza in corso...
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Stiamo recuperando i dati salvati e ricostruendo lo stato del tuo questionario.
          </p>
        </div>
      </div>
    );
  }

  if (errorMsg || !draft) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-6">
        <div className="text-center space-y-6 max-w-lg bg-white dark:bg-gray-900 p-8 md:p-10 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800">
          <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mx-auto">
            <AlertCircle size={32} />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white">
              Bozza non trovata
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {errorMsg || "Il link di ripresa utilizzato non è valido o la bozza è stata rimossa."}
            </p>
          </div>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/"
              className="w-full sm:w-auto px-6 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-gray-800 dark:text-gray-200 font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all"
            >
              Torna alla Home
            </Link>
            <Link
              to="/questionario"
              className="w-full sm:w-auto px-6 py-3 bg-primary hover:bg-primary/90 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md"
            >
              Nuovo Questionario
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Handle completed status
  if (draft.status === 'completed') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-6">
        <div className="text-center space-y-6 max-w-lg bg-white dark:bg-gray-900 p-8 md:p-10 rounded-3xl shadow-xl border border-emerald-100 dark:border-emerald-900/30">
          <div className="w-16 h-16 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto">
            <CheckCircle2 size={36} />
          </div>
          <div className="space-y-2">
            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-black text-[10px] uppercase tracking-wider rounded-full inline-block">
              Questionario Inviato
            </span>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white">
              Questo questionario è già stato inviato
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              Il questionario per <strong className="text-gray-900 dark:text-white">{draft.company_or_artist_name || 'questo progetto'}</strong> risulta completato e inviato con successo. Non è più possibile apportare modifiche tramite questo link.
            </p>
          </div>
          <div className="pt-2 text-xs text-gray-400 dark:text-gray-500 font-medium">
            Inviato il: {draft.updated_at ? new Date(draft.updated_at).toLocaleString() : 'Recentemente'}
          </div>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/"
              className="w-full sm:w-auto px-6 py-3 bg-brandDark text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all hover:opacity-90"
            >
              Torna alla Home
            </Link>
            <Link
              to="/questionario"
              className="w-full sm:w-auto px-6 py-3 bg-primary text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md hover:bg-primary/90"
            >
              Inizia Nuovo Questionario
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Handle expired status
  if (draft.status === 'expired') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-6">
        <div className="text-center space-y-6 max-w-lg bg-white dark:bg-gray-900 p-8 md:p-10 rounded-3xl shadow-xl border border-amber-100 dark:border-amber-900/30">
          <div className="w-16 h-16 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center mx-auto">
            <Clock size={36} />
          </div>
          <div className="space-y-2">
            <span className="px-3 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-black text-[10px] uppercase tracking-wider rounded-full inline-block">
              Link Scaduto
            </span>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white">
              Questa bozza è scaduta
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              Le bozze non completate hanno una validità massima di 180 giorni. Il tempo a disposizione per questa bozza è terminato. Puoi avviarne una nuova in qualsiasi momento.
            </p>
          </div>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/"
              className="w-full sm:w-auto px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all hover:bg-gray-200"
            >
              Torna alla Home
            </Link>
            <Link
              to="/questionario"
              className="w-full sm:w-auto px-6 py-3 bg-primary text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md hover:bg-primary/90"
            >
              Crea Nuovo Questionario
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Render the corresponding active questionnaire with draft data restored
  if (draft.questionnaire_type === 'artist') {
    return <ArtistQuestionnaire initialDraft={draft} />;
  }

  // Default to Brand Questionnaire
  return <Questionnaire initialDraft={draft} />;
};

export default ResumeDraft;
