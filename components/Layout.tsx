import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Instagram, Lock, ArrowUp } from 'lucide-react';

const Layout: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [showScrollTop, setShowScrollTop] = React.useState(false);
  const [privacyOpen, setPrivacyOpen] = React.useState(false);
  const [cookieOpen, setCookieOpen] = React.useState(false);
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

  const navLinks: { name: string; targetId?: string; path?: string }[] = [
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

  // URL ottimizzato per Google Drive (Thumbnail bypassa meglio i blocchi CORS)
  const logoId = "14Ps4nKRx1wOah9gZHFo4O3Ynq4qpWpKU";
  const logoUrl = `https://drive.google.com/thumbnail?id=${logoId}&sz=w500`;

  if (isDashboard) return <Outlet />;

  return (
    <div className="flex flex-col min-h-screen">
      <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="flex items-center space-x-3 group cursor-pointer">
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
            </Link>

            <div className="hidden md:flex space-x-8 items-center">
              {navLinks.map((link) => {
                if (link.path) {
                  return (
                    <Link
                      key={link.name}
                      to={link.path}
                      className={`${
                        location.pathname === link.path
                          ? 'text-primary font-bold'
                          : 'text-slate-600 hover:text-primary'
                      } transition-colors font-semibold`}
                    >
                      {link.name}
                    </Link>
                  );
                }
                return (
                  <a 
                    key={link.name} 
                    href={`#${link.targetId}`}
                    onClick={(e) => handleNavClick(e, link.targetId || '')}
                    className="text-slate-600 hover:text-primary transition-colors font-semibold"
                  >
                    {link.name}
                  </a>
                );
              })}
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
            {navLinks.map((link) => {
              if (link.path) {
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block font-bold text-xl ${
                      location.pathname === link.path
                        ? 'text-primary'
                        : 'text-slate-800 hover:text-primary'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              }
              return (
                <a 
                  key={link.name} 
                  href={`#${link.targetId}`}
                  onClick={(e) => handleNavClick(e, link.targetId || '')}
                  className="block text-slate-800 font-bold text-xl hover:text-primary"
                >
                  {link.name}
                </a>
              );
            })}
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
              <p className="mb-3">DESIGN & INNOVATION</p>
              <div className="flex justify-center md:justify-start space-x-3 text-[10px] text-gray-500 font-semibold">
                <button 
                  type="button"
                  onClick={() => setPrivacyOpen(true)}
                  className="hover:text-primary transition-colors uppercase tracking-wider cursor-pointer"
                >
                  Privacy Policy
                </button>
                <span className="text-gray-700">|</span>
                <button 
                  type="button"
                  onClick={() => setCookieOpen(true)}
                  className="hover:text-primary transition-colors uppercase tracking-wider cursor-pointer"
                >
                  Cookie Policy
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Privacy Policy Modal */}
      {privacyOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white text-gray-900 rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col p-6 md:p-8 shadow-2xl relative border border-gray-100 animate-in zoom-in-95 duration-200">
            <button 
              type="button"
              onClick={() => setPrivacyOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100"
              aria-label="Chiudi"
            >
              <X size={20} />
            </button>
            
            <div className="overflow-y-auto pr-2 space-y-4 text-sm text-gray-600 leading-relaxed text-left flex-grow">
              <h3 className="text-xl font-bold text-gray-900 mb-4 border-b pb-4">Informativa Privacy (art. 13 GDPR)</h3>
              <p>
                Benvenuto sul sito di <strong>Francesca Mutolo</strong> (francescamutolo.it). La protezione e la sicurezza dei tuoi dati personali sono per me una priorità. Di seguito sono descritte le modalità di gestione dei dati per i visitatori del mio sito.
              </p>
              <h4 className="font-bold text-gray-800 mt-4">1. Titolare del Trattamento</h4>
              <p>
                Il Titolare del trattamento è <strong>Francesca Mutolo</strong>, contattabile all'indirizzo e-mail: <a href="mailto:mutolo.gdesigner@gmail.com" className="text-primary hover:underline font-semibold">mutolo.gdesigner@gmail.com</a>.
              </p>
              <h4 className="font-bold text-gray-800 mt-4">2. Tipologia di Dati Raccolti</h4>
              <p>
                Attraverso il sito possono essere raccolti:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Dati forniti volontariamente dall'utente tramite i moduli di contatto (Contatto Rapido, Brief di Progetto, Questionario): Nome, E-mail, Telefono, risposte alle domande del questionario e altre informazioni sul progetto.</li>
                <li>Dati di navigazione raccolti in modalità anonima e aggregata al solo scopo di monitorare le prestazioni del sito.</li>
              </ul>
              <h4 className="font-bold text-gray-800 mt-4">3. Finalità del Trattamento</h4>
              <p>
                I dati raccolti sono trattati per:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Rispondere alle richieste inviate tramite i moduli di contatto o brief.</li>
                <li>Analizzare l'efficacia del servizio tramite questionari di valutazione compilati volontariamente dall'utente.</li>
                <li>Garantire il corretto funzionamento tecnico e la sicurezza del sito web.</li>
              </ul>
              <h4 className="font-bold text-gray-800 mt-4">4. Base Giuridica del Trattamento</h4>
              <p>
                Il trattamento si basa sul consenso esplicito dell'utente (espresso tramite l'invio volontario dei moduli) e sull'esecuzione di misure precontrattuali o contrattuali adottate su richiesta dell'interessato.
              </p>
              <h4 className="font-bold text-gray-800 mt-4">5. Conservazione dei Dati</h4>
              <p>
                I dati saranno conservati esclusivamente per il tempo necessario a dare riscontro alle richieste dell'interessato o per adempiere a obblighi normativi.
              </p>
              <h4 className="font-bold text-gray-800 mt-4">6. Diritti dell'Interessato</h4>
              <p>
                In conformità al GDPR, l'utente ha il diritto di chiedere al Titolare l'accesso ai propri dati personali, la rettifica, la cancellazione (oblio), la limitazione del trattamento o di opporsi al trattamento stesso. Per esercitare tali diritti, è possibile inviare un'e-mail a <a href="mailto:mutolo.gdesigner@gmail.com" className="text-primary hover:underline font-semibold">mutolo.gdesigner@gmail.com</a>.
              </p>
            </div>
            
            <div className="mt-6 border-t pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setPrivacyOpen(false)}
                className="bg-gradient-brand text-white font-bold py-2 px-6 rounded-xl hover:shadow-lg transition-all"
              >
                Chiudi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cookie Policy Modal */}
      {cookieOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white text-gray-900 rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col p-6 md:p-8 shadow-2xl relative border border-gray-100 animate-in zoom-in-95 duration-200">
            <button 
              type="button"
              onClick={() => setCookieOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100"
              aria-label="Chiudi"
            >
              <X size={20} />
            </button>
            
            <div className="overflow-y-auto pr-2 space-y-4 text-sm text-gray-600 leading-relaxed text-left flex-grow">
              <h3 className="text-xl font-bold text-gray-900 mb-4 border-b pb-4">Informativa Cookie (Cookie Policy)</h3>
              <p>
                Questa Cookie Policy spiega cosa sono i cookie, come vengono utilizzati su questo sito web (francescamutolo.it) e come puoi gestirli in conformità alla normativa italiana ed europea.
              </p>
              <h4 className="font-bold text-gray-800 mt-4">1. Cosa sono i Cookie?</h4>
              <p>
                I cookie sono piccoli file di testo che i siti visitati dagli utenti inviano ai loro terminali, dove vengono memorizzati per essere trasmessi nuovamente ai medesimi siti in occasione di visite successive.
              </p>
              <h4 className="font-bold text-gray-800 mt-4">2. Tipologie di Cookie utilizzate</h4>
              <p>
                Questo sito utilizza esclusivamente le seguenti tipologie di cookie:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Cookie Tecnici:</strong> Necessari per il corretto funzionamento del sito, la navigazione e l'erogazione dei servizi richiesti dall'utente.</li>
                <li><strong>Cookie Analitici (Google Analytics):</strong> Utilizzati per raccogliere informazioni in forma anonima e statistica sull'utilizzo del sito da parte degli utenti (es. pagine visitate, tempo trascorso). L'indirizzo IP viene anonimizzato per escludere qualsiasi forma di profilazione o tracciamento dell'identità.</li>
              </ul>
              <h4 className="font-bold text-gray-800 mt-4">3. Cookie di Terze Parti</h4>
              <p>
                Durante la navigazione, il sito potrebbe interagire con servizi esterni forniti da terze parti (come Google per i font o per l'incorporazione di immagini/mappe e Instagram). Ciascun servizio di terza parte applica le proprie politiche sulla privacy e sui cookie.
              </p>
              <h4 className="font-bold text-gray-800 mt-4">4. Come disabilitare i Cookie dal Browser</h4>
              <p>
                Puoi controllare, bloccare o eliminare i cookie in qualsiasi momento modificando le impostazioni del tuo browser internet. Di seguito i link alle istruzioni dei principali browser:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">Google Chrome</a></li>
                <li><a href="https://support.mozilla.org/it/kb/Attivare%20e%20disattivare%20i%20cookie" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">Mozilla Firefox</a></li>
                <li><a href="https://support.apple.com/it-it/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">Apple Safari</a></li>
                <li><a href="https://support.microsoft.com/it-it/windows/gestire-i-cookie-in-microsoft-edge-60451397-235a-478a-7451-aa311a2a09c2" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">Microsoft Edge</a></li>
              </ul>
              <p className="mt-4 text-xs text-gray-500">
                La disabilitazione dei cookie tecnici potrebbe compromettere la corretta visualizzazione di alcune sezioni o funzionalità del sito.
              </p>
            </div>
            
            <div className="mt-6 border-t pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setCookieOpen(false)}
                className="bg-gradient-brand text-white font-bold py-2 px-6 rounded-xl hover:shadow-lg transition-all"
              >
                Chiudi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;