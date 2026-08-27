import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import PortfolioGrid from '../components/PortfolioGrid';
import ContactSection from '../components/ContactSection';
import SEO from '../components/SEO';

export interface CategoryInfo {
  slug: string;
  category: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
}

export const CATEGORY_PAGES: Record<string, CategoryInfo> = {
  'branding': {
    slug: 'branding',
    category: 'Branding',
    title: 'Branding e Identità Visiva a Cagliari e in Sardegna | Francesca Mutolo',
    description: 'Progetti di branding e identità visiva per professionisti e attività in Sardegna. Loghi, brand identity e coordinati grafici firmati Francesca Mutolo.',
    h1: 'Progetti di Branding',
    intro: 'Identità visiva, loghi e coordinati grafici realizzati per professionisti e attività della Sardegna. Ogni progetto è sviluppato con attenzione sartoriale per comunicare in modo coerente e distintivo il carattere unico di ogni brand.',
  },
  'flyer-poster': {
    slug: 'flyer-poster',
    category: 'Flyer e Poster',
    title: 'Flyer e Poster Pubblicitari a Cagliari | Francesca Mutolo',
    description: 'Progettazione di flyer e poster pubblicitari per attività commerciali in Sardegna. Grafica pubblicitaria efficace firmata Francesca Mutolo.',
    h1: 'Flyer e Poster Pubblicitari',
    intro: 'Materiali promozionali pensati per comunicare in modo diretto, chiaro ed efficace, dalla farmacia al centro benessere. Soluzioni visive ad alto impatto per valorizzare prodotti, eventi e promozioni.',
  },
  'social-media': {
    slug: 'social-media',
    category: 'Social Media',
    title: 'Grafica per Social Media a Cagliari | Francesca Mutolo',
    description: 'Contenuti grafici per Instagram e social media di professionisti e attività in Sardegna. Comunicazione visiva coerente firmata Francesca Mutolo.',
    h1: 'Grafica per Social Media',
    intro: 'Contenuti visivi e template pensati per Instagram e i canali social di attività e liberi professionisti. Un\'estetica curata e riconoscibile, perfettamente coerente con l\'identità di brand di ogni cliente.',
  },
  'web': {
    slug: 'web',
    category: 'Web',
    title: 'Siti Web per Professionisti a Cagliari e Sardegna | Francesca Mutolo',
    description: 'Realizzazione siti web per professionisti e attività in Sardegna: design, contenuti e struttura pensati per generare contatti. Firmato Francesca Mutolo.',
    h1: 'Siti Web',
    intro: 'Siti web progettati per professionisti e attività della Sardegna, con particolare attenzione al design, alla chiarezza dei contenuti e a una struttura ottimizzata per generare contatti e conversioni reali.',
  },
};

interface PortfolioCategoryPageProps {
  categoryKey?: string;
}

const PortfolioCategoryPage: React.FC<PortfolioCategoryPageProps> = ({ categoryKey }) => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const activeSlug = categoryKey || categorySlug || '';
  const pageData = CATEGORY_PAGES[activeSlug];

  if (!pageData) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="bg-white min-h-[70vh]">
      <SEO title={pageData.title} description={pageData.description} />

      <section className="pt-16 md:pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            {pageData.h1}
          </h1>
          <div className="w-24 h-1 bg-gradient-brand mx-auto rounded-full mb-6"></div>
          <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {pageData.intro}
          </p>
          <p className="mt-3 text-xs md:text-sm text-gray-400 max-w-2xl mx-auto">
            I progetti contrassegnati come 'Progetto Concept' sono case study dimostrativi, pensati per mostrare il mio approccio a settori specifici.
          </p>
        </div>

        <PortfolioGrid fixedCategory={pageData.category} />
      </section>

      <section id="contact" className="py-24 bg-gray-50 scroll-mt-20 border-t border-gray-100">
        <ContactSection />
      </section>
    </div>
  );
};

export default PortfolioCategoryPage;
