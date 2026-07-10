import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Feedback } from '../types';
import { Star, X, MessageSquare, Users, Globe } from 'lucide-react';

const parseStructuredFeedback = (message: string) => {
  if (!message || !message.includes('VALUTAZIONE COMPLETA DEL CLIENTE')) {
    return null;
  }
  
  const result: {
    name?: string;
    company?: string;
    channel?: string;
    rating?: number;
    price?: string;
    consent?: string;
    experience?: string;
  } = {};

  const lines = message.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('- Nome del Cliente:')) {
      result.name = line.replace('- Nome del Cliente:', '').trim();
    } else if (line.startsWith('- Azienda o Progetto:')) {
      result.company = line.replace('- Azienda o Progetto:', '').trim();
    } else if (line.startsWith('- Canale di acquisizione')) {
      result.channel = line.substring(line.indexOf(':') + 1).trim();
    } else if (line.startsWith('- Soddisfazione generale del risultato:')) {
      const match = line.match(/(\d+)\/5/);
      if (match) {
        result.rating = parseInt(match[1]);
      }
    } else if (line.startsWith('- Percezione del prezzo:')) {
      result.price = line.replace('- Percezione del prezzo:', '').trim();
    } else if (line.startsWith('- Autorizzazione Case Study:')) {
      result.consent = line.replace('- Autorizzazione Case Study:', '').trim();
    } else if (line.startsWith('↳ "') || line.startsWith('↳  "')) {
      let exp = line;
      let j = i + 1;
      while (j < lines.length && !lines[j].trim().startsWith('🔒') && !lines[j].trim().startsWith('- Autorizzazione')) {
        exp += '\n' + lines[j];
        j++;
      }
      let cleanExp = exp.trim();
      if (cleanExp.startsWith('↳')) {
        cleanExp = cleanExp.substring(1).trim();
      }
      if (cleanExp.startsWith('"') && cleanExp.endsWith('"')) {
        cleanExp = cleanExp.substring(1, cleanExp.length - 1);
      }
      result.experience = cleanExp;
    }
  }

  return result;
};

