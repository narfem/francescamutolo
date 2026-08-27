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

  // Schema.org per la landing page nutrizionisti
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Sito Web per Nutrizionisti e Biologi Nutrizionisti | Francesca Mutolo",
    "description": "Progettazione di siti web professionali e identità visiva per nutrizionisti, biologi nutrizionisti e dietisti. Uno spazio proprietario per valorizzare il tuo metodo e accogliere nuovi pazienti.",
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
      <section className="relative pt-10 pb-16 md:pt-16 md:pb-24 overflow-hidden bg-gradient-to-b from-emerald-50/40 via-white to-gray-50/40 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left: Copy & CTAs */}
            <div className="lg:col-span-7 text-left space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 text-xs font-bold tracking-wide uppercase">
                <Sparkles size={14} className="text-emerald-600" />
                <span>Brand Identity & Siti Web per Nutrizionisti</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-[1.15]">
                Il tuo spazio professionale online: <br />
                <span className="text-gradient-brand">chiaro, autorevole</span> e fedele al tuo metodo nutrizionale.
              </h1>

              <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-xl">
                Uno spazio proprietario dove spiegare come imposti i tuoi piani alimentari, farti trovare su Google e accogliere i pazienti con chiarezza e rigore scientifico.
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
                  <span>Scrivimi su WhatsApp</span>
                </a>
              </div>

              {/* Quick Feature Badges */}
              <div className="flex flex-wrap gap-4 pt-4 text-xs font-semibold text-gray-600">
                <div className="flex items-center gap-1.5">
                  <Check size={15} className="text-primary" />
                  <span>Spazio 100% Proprietario</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check size={15} className="text-emerald-600" />
                  <span>Educazione Alimentare & Metodo</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check size={15} className="text-primary" />
                  <span>Trasparenza Scientifica</span>
                </div>
              </div>
            </div>

            {/* Right: Nutritionist Consultation Visual */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none rounded-3xl overflow-hidden shadow-2xl border border-gray-200/80 bg-gray-100">
                <img
                  src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=900&q=80"
                  alt="Consulenza nutrizionale professionale e pianificazione di uno stile alimentare sano ed equilibrato"
                  className="w-full h-80 sm:h-96 object-cover"
                  loading="eager"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/70 via-transparent to-transparent" />
                
                {/* Floating caption card */}
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

      {/* 2. IL PROBLEMA: Perché social e directory non bastano */}
      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Cosa accade affidandosi solo a social e piattaforme terze?
            </h2>
            <p className="mt-2.5 text-sm sm:text-base text-gray-600">
              Social network e portali di prenotazione possono affiancare la tua attività, ma presentano limiti importanti per chi fa educazione nutrizionale.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Problema 1 */}
            <div className="p-6 rounded-3xl bg-gray-50/80 border border-gray-200/70 hover:border-primary/40 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm mb-4">
                01
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-2">
                La confusione delle mode e delle diete repentine
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Sui social i contenuti scientifici competono con detox, diete miracolose e trend passeggeri. Un sito personale crea un'oasi di serietà dove valorizzare l'evidenza scientifica.
              </p>
            </div>

            {/* Problema 2 */}
            <div className="p-6 rounded-3xl bg-gray-50/80 border border-gray-200/70 hover:border-secondary/40 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center font-bold text-sm mb-4">
                02
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-2">
                Profili standardizzati nelle directory
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Nelle piattaforme di prenotazione ogni profilo è identico e si rischia di essere scelti solo per tariffa o vicinanza, senza spazio per spiegare la propria specializzazione (sportiva, clinica, donna).
              </p>
            </div>

            {/* Problema 3 */}
            <div className="p-6 rounded-3xl bg-gray-50/80 border border-gray-200/70 hover:border-secondary/40 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center font-bold text-sm mb-4">
                03
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-2">
                Dipendenza da algoritmi e abbonamenti esterni
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Affidare i propri contatti solo a terzi significa subire continui cali di visibilità organica o aumenti di commissioni, senza possedere un archivio stabile dei propri contenuti.
              </p>
            </div>

            {/* Problema 4 */}
            <div className="p-6 rounded-3xl bg-gray-50/80 border border-gray-200/70 hover:border-primary/40 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm mb-4">
                04
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-2">
                Poco spazio per spiegare il percorso nutrizionale
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Spiegare l'anamnesi, la valutazione della composizione corporea e la personalizzazione del piano richiede sezioni ordinate e una lettura senza interruzioni.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PERCHÉ UN SITO PUÒ FARE LA DIFFERENZA: 4 Vantaggi Concreti */}
      <section className="py-14 md:py-20 bg-gray-50/60 border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              4 vantaggi concreti di un sito web per il tuo studio
            </h2>
            <p className="mt-2.5 text-sm sm:text-base text-gray-600">
              Un sito web non è una semplice vetrina, ma il centro stabile e autorevole della tua attività professionale.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Vantaggio 1 */}
            <div className="p-6 rounded-3xl bg-white border border-gray-200/80 shadow-sm hover:shadow-md hover:border-primary/40 transition-all">
              <div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-5">
                <Award size={22} />
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-2">
                Autorevolezza & Iscrizione all'Albo
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Presenti la tua laurea, abilitazione ONB e percorsi formativi in un contesto trasparente e istituzionale.
              </p>
            </div>

            {/* Vantaggio 2 */}
            <div className="p-6 rounded-3xl bg-white border border-gray-200/80 shadow-sm hover:shadow-md hover:border-secondary/40 transition-all">
              <div className="w-11 h-11 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center mb-5">
                <HeartHandshake size={22} />
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-2">
                Metodo & Filosofia Chiara
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Comunichi che non proponi schemi restrittivi punitivi, ma percorsi di educazione alimentare sostenibili nel tempo.
              </p>
            </div>

            {/* Vantaggio 3 */}
            <div className="p-6 rounded-3xl bg-white border border-gray-200/80 shadow-sm hover:shadow-md hover:border-primary/40 transition-all">
              <div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-5">
                <Layers size={22} />
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-2">
                Pazienti Più Informati e Motivati
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Chi legge come si articola la prima visita arriva al colloquio conoscitivo consapevole e pronto a collaborare.
              </p>
            </div>

            {/* Vantaggio 4 */}
            <div className="p-6 rounded-3xl bg-white border border-gray-200/80 shadow-sm hover:shadow-md hover:border-secondary/40 transition-all">
              <div className="w-11 h-11 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center mb-5">
                <Globe size={22} />
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-2">
                Riferimento Stabile e Proprietario
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Un indirizzo da condividere con medici di base, palestre, specialisti e colleghi per collaborazioni e passaparola.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. IL SITO COME PRIMO PUNTO DI CONTATTO */}
      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Visual element / Image */}
            <div className="lg:col-span-5 order-2 lg:order-1">
              <div className="relative rounded-3xl overflow-hidden shadow-xl border border-gray-200 bg-white">
                <img
                  src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80"
                  alt="Scelta di alimenti freschi e nutrienti per una dieta sana e bilanciata"
                  className="w-full h-72 sm:h-80 object-cover"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="p-5 bg-white text-left">
                  <div className="flex items-center gap-2 text-xs font-bold text-primary mb-1">
                    <Activity size={15} />
                    <span>Dall'Anamnesi al Piano Personalizzato</span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Spiegare il percorso trasforma la curiosità in una richiesta di consulenza consapevole.
                  </p>
                </div>
              </div>
            </div>

            {/* What patients understand */}
            <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                  Cosa comprende chi visita il tuo sito professionale
                </h2>
                <p className="mt-2 text-sm sm:text-base text-gray-600 leading-relaxed">
                  Decidere di farsi seguire da un nutrizionista richiede fiducia. Il sito risponde alle domande più comuni prima ancora del primo contatto:
                </p>
              </div>

              <div className="space-y-3.5">
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/80 flex items-start gap-3.5">
                  <CheckCircle size={18} className="text-primary shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-sm text-gray-900">Chi è il professionista</h3>
                    <p className="text-xs text-gray-600 mt-0.5">Formazione accademica, approccio clinico, ascolto ed empatia.</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/80 flex items-start gap-3.5">
                  <CheckCircle size={18} className="text-secondary shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-sm text-gray-900">Come si svolge la prima visita</h3>
                    <p className="text-xs text-gray-600 mt-0.5">Anamnesi nutrizionale, stile di vita, misurazioni e fissazione degli obiettivi.</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/80 flex items-start gap-3.5">
                  <CheckCircle size={18} className="text-primary shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-sm text-gray-900">A chi si rivolgono i tuoi percorsi</h3>
                    <p className="text-xs text-gray-600 mt-0.5">Nutrizione clinica, sportiva, fertilità e gravidanza, benessere intestinale, vegetariana.</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/80 flex items-start gap-3.5">
                  <CheckCircle size={18} className="text-secondary shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-sm text-gray-900">Modalità e visite di controllo</h3>
                    <p className="text-xs text-gray-600 mt-0.5">Incontri in studio o a distanza online con indicazioni su frequenza e monitoraggio.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. COSA PUÒ RACCONTARE IL TUO SITO: 6 Card Sintetiche */}
      <section className="py-14 md:py-20 bg-gray-50/70 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Cosa racconterà il tuo sito
            </h2>
            <p className="mt-2 text-sm sm:text-base text-gray-600">
              Moduli chiari e personalizzati, progettati attorno alla tua pratica e alle tue specializzazioni.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* 1 */}
            <div className="p-5 rounded-2xl bg-white border border-gray-200/70 flex items-start gap-3.5 shadow-sm">
              <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0">
                <UserCheck size={20} />
              </div>
              <div>
                <h3 className="font-bold text-sm text-gray-900 mb-1">Chi Sono & Albo ONB</h3>
                <p className="text-xs text-gray-600 leading-relaxed">Presentazione della tua storia, iscrizione all'Ordine e valori scientifici.</p>
              </div>
            </div>

            {/* 2 */}
            <div className="p-5 rounded-2xl bg-white border border-gray-200/70 flex items-start gap-3.5 shadow-sm">
              <div className="p-2 rounded-xl bg-secondary/10 text-secondary shrink-0">
                <Apple size={20} />
              </div>
              <div>
                <h3 className="font-bold text-sm text-gray-900 mb-1">Metodo ed Educazione</h3>
                <p className="text-xs text-gray-600 leading-relaxed">Spiegazione di come imposti il piano, promuovendo abitudini sane e durature.</p>
              </div>
            </div>

            {/* 3 */}
            <div className="p-5 rounded-2xl bg-white border border-gray-200/70 flex items-start gap-3.5 shadow-sm">
              <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0">
                <FileText size={20} />
              </div>
              <div>
                <h3 className="font-bold text-sm text-gray-900 mb-1">Aree di Consulenza</h3>
                <p className="text-xs text-gray-600 leading-relaxed">Nutrizione sportiva, clinica, ricomposizione corporea, gonfiore o fertilità.</p>
              </div>
            </div>

            {/* 4 */}
            <div className="p-5 rounded-2xl bg-white border border-gray-200/70 flex items-start gap-3.5 shadow-sm">
              <div className="p-2 rounded-xl bg-secondary/10 text-secondary shrink-0">
                <Laptop size={20} />
              </div>
              <div>
                <h3 className="font-bold text-sm text-gray-900 mb-1">Prima Visita & Online</h3>
                <p className="text-xs text-gray-600 leading-relaxed">Cosa portare al primo colloquio e come si svolgono le consulenze da remoto.</p>
              </div>
            </div>

            {/* 5 */}
            <div className="p-5 rounded-2xl bg-white border border-gray-200/70 flex items-start gap-3.5 shadow-sm">
              <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0">
                <HelpCircle size={20} />
              </div>
              <div>
                <h3 className="font-bold text-sm text-gray-900 mb-1">FAQ & Dettagli Pratici</h3>
                <p className="text-xs text-gray-600 leading-relaxed">Esami del sangue, frequenza dei controlli e detraibilità delle spese sanitarie.</p>
              </div>
            </div>

            {/* 6 */}
            <div className="p-5 rounded-2xl bg-white border border-gray-200/70 flex items-start gap-3.5 shadow-sm">
              <div className="p-2 rounded-xl bg-secondary/10 text-secondary shrink-0">
                <MapPin size={20} />
              </div>
              <div>
                <h3 className="font-bold text-sm text-gray-900 mb-1">Studio, Mappa & Contatti</h3>
                <p className="text-xs text-gray-600 leading-relaxed">Indirizzo dello studio, orari di segreteria, modulo sicuro e WhatsApp.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. PRESENZA ONLINE E GOOGLE: Essere trovati con autorevolezza */}
      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-2">
                  <Search size={13} />
                  <span>Visibilità Locale & Motori di Ricerca</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                  Fatti trovare da chi cerca un nutrizionista nella tua zona
                </h2>
                <p className="mt-2 text-sm sm:text-base text-gray-600 leading-relaxed">
                  Quando una persona decide di intraprendere un percorso nutrizionale, il motore di ricerca è tra i primi canali consultati. Un sito proprietario permette di:
                </p>
              </div>

              <div className="space-y-3.5">
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/80 flex items-start gap-3.5">
                  <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0 mt-0.5">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-gray-900">Potenziare la Scheda Google My Business</h3>
                    <p className="text-xs text-gray-600 mt-0.5">Collega la posizione del tuo studio su Google Maps a un sito ufficiale curato e veloce.</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/80 flex items-start gap-3.5">
                  <div className="p-2 rounded-xl bg-secondary/10 text-secondary shrink-0 mt-0.5">
                    <Search size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-gray-900">Intercettare Ricerche Specifiche</h3>
                    <p className="text-xs text-gray-600 mt-0.5">Ricerche locali come "nutrizionista sportivo [città]" o "biologo nutrizionista [zona]".</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/80 flex items-start gap-3.5">
                  <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0 mt-0.5">
                    <Globe size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-gray-900">Hub per Contenuti e Consigli Scientifici</h3>
                    <p className="text-xs text-gray-600 mt-0.5">Un archivio stabile dove raccogliere articoli, guide o ricette senza dipendere dai social.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quote block */}
            <div className="lg:col-span-5 bg-gradient-to-br from-emerald-50/60 via-primary/5 to-secondary/10 p-8 sm:p-10 rounded-3xl border border-gray-200/80 text-left">
              <div className="w-12 h-12 rounded-2xl bg-gradient-brand text-white flex items-center justify-center mb-6 shadow-md shadow-primary/20">
                <Shield size={24} />
              </div>
              <blockquote className="text-lg font-bold text-gray-900 leading-snug">
                "Un sito web non è una spesa di visibilità passeggera, ma un bene stabile che valorizza la tua professionalità negli anni."
              </blockquote>
              <p className="mt-4 text-xs text-gray-500 leading-relaxed">
                Costruiamo una struttura tecnica conforme alle buone pratiche SEO e alle linee guida deontologiche sanitarie, senza promesse irrealistiche.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 7. PERCHÉ LAVORARE CON ME (Francesca Mutolo - Brand Designer) */}
      <section className="py-14 md:py-20 bg-gray-50/70 border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-secondary mb-1.5 block">
              Brand Design Specialist
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Perché lavorare con me: Brand Design per professionisti
            </h2>
            <p className="mt-2 text-sm sm:text-base text-gray-600">
              Non mi occupo solo di programmazione tecnica: progetto un'identità visiva e un'architettura dei contenuti capaci di trasmettere cura, rigore ed empatia.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-sm hover:shadow-md transition-all text-left">
              <div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                <Sparkles size={22} />
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-1.5">Identità Visiva su Misura</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Palette colori fresche e naturali, tipografia leggibile ed elementi grafici studiati per comunicare equilibrio e salute.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-sm hover:shadow-md transition-all text-left">
              <div className="w-11 h-11 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center mb-4">
                <Layers size={22} />
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-1.5">Architettura & Testi Chiari</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Organizziamo le informazioni in modo che i pazienti comprendano subito percorsi, modalità e costi senza barriere tecniche.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-sm hover:shadow-md transition-all text-left">
              <div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                <Shield size={22} />
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-1.5">Trasparenza & Deontologia</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Comunicazione rigorosa nel rispetto delle normative sanitarie e dell'Ordine dei Biologi, senza claim promozionali scorretti.
              </p>
            </div>
          </div>

          {/* Quick links to portfolio/reviews */}
          <div className="mt-10 text-center">
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

      {/* 8. CTA FINALE & FORM DI CONTATTO */}
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
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="nutritionist-name" className="block text-[11px] font-extrabold uppercase tracking-wider text-gray-700 mb-1.5">
                      Nome e Cognome *
                    </label>
                    <input
                      type="text"
                      id="nutritionist-name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Dott. / Dott.ssa Mario Rossi"
                      className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="nutritionist-email" className="block text-[11px] font-extrabold uppercase tracking-wider text-gray-700 mb-1.5">
                      Email Professionale *
                    </label>
                    <input
                      type="email"
                      id="nutritionist-email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="nome@studionutrizione.it"
                      className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="nutritionist-phone" className="block text-[11px] font-extrabold uppercase tracking-wider text-gray-700 mb-1.5">
                      Telefono (facoltativo)
                    </label>
                    <input
                      type="tel"
                      id="nutritionist-phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+39 3XX XXXXXXX"
                      className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="nutritionist-serviceInterest" className="block text-[11px] font-extrabold uppercase tracking-wider text-gray-700 mb-1.5">
                      Cosa vorresti realizzare?
                    </label>
                    <select
                      id="nutritionist-serviceInterest"
                      value={formData.serviceInterest}
                      onChange={(e) => setFormData({ ...formData, serviceInterest: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    >
                      <option value="Sito web professionale per nutrizionisti">Nuovo sito web professionale</option>
                      <option value="Brand Identity completa (Logo + Sito web)">Identità visiva completa (Logo + Sito)</option>
                      <option value="Restyling sito web esistente">Restyling sito web esistente</option>
                      <option value="Consulenza preliminare e preventivo">Consulenza / Preventivo</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="nutritionist-message" className="block text-[11px] font-extrabold uppercase tracking-wider text-gray-700 mb-1.5">
                    Raccontami brevemente del tuo progetto *
                  </label>
                  <textarea
                    id="nutritionist-message"
                    required
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Di cosa ti occupi (clinica, sportiva, donna), se hai già uno studio o se intendi lavorare anche online..."
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
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
