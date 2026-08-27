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
  Clock,
  Compass,
  Smile,
  Laptop
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
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden bg-gradient-to-b from-gray-50/80 via-white to-gray-50/40 border-b border-gray-100">
        {/* Subtle decorative background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-brand opacity-5 blur-3xl pointer-events-none -z-10 rounded-full" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Category Chip */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs sm:text-sm font-bold tracking-wide uppercase mb-6 animate-in fade-in duration-300">
            <Sparkles size={14} className="text-secondary" />
            <span>Brand Identity & Siti Web per Psicologi e Psicoterapeuti</span>
          </div>

          {/* Main Headline H1 */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.15] mb-6 max-w-4xl mx-auto">
            Il tuo spazio professionale online: <br className="hidden sm:inline" />
            <span className="text-gradient-brand">chiaro, accogliente</span> e fedele al tuo approccio.
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-10 font-normal">
            Presentare la propria attività clinica online non significa inseguire algoritmi o formule promozionali aggressive. 
            Significa creare un punto di riferimento autorevole dove chi cerca supporto può comprendere chi sei, come lavori e sentirsi al sicuro nel fare il primo passo.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <a
              href="#contact-form-section"
              onClick={scrollToContact}
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-gradient-brand rounded-2xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
            >
              <span>Parliamo del tuo Progetto</span>
              <ArrowRight size={18} className="ml-2" />
            </a>
            <a
              href="https://wa.me/393278850689?text=Ciao%20Francesca,%20sono%20uno%20psicologo/psicoterapeuta%20e%20vorrei%20informazioni%20per%20un%20sito%20web."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-4 text-base font-semibold text-gray-700 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              <MessageCircle size={18} className="mr-2 text-emerald-600" />
              <span>Contattami su WhatsApp</span>
            </a>
          </div>

          {/* Trust badges */}
          <div className="mt-14 pt-8 border-t border-gray-200/70 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left max-w-3xl mx-auto">
            <div className="flex items-start space-x-3">
              <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0 mt-0.5">
                <Shield size={18} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-gray-900">Spazio Proprietario</h4>
                <p className="text-xs text-gray-500 mt-0.5">Indipendente da social, directory o variazioni di algoritmo.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="p-2 rounded-xl bg-secondary/10 text-secondary shrink-0 mt-0.5">
                <HeartHandshake size={18} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-gray-900">Chiarezza & Accoglienza</h4>
                <p className="text-xs text-gray-500 mt-0.5">Un tono rassicurante e rispettoso della sensibilità del paziente.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0 mt-0.5">
                <UserCheck size={18} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-gray-900">Etica & Deontologia</h4>
                <p className="text-xs text-gray-500 mt-0.5">Comunicazione rigorosa, trasparente e conforme alle linee guida.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. IL PROBLEMA: Affidarsi esclusivamente a canali terzi */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
              Cosa accade quando la tua presenza si affida solo a social o piattaforme terze?
            </h2>
            <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed">
              I social network, i portali di prenotazione sanitaria e le directory di settore possono essere complementari, 
              ma affidarsi unicamente a loro presenta limiti strutturali per chi esercita una professione d'aiuto.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-3xl bg-gray-50/70 border border-gray-100 hover:border-gray-200 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xl mb-6">
                01
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Profili standardizzati e poco distintivi
              </h3>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                Nelle directory e nei portali aggregatori, ogni profilo è inserito in una scheda preimpostata identica a quella di centinaia di colleghi. Questo rischia di appiattire le specificità del tuo orientamento, riducendo spesso la scelta del paziente a criteri puramente geografici o di tariffa.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-gray-50/70 border border-gray-100 hover:border-gray-200 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center font-bold text-xl mb-6">
                02
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                La dispersione e la fretta dei social
              </h3>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                I post sui social hanno una visibilità di poche ore e convivono con continue distrazioni, notifiche e contenuti di ogni tipo. Chi sta vivendo un momento di fragilità o cerca un professionista ha bisogno di calma, riservatezza e uno spazio ordinato per riflettere.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-gray-50/70 border border-gray-100 hover:border-gray-200 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center font-bold text-xl mb-6">
                03
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Nessun controllo sulle regole della piattaforma
              </h3>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                Costruire la propria autorevolezza esclusivamente all'interno di piattaforme di terzi significa dipendere da modifiche agli algoritmi, aumenti di abbonamento o variazioni delle condizioni d'uso, senza possedere un archivio stabile del proprio lavoro.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-gray-50/70 border border-gray-100 hover:border-gray-200 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xl mb-6">
                04
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Mancanza di spazio per spiegare il tuo metodo
              </h3>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                Spiegare con cura un approccio (cognitivo-comportamentale, psicodinamico, sistemico-relazionale, integrato o breve) richiede respiro tipografico, sezioni dedicate e un percorso di lettura pensato per chi non ha familiarità con il gergo clinico.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PERCHÉ UN SITO PUÒ FARE LA DIFFERENZA: 4 Vantaggi Concreti */}
      <section className="py-16 md:py-24 bg-gray-50/60 border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
              4 vantaggi concreti di un sito web per il tuo studio
            </h2>
            <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed">
              Un sito web non è una vetrina statica: è il centro stabile della tua presenza professionale, progettato per favorire una relazione consapevole fin dal primo contatto.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Vantaggio 1 */}
            <div className="bg-white p-7 rounded-3xl border border-gray-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                  <Shield size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 leading-snug">
                  Autorevolezza e serietà professionale
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Presenti la tua formazione, l'iscrizione all'Albo e la tua esperienza in un contesto limpido, curato e privo di elementi che possano distrarre o svilire il tuo valore clinico.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center text-xs font-semibold text-primary">
                <span>Riconoscibilità immediata</span>
              </div>
            </div>

            {/* Vantaggio 2 */}
            <div className="bg-white p-7 rounded-3xl border border-gray-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center mb-6">
                  <HeartHandshake size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 leading-snug">
                  Ambiente accogliente e riservato
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Uno spazio visivo sereno, studiato per mettere a proprio agio chi legge. Colori caldi o neutri, testo leggibile e un clima rassicurante trasmettono ascolto e rispetto.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center text-xs font-semibold text-secondary">
                <span>Fiducia e ascolto</span>
              </div>
            </div>

            {/* Vantaggio 3 */}
            <div className="bg-white p-7 rounded-3xl border border-gray-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                  <Layers size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 leading-snug">
                  Filtro naturale sui contatti
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Esplicitando chiaramente aree di intervento (es. ansia, sostegno alla genitorialità, terapia di coppia) e modalità (in presenza o online), ricevi richieste più allineate alla tua specializzazione.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center text-xs font-semibold text-primary">
                <span>Pazienti più informati</span>
              </div>
            </div>

            {/* Vantaggio 4 */}
            <div className="bg-white p-7 rounded-3xl border border-gray-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center mb-6">
                  <Globe size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 leading-snug">
                  Punto di riferimento duraturo
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Un indirizzo web facile da ricordare, ideale da stampare sul biglietto da visita, inviare a colleghi per invii mirati o consultare con calma prima di prenotare un colloquio conoscitivo.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center text-xs font-semibold text-secondary">
                <span>Presenza stabile nel tempo</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. IL SITO COME PRIMO PUNTO DI CONTATTO: Costruire Fiducia */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-gray-900 via-brandDark to-gray-900 text-white rounded-3xl p-8 sm:p-12 md:p-16 shadow-2xl relative overflow-hidden">
            {/* Ambient light accent */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-brand opacity-20 blur-3xl pointer-events-none rounded-full" />

            <div className="relative z-10 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-secondary text-xs font-bold uppercase tracking-wider mb-6">
                <Smile size={14} />
                <span>La relazione terapeutica inizia prima del primo incontro</span>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-tight mb-6">
                Costruire fiducia prima del primo messaggio
              </h2>

              <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-8">
                La decisione di rivolgersi a uno psicologo o a uno psicoterapeuta è intima, spesso accompagnata da dubbi o timori. 
                Prima di inviare una mail o comporre un numero di telefono, la persona desidera capire con chi parlerà e in che modo potrà essere accolta.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="flex items-start space-x-3 bg-white/5 border border-white/10 p-4 rounded-2xl">
                  <CheckCircle size={18} className="text-secondary shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block mb-0.5">Chi è il professionista</strong>
                    <span className="text-gray-400 text-xs">Volto, percorso accademico, principi guida ed etica del lavoro.</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3 bg-white/5 border border-white/10 p-4 rounded-2xl">
                  <CheckCircle size={18} className="text-secondary shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block mb-0.5">Quale approccio adotta</strong>
                    <span className="text-gray-400 text-xs">Spiegato in termini semplici, senza tecnicismi incomprensibili.</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3 bg-white/5 border border-white/10 p-4 rounded-2xl">
                  <CheckCircle size={18} className="text-secondary shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block mb-0.5">A chi è rivolto il percorso</strong>
                    <span className="text-gray-400 text-xs">Adulti, adolescenti, coppie, famiglie o specifiche tematiche.</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3 bg-white/5 border border-white/10 p-4 rounded-2xl">
                  <CheckCircle size={18} className="text-secondary shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block mb-0.5">Come avverrà il contatto</strong>
                    <span className="text-gray-400 text-xs">Modalità di risposta, tempi e indicazioni pratiche sul primo colloquio.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. COSA PUÒ RACCONTARE IL TUO SITO: Le sezioni chiave */}
      <section className="py-16 md:py-24 bg-gray-50/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
              Cosa può raccontare il tuo sito professionale?
            </h2>
            <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed">
              Non esistono elenchi obbligatori: ogni progetto viene disegnato attorno alle tue reali esigenze e al tuo modo di lavorare. Ecco le aree tematiche più efficaci e richieste.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Sezione 1 */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200/70 hover:border-primary/40 transition-all">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                  <UserCheck size={20} />
                </div>
                <h3 className="font-bold text-lg text-gray-900">Chi Sono & Bio</h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Il tuo percorso formativo, l'iscrizione all'Albo regionale degli Psicologi e la motivazione che guida la tua pratica clinica, raccontati con tono umano e professionale.
              </p>
            </div>

            {/* Sezione 2 */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200/70 hover:border-secondary/40 transition-all">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2.5 rounded-xl bg-secondary/10 text-secondary">
                  <Compass size={20} />
                </div>
                <h3 className="font-bold text-lg text-gray-900">Approccio Terapeutico</h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Una spiegazione accessibile del tuo modello di riferimento, per far comprendere alla persona come si articola il lavoro insieme e cosa aspettarsi dalle sedute.
              </p>
            </div>

            {/* Sezione 3 */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200/70 hover:border-primary/40 transition-all">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                  <FileText size={20} />
                </div>
                <h3 className="font-bold text-lg text-gray-900">Aree di Intervento</h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Le tematiche su cui offri supporto: gestione di ansia e stress, momenti di transizione, difficoltà relazionali, elaborazione di lutti, autostima, crescita personale.
              </p>
            </div>

            {/* Sezione 4 */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200/70 hover:border-secondary/40 transition-all">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2.5 rounded-xl bg-secondary/10 text-secondary">
                  <Laptop size={20} />
                </div>
                <h3 className="font-bold text-lg text-gray-900">Servizi & Modalità</h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Dettagli sui colloqui in studio e sulle consulenze psicologiche online: come si svolgono, piattaforme protette utilizzate e requisiti di riservatezza.
              </p>
            </div>

            {/* Sezione 5 */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200/70 hover:border-primary/40 transition-all">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                  <HelpCircle size={20} />
                </div>
                <h3 className="font-bold text-lg text-gray-900">FAQ & Aspetti Pratici</h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Risposte alle domande più frequenti: durata del colloquio, frequenza degli incontri, modalità di pagamento e detraibilità delle spese sanitarie.
              </p>
            </div>

            {/* Sezione 6 */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200/70 hover:border-secondary/40 transition-all">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2.5 rounded-xl bg-secondary/10 text-secondary">
                  <MapPin size={20} />
                </div>
                <h3 className="font-bold text-lg text-gray-900">Studio & Contatti</h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Dove si trova il tuo studio con mappa integrata, orari di disponibilità, modulo di richiesta contatto sicuro e collegamento diretto per messaggi o chiamate.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. PRESENZA ONLINE E GOOGLE: Essere presenti con valore */}
      <section className="py-16 md:py-24 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
            <div className="md:col-span-5 bg-gradient-to-br from-primary/5 via-secondary/5 to-transparent p-8 sm:p-10 rounded-3xl border border-gray-200/80">
              <div className="w-12 h-12 rounded-2xl bg-gradient-brand text-white flex items-center justify-center mb-6 shadow-md shadow-primary/20">
                <Search size={24} />
              </div>
              <blockquote className="text-lg sm:text-xl font-bold text-gray-900 leading-snug">
                "Essere presenti online non significa semplicemente avere un profilo social."
              </blockquote>
              <p className="mt-4 text-xs sm:text-sm text-gray-500 leading-relaxed">
                Significa disporre di una base solida, indicizzata e accessibile a chiunque cerchi attivamente una figura di supporto nel proprio territorio o da remoto.
              </p>
            </div>

            <div className="md:col-span-7 space-y-6">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                Presenza online e Google: farsi trovare con discrezione ed efficacia
              </h2>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                Quando una persona avverte un bisogno di supporto psicologico, il motore di ricerca è spesso il primo luogo in cui si informa. Avere un sito web ottimizzato permette di:
              </p>

              <ul className="space-y-3.5 text-sm sm:text-base text-gray-700">
                <li className="flex items-start space-x-3">
                  <CheckCircle size={18} className="text-primary shrink-0 mt-0.5" />
                  <span><strong>Valorizzare la tua scheda Google My Business:</strong> collegando la tua sede su Google Maps a una pagina ufficiale ricca di informazioni utili e chiare.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle size={18} className="text-primary shrink-0 mt-0.5" />
                  <span><strong>Intercettare ricerche geolocalizzate:</strong> come chi cerca uno psicologo specializzato nella tua città o nel tuo quartiere.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle size={18} className="text-primary shrink-0 mt-0.5" />
                  <span><strong>Offrire un link affidabile per il passaparola:</strong> quando un collega o un paziente consiglia il tuo nome, avere un sito curato rafforza la fiducia prima del contatto.</span>
                </li>
              </ul>

              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/70 text-xs text-gray-500 flex items-center gap-2">
                <Clock size={16} className="text-gray-400 shrink-0" />
                <span>Nessuna promessa irrealistica: costruiamo una struttura tecnica pulita, veloce e indicizzabile secondo le buone pratiche SEO e l'etica professionale.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. PERCHÉ LAVORARE CON ME: Francesca Mutolo come Brand Designer */}
      <section className="py-16 md:py-24 bg-gray-50/80 border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-secondary mb-2 block">
              Metodo e Identità
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
              Perché lavorare con me: Brand Design orientato alla cura e alla chiarezza
            </h2>
            <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed">
              Il mio lavoro come Brand Designer non si limita alla costruzione tecnica di un sito web: consiste nel progettare un'identità visiva e un'esperienza di lettura capaci di trasmettere il valore e la sensibilità della tua professione.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-7 rounded-3xl border border-gray-200/80 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                <Sparkles size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Identità Visiva Coerente</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Dalla palette colori studiata per favorire tranquillità alla scelta tipografica ad alta leggibilità: ogni dettaglio visivo è calibrato sul tuo stile professionale.
              </p>
            </div>

            <div className="bg-white p-7 rounded-3xl border border-gray-200/80 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center mb-6">
                <Layers size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Architettura delle Informazioni</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Organizziamo i testi in modo che risultino chiari, accoglienti e facili da consultare sia da smartphone che da computer, eliminando ogni sensazione di smarrimento.
              </p>
            </div>

            <div className="bg-white p-7 rounded-3xl border border-gray-200/80 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                <Shield size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Rispetto Deontologico</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Consapevolezza delle normative sulla comunicazione sanitaria: niente slogan promozionali fuori luogo, ma una presentazione trasparente, etica e professionale.
              </p>
            </div>
          </div>

          {/* Quick link to portfolio/reviews */}
          <div className="mt-12 text-center">
            <p className="text-sm text-gray-500 mb-4">
              Vuoi vedere alcuni dei miei progetti di brand identity e web design?
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                to="/portfolio/web" 
                className="inline-flex items-center text-sm font-bold text-primary hover:text-secondary underline"
              >
                Esplora i progetti Web &rarr;
              </Link>
              <span className="text-gray-300">|</span>
              <Link 
                to="/recensioni" 
                className="inline-flex items-center text-sm font-bold text-primary hover:text-secondary underline"
              >
                Leggi le recensioni dei clienti &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 8. CTA FINALE & FORM DI CONTATTO */}
      <section id="contact-form-section" className="py-16 md:py-24 bg-white border-t border-gray-100 scroll-mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-bold uppercase tracking-wider mb-4">
              <MessageCircle size={14} />
              <span>Contatto Diretto</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Parliamo del tuo progetto
            </h2>
            <p className="mt-3 text-base text-gray-600 leading-relaxed">
              Raccontami le tue esigenze o richiedi un preventivo personalizzato per il tuo nuovo sito web o per la tua identità visiva. Risponderò entro 24-48 ore lavorative.
            </p>
          </div>

          <div className="bg-gray-50/70 border border-gray-200/80 rounded-3xl p-6 sm:p-10 shadow-sm">
            {submitted ? (
              <div className="text-center py-10 space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={36} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Grazie per avermi scritto!</h3>
                <p className="text-gray-600 max-w-md mx-auto text-sm sm:text-base leading-relaxed">
                  Ho ricevuto la tua richiesta. Analizzerò le informazioni e ti risponderò al più presto con una proposta chiara e dedicata.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-6 px-6 py-2.5 text-xs font-bold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50"
                >
                  Invia un altro messaggio
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-xs font-extrabold uppercase tracking-wider text-gray-700 mb-2">
                      Nome e Cognome *
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Dott. / Dott.ssa Mario Rossi"
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-xs font-extrabold uppercase tracking-wider text-gray-700 mb-2">
                      Email Professionale *
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="nome@studio.it"
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-xs font-extrabold uppercase tracking-wider text-gray-700 mb-2">
                      Telefono (facoltativo)
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+39 3XX XXXXXXX"
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="serviceInterest" className="block text-xs font-extrabold uppercase tracking-wider text-gray-700 mb-2">
                      Cosa vorresti realizzare?
                    </label>
                    <select
                      id="serviceInterest"
                      value={formData.serviceInterest}
                      onChange={(e) => setFormData({ ...formData, serviceInterest: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    >
                      <option value="Sito web professionale per psicologi">Nuovo sito web professionale</option>
                      <option value="Brand Identity completa (Logo + Sito web)">Identità visiva completa (Logo + Sito web)</option>
                      <option value="Restyling sito web esistente">Restyling di un sito web esistente</option>
                      <option value="Consulenza preliminare e preventivo">Consulenza preliminare / Preventivo</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs font-extrabold uppercase tracking-wider text-gray-700 mb-2">
                    Raccontami del tuo studio o del tuo progetto *
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Raccontami brevemente di cosa ti occupi, se hai già un'identità visiva o se stai avviando un nuovo studio..."
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
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

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto px-8 py-4 bg-gradient-brand text-white font-bold rounded-2xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? (
                      <span>Invio in corso...</span>
                    ) : (
                      <>
                        <span>Invia la tua Richiesta</span>
                        <Send size={18} />
                      </>
                    )}
                  </button>

                  <a
                    href="https://wa.me/393278850689?text=Ciao%20Francesca,%20sono%20uno%20psicologo/psicoterapeuta%20e%20vorrei%20informazioni%20per%20un%20sito%20web."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-xs font-bold text-gray-600 hover:text-emerald-700 transition-colors"
                  >
                    <MessageCircle size={16} className="mr-1.5 text-emerald-600" />
                    <span>Preferisci scrivere su WhatsApp? Clicca qui</span>
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
