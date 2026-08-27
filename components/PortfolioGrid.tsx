import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { PortfolioItem } from '../types';
import { Image as ImageIcon, X, ChevronDown, ChevronUp } from 'lucide-react';

export const isConceptProject = (item: PortfolioItem): boolean => {
  const titleLower = (item.title || '').toLowerCase().trim();
  if (
    titleLower.includes('samten beats') ||
    titleLower.includes('sanoflex') ||
    titleLower.includes('modux')
  ) {
    return false;
  }
  if (
    titleLower.includes('salone') ||
    titleLower.includes('parruccheria') ||
    titleLower.includes('farmacia') ||
    titleLower.includes("sant'ignazio") ||
    titleLower.includes('psicologia') ||
    titleLower.includes('studio medico') ||
    (titleLower.includes('medico') && !titleLower.includes('sanoflex')) ||
    titleLower.includes('adele deidda') ||
    titleLower.includes('architetta') ||
    titleLower.includes('concept') ||
    (item.description || '').toLowerCase().includes('concept')
  ) {
    return true;
  }
  return false;
};

export const getProjectModalDescription = (item: PortfolioItem): string => {
  const titleLower = (item.title || '').toLowerCase().trim();
  const categoryLower = (item.category || '').toLowerCase().trim();

  // 1. SamTen Beats (Sito Web vs Brand Identity)
  if (titleLower.includes('samten')) {
    if (categoryLower.includes('web') || titleLower.includes('sito') || titleLower.includes('web')) {
      return "Progettazione e realizzazione del sito web per SamTen Beats, pensato per presentare il percorso artistico e i contenuti in modo chiaro e coinvolgente.";
    }
    return "Sviluppo dell'identità visiva per SamTen Beats: logo, palette colori e coordinato grafico pensati per comunicare energia e riconoscibilità nel settore musicale.";
  }

  // 2. Sanoflex Megastore
  if (titleLower.includes('sanoflex')) {
    return "Poster pubblicitario per Sanoflex Megastore, attività specializzata in dispositivi medici. Un lavoro pensato per comunicare in modo diretto un'offerta commerciale a un pubblico ampio.";
  }

  // 3. Modux Consulting
  if (titleLower.includes('modux')) {
    return "Identità visiva per Modux Consulting, studio di consulenza legale: logo e coordinato grafico pensati per trasmettere autorevolezza e affidabilità.";
  }

  // 4. Salone Parruccheria
  if (titleLower.includes('salone') || titleLower.includes('parruccheria') || titleLower.includes('parrucchier')) {
    return "Case study dimostrativo per un salone di parrucchieria: un esempio di come costruire un'identità visiva curata attorno al concetto di cura del capello e attenzione al dettaglio.";
  }

  // 5. Farmacia Sant'Ignazio
  if (titleLower.includes('farmacia') || titleLower.includes("sant'ignazio") || titleLower.includes('sant ignazio') || titleLower.includes('ignazio')) {
    return "Case study dimostrativo per una farmacia: identità visiva pensata per comunicare professionalità, fiducia e vicinanza al cliente.";
  }

  // 6. Studio Psicologia
  if (titleLower.includes('psicologia') || titleLower.includes('psicolog')) {
    return "Case study dimostrativo per uno studio di psicologia: un sito pensato per accogliere chi cerca supporto, con un tono caldo, chiaro e rassicurante.";
  }

  // 7. Studio Medico
  if (titleLower.includes('studio medico') || (titleLower.includes('medico') && !titleLower.includes('sanoflex'))) {
    return "Case study dimostrativo per uno studio medico: un sito pensato per comunicare competenza clinica e allo stesso tempo un'accoglienza umana verso i pazienti.";
  }

  // 8. Architetta Adele Deidda
  if (titleLower.includes('adele deidda') || titleLower.includes('architett') || titleLower.includes('deidda')) {
    return "Case study dimostrativo per uno studio di architettura: un'identità visiva pensata per raccontare visione progettuale e precisione tecnica.";
  }

  // Fallback sul campo description (ripulito)
  if (item.description) {
    const clean = item.description.replace(/\[SITE_URL:.*?\]/, '').trim();
    if (clean) return clean;
  }

  return "";
};

export const CATEGORY_LINKS = [
  { name: 'Tutti', path: '/' },
  { name: 'Branding', path: '/portfolio/branding' },
  { name: 'Flyer & Poster', path: '/portfolio/flyer-poster' },
  { name: 'Social Media', path: '/portfolio/social-media' },
  { name: 'Web', path: '/portfolio/web' },
];

interface PortfolioGridProps {
  fixedCategory?: string;
}

