
import React from 'react';
import Hero from '../components/Hero';
import PortfolioGrid from '../components/PortfolioGrid';
import ContactSection from '../components/ContactSection';

const Home: React.FC = () => {
  return (
    <div>
      <Hero />
      <section id="portfolio" className="py-24 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">I Miei Lavori</h2>
            <div className="w-24 h-1 bg-gradient-brand mx-auto rounded-full"></div>
            <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto italic">
              "Il design è l'ambasciatore silenzioso del tuo brand."
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
