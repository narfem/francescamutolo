import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Instagram, Lock, ArrowUp } from 'lucide-react';

const Layout: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [showScrollTop, setShowScrollTop] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isDashboard = location.pathname.startsWith('/dashboard');

  React.useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Portfolio', targetId: 'portfolio' },
    { name: 'Contatti', targetId: 'contact' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    setIsMenuOpen(false);

    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // URL standard per Google Drive con bypass referrer
  const logoUrl = "https://drive.google.com/uc?export=view&id=1-1MNPNU_LjsOB1ETjNMKk0R8OgUANR3b";

  if (isDashboard) return <Outlet />;

  return (
    <div className="flex flex-col min-h-screen">
      <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-3 group">
              <div className="relative">
                <img 
                  src={logoUrl} 
                  alt="Francesca Mutolo Logo" 
                  referrerPolicy="no-referrer"
                  className="h-10 w-10 object-cover rounded-full border-2 border-primary shadow-sm transition-transform group-hover:scale-105"
                />
                <div className="absolute -inset-1 bg-gradient-brand rounded-full -z-10 opacity-20 blur-sm group-hover:opacity-40 transition-opacity"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold leading-tight text-gradient-brand">
                  Francesca Mutolo
                </span>
                <span className="text-[10px] font-extrabold text-secondary uppercase tracking-[0.15em] leading-none mt-1">
                  Graphic & AI Product Designer
                </span>
              </div>
            </div>

            <div className="hidden md:flex space-x-8 items-center">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={`#${link.targetId}`}
                  onClick={(e) => handleNavClick(e, link.targetId)}
                  className="text-slate-600 hover:text-primary transition-colors font-semibold"
                >
                  {link.name}
                </a>
              ))}
              <Link 
                to="/login" 
                aria-label="Area Riservata"
                className="bg-gradient-brand text-white p-2 rounded-full font-bold hover:shadow-lg hover:shadow-primary/20 transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center"
              >
                <Lock size={18} />
              </Link>
            </div>

            <div className="md:hidden flex items-center">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-900 p-2">
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-100 py-8 px-4 space-y-6 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={`#${link.targetId}`}
                onClick={(e) => handleNavClick(e, link.targetId)}
                className="block text-slate-800 font-bold text-xl hover:text-primary"
              >
                {link.name}
              </a>
            ))}
            <Link 
              to="/login" 
              aria-label="Area Riservata"
              className="flex bg-gradient-brand text-white items-center justify-center p-4 rounded-2xl font-bold text-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              <Lock size={24} />
            </Link>
          </div>
        )}
      </nav>

      <main className="flex-grow pt-16">
        <Outlet />
      </main>

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-4 bg-gradient-brand text-white rounded-full shadow-2xl z-50 hover:-translate-y-2 transition-all active:translate-y-0"
          aria-label="Torna all'inizio"
        >
          <ArrowUp size={24} />
        </button>
      )}

      <footer className="bg-brandDark text-white py-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center text-center md:text-left">
            <div>
              <div className="flex items-center justify-center md:justify-start space-x-3 md:space-x-4">
                <div className="relative flex-shrink-0">
                  <img 
                    src={logoUrl} 
                    alt="Logo White" 
                    referrerPolicy="no-referrer"
                    className="h-10 w-10 md:h-12 md:w-12 object-cover rounded-full border border-white/20 shadow-sm transition-transform" 
                  />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-lg md:text-xl font-bold leading-tight text-gradient-brand">
                    Francesca Mutolo
                  </span>
                  <span className="text-[10px] md:text-[11px] font-extrabold text-secondary uppercase tracking-[0.15em] leading-none mt-1 whitespace-nowrap">
                    Graphic & AI Product Designer
                  </span>
                </div>
              </div>
            </div>
            <div className="flex justify-center items-center">
              <a 
                href="https://www.instagram.com/francescamutolographicdesigner/" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary transition-all hover:scale-125"
              >
                <Instagram size={28} />
              </a>
            </div>
            <div className="text-gray-500 text-xs tracking-widest leading-relaxed">
              <p className="mb-1 font-bold">© {new Date().getFullYear()} FRANCESCA MUTOLO</p>
              <p>DESIGN & INNOVATION</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;