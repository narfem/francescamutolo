
import React from 'react';
import Hero from '../components/Hero';
import PortfolioGrid from '../components/PortfolioGrid';
import ContactSection from '../components/ContactSection';
import SEO from '../components/SEO';

const Home: React.FC = () => {
  return (
    <div>
      <SEO 
        title="Francesca Mutolo | Brand Designer a Cagliari e in Sardegna"
        description="Logo, brand identity e siti web per professionisti e attività in Sardegna. Con base a Cagliari, lavoro con studi, artigiani e attività su tutta l'isola."
      />
      <Hero />
      <section id="portfolio" className="py-24 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">I Miei Lavori</h2>
            <div className="w-24 h-1 bg-gradient-brand mx-auto rounded-full"></div>
            <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto italic">
              "Non progetto solo loghi: costruisco identità che parlano la lingua di chi le userà ogni giorno."
            </p>
            <h2 className="mt-3 text-base md:text-lg font-medium text-gray-500 max-w-3xl mx-auto">
              Brand identity e siti web per professionisti e artigiani a Cagliari e in Sardegna
            </h2>
            <p className="mt-2 text-xs md:text-sm text-gray-400 max-w-2xl mx-auto">
              I progetti contrassegnati come 'Progetto Concept' sono case study dimostrativi, pensati per mostrare il mio approccio a settori specifici.
            </p>
          </div>
          <PortfolioGrid />
        </div>
      </section>
      <section id="contact" className="py-24 bg-gray-50 scroll-mt-20">
        <ContactSection />
      </section>
    </div>
  );
};

export default Home;
