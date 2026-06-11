import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Feedback } from '../types';
import { Star, Trash2, Check, RefreshCw, AlertTriangle, MessageSquare, Flag, X } from 'lucide-react';

const ManageFeedbacks: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [errorInfo, setErrorInfo] = useState<string | null>(null);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [feedbackToDelete, setFeedbackToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    setLoading(true);
    setErrorInfo(null);
    try {
      const { data, error } = await supabase
        .from('feedbacks')
        .select('*')
        .eq('is_deleted', false)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }
      setFeedbacks(data || []);
    } catch (err: any) {
      console.error("Fetch feedbacks error:", err);
      
      const isRelationError = err?.code === '42P01' || 
                              (err?.message && err.message.toLowerCase().includes('relation') && err.message.toLowerCase().includes('exist'));

      if (isRelationError) {
        setErrorInfo(
          "La tabella 'feedbacks' non esiste ancora nel tuo database Supabase. Assicurati di aver eseguito lo script SQL per creare la tabella e le politiche di sicurezza inserito qui sotto."
        );
      } else {
        setErrorInfo(err?.message || err?.details || "Impossibile recuperare i feedback dal database.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleToggleApprove = async (fb: Feedback) => {
    setUpdatingId(fb.id);
    try {
      const { error } = await supabase
        .from('feedbacks')
        .update({ is_approved: !fb.is_approved })
        .eq('id', fb.id);

      if (error) throw error;
      
      setFeedbacks(prev => prev.map(f => f.id === fb.id ? { ...f, is_approved: !f.is_approved } : f));
      if (selectedFeedback && selectedFeedback.id === fb.id) {
        setSelectedFeedback(prev => prev ? { ...prev, is_approved: !prev.is_approved } : null);
      }
    } catch (err) {
      console.error("Error toggling approval:", err);
      alert("Impossibile aggiornare lo stato di approvazione del feedback.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setFeedbackToDelete(id);
  };

  const handleConfirmDelete = async () => {
    if (!feedbackToDelete) return;
    setUpdatingId(feedbackToDelete);
    try {
      const { error } = await supabase
        .from('feedbacks')
        .delete()
        .eq('id', feedbackToDelete);

      if (error) throw error;
      
      setFeedbacks(prev => prev.filter(f => f.id !== feedbackToDelete));
      if (selectedFeedback && selectedFeedback.id === feedbackToDelete) {
        setSelectedFeedback(null);
      }
      setFeedbackToDelete(null);
    } catch (err) {
      console.error("Error deleting feedback:", err);
      alert("Impossibile eliminare il feedback.");
    } finally {
      setUpdatingId(null);
    }
  };

  const sqlCode = `CREATE TABLE IF NOT EXISTS feedbacks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  company TEXT,
  rating INTEGER NOT NULL DEFAULT 5,
  message TEXT NOT NULL,
  is_deleted BOOLEAN DEFAULT FALSE,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE feedbacks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Inserimento pubblico feedback" ON feedbacks;
CREATE POLICY "Inserimento pubblico feedback" ON feedbacks FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Admin Select Feedbacks" ON feedbacks;
CREATE POLICY "Admin Select Feedbacks" ON feedbacks FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Admin Update Feedbacks" ON feedbacks;
CREATE POLICY "Admin Update Feedbacks" ON feedbacks FOR UPDATE TO authenticated USING (true);
DROP POLICY IF EXISTS "Admin Delete Feedbacks" ON feedbacks;
CREATE POLICY "Admin Delete Feedbacks" ON feedbacks FOR ALL TO authenticated USING (true);`;

  return (
    <div className="space-y-12 pb-24 relative animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Feedback Clienti</h1>
          <p className="text-sm text-gray-500 mt-1">Gestisci le recensioni e i commenti inviati dai tuoi clienti</p>
        </div>
        <button 
          onClick={fetchFeedbacks}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm shrink-0"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Aggiorna
        </button>
      </div>

      {errorInfo && (
        <div className="bg-orange-50 text-orange-800 border border-orange-100 p-6 rounded-2xl text-sm max-w-4xl">
          <div className="flex gap-3 mb-2">
            <AlertTriangle className="text-orange-600 shrink-0" size={20} />
            <p className="font-extrabold uppercase tracking-wider text-xs mt-0.5">Sincronizzazione Database Obbligatoria:</p>
          </div>
          <p className="mb-4 font-medium">{errorInfo}</p>
          <div className="bg-gray-900 p-4 rounded-xl text-gray-100 font-mono text-xs overflow-x-auto whitespace-pre">
            {sqlCode}
          </div>
          <p className="mt-4 text-xs">Copia e ed esegui questa query nel SQL Editor del tuo pannello di controllo Supabase per attivare la tabella dei feedback.</p>
        </div>
      )}

      <div className="rounded-[2rem] md:rounded-[3rem] p-4 md:p-8 bg-white border border-gray-100 shadow-sm">
        <h2 className="text-xl md:text-2xl font-black text-gray-950 mb-8 flex items-center gap-3">
          <MessageSquare size={28} className="text-primary" />
          <span>Tutti i Feedback ricevuti ({feedbacks.filter(f => !f.is_deleted).length})</span>
        </h2>

        {loading ? (
          <div className="py-20 text-center font-bold text-gray-400">Caricamento feedback...</div>
        ) : feedbacks.filter(f => !f.is_deleted).length === 0 ? (
          <div className="py-20 text-center text-gray-400 font-medium">
            Nessun feedback inviato finora.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {feedbacks.filter(f => !f.is_deleted).map((fb) => (
              <div 
                key={fb.id}
                onClick={() => setSelectedFeedback(fb)}
                className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 hover:border-primary/40 hover:shadow-md transition-all relative group flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                        <MessageSquare size={22} />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-extrabold text-gray-900 text-lg leading-tight group-hover:text-primary transition-colors">
                            {fb.name}
                          </h3>
                          
                          <button 
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleApprove(fb);
                            }}
                            disabled={updatingId === fb.id}
                            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border transition-all ${
                              fb.is_approved 
                                ? 'bg-green-50 text-green-600 border-green-100/50' 
                                : 'bg-gray-50 text-gray-400 border-gray-100 hover:text-primary hover:border-primary/20'
                            }`}
                            title={fb.is_approved ? "Ritira approvazione" : "Approva feedback"}
                          >
                            <Flag size={10} fill={fb.is_approved ? "currentColor" : "none"} />
                            {fb.is_approved ? 'Pubblicato' : 'In Attesa'}
                          </button>
                        </div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                          {fb.company || 'Feedback Cliente'}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-1">
                      <button 
                        type="button"
                        onClick={(e) => handleDeleteClick(e, fb.id)}
                        disabled={updatingId === fb.id}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors bg-gray-50 rounded-full hover:bg-gray-100"
                        title="Elimina feedback"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-0.5 my-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        size={14} 
                        className={star <= fb.rating ? 'text-[#F39637] fill-[#F39637]' : 'text-gray-200'}
                      />
                    ))}
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">
                      {fb.rating} / 5 stelle
                    </span>
                  </div>

                  <div className="text-xs text-gray-600 bg-gray-50/50 p-4 rounded-xl border border-gray-100 leading-relaxed font-medium italic mt-2 line-clamp-3">
                    "{fb.message}"
                  </div>
                </div>

                <div className="flex justify-end items-center pt-4 border-t border-gray-50 mt-4 text-right">
                  <span className="text-[10px] font-mono font-bold text-gray-400">
                    {new Date(fb.created_at).toLocaleDateString('it-IT', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedFeedback && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in"
          onClick={() => setSelectedFeedback(null)}
        >
          <div 
            className="bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 md:p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 flex-shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-lg shadow-primary/5">
                  <MessageSquare size={26} />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-black text-gray-900 leading-tight">{selectedFeedback.name}</h3>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">
                    {selectedFeedback.company || 'Feedback Cliente'} • Inviato il {new Date(selectedFeedback.created_at).toLocaleDateString('it-IT', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedFeedback(null)}
                className="p-2 text-gray-400 hover:text-gray-650 transition-colors bg-gray-100/60 hover:bg-gray-100 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8 overflow-y-auto space-y-6 max-h-[60vh]">
              <div>
                <span className="text-[10px] font-black tracking-wider uppercase text-gray-400 ml-1 block mb-2">Valutazione</span>
                <div className="flex items-center gap-1.5 bg-gray-50 p-4 rounded-xl border border-gray-100 inline-flex">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        size={18} 
                        className={star <= selectedFeedback.rating ? 'text-[#F39637] fill-[#F39637]' : 'text-gray-200'}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-black text-gray-500 uppercase tracking-wider ml-2">
                    {selectedFeedback.rating} su 5 stelle
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-black tracking-wider uppercase text-gray-400 ml-1 block mb-2">Messaggio completo</span>
                <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 text-sm md:text-base text-gray-700 font-medium italic leading-relaxed whitespace-pre-wrap">
                  "{selectedFeedback.message}"
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between border-t border-gray-100/60 pt-6">
                <div>
                  <span className="text-[10px] font-black tracking-wider uppercase text-gray-400 block mb-1">Stato Pubblicazione</span>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                      selectedFeedback.is_approved 
                        ? 'bg-green-50 text-green-700 border border-green-100/50' 
                        : 'bg-yellow-50 text-yellow-700 border border-yellow-100/50'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${selectedFeedback.is_approved ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                      {selectedFeedback.is_approved ? 'Approvato e Pubblicato' : 'In attesa di approvazione'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => handleToggleApprove(selectedFeedback)}
                    disabled={updatingId === selectedFeedback.id}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                      selectedFeedback.is_approved 
                        ? 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border-yellow-100' 
                        : 'bg-green-50 text-green-750 hover:bg-green-100 border-green-100'
                    }`}
                  >
                    {selectedFeedback.is_approved ? 'Ritira Approvazione' : 'Approva e Pubblica'}
                  </button>

                  <button
                    onClick={() => setFeedbackToDelete(selectedFeedback.id)}
                    disabled={updatingId === selectedFeedback.id}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors border border-transparent hover:border-red-150"
                    title="Elimina feedback"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 md:p-8 bg-gray-50/50 border-t border-gray-100 flex-shrink-0 flex justify-end">
              <button 
                onClick={() => setSelectedFeedback(null)}
                className="px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-bold text-sm transition-all"
              >
                Chiudi
              </button>
            </div>
          </div>
        </div>
      )}

      {feedbackToDelete && (
        <div 
          className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in"
          onClick={() => setFeedbackToDelete(null)}
        >
          <div 
            className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl p-6 md:p-8 flex flex-col overflow-hidden animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex gap-4 items-start mb-6">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 font-sans">Sei sicuro?</h3>
                <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                  Stai per eliminare definitivamente questo feedback. Questa operazione non può essere annullata.
                </p>
              </div>
            </div>
            
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setFeedbackToDelete(null)}
                className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-xs transition-all"
              >
                Annulla
              </button>
              <button 
                onClick={handleConfirmDelete}
                disabled={updatingId === feedbackToDelete}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs transition-all flex items-center gap-1.5"
              >
                {updatingId === feedbackToDelete ? 'Eliminazione...' : 'Conferma ed Elimina'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageFeedbacks;
