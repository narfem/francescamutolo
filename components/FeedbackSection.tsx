import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Star, Send, CheckCircle } from 'lucide-react';

const FeedbackSection: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await supabase.from('feedbacks').insert([{
      name: formData.name,
      company: formData.company || null,
      rating: rating,
      message: formData.message,
      is_deleted: false,
      is_approved: false
    }]);

    setLoading(false);
    if (!error) {
      setSubmitted(true);
      setFormData({ name: '', company: '', message: '' });
      setRating(5);
    } else {
      console.error("Errore salvataggio feedback:", error);
      alert("Si è verificato un errore durante l'invio del feedback. Assicurati che lo schema del database sia aggiornato.");
    }
  };

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto text-center py-16 px-4 animate-in fade-in duration-300">
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-500" />
        </div>
        <h2 className="text-3xl font-black text-gray-950 mb-4">Grazie per il tuo feedback!</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          La tua opinione è preziosa e mi aiuta a migliorare costantemente i miei servizi.
        </p>
        <button 
          onClick={() => setSubmitted(false)}
          className="text-primary font-bold hover:underline transition-all"
        >
          Invia un altro feedback
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold text-gray-950 mb-4 tracking-tight">Lasciami un Feedback</h2>
        <p className="text-gray-600 max-w-xl mx-auto">
          Hai collaborato con me o provato i miei servizi? La tua opinione è preziosa! Raccontami la tua esperienza.
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 max-w-2xl mx-auto">
        <div className="p-8 md:p-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">Nome *</label>
                <input 
                  required 
                  type="text" 
                  placeholder="Il tuo nome o azienda"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-gray-900 bg-white"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">Ruolo o Azienda <span className="text-gray-400 font-normal">(Opzionale)</span></label>
                <input 
                  type="text" 
                  placeholder="Es: CEO di BrandX"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-gray-900 bg-white"
                  value={formData.company}
                  onChange={e => setFormData({...formData, company: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">La tua valutazione *</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isFilled = hoverRating !== null ? star <= hoverRating : star <= rating;
                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(null)}
                      className="p-1 transition-all hover:scale-110 focus:outline-none"
                    >
                      <Star 
                        size={28} 
                        className={`transition-colors ${
                          isFilled 
                            ? 'fill-[#F39637] text-[#F39637]' 
                            : 'text-gray-200 hover:text-gray-300'
                        }`} 
                      />
                    </button>
                  );
                })}
                <span className="ml-3 text-xs font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-1 rounded hidden md:inline-block">
                  {rating} / 5 stelle
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">Il tuo messaggio *</label>
              <textarea 
                required 
                rows={4} 
                placeholder="Cosa ti è piaciuto della nostra collaborazione?"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none resize-none text-gray-900 bg-white"
                value={formData.message}
                onChange={e => setFormData({...formData, message: e.target.value})}
              ></textarea>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gradient-brand text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-95 transition-opacity disabled:opacity-50 shadow-lg shadow-primary/10"
            >
              {loading ? 'Invio in corso...' : 'Invia Feedback'} <Send size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FeedbackSection;