const PublishedFeedbacks: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);

  useEffect(() => {
    const fetchPublishedFeedbacks = async () => {
      try {
        const { data, error } = await supabase
          .from('feedbacks')
          .select('*')
          .eq('is_deleted', false)
          .eq('is_approved', true)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching published feedbacks:', error);
        } else if (data) {
          setFeedbacks(data);
        }
      } catch (err) {
        console.error('Failed to load published feedbacks:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPublishedFeedbacks();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (feedbacks.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gray-50/50 border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Cosa Dicono di Me</h3>
          <div className="w-12 h-1 bg-gradient-brand mx-auto rounded-full mt-3"></div>
        </div>

        <div className="flex flex-wrap justify-center gap-8">
          {feedbacks.map((fb) => {
            const parsed = parseStructuredFeedback(fb.message);
            const clientName = parsed?.name || fb.name;
            const clientCompany = parsed?.company || fb.company;
            const clientRating = parsed?.rating || fb.rating || 5;
            const clientComment = parsed?.experience || fb.message;

            return (
              <div 
                key={fb.id} 
                onClick={() => setSelectedFeedback(fb)}
                className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.334rem)] max-w-md cursor-pointer hover:translate-y-[-2px]"
              >
                <div>
                  <div className="flex gap-1 mb-4 text-amber-400">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star 
                        key={idx} 
                        size={16} 
                        className={idx < clientRating ? 'fill-current' : 'text-gray-200'} 
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 italic text-sm leading-relaxed mb-6 whitespace-pre-wrap line-clamp-4">
                    "{clientComment}"
                  </p>
                </div>
                
                <div className="border-t border-gray-50 pt-4 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm leading-tight">{clientName}</h4>
                    {clientCompany && (
                      <p className="text-xs text-gray-500 font-medium mt-0.5">{clientCompany}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail Modal Popup */}
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
                  <h3 className="text-xl md:text-2xl font-black text-gray-900 leading-tight">
                    {parseStructuredFeedback(selectedFeedback.message)?.name || selectedFeedback.name}
                  </h3>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">
                    {parseStructuredFeedback(selectedFeedback.message)?.company || selectedFeedback.company || 'Feedback Cliente'}
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
                    {[1, 2, 3, 4, 5].map((star) => {
                      const parsedRating = parseStructuredFeedback(selectedFeedback.message)?.rating;
                      const finalRating = parsedRating !== undefined ? parsedRating : selectedFeedback.rating;
                      return (
                        <Star 
                          key={star} 
                          size={18} 
                          className={star <= (finalRating || 5) ? 'text-[#F39637] fill-[#F39637]' : 'text-gray-200'}
                        />
                      );
                    })}
                  </div>
                  <span className="text-xs font-black text-gray-500 uppercase tracking-wider ml-2">
                    {(parseStructuredFeedback(selectedFeedback.message)?.rating !== undefined ? parseStructuredFeedback(selectedFeedback.message)?.rating : selectedFeedback.rating) || 5} su 5 stelle
                  </span>
                </div>
              </div>

              {(() => {
                const parsed = parseStructuredFeedback(selectedFeedback.message);
                if (parsed) {
                  return (
                    <div className="space-y-6">
                      {/* Grid with Client info and project stats */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Client card */}
                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex gap-4">
                          <div className="text-secondary bg-secondary/10 p-3 h-12 w-12 rounded-xl flex items-center justify-center shrink-0">
                            <Users size={20} />
                          </div>
                          <div className="space-y-1">
                            <h4 className="text-xs font-black uppercase text-slate-450 tracking-wider">Dati Cliente</h4>
                            <p className="text-sm font-bold text-slate-900">{parsed.name || selectedFeedback.name}</p>
                            <p className="text-xs text-slate-600 font-medium">{parsed.company || selectedFeedback.company || 'Nessuna azienda'}</p>
                          </div>
                        </div>

                        {/* Origin channel & pricing perception */}
                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex gap-4">
                          <div className="text-primary bg-primary/10 p-3 h-12 w-12 rounded-xl flex items-center justify-center shrink-0">
                            <Globe size={20} />
                          </div>
                          <div className="space-y-1">
                            <h4 className="text-xs font-black uppercase text-slate-450 tracking-wider">Dettagli Progetto</h4>
                            <p className="text-sm font-bold text-slate-900">
                              Canale: <span className="text-primary font-extrabold">{parsed.channel || 'N/D'}</span>
                            </p>
                            <p className="text-xs text-slate-600 font-medium">
                              Prezzo: <span className="font-extrabold text-slate-800">{parsed.price || 'N/D'}</span>
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Testimonial Message (The actual feedback) */}
                      <div>
                        <span className="text-[10px] font-black tracking-wider uppercase text-slate-400 ml-1 block mb-2">Esperienza del Cliente</span>
                        <div className="bg-primary text-white p-6 md:p-8 rounded-3xl border border-primary/10 relative shadow-inner overflow-hidden">
                          {/* Decorative quote icon */}
                          <div className="absolute right-4 top-2 text-white/20 font-serif text-8xl leading-none select-none pointer-events-none">
                            ”
                          </div>
                          <p className="text-sm md:text-base text-white font-medium italic leading-relaxed relative z-10 whitespace-pre-wrap">
                            "{parsed.experience || selectedFeedback.message}"
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <div>
                    <span className="text-[10px] font-black tracking-wider uppercase text-gray-400 ml-1 block mb-2">Messaggio completo</span>
                    <div className="bg-primary text-white p-6 md:p-8 rounded-3xl border border-primary/10 relative shadow-inner overflow-hidden">
                      <div className="absolute right-4 top-2 text-white/20 font-serif text-8xl leading-none select-none pointer-events-none">
                        ”
                      </div>
                      <p className="text-sm md:text-base text-white font-medium italic leading-relaxed relative z-10 whitespace-pre-wrap">
                        "{selectedFeedback.message}"
                      </p>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default PublishedFeedbacks;
