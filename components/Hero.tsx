import React from 'react';
import { ArrowDown } from 'lucide-react';

const Hero: React.FC = () => {
  // URL ottimizzato per Google Drive (Thumbnail bypassa meglio i blocchi CORS e Referrer)
  const imageId = "1NkHD9_y1_YPJjlNIuzIuNR93Iw0GnbD0";
  const imageUrl = `https://drive.google.com/thumbnail?id=${imageId}&sz=w1200`;

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-[85vh] md:min-h-[680px] pt-6 lg:pt-10 pb-20 flex items-start bg-white overflow-hidden clear-both">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#F39637]/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#C13C8D]/5 rounded-full blur-[100px] translate-y-1/4 -translate-x-1/4 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 w-full">
        <div className="relative">
          
          <div className="float-right ml-3 mb-2 md:ml-8 md:mb-8 lg:ml-16 lg:mb-12 w-[35%] sm:w-[45%] lg:w-[440px] group relative"
               style={{ 
                 shapeOutside: 'inset(0 round 2.5rem)', 
                 shapeMargin: '1.25rem' 
               }}>
            <div className="relative z-10 aspect-[4/5] overflow-hidden rounded-xl md:rounded-[2.5rem] shadow-2xl border md:border-4 border-white bg-slate-100">
              <img 
                src={imageUrl} 
                alt="Francesca Mutolo, brand designer" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-20"></div>
            </div>
            
            <div className="absolute -top-8 -right-8 w-24 h-24 bg-[#C13C8D]/10 rounded-full -z-0 blur-2xl"></div>
            <div className="absolute -bottom-8 -left-8 w-28 h-28 bg-[#F39637]/10 rounded-full -z-0 blur-2xl"></div>
          </div>

          <div className="mb-4 md:mb-12">
            <h1 className="text-[1.35rem] sm:text-3xl md:text-5xl lg:text-7xl xl:text-8xl font-bold leading-[1.15] text-slate-900 tracking-tight mb-2 md:mb-8">
              Grafica <br />
              e brand identity <br />
              in <span className="brand-orange italic text-[#F39637]">Sardegna,</span> <br />
              con base a{" "}
              <span className="relative inline-block">
                Cagliari.
                <span className="absolute bottom-1 md:bottom-2 left-0 w-full h-2 md:h-3 bg-[#C13C8D]/10 -z-10"></span>
              </span>
            </h1>
          </div>

          <div className="text-slate-600 space-y-3 md:space-y-8">
            <p className="text-sm sm:text-lg md:text-xl lg:text-3xl font-medium leading-normal sm:leading-tight text-slate-800">
              Sono Francesca, aiuto professionisti e attività della Sardegna (da Cagliari a tutta l'isola) a costruire il proprio brand: grafica, identità visiva, siti web.
            </p>

            <div className="font-medium text-xs sm:text-base md:text-lg lg:text-2xl text-slate-900 border-l-2 sm:border-l-4 border-[#F39637] pl-3 md:pl-8 py-1 md:py-2 italic bg-slate-50/30 rounded-r-xl">
              Dopo anni ad ascoltare davvero le persone nel mondo della vendita, oggi uso la stessa attenzione per raccontare il tuo brand, con la velocità in più che mi dà l'intelligenza artificiale.
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
            </div>
          </div>
          <div className="clear-both"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;