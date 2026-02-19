import React, { useState } from 'react';
import { ArrowDown, FileText, Sparkles } from 'lucide-react';
import AIChatModal from './AIChatModal';

const Hero: React.FC = () => {
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  
  // URL standard per Google Drive
  const imageUrl = "https://drive.google.com/uc?export=view&id=14TXBzLOzcZvIt-O2Q5LDHmSfQvX7Jixx";
  
  const cvDownloadUrl = "https://drive.google.com/uc?export=download&id=16eFV00cfPNk2UAtfNX8QZk8MLTwvTVAs";

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-[80vh] pt-6 lg:pt-10 pb-20 flex items-start bg-white overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#F39637]/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#C13C8D]/5 rounded-full blur-[100px] translate-y-1/4 -translate-x-1/4"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 w-full">
        <div className="relative">
          
          <div className="float-right ml-4 mb-4 md:ml-8 md:mb-8 lg:ml-16 lg:mb-12 w-[45%] lg:w-[440px] group relative"
               style={{ 
                 shapeOutside: 'inset(0 round 2.5rem)', 
                 shapeMargin: '1.5rem' 
               }}>
            <div className="relative z-10 aspect-[4/5] overflow-hidden rounded-2xl md:rounded-[2.5rem] shadow-2xl border-2 md:border-4 border-white bg-slate-100">
              <img 
                src={imageUrl} 
                alt="Francesca Mutolo Professional Portrait" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-20"></div>
            </div>
            
            <div className="absolute -top-8 -right-8 w-24 h-24 bg-[#C13C8D]/10 rounded-full -z-0 blur-2xl"></div>
            <div className="absolute -bottom-8 -left-8 w-28 h-28 bg-[#F39637]/10 rounded-full -z-0 blur-2xl"></div>
          </div>

          <div className="mb-8 md:mb-12">
            <h1 className="text-3xl md:text-5xl lg:text-7xl xl:text-8xl font-bold leading-[1.1] text-slate-900 tracking-tight mb-4 md:mb-8">
              Esperienza, <br />
              <span className="brand-orange italic text-[#F39637]">Creatività</span> <br />
              & <span className="relative inline-block">
                Strategia.
                <span className="absolute bottom-1 md:bottom-2 left-0 w-full h-2 md:h-3 bg-[#C13C8D]/10 -z-10"></span>
              </span>
            </h1>
          </div>

          <div className="text-slate-600 space-y-4 md:space-y-8">
            <p className="text-lg md:text-xl lg:text-3xl font-medium leading-tight text-slate-800">
              Mi chiamo Francesca, classe 1986. <br />
              Sono sarda, per nascita e per scelta. <br />
              Unisco la solida base della comunicazione visiva alle infinite potenzialità dell'<strong>Intelligenza Artificiale</strong>.
            </p>
            
            <p className="text-base md:text-lg lg:text-xl leading-relaxed">
              Il mio percorso è iniziato con la curiosità di chi vuole capire come le immagini influenzano le emozioni, evolvendo poi in una ricerca costante tra estetica classica e tecnologia d'avanguardia. Credo fermamente che il design non debba solo essere "bello", ma debba assolvere a una funzione precisa.
            </p>

            <div className="font-medium text-base md:text-lg lg:text-2xl text-slate-900 border-l-4 border-[#F39637] pl-4 md:pl-8 py-2 italic bg-slate-50/30 rounded-r-xl">
              Aiuto professionisti e aziende a raccontarsi con autenticità, eleganza e quel pizzico di innovazione che fa la differenza.
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 pt-6 md:pt-10">
              <a 
                href="#contact" 
                onClick={(e) => scrollToSection(e, 'contact')}
                className="group px-6 md:px-10 py-3 md:py-5 bg-gradient-brand text-white rounded-full font-bold transition-all hover:shadow-lg hover:shadow-primary/30 flex items-center space-x-3 text-sm md:text-base"
              >
                <span>Collaboriamo</span>
              </a>
              <a 
                href="#portfolio" 
                onClick={(e) => scrollToSection(e, 'portfolio')}
                className="group px-6 md:px-10 py-3 md:py-5 bg-white text-slate-900 border border-slate-200 rounded-full font-bold hover:border-[#F39637] transition-all flex items-center space-x-3 text-sm md:text-base"
              >
                <span>Guarda i lavori</span>
                <ArrowDown size={18} className="group-hover:translate-y-1 transition-transform text-[#F39637]" />
              </a>
              <a 
                href={cvDownloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group px-6 md:px-10 py-3 md:py-5 bg-white text-slate-900 border border-slate-200 rounded-full font-bold hover:border-primary transition-all flex items-center space-x-3 text-sm md:text-base"
              >
                <span>Il mio CV</span>
                <FileText size={18} className="text-primary group-hover:scale-110 transition-transform" />
              </a>
              
              <button 
                onClick={() => setIsAIChatOpen(true)}
                className="group px-6 md:px-10 py-3 md:py-5 bg-slate-900 text-white rounded-full font-bold hover:bg-black transition-all flex items-center space-x-3 text-sm md:text-base shadow-xl hover:shadow-primary/20"
              >
                <Sparkles size={18} className="text-secondary animate-pulse" />
                <span>Chiedi alla mia AI personale</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {isAIChatOpen && <AIChatModal onClose={() => setIsAIChatOpen(false)} />}
    </section>
  );
};

export default Hero;