import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { PortfolioItem } from '../types';
import { Image as ImageIcon, X, Star, ChevronDown, ChevronUp } from 'lucide-react';

const PortfolioGrid: React.FC = () => {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('Tutti');
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [showAll, setShowAll] = useState(false);

  const categories = ['Tutti', 'Branding', 'Flyer & Poster', 'Social Media'];

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
      <div className="flex flex-col justify-center items-center h-64 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-gray-400 font-medium animate-pulse">Caricamento progetti...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-4 mb-16">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setActiveCategory(cat);
              setShowAll(false);
            }}
            className={`px-8 py-3 rounded-full transition-all font-bold text-sm tracking-wide ${
              activeCategory === cat 
                ? 'bg-gradient-brand text-white shadow-lg shadow-primary/20 scale-105' 
                : 'bg-white text-gray-500 hover:bg-gray-100 shadow-sm'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap justify-center gap-10 max-w-7xl mx-auto">
        {filteredItems.map((item) => (
          <div 
            key={item.id} 
            className="group flex flex-col w-full sm:w-[calc(50%-1.25rem)] lg:w-[calc(33.333%-1.7rem)] max-w-sm cursor-pointer relative"
            onClick={() => setSelectedItem(item)}
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-sm group-hover:shadow-2xl transition-all duration-500 bg-gray-100">
              {item.image_url ? (
                <img 
                  src={item.image_url} 
                  alt={item.title} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
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
                {item.is_featured && <Star size={14} className="fill-primary text-primary" />}
              </div>
              <p className="mt-2 text-gray-600 text-sm leading-relaxed line-clamp-2 italic">{item.description}</p>
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
            className="absolute top-4 right-4 md:top-8 md:right-8 text-white hover:text-primary transition-colors p-2 z-[110]"
            onClick={(e) => { e.stopPropagation(); setSelectedItem(null); }}
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
                  alt={selectedItem.title} 
                  referrerPolicy="no-referrer"
                  className="max-w-full max-h-full w-auto h-auto object-contain mx-auto transition-all"
                  onError={(e) => { (e.target as any).src = 'https://placehold.co/1200x800?text=Errore+Caricamento' }}
                />
              </div>
              <div className="p-6 md:p-8 bg-white border-t border-gray-100 flex-shrink-0">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-black text-primary uppercase tracking-widest">{selectedItem.category?.replace(/flayer/i, 'Flyer')}</span>
                  {selectedItem.is_featured && <Star size={14} className="fill-primary text-primary" />}
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{selectedItem.title}</h2>
                {selectedItem.description && (
                  <p className="mt-2 md:mt-4 text-gray-600 leading-relaxed italic text-sm md:text-base line-clamp-2 md:line-clamp-none">
                    {selectedItem.description}
                  </p>
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