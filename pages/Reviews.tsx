import React from 'react';
import { useNavigate } from 'react-router-dom';
import PublishedFeedbacks from '../components/PublishedFeedbacks';
import FeedbackSection from '../components/FeedbackSection';
import SEO from '../components/SEO';

const Reviews: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigateToSection = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    navigate('/', { state: { scrollTo: targetId } });
  };

  return (
    <div className="py-12 md:py-20 bg-white min-h-[70vh]">
      <SEO 
        title="Recensioni e Testimonianze | Francesca Mutolo Brand Designer"
        description="Le recensioni e opinioni dei clienti che hanno affidato la propria brand identity, logo o sito web a Francesca Mutolo."
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
          Recensioni
        </h1>
        <div className="w-24 h-1 bg-gradient-brand mx-auto rounded-full mb-6"></div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto italic">
          Le testimonianze e le opinioni dei clienti che mi hanno affidato il loro brand.
        </p>

        {/* Primo paragrafo: breve, in risalto con stile citazione coordinato */}
        <div className="mt-8 max-w-2xl mx-auto">
          <p className="font-semibold text-base sm:text-lg md:text-xl text-slate-900 italic border-l-4 border-[#F39637] pl-4 md:pl-6 py-2.5 bg-slate-50/70 rounded-r-xl text-left shadow-xs">
            Ogni progetto nasce da un ascolto attento a chi lo vive ogni giorno.
          </p>
        </div>

        {/* Secondo paragrafo: testo normale con spaziatura */}
        <p className="mt-6 text-base md:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Le recensioni raccolte qui raccontano il punto di vista di chi ha lavorato con me su brand identity, grafica pubblicitaria e siti web per professionisti e attività di Cagliari e della Sardegna.
        </p>
      </div>

      <PublishedFeedbacks />

      {/* Nuova Sezione per Nuovi Prospect / Collaborazioni */}
      <section className="py-16 md:py-20 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-base sm:text-lg md:text-xl text-gray-700 font-medium leading-relaxed max-w-2xl mx-auto mb-8">
            Se vuoi farti un'idea più completa del mio modo di lavorare, puoi dare un'occhiata ai{' '}
            <a
              href="/#portfolio"
              onClick={(e) => handleNavigateToSection(e, 'portfolio')}
              className="text-primary hover:text-secondary font-bold underline cursor-pointer inline focus:outline-none focus:ring-2 focus:ring-primary/40 rounded px-0.5 transition-colors"
            >
              progetti realizzati
            </a>{' '}
            per professionisti e attività della Sardegna.
          </p>

          <div className="flex justify-center">
            <a
              href="/#contact"
              onClick={(e) => handleNavigateToSection(e, 'contact')}
              className="group px-8 md:px-11 py-4 md:py-5 bg-gradient-brand text-white rounded-full font-extrabold text-base md:text-lg shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center space-x-3 cursor-pointer"
              id="btn-recensioni-contattami"
            >
              <span>Contattami</span>
            </a>
          </div>
        </div>
      </section>

      {/* Sezione chiaramente separata per il Feedback dei clienti esistenti */}
      <section id="feedback" className="py-20 bg-gray-50/70 border-t border-gray-200/80">
        <FeedbackSection />
      </section>
    </div>
  );
};

export default Reviews;
