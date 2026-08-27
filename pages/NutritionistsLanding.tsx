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
  Sparkles, 
  Globe, 
  HeartHandshake, 
  Layers, 
  ArrowRight,
  MessageCircle,
  Apple,
  Laptop,
  Check,
  Activity,
  Award
} from 'lucide-react';
import { SEO } from '../components/SEO';
import { PrivacyConsentCheckbox } from '../components/PrivacyConsentCheckbox';

const NutritionistsLanding: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    serviceInterest: 'Sito web professionale per nutrizionisti',
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
      const formattedMessage = `[Richiesta da Landing Nutrizionisti]\nInteresse principale: ${formData.serviceInterest}\nTelefono: ${formData.phone || 'Non indicato'}\n\nMessaggio:\n${formData.message}`;

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
          serviceInterest: 'Sito web professionale per nutrizionisti',
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

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Sito Web per Nutrizionisti e Biologi Nutrizionisti | Francesca Mutolo",
    "description": "Progettazione di siti web professionali e identità visiva per nutrizionisti e biologi nutrizionisti. Uno spazio proprietario per valorizzare il tuo metodo e accogliere nuovi pazienti.",
    "url": "https://www.francescamutolo.it/nutrizionisti",
    "inLanguage": "it-IT",
    "isPartOf": {
      "@type": "WebSite",
      "name": "Francesca Mutolo | Brand Designer",
      "url": "https://www.francescamutolo.it/"
    },
    "about": [
      {
        "@type": "Service",
        "name": "Progettazione Siti Web per Nutrizionisti e Biologi Nutrizionisti",
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
        title="Sito Web per Nutrizionisti e Biologi Nutrizionisti | Francesca Mutolo"
        description="Creazione siti web professionali e brand identity per nutrizionisti e biologi nutrizionisti. Valorizza il tuo metodo, fatti trovare su Google e costruisci fiducia fin dal primo contatto."
        canonical="https://www.francescamutolo.it/nutrizionisti"
        schemaData={schemaData}
      />

      {/* 1. HERO SECTION */}
      <section className="relative pt-8 pb-14 md:pt-14 md:pb-20 overflow-hidden bg-gradient-to-b from-emerald-50/50 via-white to-gray-50/40 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left: Headline, Subtitle, CTAs */}
            <div className="lg:col-span-7 text-left space-y-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 text-xs font-bold tracking-wide uppercase">
                <Sparkles size={14} className="text-emerald-600" />
                <span>Brand Identity & Siti Web per Nutrizionisti</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-[1.15]">
                Il tuo spazio professionale: <br />
                <span className="text-gradient-brand">chiaro, autorevole</span> e fedele al tuo metodo nutrizionale.
              </h1>

              <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-xl">
                Valorizza la tua formazione scientifica, spiega come imposti i tuoi piani alimentari e fatti trovare da chi cerca una guida competente per la propria salute.
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
                  href="https://wa.me/393278850689?text=Ciao%20Francesca,%20sono%20un%20nutrizionista/biologo%20nutrizionista%20e%20vorrei%20informazioni%20per%20un%20sito%20web."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-5 py-3.5 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 hover:text-gray-900 transition-colors text-center"
                >
                  <MessageCircle size={16} className="mr-2 text-emerald-600" />
                  <span>WhatsApp</span>
                </a>
              </div>

              <div className="flex flex-wrap gap-4 pt-3 text-xs font-semibold text-gray-600">
                <div className="flex items-center gap-1.5">
                  <Check size={15} className="text-primary" />
                  <span>Spazio 100% Proprietario</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check size={15} className="text-emerald-600" />
                  <span>Educazione & Metodo Clinico</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check size={15} className="text-primary" />
                  <span>Trasparenza Scientifica</span>
                </div>
              </div>
            </div>

            {/* Right: Nutrition Consultation Visual */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none rounded-3xl overflow-hidden shadow-2xl border border-gray-200/80 bg-gray-100">
                <img
                  src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=900&q=80"
                  alt="Pianificazione nutrizionale professionale, educazione alimentare e stile di vita sano ed equilibrato"
                  className="w-full h-80 sm:h-96 object-cover"
                  loading="eager"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/70 via-transparent to-transparent" />
                
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-white/95 backdrop-blur-sm border border-white/40 shadow-lg text-left">
                  <p className="text-xs font-extrabold text-gray-900">
                    La fiducia nasce dalla chiarezza del metodo
                  </p>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Spiegare come si articola la prima visita rassicura chi desidera cambiare le proprie abitudini con serenità.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. PERCHÉ UN SITO FA LA DIFFERENZA: 4 Card Sintetiche */}
      <section className="py-12 md:py-18 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Perché avere un sito professionale
            </h2>
            <p className="mt-2 text-sm sm:text-base text-gray-600">
              Uno spazio stabile che supera i limiti di social e portali di prenotazione standardizzati.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Card 1 */}
            <div className="p-6 rounded-3xl bg-gray-50/80 border border-gray-200/70 hover:border-primary/40 hover:shadow-md transition-all text-left">
              <div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                <Award size={22} />
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-1.5">
                Autorevolezza & Albo
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Mostra titolo accademico, iscrizione ONB e percorsi formativi in un contesto trasparente e istituzionale.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-6 rounded-3xl bg-gray-50/80 border border-gray-200/70 hover:border-secondary/40 hover:shadow-md transition-all text-left">
              <div className="w-11 h-11 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center mb-4">
                <HeartHandshake size={22} />
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-1.5">
                Metodo & Filosofia
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Distinguiti dalle diete drastiche: comunica la tua visione di educazione alimentare sostenibile e senza restrizioni punitive.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-6 rounded-3xl bg-gray-50/80 border border-gray-200/70 hover:border-primary/40 hover:shadow-md transition-all text-left">
              <div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                <Layers size={22} />
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-1.5">
                Pazienti Consapevoli
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Chi legge come si svolge la prima visita e l'anamnesi arriva al colloquio informato e pronto a collaborare.
              </p>
            </div>

            {/* Card 4 */}
            <div className="p-6 rounded-3xl bg-gray-50/80 border border-gray-200/70 hover:border-secondary/40 hover:shadow-md transition-all text-left">
              <div className="w-11 h-11 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center mb-4">
                <Globe size={22} />
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-1.5">
                Spazio Proprietario
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Un riferimento ufficiale da condividere con medici di base, palestre e specialisti per collaborazioni e passaparola.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FARTI CONOSCERE PRIMA DEL PRIMO CONTATTO */}
      <section className="py-12 md:py-18 bg-gray-50/60 border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Visual element / Image */}
            <div className="lg:col-span-5 order-2 lg:order-1">
              <div className="relative rounded-3xl overflow-hidden shadow-xl border border-gray-200 bg-white">
                <img
                  src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=900&q=80"
                  alt="Consulenza e colloquio conoscitivo per la definizione del percorso nutrizionale"
                  className="w-full h-72 sm:h-80 object-cover"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="p-4 bg-white text-left">
                  <div className="flex items-center gap-2 text-xs font-bold text-primary mb-0.5">
                    <Activity size={15} />
                    <span>Dall'Anamnesi agli Obiettivi Condivisi</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Spiegare il percorso trasforma la curiosità in una richiesta di consulenza consapevole.
                  </p>
                </div>
              </div>
            </div>

            {/* What visitors understand */}
            <div className="lg:col-span-7 order-1 lg:order-2 space-y-5 text-left">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                  Cosa comprende chi visita il tuo sito
                </h2>
                <p className="mt-1.5 text-sm text-gray-600">
                  Affidarsi a un nutrizionista richiede fiducia. Il sito risponde ai dubbi più comuni prima del primo incontro:
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-white border border-gray-200/80 flex items-start gap-3 shadow-sm">
                  <CheckCircle size={17} className="text-primary shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-xs sm:text-sm text-gray-900">Chi sei e come lavori</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Formazione accademica, approccio clinico, ascolto ed empatia.</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-gray-200/80 flex items-start gap-3 shadow-sm">
                  <CheckCircle size={17} className="text-secondary shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-xs sm:text-sm text-gray-900">Come si svolge la prima visita</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Anamnesi nutrizionale, stile di vita, misurazioni e piano su misura.</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-gray-200/80 flex items-start gap-3 shadow-sm">
                  <CheckCircle size={17} className="text-primary shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-xs sm:text-sm text-gray-900">A chi ti rivolgi</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Nutrizione clinica, sportiva, fertilità e gravidanza, benessere intestinale.</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-gray-200/80 flex items-start gap-3 shadow-sm">
                  <CheckCircle size={17} className="text-secondary shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-xs sm:text-sm text-gray-900">Modalità in studio o online</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Incontri di persona o da remoto con indicazioni su controlli e monitoraggio.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. COSA PUÒ RACCONTARE IL TUO SITO: 6 Card Modulari */}
      <section className="py-12 md:py-18 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Cosa racconterà il tuo sito
            </h2>
            <p className="mt-1.5 text-sm text-gray-600">
              Moduli chiari e personalizzati, calibrati attorno alla tua pratica e alle tue specializzazioni.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {/* 1 */}
            <div className="p-5 rounded-2xl bg-gray-50/70 border border-gray-200/70 flex items-start gap-3.5 shadow-sm text-left">
              <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0">
                <UserCheck size={20} />
              </div>
              <div>
                <h3 className="font-bold text-sm text-gray-900 mb-1">Chi Sono & Albo ONB</h3>
                <p className="text-xs text-gray-600 leading-relaxed">Presentazione della tua storia, iscrizione all'Ordine e valori scientifici.</p>
              </div>
            </div>

            {/* 2 */}
            <div className="p-5 rounded-2xl bg-gray-50/70 border border-gray-200/70 flex items-start gap-3.5 shadow-sm text-left">
              <div className="p-2 rounded-xl bg-secondary/10 text-secondary shrink-0">
                <Apple size={20} />
              </div>
              <div>
                <h3 className="font-bold text-sm text-gray-900 mb-1">Metodo ed Educazione</h3>
                <p className="text-xs text-gray-600 leading-relaxed">Spiegazione di come imposti il piano, promuovendo abitudini sane e durature.</p>
              </div>
            </div>

            {/* 3 */}
            <div className="p-5 rounded-2xl bg-gray-50/70 border border-gray-200/70 flex items-start gap-3.5 shadow-sm text-left">
              <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0">
                <FileText size={20} />
              </div>
              <div>
                <h3 className="font-bold text-sm text-gray-900 mb-1">Aree di Consulenza</h3>
                <p className="text-xs text-gray-600 leading-relaxed">Nutrizione sportiva, clinica, ricomposizione corporea, salute femminile o IBS.</p>
              </div>
            </div>

            {/* 4 */}
            <div className="p-5 rounded-2xl bg-gray-50/70 border border-gray-200/70 flex items-start gap-3.5 shadow-sm text-left">
              <div className="p-2 rounded-xl bg-secondary/10 text-secondary shrink-0">
                <Laptop size={20} />
              </div>
              <div>
                <h3 className="font-bold text-sm text-gray-900 mb-1">Prima Visita & Online</h3>
                <p className="text-xs text-gray-600 leading-relaxed">Cosa portare al primo colloquio e come si svolgono le consulenze a distanza.</p>
              </div>
            </div>

            {/* 5 */}
            <div className="p-5 rounded-2xl bg-gray-50/70 border border-gray-200/70 flex items-start gap-3.5 shadow-sm text-left">
              <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0">
                <HelpCircle size={20} />
              </div>
              <div>
                <h3 className="font-bold text-sm text-gray-900 mb-1">FAQ & Dettagli Pratici</h3>
                <p className="text-xs text-gray-600 leading-relaxed">Esami ematici, frequenza dei controlli e detraibilità sanitaria delle visite.</p>
              </div>
            </div>

            {/* 6 */}
            <div className="p-5 rounded-2xl bg-gray-50/70 border border-gray-200/70 flex items-start gap-3.5 shadow-sm text-left">
              <div className="p-2 rounded-xl bg-secondary/10 text-secondary shrink-0">
                <MapPin size={20} />
              </div>
              <div>
                <h3 className="font-bold text-sm text-gray-900 mb-1">Studio, Mappa & Contatti</h3>
                <p className="text-xs text-gray-600 leading-relaxed">Posizione dello studio, orari di segreteria, modulo di contatto e WhatsApp.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. VISIBILITÀ SU GOOGLE E REPERIBILITÀ */}
      <section className="py-12 md:py-18 bg-gray-50/60 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-4 text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                <Search size={13} />
                <span>Visibilità Locale & Motori di Ricerca</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                Fatti trovare da chi cerca un nutrizionista nella tua zona
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Chi cerca un professionista della nutrizione su Google desidera valutare specializzazioni, studio e approccio. Un sito proprietario permette di:
              </p>

              <div className="space-y-2.5 pt-1">
                <div className="p-3.5 rounded-2xl bg-white border border-gray-200/80 flex items-center gap-3">
                  <div className="p-1.5 rounded-xl bg-primary/10 text-primary shrink-0">
                    <MapPin size={16} />
                  </div>
                  <p className="text-xs sm:text-sm text-gray-700">
                    <strong>Scheda Google My Business</strong> collegata al tuo sito ufficiale curato e veloce.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-gray-200/80 flex items-center gap-3">
                  <div className="p-1.5 rounded-xl bg-secondary/10 text-secondary shrink-0">
                    <Search size={16} />
                  </div>
                  <p className="text-xs sm:text-sm text-gray-700">
                    <strong>Ricerche geolocalizzate</strong> come <em>"nutrizionista [città]"</em> o <em>"biologo nutrizionista [zona]"</em>.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-gray-200/80 flex items-center gap-3">
                  <div className="p-1.5 rounded-xl bg-primary/10 text-primary shrink-0">
                    <Globe size={16} />
                  </div>
                  <p className="text-xs sm:text-sm text-gray-700">
                    <strong>Archivio proprietario</strong> per articoli, ricette e consigli senza dipendere dai social.
                  </p>
                </div>
              </div>
            </div>

            {/* Right quote block */}
            <div className="lg:col-span-5 bg-gradient-to-br from-emerald-50/80 via-primary/5 to-secondary/10 p-7 sm:p-8 rounded-3xl border border-gray-200/80 text-left">
              <div className="w-10 h-10 rounded-2xl bg-gradient-brand text-white flex items-center justify-center mb-4 shadow-md shadow-primary/20">
                <Shield size={20} />
              </div>
              <blockquote className="text-base sm:text-lg font-bold text-gray-900 leading-snug">
                "Un sito web non è una spesa passeggera, ma un bene stabile che valorizza la tua autorevolezza negli anni."
              </blockquote>
              <p className="mt-3 text-xs text-gray-500 leading-relaxed">
                Struttura tecnica conforme alle buone pratiche SEO e alle linee guida deontologiche sanitarie, senza promesse irrealistiche.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 6. IL MIO APPROCCIO (Francesca Mutolo - Brand Designer) */}
      <section className="py-12 md:py-18 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-9">
            <span className="text-xs font-bold uppercase tracking-widest text-secondary mb-1 block">
              Brand Design Specialist
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Il mio approccio: Brand Design per nutrizionisti
            </h2>
            <p className="mt-1.5 text-sm text-gray-600">
              Progetto un'identità visiva e un'architettura dei contenuti capaci di trasmettere cura, rigore ed equilibrio.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-gray-50/70 p-5 rounded-3xl border border-gray-200/80 shadow-sm text-left">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                <Sparkles size={20} />
              </div>
              <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-1">Identità Visiva su Misura</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Palette colori naturali, tipografia leggibile ed elementi grafici studiati per comunicare salute e benessere.
              </p>
            </div>

            <div className="bg-gray-50/70 p-5 rounded-3xl border border-gray-200/80 shadow-sm text-left">
              <div className="w-10 h-10 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center mb-3">
                <Layers size={20} />
              </div>
              <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-1">Architettura Chiara</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Informazioni organizzate per far comprendere subito percorsi, modalità di visita e contatti senza barriere.
              </p>
            </div>

            <div className="bg-gray-50/70 p-5 rounded-3xl border border-gray-200/80 shadow-sm text-left">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                <Shield size={20} />
              </div>
              <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-1">Deontologia Sanitaria</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Comunicazione rigorosa nel rispetto delle linee guida dell'Ordine dei Biologi, senza claim promozionali scorretti.
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <div className="flex flex-wrap justify-center items-center gap-3 text-xs sm:text-sm">
              <span className="text-gray-500">Vuoi approfondire il mio lavoro?</span>
              <Link 
                to="/portfolio/web" 
                className="font-bold text-primary hover:text-secondary underline"
              >
                Esplora i progetti Web &rarr;
              </Link>
              <span className="text-gray-300">|</span>
              <Link 
                to="/recensioni" 
                className="font-bold text-primary hover:text-secondary underline"
              >
                Leggi le recensioni dei clienti &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CTA FINALE & FORM DI CONTATTO */}
      <section id="contact-form-section" className="py-12 md:py-18 bg-gray-50/60 border-t border-gray-100 scroll-mt-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-bold uppercase tracking-wider mb-2">
              <MessageCircle size={13} />
              <span>Contatto Diretto</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Parliamo del tuo progetto
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-gray-600">
              Compila il modulo o scrivimi direttamente. Rispondo entro 24-48 ore lavorative.
            </p>
          </div>

          <div className="bg-white border border-gray-200/80 rounded-3xl p-6 sm:p-8 shadow-sm">
            {submitted ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Grazie per avermi scritto!</h3>
                <p className="text-gray-600 max-w-md mx-auto text-xs sm:text-sm leading-relaxed">
                  Ho ricevuto la tua richiesta e ti risponderò al più presto con una proposta dedicata al tuo studio nutrizionale.
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
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="nutritionist-name" className="block text-[11px] font-extrabold uppercase tracking-wider text-gray-700 mb-1">
                      Nome e Cognome *
                    </label>
                    <input
                      type="text"
                      id="nutritionist-name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Dott. / Dott.ssa Mario Rossi"
                      className="w-full px-3.5 py-2.5 bg-gray-50/60 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="nutritionist-email" className="block text-[11px] font-extrabold uppercase tracking-wider text-gray-700 mb-1">
                      Email Professionale *
                    </label>
                    <input
                      type="email"
                      id="nutritionist-email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="nome@studionutrizione.it"
                      className="w-full px-3.5 py-2.5 bg-gray-50/60 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="nutritionist-phone" className="block text-[11px] font-extrabold uppercase tracking-wider text-gray-700 mb-1">
                      Telefono (facoltativo)
                    </label>
                    <input
                      type="tel"
                      id="nutritionist-phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+39 3XX XXXXXXX"
                      className="w-full px-3.5 py-2.5 bg-gray-50/60 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="nutritionist-serviceInterest" className="block text-[11px] font-extrabold uppercase tracking-wider text-gray-700 mb-1">
                      Cosa vorresti realizzare?
                    </label>
                    <select
                      id="nutritionist-serviceInterest"
                      value={formData.serviceInterest}
                      onChange={(e) => setFormData({ ...formData, serviceInterest: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-gray-50/60 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    >
                      <option value="Sito web professionale per nutrizionisti">Nuovo sito web professionale</option>
                      <option value="Brand Identity completa (Logo + Sito web)">Identità visiva completa (Logo + Sito)</option>
                      <option value="Restyling sito web esistente">Restyling sito web esistente</option>
                      <option value="Consulenza preliminare e preventivo">Consulenza / Preventivo</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="nutritionist-message" className="block text-[11px] font-extrabold uppercase tracking-wider text-gray-700 mb-1">
                    Raccontami brevemente del tuo progetto *
                  </label>
                  <textarea
                    id="nutritionist-message"
                    required
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Di cosa ti occupi (clinica, sportiva, salute femminile), se hai già uno studio o se intendi lavorare anche da remoto..."
                    className="w-full px-3.5 py-2.5 bg-gray-50/60 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                  />
                </div>

                <div>
                  <PrivacyConsentCheckbox
                    id="nutritionists-privacy"
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
                    href="https://wa.me/393278850689?text=Ciao%20Francesca,%20sono%20un%20nutrizionista/biologo%20nutrizionista%20e%20vorrei%20informazioni%20per%20un%20sito%20web."
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

export default NutritionistsLanding;