const PortfolioGrid: React.FC<PortfolioGridProps> = ({ fixedCategory = 'Tutti' }) => {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [showAll, setShowAll] = useState(false);

  const activeCategory = fixedCategory;

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      setLoading(true);
      console.log("Fetching portfolio items for grid...");
      const { data, error } = await supabase
        .from('portfolio')
        .select('*')
        .not('category', 'ilike', '%CV%')
        .not('category', 'ilike', '%Curriculum%')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Errore fetch portfolio grid:", error);
      } else if (data) {
        console.log("Portfolio items fetched for grid:", data.length);
        setItems(data);
      }
    } catch (err) {
      console.error("Critical error in fetchPortfolio grid:", err);
    } finally {
      setLoading(false);
    }
  };

  const getSiteUrlFromDescription = (desc: string) => {
    if (!desc) return '';
    const match = desc.match(/\[SITE_URL:(.*?)\]/);
    return match ? match[1] : '';
  };

  const getCleanDescription = (desc: string) => {
    if (!desc) return '';
    return desc.replace(/\[SITE_URL:.*?\]/, '').trim();
  };

  const getAltText = (item: PortfolioItem) => {
    const title = item.title || '';
    const cleanTitle = title.trim();
    const titleLower = cleanTitle.toLowerCase();

    if (titleLower.includes('samten beats')) {
      return 'Brand identity e artwork per il progetto musicale SamTen Beats';
    }
    if (titleLower.includes('salone') || titleLower.includes('parruccheria')) {
      return 'Brand identity per salone di parrucchieria - progetto concept Cagliari';
    }
    if (titleLower.includes('farmacia') || titleLower.includes("sant'ignazio")) {
      return 'Logo e brand identity per farmacia - progetto concept';
    }
    if (titleLower.includes('sanoflex')) {
      return 'Poster pubblicitario per Sanoflex Megastore - dispositivi medici';
    }
    if (titleLower.includes('psicologia')) {
      return 'Sito web per studio di psicologia - progetto concept';
    }
    if (titleLower.includes('modux')) {
      return 'Logo e brand identity per studio di consulenza legale a Cagliari';
    }
    if (titleLower.includes('studio medico') || (titleLower.includes('medico') && !titleLower.includes('sanoflex'))) {
      return 'Sito web per studio medico - progetto concept';
    }
    if (titleLower.includes('adele deidda') || titleLower.includes('architetta')) {
      return 'Brand identity per studio di architettura - progetto concept';
    }

    const category = item.category?.replace(/flayer/i, 'Flyer') || 'Brand identity';
    const isConcept = isConceptProject(item);
    return `${cleanTitle} - ${category} per attività e professionisti in Sardegna${isConcept ? ' - progetto concept' : ''}`;
  };

  const handleCardClick = (item: PortfolioItem) => {
    setSelectedItem(item);
  };

  const categoryItems = activeCategory === 'Tutti' 
    ? items 
    : items.filter(item => {
        if (activeCategory === 'Flyer & Poster') {
            return item.category === 'Flyer & Poster' || item.category === 'Flayer & Poster';
        }
        return item.category === activeCategory;
      });

  const filteredItems = (showAll || activeCategory !== 'Tutti' || !categoryItems.some(item => item.is_featured))
    ? categoryItems 
    : categoryItems.filter(item => item.is_featured);

  const hasHiddenItems = activeCategory === 'Tutti' && categoryItems.some(item => !item.is_featured);

  if (loading) {
    return (
      <div className="min-h-[600px]">
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-12 sm:mb-16 animate-pulse">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 sm:h-11 w-28 sm:w-36 bg-gray-100 rounded-full" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="rounded-3xl bg-gray-50/80 border border-gray-100 overflow-hidden animate-pulse">
              <div className="aspect-[4/3] bg-gray-200/70" />
              <div className="p-6 space-y-3">
                <div className="h-4 w-1/3 bg-gray-200 rounded" />
                <div className="h-6 w-3/4 bg-gray-200 rounded" />
                <div className="h-4 w-full bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-4 mb-16">
        {CATEGORY_LINKS.map((cat) => {
          const isActive = activeCategory === cat.name;
          return (
            <Link
              key={cat.name}
              to={cat.path}
              className={`px-8 py-3 rounded-full transition-all font-bold text-sm tracking-wide inline-flex items-center justify-center ${
                isActive 
                  ? 'bg-gradient-brand text-white shadow-lg shadow-primary/20 scale-105 pointer-events-none' 
                  : 'bg-white text-gray-500 hover:bg-gray-100 shadow-sm hover:text-gray-900'
              }`}
            >
              {cat.name}
            </Link>
          );
        })}
      </div>

      <div className="flex flex-wrap justify-center gap-10 max-w-7xl mx-auto">
        {filteredItems.map((item) => (
          <div 
            key={item.id} 
            className="group flex flex-col w-full sm:w-[calc(50%-1.25rem)] lg:w-[calc(33.333%-1.7rem)] max-w-sm cursor-pointer relative"
            onClick={() => handleCardClick(item)}
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-sm group-hover:shadow-2xl transition-all duration-500 bg-gray-100">
              {isConceptProject(item) && (
                <span 
                  aria-label="Progetto dimostrativo, non cliente reale"
                  className="absolute top-3 right-3 z-10 bg-black/60 backdrop-blur-sm text-white text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-sm"
                >
                  Progetto Concept
                </span>
              )}
              {item.image_url ? (
                <img 
                  src={item.image_url} 
                  alt={getAltText(item)} 
                  referrerPolicy="no-referrer"
                  className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${item.category === 'Web' ? 'object-top' : 'object-center'}`}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://placehold.co/800x600?text=Immagine+Non+Disponibile';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">
                  <ImageIcon size={48} />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-brandDark/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                <span className="text-white font-bold text-sm uppercase tracking-widest transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  {item.category?.replace(/flayer/i, 'Flyer')}
                </span>
              </div>
            </div>
            <div className="mt-6 px-2">
              <div className="flex items-center gap-2">
                <h3 className="text-2xl font-bold text-gray-900 group-hover:text-primary transition-colors duration-300">
                  {item.title}
                </h3>
              </div>
              <p className="mt-2 text-gray-600 text-sm leading-relaxed line-clamp-2 italic">
                {getProjectModalDescription(item) || getCleanDescription(item.description)}
              </p>
            </div>
          </div>
        ))}
        
        {filteredItems.length === 0 && (
          <div className="w-full text-center py-32">
            <div className="mb-4 inline-block p-6 bg-gray-100 rounded-full text-gray-400">
                <ImageIcon size={48} />
            </div>
            <p className="text-gray-400 text-xl italic">Nessun progetto trovato in questa categoria.</p>
          </div>
        )}
      </div>

      {hasHiddenItems && (
        <div className="mt-20 text-center">
          {!showAll ? (
            <button 
              onClick={() => setShowAll(true)}
              className="group inline-flex items-center gap-3 px-10 py-4 bg-white border-2 border-primary text-primary rounded-full font-bold hover:bg-primary hover:text-white transition-all duration-300 shadow-md hover:shadow-xl"
            >
              <span>Mostra altro</span>
              <ChevronDown size={20} className="group-hover:translate-y-1 transition-transform" />
            </button>
          ) : (
            <button 
              onClick={() => setShowAll(false)}
              className="group inline-flex items-center gap-3 px-10 py-4 bg-white border-2 border-primary text-primary rounded-full font-bold hover:bg-primary hover:text-white transition-all duration-300 shadow-md hover:shadow-xl"
            >
              <span>Mostra meno</span>
              <ChevronUp size={20} className="group-hover:-translate-y-1 transition-transform" />
            </button>
          )}
        </div>
      )}

      {selectedItem && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/95 backdrop-blur-md animate-in fade-in duration-300"
          onClick={() => setSelectedItem(null)}
        >
          <button 
            className="absolute top-4 right-4 md:top-8 md:right-8 text-primary hover:text-secondary hover:scale-105 transition-all p-2 z-[110] cursor-pointer"
            onClick={(e) => { e.stopPropagation(); setSelectedItem(null); }}
            aria-label="Chiudi dettaglio progetto"
          >
            <X size={36} />
          </button>
          
          <div 
            className="max-w-6xl w-full h-full max-h-full flex flex-col items-center animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-[2rem] overflow-hidden shadow-2xl w-full h-full flex flex-col">
              <div className="flex-grow flex items-center justify-center bg-gray-50 overflow-hidden p-4 md:p-6 min-h-0">
                <img 
                  src={selectedItem.image_url} 
                  alt={getAltText(selectedItem)} 
                  referrerPolicy="no-referrer"
                  className="max-w-full max-h-full w-auto h-auto object-contain mx-auto transition-all"
                  onError={(e) => { (e.target as any).src = 'https://placehold.co/1200x800?text=Errore+Caricamento' }}
                />
              </div>
              <div className="p-6 md:p-8 bg-white border-t border-gray-100 flex-shrink-0">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <span className="text-xs font-black text-primary uppercase tracking-widest">{selectedItem.category?.replace(/flayer/i, 'Flyer')}</span>
                  {isConceptProject(selectedItem) && (
                    <span 
                      aria-label="Progetto dimostrativo, non cliente reale"
                      className="bg-black/60 backdrop-blur-sm text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full shadow-sm"
                    >
                      Progetto Concept
                    </span>
                  )}
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900">{selectedItem.title}</h3>
                {(getProjectModalDescription(selectedItem) || selectedItem.description) && (
                  <p className="mt-2 md:mt-4 text-gray-600 leading-relaxed text-sm md:text-base">
                    {getProjectModalDescription(selectedItem) || getCleanDescription(selectedItem.description)}
                  </p>
                )}
                {(selectedItem.site_url || getSiteUrlFromDescription(selectedItem.description || '')) && (
                  <div className="mt-4 pt-1">
                    <a
                      href={selectedItem.site_url || getSiteUrlFromDescription(selectedItem.description || '')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-secondary underline"
                    >
                      Visita il sito web &rarr;
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioGrid;