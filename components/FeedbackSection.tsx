import React from 'react';
import { Send } from 'lucide-react';

const FeedbackSection: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4" id="feedback-section-container">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-extrabold text-gray-950 mb-4 tracking-tight">Lasciami un Feedback</h2>
        <p className="text-gray-600 max-w-xl mx-auto font-medium">
          Hai collaborato con me? La tua opinione è preziosa! Raccontami la tua esperienza
        </p>
      </div>

      <div className="max-w-md mx-auto text-center mt-8">
        <a 
          href="/#/valutazione-servizio"
          className="inline-flex w-full sm:w-auto bg-gradient-brand text-white px-8 py-4 rounded-xl font-bold items-center justify-center gap-2 hover:opacity-95 transition-opacity shadow-lg shadow-primary/10 transition-all transform hover:scale-[1.02]"
          id="btn-valutazione-servizio"
        >
          Valuta il Servizio <Send size={20} />
        </a>
      </div>
    </div>
  );
};

export default FeedbackSection;
