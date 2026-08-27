import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  Search, 
  UserCheck, 
  FileText, 
  HelpCircle, 
  MapPin, 
  Send, 
  CheckCircle, 
  Globe, 
  HeartHandshake, 
  Layers, 
  ArrowRight,
  MessageCircle,
  Compass,
  Laptop,
  Check,
  Palette
} from 'lucide-react';
import { SEO } from '../components/SEO';
import { PrivacyConsentCheckbox } from '../components/PrivacyConsentCheckbox';

const PsychologistsLanding: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    serviceInterest: 'Sito web professionale per psicologi',
    message: ''
  });
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [privacyError, setPrivacyError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!privacyConsent) {
      setPrivacyError(true);
      return;
    }

    setLoading(true);
    try {
      const formattedMessage = `[Richiesta da Landing Psicologi]\nInteresse principale: ${formData.serviceInterest}\nTelefono: ${formData.phone || 'Non indicato'}\n\nMessaggio:\n${formData.message}`;

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formattedMessage,
          source_page: window.location.href,
          timestamp: new Date().toISOString()
        })
      });

      const data = await response.json();
      setLoading(false);

      if (data.success) {
        setSubmitted(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          serviceInterest: 'Sito web professionale per psicologi',
          message: ''
        });
        setPrivacyConsent(false);
        setPrivacyError(false);
      } else {
        alert(data.error || "Si è verificato un errore durante l'invio del messaggio. Riprova tra poco.");
      }
    } catch {
      setLoading(false);
      alert("Impossibile connettersi al server. Puoi scrivermi direttamente via WhatsApp o email.");
    }
  };

  const scrollToContact = (e: React.MouseEvent) => {
    e.preventDefault();
    const contactEl = document.getElementById('contact-form-section');
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Schema.org per la landing page psicologi
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Sito Web per Psicologi e Psicoterapeuti | Francesca Mutolo",
    "description": "Progettazione di siti web professionali e identità visiva per psicologi e psicoterapeuti. Spazio proprietario, chiaro, accogliente e rispettoso del codice deontologico.",
    "url": "https://www.francescamutolo.it/psicologi",
    "inLanguage": "it-IT",
    "isPartOf": {
      "@type": "WebSite",
      "name": "Francesca Mutolo | Brand Designer",
      "url": "https://www.francescamutolo.it/"
    },
    "about": [
      {
        "@type": "Service",
        "name": "Progettazione Siti Web per Psicologi e Psicoterapeuti",
        "provider": {
          "@type": "Person",
          "name": "Francesca Mutolo",
          "jobTitle": "Brand Designer",
          "url": "https://www.francescamutolo.it/"
        }
      }
    ]
  };

  return (
    <div className="bg-white text-gray-900 selection:bg-primary/20 selection:text-primary">
      <SEO
        title="Sito Web per Psicologi e Psicoterapeuti | Francesca Mutolo"
        description="Creazione siti web professionali e brand identity per psicologi e psicoterapeuti. Uno spazio proprietario chiaro, accogliente e progettato per costruire fiducia."
        canonical="https://www.francescamutolo.it/psicologi"
        schemaData={schemaData}
      />

      {/* 1. HERO SECTION */}
      <section className="relative pt-10 pb-16 md:pt-16 md:pb-24 overflow-hidden bg-gradient-to-b from-gray-50/90 via-white to-gray-50/40 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left: Copy & CTAs */}
            <div className="lg:col-span-7 text-left space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-wide uppercase">
                <Compass size={14} className="text-secondary" />
                <span>Brand Identity & Siti Web per Psicologi</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-[1.15]">
                Il tuo spazio professionale online: <br />
                <span className="text-gradient-brand">chiaro, accogliente</span> e fedele al tuo approccio.
              </h1>

              <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-xl">
                Uno spazio proprietario dove spiegare come lavori, farti trovare su Google e accogliere i pazienti con discrezione e autorevolezza.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <a
                  href="#contact-form-section"
                  onClick={scrollToContact}
                  className="inline-flex items-center justify-center px-7 py-3.5 text-sm font-bold text-white bg-gradient-brand rounded-2xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all cursor-pointer text-center"
                >
                  <span>Parliamo del tuo Progetto</span>
                  <ArrowRight size={16} className="ml-2" />
                </a>
                <a
                  href="https://wa.me/393278850689?text=Ciao%20Francesca,%20sono%20uno%20psicologo/psicoterapeuta%20e%20vorrei%20informazioni%20per%20un%20sito%20web."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-5 py-3.5 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 hover:text-gray-900 transition-colors text-center"
                >
                  <MessageCircle size={16} className="mr-2 text-emerald-600" />
                  <span>Scrivimi su WhatsApp</span>
                </a>
              </div>

              {/* Quick Feature Pill Badges */}
              <div className="flex flex-wrap gap-4 pt-4 text-xs font-semibold text-gray-600">
                <div className="flex items-center gap-1.5">
                  <Check size={15} className="text-primary" />
                  <span>Spazio 100% Proprietario</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check size={15} className="text-secondary" />
                  <span>Accoglienza & Riservatezza</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check size={15} className="text-primary" />
                  <span>Rispetto Deontologico</span>
                </div>
              </div>
            </div>

            {/* Right: Studio Atmosphere Image */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none rounded-3xl overflow-hidden shadow-2xl border border-gray-200/80 bg-gray-100">
                <img
                  src="https://images.unsplash.com/photo-1590650516494-0c8e4a4dd67e?auto=format&fit=crop&w=900&q=80"
                  alt="Studio di psicoterapia accogliente e riservato con poltrone per il colloquio clinico"
                  className="w-full h-80 sm:h-96 object-cover"
                  loading="eager"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/70 via-transparent to-transparent" />
                
                {/* Floating caption card */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-white/95 backdrop-blur-sm border border-white/40 shadow-lg text-left">
                  <p className="text-xs font-extrabold text-gray-900">
                    La relazione terapeutica inizia prima del primo colloquio
                  </p>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Un'atmosfera digitale curata trasmette fiducia e serenità a chi sta cercando aiuto.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. IL VALORE DEL SITO: 4 Card Sintetiche */}
      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Perché un sito proprietario fa la differenza
            </h2>
            <p className="mt-2.5 text-sm sm:text-base text-gray-600">
              Directory e social sono utili, ma un sito personale è il centro stabile della tua presenza clinica.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <div className="p-6 rounded-3xl bg-gray-50/80 border border-gray-200/70 hover:border-primary/40 hover:shadow-md transition-all">
              <div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-5">
                <Shield size={22} />
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-2">
                Autorevolezza & Albo
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Presenti la tua iscrizione all'Albo, formazione ed esperienza in uno spazio limpido e senza distrazioni.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-6 rounded-3xl bg-gray-50/80 border border-gray-200/70 hover:border-secondary/40 hover:shadow-md transition-all">
              <div className="w-11 h-11 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center mb-5">
                <HeartHandshake size={22} />
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-2">
                Accoglienza & Calma
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Un'estetica rilassante studiata per far sentire compreso chi sta vivendo un momento di vulnerabilità.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-6 rounded-3xl bg-gray-50/80 border border-gray-200/70 hover:border-primary/40 hover:shadow-md transition-all">
              <div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-5">
                <Layers size={22} />
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-2">
                Filtro Naturale
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Specificando chiaramente aree di intervento e approccio, ricevi contatti allineati al tuo lavoro.
              </p>
            </div>

            {/* Card 4 */}
            <div className="p-6 rounded-3xl bg-gray-50/80 border border-gray-200/70 hover:border-secondary/40 hover:shadow-md transition-all">
              <div className="w-11 h-11 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center mb-5">
                <Globe size={22} />
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-2">
                Indipendenza Totale
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Uno spazio tuo per sempre, svincolato da cambi di algoritmi o abbonamenti a piattaforme terze.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ESSERE TROVATI E CONOSCIUTI (Google & Presenza) */}
      <section className="py-14 md:py-20 bg-gray-50/70 border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Visual element / Image */}
            <div className="lg:col-span-5 order-2 lg:order-1">
              <div className="relative rounded-3xl overflow-hidden shadow-xl border border-gray-200 bg-white">
                <img
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=900&q=80"
                  alt="Psicologa professionista durante la riflessione clinica e l'organizzazione delle sedute nello studio"
                  className="w-full h-72 sm:h-80 object-cover"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="p-5 bg-white text-left">
                  <div className="flex items-center gap-2 text-xs font-bold text-primary mb-1">
                    <Search size={15} />
                    <span>Visibilità Etica su Google</span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Farsi trovare al momento giusto da chi cerca attivamente una figura di supporto.
                  </p>
                </div>
              </div>
            </div>

            {/* Content list */}
            <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                  Fatti trovare con discrezione ed efficacia
                </h2>
                <p className="mt-2 text-sm sm:text-base text-gray-600 leading-relaxed">
                  Essere online non significa fare rumore, ma essere reperibili con chiarezza quando qualcuno cerca aiuto.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-white border border-gray-200/80 flex items-start gap-3.5 shadow-sm">
                  <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0 mt-0.5">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-gray-900">Scheda Google My Business Integrata</h3>
                    <p className="text-xs text-gray-600 mt-0.5">Collega la sede su Google Maps al tuo sito ufficiale per massima fiducia.</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-gray-200/80 flex items-start gap-3.5 shadow-sm">
                  <div className="p-2 rounded-xl bg-secondary/10 text-secondary shrink-0 mt-0.5">
                    <Search size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-gray-900">Ricerche Geografiche e per Tematica</h3>
                    <p className="text-xs text-gray-600 mt-0.5">Fatti trovare da chi cerca uno psicologo nella tua città o per specifici disagi.</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-gray-200/80 flex items-start gap-3.5 shadow-sm">
                  <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0 mt-0.5">
                    <Globe size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-gray-900">Riferimento Stabile per il Passaparola</h3>
                    <p className="text-xs text-gray-600 mt-0.5">Un indirizzo semplice da condividere tra colleghi, medici o conoscenti.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. COSA PUÒ RACCONTARE IL TUO SITO: 6 Card Sintetiche */}
      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Cosa racconterà il tuo sito
            </h2>
            <p className="mt-2 text-sm sm:text-base text-gray-600">
              Moduli chiari e personalizzati, progettati attorno al tuo modo di lavorare.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200/70 flex items-start gap-3.5">
              <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0">
                <UserCheck size={20} />
              </div>
              <div>
                <h3 className="font-bold text-sm text-gray-900 mb-1">Chi Sei & Formazione</h3>
                <p className="text-xs text-gray-600 leading-relaxed">Presentazione del percorso, iscrizione all'Albo e valori guida.</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200/70 flex items-start gap-3.5">
              <div className="p-2 rounded-xl bg-secondary/10 text-secondary shrink-0">
                <Compass size={20} />
              </div>
              <div>
                <h3 className="font-bold text-sm text-gray-900 mb-1">Approccio Terapeutico</h3>
                <p className="text-xs text-gray-600 leading-relaxed">Il tuo modello clinico spiegato in modo semplice e privo di gergo oscuro.</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200/70 flex items-start gap-3.5">
              <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0">
                <FileText size={20} />
              </div>
              <div>
                <h3 className="font-bold text-sm text-gray-900 mb-1">Aree di Intervento</h3>
                <p className="text-xs text-gray-600 leading-relaxed">Ansia, relazioni, autostima, genitorialità o momenti di transizione.</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200/70 flex items-start gap-3.5">
              <div className="p-2 rounded-xl bg-secondary/10 text-secondary shrink-0">
                <Laptop size={20} />
              </div>
              <div>
                <h3 className="font-bold text-sm text-gray-900 mb-1">Studio & Online</h3>
                <p className="text-xs text-gray-600 leading-relaxed">Come si svolgono i colloqui in presenza e le consulenze a distanza.</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200/70 flex items-start gap-3.5">
              <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0">
                <HelpCircle size={20} />
              </div>
              <div>
                <h3 className="font-bold text-sm text-gray-900 mb-1">FAQ & Aspetti Pratici</h3>
                <p className="text-xs text-gray-600 leading-relaxed">Durata, frequenza, tariffe e detraibilità delle spese sanitarie.</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200/70 flex items-start gap-3.5">
              <div className="p-2 rounded-xl bg-secondary/10 text-secondary shrink-0">
                <MapPin size={20} />
              </div>
              <div>
                <h3 className="font-bold text-sm text-gray-900 mb-1">Studio & Contatti</h3>
                <p className="text-xs text-gray-600 leading-relaxed">Mappa della sede, modulo sicuro e contatto diretto WhatsApp.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PERCHÉ LAVORARE CON ME (Francesca Mutolo - Brand Designer) */}
      <section className="py-14 md:py-20 bg-gray-50/70 border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-secondary mb-1.5 block">
              Brand Design Specialist
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Un design su misura per la tua professione
            </h2>
            <p className="mt-2 text-sm sm:text-base text-gray-600">
              Non creo solo un sito web: progetto un'identità visiva che comunica serenità, cura ed etica professionale.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-white border border-gray-200/80 shadow-sm text-left">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                <Palette size={20} />
              </div>
              <h3 className="font-bold text-gray-900 text-sm mb-1.5">Identità Visiva Coerente</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Colori rassicuranti e tipografia ad alta leggibilità, studiati per trasmettere calma e accoglienza.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-gray-200/80 shadow-sm text-left">
              <div className="w-10 h-10 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center mb-4">
                <Layers size={20} />
              </div>
              <h3 className="font-bold text-gray-900 text-sm mb-1.5">Chiarezza & Fluidità</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Percorso di lettura lineare e intuitivo da qualsiasi dispositivo mobile o computer.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-gray-200/80 shadow-sm text-left">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                <Shield size={20} />
              </div>
              <h3 className="font-bold text-gray-900 text-sm mb-1.5">Rispetto Deontologico</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Nessun marketing aggressivo: solo comunicazione etica, trasparente e conforme alle linee guida.
              </p>
            </div>
          </div>

          <div className="mt-10 text-center flex flex-wrap justify-center items-center gap-4 text-xs font-bold">
            <Link 
              to="/portfolio/web" 
              className="text-primary hover:text-secondary underline"
            >
              Guarda i progetti Web &rarr;
            </Link>
            <span className="text-gray-300">•</span>
            <Link 
              to="/recensioni" 
              className="text-primary hover:text-secondary underline"
            >
              Leggi le recensioni dei clienti &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* 6. CTA FINALE & FORM DI CONTATTO */}
      <section id="contact-form-section" className="py-14 md:py-20 bg-white border-t border-gray-100 scroll-mt-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-bold uppercase tracking-wider mb-3">
              <MessageCircle size={13} />
              <span>Contatto Diretto</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Parliamo del tuo progetto
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-gray-600">
              Compila il modulo o scrivimi direttamente. Rispondo entro 24-48 ore lavorative.
            </p>
          </div>

          <div className="bg-gray-50/90 border border-gray-200/80 rounded-3xl p-6 sm:p-8 shadow-sm">
            {submitted ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Grazie per avermi scritto!</h3>
                <p className="text-gray-600 max-w-md mx-auto text-xs sm:text-sm leading-relaxed">
                  Ho ricevuto la tua richiesta e ti risponderò al più presto con una proposta dedicata.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-5 py-2 text-xs font-bold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer"
                >
                  Invia un altro messaggio
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className="block text-[11px] font-extrabold uppercase tracking-wider text-gray-700 mb-1.5">
                      Nome e Cognome *
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Dott. / Dott.ssa Mario Rossi"
                      className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-[11px] font-extrabold uppercase tracking-wider text-gray-700 mb-1.5">
                      Email Professionale *
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="nome@studio.it"
                      className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="phone" className="block text-[11px] font-extrabold uppercase tracking-wider text-gray-700 mb-1.5">
                      Telefono (facoltativo)
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+39 3XX XXXXXXX"
                      className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="serviceInterest" className="block text-[11px] font-extrabold uppercase tracking-wider text-gray-700 mb-1.5">
                      Cosa vorresti realizzare?
                    </label>
                    <select
                      id="serviceInterest"
                      value={formData.serviceInterest}
                      onChange={(e) => setFormData({ ...formData, serviceInterest: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    >
                      <option value="Sito web professionale per psicologi">Nuovo sito web professionale</option>
                      <option value="Brand Identity completa (Logo + Sito web)">Identità visiva completa (Logo + Sito)</option>
                      <option value="Restyling sito web esistente">Restyling sito web esistente</option>
                      <option value="Consulenza preliminare e preventivo">Consulenza / Preventivo</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-[11px] font-extrabold uppercase tracking-wider text-gray-700 mb-1.5">
                    Raccontami brevemente del tuo progetto *
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Di cosa ti occupi, se hai già un'identità visiva o se stai avviando un nuovo studio..."
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                  />
                </div>

                <div>
                  <PrivacyConsentCheckbox
                    id="psychologists-privacy"
                    checked={privacyConsent}
                    onChange={(checked) => {
                      setPrivacyConsent(checked);
                      if (checked) setPrivacyError(false);
                    }}
                    error={privacyError}
                  />
                </div>

                <div className="pt-1 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto px-7 py-3.5 bg-gradient-brand text-white font-bold text-sm rounded-2xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? (
                      <span>Invio in corso...</span>
                    ) : (
                      <>
                        <span>Invia la Richiesta</span>
                        <Send size={16} />
                      </>
                    )}
                  </button>

                  <a
                    href="https://wa.me/393278850689?text=Ciao%20Francesca,%20sono%20uno%20psicologo/psicoterapeuta%20e%20vorrei%20informazioni%20per%20un%20sito%20web."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-xs font-bold text-gray-600 hover:text-emerald-700 transition-colors"
                  >
                    <MessageCircle size={15} className="mr-1.5 text-emerald-600" />
                    <span>WhatsApp Diretto</span>
                  </a>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PsychologistsLanding;
