import React, { useEffect, useState } from 'react';
import { 
  Shield, Server, HardDrive, Send, Mail, Globe, Copy, Check, ExternalLink,
  RefreshCw, AlertCircle, PlayCircle, HelpCircle, FileText, ChevronRight, Download
} from 'lucide-react';

const ManageContactsEngine: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState<any>(null);
  const [localCount, setLocalCount] = useState(0);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/contact');
      const data = await res.json();
      if (data.success) {
        setConfig(data.config);
        setLocalCount(data.local_file_contacts_count);
      }
    } catch (err) {
      console.error("Errore fetch status contatti:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleCopyCode = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setCopiedSuccess(true);
    setTimeout(() => {
      setCopiedSection(null);
      setCopiedSuccess(false);
    }, 2500);
  };

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://francescamutolo.vercel.app';

  const codeSnippetJS = `// MODALITÀ B — INTEGRAZIONE VELOCE NON INVASIVA
const contactData = {
  name: "Alessandro Neri",
  email: "customer@example.com",
  phone: "+39 333 1234567",
  company: "Brand Agency",
  message: "Richiesta per rilancio Brand Identity globale.",
  source_page: window.location.href,
  timestamp: new Date().toISOString()
};

fetch("${currentOrigin}/api/contact", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(contactData)
})
.then(res => res.json())
.then(result => {
  if (result.success) {
    console.log("Contatto normalizzato ed inoltrato con successo!", result.modules_report);
  } else {
    console.error("Scartato dal server:", result.error);
  }
})
.catch(err => console.error("Connessione fallita:", err));`;

  const codeSnippetHTML = `<!-- Form HTML Universale Anti-Spam Integrato -->
<form id="universalContactForm" class="space-y-4">
  <!-- Campo Honeypot invisibile per intrappolare i Bot automatici -->
  <input type="text" name="website_url" style="display:none !important" tabIndex="-1" autocomplete="off" />

  <div>
    <label>Nome *</label>
    <input type="text" name="name" required class="border p-2 w-full rouded" />
  </div>
  <div>
    <label>E-mail *</label>
    <input type="email" name="email" required class="border p-2 w-full rouded" />
  </div>
  <div>
    <label>Messaggio *</label>
    <textarea name="message" required class="border p-2 w-full rounded"></textarea>
  </div>
  <button type="submit" class="bg-indigo-600 text-white px-4 py-2 rounded">
    Invia Messaggio
  </button>
</form>

<script>
document.getElementById('universalContactForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const formData = new FormData(this);
  
  // Rilevamento bot tramite honeypot
  if (formData.get('website_url')) {
    alert("Messaggio inviato!");
    this.reset();
    return;
  }

  const payload = {
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message'),
    source_page: window.location.hostname + window.location.pathname,
    timestamp: new Date().toISOString()
  };

  fetch("${currentOrigin}/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      alert("Messaggio ricevuto correttamente!");
      this.reset();
    } else {
      alert("Errore: " + data.error);
    }
  })
  .catch(() => alert("Impossibile connettersi al server dei contatti."));
});
</script>`;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs font-black tracking-widest text-primary uppercase">Modulo Esterno Integrato</span>
          <h1 className="text-3xl md:text-4xl font-black text-gray-950 tracking-tight mt-1 leading-tight">
            Sistema Contatti Universale
          </h1>
          <p className="text-gray-500 text-xs md:text-sm font-semibold max-w-2xl mt-1 leading-relaxed">
            Gestisci in totale sicurezza le richieste provenienti da questo portfolio o da siti esterni. I contatti vengono normalizzati, verificati contro lo spam ed inoltrati istantaneamente ai tuoi canali preferiti senza intermediari.
          </p>
        </div>
        <button
          onClick={fetchStatus}
          className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl text-xs font-black text-gray-700 active:scale-95 transition-all shadow-sm"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Aggiorna Stato
        </button>
      </div>

      {/* Grid status cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Core Gateway State */}
        <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm space-y-4">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-brandDark text-white rounded-2xl shadow-inner">
              <Server size={22} />
            </div>
            <span className="px-2.5 py-0.5 bg-green-50 text-green-700 text-[10px] font-black uppercase rounded-lg border border-green-100">
              Gateway Online
            </span>
          </div>
          <div>
            <h3 className="font-extrabold text-gray-950 text-sm">Porta d'Accesso Unificata</h3>
            <p className="text-xs text-gray-400 mt-1">Endpoint HTTP attivo configurato per le richieste.</p>
            <code className="block mt-3 text-[11px] font-bold font-mono bg-slate-50 border p-2 text-slate-700 rounded-xl truncate">
              {currentOrigin}/api/contact
            </code>
          </div>
        </div>

        {/* Local database File DB state */}
        <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm space-y-4">
          <div className="flex justify-between items-start">
            <div className={`p-3 rounded-2xl shadow-inner ${config?.ENABLE_FILE_DB ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-400'}`}>
              <HardDrive size={22} />
            </div>
            <span className={`px-2.5 py-0.5 text-[10px] font-black uppercase rounded-lg border ${
              config?.ENABLE_FILE_DB 
                ? 'bg-blue-50 text-blue-700 border-blue-100' 
                : 'bg-gray-50 text-gray-400 border-gray-200'
            }`}>
              {config?.ENABLE_FILE_DB ? 'Attivo (Locale)' : 'Disattivato'}
            </span>
          </div>
          <div>
            <h3 className="font-extrabold text-gray-950 text-sm">Archivio JSON di Emergenza</h3>
            <p className="text-xs text-gray-400 mt-1">
              Backup autonomo conservato in locale sul server node.
            </p>
            <div className="flex items-center justify-between mt-3 bg-amber-50/50 border border-amber-100 p-2.5 rounded-xl">
              <span className="text-xs text-amber-900 font-extrabold">Contatti in Backup:</span>
              <span className="text-xs font-black bg-white px-2 py-0.5 border border-amber-200 text-amber-700 rounded-lg">
                {localCount}
              </span>
            </div>
          </div>
        </div>

        {/* Google Sheets Option */}
        <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm space-y-4">
          <div className="flex justify-between items-start">
            <div className={`p-3 rounded-2xl shadow-inner ${config?.ENABLE_SHEETS ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
              <FileText size={22} />
            </div>
            <span className={`px-2.5 py-0.5 text-[10px] font-black uppercase rounded-lg border ${
              config?.ENABLE_SHEETS 
                ? 'bg-green-50 text-green-700 border-green-100' 
                : 'bg-gray-50 text-gray-400 border-gray-200'
            }`}>
              {config?.ENABLE_SHEETS ? 'Attivo (Fogli)' : 'Inattivo'}
            </span>
          </div>
          <div>
            <h3 className="font-extrabold text-gray-950 text-sm">Fogli Google (Sheets DB)</h3>
            <p className="text-xs text-gray-400 mt-1">Registrazione istantanea gratuita su Google Spreadsheet.</p>
            <span className="block mt-3 text-[11px] font-semibold text-gray-500 font-mono italic">
              {config?.ENABLE_SHEETS ? `ID Foglio: ${config?.GOOGLE_SHEETS_ID}` : 'Nessun foglio configurato in .env'}
            </span>
          </div>
        </div>

        {/* Telegram Bot */}
        <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm space-y-4">
          <div className="flex justify-between items-start">
            <div className={`p-3 rounded-2xl shadow-inner ${config?.ENABLE_TELEGRAM ? 'bg-[#229ED9]/10 text-[#229ED9]' : 'bg-gray-100 text-gray-400'}`}>
              <Send size={22} className="-rotate-12" />
            </div>
            <span className={`px-2.5 py-0.5 text-[10px] font-black uppercase rounded-lg border ${
              config?.ENABLE_TELEGRAM 
                ? 'bg-sky-50 text-sky-700 border-sky-100' 
                : 'bg-gray-50 text-gray-400 border-gray-200'
            }`}>
              {config?.ENABLE_TELEGRAM ? 'Notifiche Attive' : 'Inattivo'}
            </span>
          </div>
          <div>
            <h3 className="font-extrabold text-gray-950 text-sm">Bot Telegram Personale</h3>
            <p className="text-xs text-gray-400 mt-1">Notifiche push in tempo reale ad ogni invio di form.</p>
            <span className="block mt-3 text-[11px] font-semibold text-gray-500">
              {config?.ENABLE_TELEGRAM ? 'Bot connesso a Chat ID' : 'Bot Token non configurato in .env'}
            </span>
          </div>
        </div>

        {/* Nodemailer SMTP */}
        <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm space-y-4">
          <div className="flex justify-between items-start">
            <div className={`p-3 rounded-2xl shadow-inner ${config?.ENABLE_EMAIL ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-400'}`}>
              <Mail size={22} />
            </div>
            <span className={`px-2.5 py-0.5 text-[10px] font-black uppercase rounded-lg border ${
              config?.ENABLE_EMAIL 
                ? 'bg-purple-50 text-purple-700 border-purple-100' 
                : 'bg-gray-50 text-gray-400 border-gray-200'
            }`}>
              {config?.ENABLE_EMAIL ? 'Invia E-mail' : 'Disattivato'}
            </span>
          </div>
          <div>
            <h3 className="font-extrabold text-gray-950 text-sm">Notifiche SMTP (E-mail)</h3>
            <p className="text-xs text-gray-400 mt-1">Email HTML formattate per archiviare e rispondere.</p>
            <span className="block mt-3 text-[11px] font-semibold text-gray-500 truncate">
              {config?.ENABLE_EMAIL ? `Destinatario: ${config?.EMAIL_TO}` : 'SMTP disattivato'}
            </span>
          </div>
        </div>

        {/* Webhook */}
        <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm space-y-4">
          <div className="flex justify-between items-start">
            <div className={`p-3 rounded-2xl shadow-inner ${config?.ENABLE_WEBHOOK ? 'bg-orange-50 text-orange-600' : 'bg-gray-100 text-gray-400'}`}>
              <Globe size={22} />
            </div>
            <span className={`px-2.5 py-0.5 text-[10px] font-black uppercase rounded-lg border ${
              config?.ENABLE_WEBHOOK 
                ? 'bg-orange-50 text-orange-700 border-orange-100' 
                : 'bg-gray-50 text-gray-400 border-gray-200'
            }`}>
              {config?.ENABLE_WEBHOOK ? 'Webhook Attivo' : 'Inattivo'}
            </span>
          </div>
          <div>
            <h3 className="font-extrabold text-gray-950 text-sm">Inoltro Webhook Outbound</h3>
            <p className="text-xs text-gray-400 mt-1">Payload JSON inoltrato ad automazioni (Make / Notion).</p>
            <span className="block mt-3 text-[11px] font-semibold text-gray-500">
              {config?.ENABLE_WEBHOOK ? 'Rinvio automatico attivo' : 'Nessun Webhook configurato'}
            </span>
          </div>
        </div>
      </div>

      {/* Diagnostica Ambiente & Configurazione Live */}
      <div className="bg-slate-55 border border-gray-200/80 rounded-[2rem] p-6 md:p-8 space-y-6">
        <div>
          <h3 className="text-md font-black text-gray-950 uppercase tracking-wider flex items-center gap-2">
            <Shield size={20} className="text-primary animate-pulse" />
            <span>Pannello Diagnostico Credenziali (.env)</span>
          </h3>
          <p className="text-xs text-gray-500 mt-1 font-semibold">
            In questa interfaccia puoi controllare in tempo reale quali credenziali e parametri di ambiente sono attivi sulla macchina virtuale / container di AI Studio.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Telegram Settings Checklist */}
          <div className="bg-gray-50/50 border border-gray-100 p-5 rounded-2xl space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
              Rilevamento Bot Telegram
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-gray-505 font-mono bg-white border px-1.5 py-0.5 rounded">TELEGRAM_BOT_TOKEN</span>
                <span className={`px-2 py-0.5 text-[10px] font-black rounded-lg uppercase ${config?.env_checks?.TELEGRAM_BOT_TOKEN_PRESENTE ? 'bg-green-100 text-green-800' : 'bg-red-50 text-red-650'}`}>
                  {config?.env_checks?.TELEGRAM_BOT_TOKEN_PRESENTE ? 'CONFIGURATO (OK)' : 'MANCANTE ⚠️'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs font-semibold font-semibold">
                <span className="text-gray-505 font-mono bg-white border px-1.5 py-0.5 rounded">TELEGRAM_CHAT_ID</span>
                <span className={`px-2 py-0.5 text-[10px] font-black rounded-lg uppercase ${config?.env_checks?.TELEGRAM_CHAT_ID_PRESENTE ? 'bg-green-100 text-green-800' : 'bg-red-50 text-red-650'}`}>
                  {config?.env_checks?.TELEGRAM_CHAT_ID_PRESENTE ? 'CONFIGURATO (OK)' : 'MANCANTE ⚠️'}
                </span>
              </div>
            </div>
            <div className="bg-blue-50/50 border border-blue-100 p-3 rounded-xl mt-2 text-[11px] text-blue-900 leading-relaxed font-semibold">
              <HelpCircle size={14} className="inline mr-1 text-blue-600 align-text-bottom" />
              Il bot invierà una notifica push formattata istantaneamente a ogni nuovo contatto non appena configuri questi due valori.
            </div>
          </div>

          {/* Nodemailer SMTP Settings Checklist */}
          <div className="bg-gray-50/50 border border-gray-100 p-5 rounded-2xl space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
              Dispatcher Email (SMTP)
            </h4>
            <div className="space-y-1.5 text-xs font-semibold">
              <div className="flex items-center justify-between">
                <span className="text-gray-505 font-mono bg-white border px-1.5 py-0.5 rounded">SMTP_HOST</span>
                <span className={`px-1.5 py-0.5 text-[10px] font-black rounded-md ${config?.env_checks?.SMTP_HOST_PRESENTE ? 'text-green-700 bg-green-50' : 'text-red-500 bg-red-50/50'}`}>
                  {config?.env_checks?.SMTP_HOST_PRESENTE ? 'RILEVATO' : 'ASSENTE'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-505 font-mono bg-white border px-1.5 py-0.5 rounded">SMTP_USER</span>
                <span className={`px-1.5 py-0.5 text-[10px] font-black rounded-md ${config?.env_checks?.SMTP_USER_PRESENTE ? 'text-green-700 bg-green-50' : 'text-red-500 bg-red-50/50'}`}>
                  {config?.env_checks?.SMTP_USER_PRESENTE ? 'RILEVATO' : 'ASSENTE'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-505 font-mono bg-white border px-1.5 py-0.5 rounded">SMTP_PASS</span>
                <span className={`px-1.5 py-0.5 text-[10px] font-black rounded-md ${config?.env_checks?.SMTP_PASS_PRESENTE ? 'text-green-700 bg-green-50' : 'text-red-500 bg-red-50/50'}`}>
                  {config?.env_checks?.SMTP_PASS_PRESENTE ? 'RILEVATO' : 'ASSENTE'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-505 font-mono bg-white border px-1.5 py-0.5 rounded">EMAIL_TO</span>
                <span className={`px-1.5 py-0.5 text-[10px] font-black rounded-md ${config?.env_checks?.EMAIL_TO_PRESENTE ? 'text-green-700 bg-green-50' : 'text-red-500 bg-red-50/50'}`}>
                  {config?.env_checks?.EMAIL_TO_PRESENTE ? 'RILEVATO' : 'ASSENTE'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200/50 pt-4 text-xs font-semibold text-gray-500 leading-relaxed space-y-2">
          <p>
            🛡️ <strong className="text-gray-800">Come configurare queste variabili nell'anteprima:</strong>
          </p>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Puoi configurare le variabili d'ambiente direttamente tramite i controlli della piattaforma AI Studio, se supportati.</li>
            <li>In alternativa, <strong className="text-brandDark">scrivimi qui in chat i tuoi dati di configurazione</strong> (es. Token Bot e Chat ID Telegram, o parametri SMTP) e provvederò io a creare e salvare in tempo reale sul server un file <code className="bg-gray-100 px-1 py-0.5 text-red-600 font-mono rounded">.env</code> definitivo per te.</li>
          </ol>
        </div>
      </div>

      {/* Security & Anti-Bot panel */}
      <div className="bg-amber-50/20 border border-amber-200/50 p-6 rounded-[2rem] flex flex-col md:flex-row gap-5 items-start">
        <div className="p-3 bg-amber-50 text-amber-700 rounded-xl">
          <Shield size={24} />
        </div>
        <div className="space-y-1">
          <h4 className="font-extrabold text-gray-900 text-sm">Sicurezza & Protezione Anti-Spam Integrata di Serie</h4>
          <p className="text-xs text-gray-500 leading-relaxed font-semibold">
            Il backend applica autonomamente una decontaminazione HTML sui messaggi, blocca le stringhe sospette e offre protezione contro gli attacchi bruteforce automatizzati tramite un <strong className="text-amber-800">Rate Limiter basato su indirizzo IP</strong> (massimo 5 richieste al minuto). È supportato anche lo scenario <strong className="text-amber-800">Honeypot anti-bot</strong> tramite l'inclusione di un campo invisibile nel form che scherma integralmente le liste.
          </p>
        </div>
      </div>

      {/* Code Integrations Panel */}
      <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-6 md:p-8 space-y-6">
        <div className="border-b border-gray-100 pb-4">
          <h3 className="text-lg font-black text-gray-950 uppercase tracking-wider flex items-center gap-2">
            <PlayCircle size={20} className="text-primary" />
            <span>Modalità di Integrazione su altri Siti (Copiate e Usate)</span>
          </h3>
          <p className="text-xs text-gray-450 mt-1">
            Esegui l'integrazione del tuo form su altre pagine web statiche, WordPress, o progetti AI senza inserire chiavi o modificare database.
          </p>
        </div>

        {/* Integration B1: JS Fetch */}
        <div className="space-y-3">
          <div className="flex justify-between items-center bg-gray-50 p-3 rounded-2xl border border-gray-100">
            <span className="text-xs font-black text-gray-800 uppercase tracking-widest pl-1">Integrazione in JavaScript Puro (Fetch)</span>
            <button
              onClick={() => handleCopyCode(codeSnippetJS, 'js')}
              className="flex items-center gap-1 text-[10px] font-black uppercase text-primary bg-white px-3 py-1.5 rounded-xl border border-gray-100 hover:bg-gray-100 active:scale-95 transition-all shadow-sm"
            >
              {copiedSection === 'js' ? <Check size={11} /> : <Copy size={11} />}
              <span>{copiedSection === 'js' ? 'Copiato!' : 'Copia Codice'}</span>
            </button>
          </div>
          <pre className="p-4 bg-slate-900 text-slate-300 rounded-2xl text-[10px] font-mono leading-normal overflow-x-auto text-left max-h-[250px] chat-scrollbar select-all">
            {codeSnippetJS}
          </pre>
        </div>

        {/* Integration B2: Plain HTML Form */}
        <div className="space-y-3 pt-4 border-t border-gray-50">
          <div className="flex justify-between items-center bg-gray-50 p-3 rounded-2xl border border-gray-100">
            <span className="text-xs font-black text-gray-800 uppercase tracking-widest pl-1">Form HTML Completo con Honeypot Anti-Bot</span>
            <button
              onClick={() => handleCopyCode(codeSnippetHTML, 'html')}
              className="flex items-center gap-1 text-[10px] font-black uppercase text-primary bg-white px-3 py-1.5 rounded-xl border border-gray-100 hover:bg-gray-100 active:scale-95 transition-all shadow-sm"
            >
              {copiedSection === 'html' ? <Check size={11} /> : <Copy size={11} />}
              <span>{copiedSection === 'html' ? 'Copiato!' : 'Copia Codice'}</span>
            </button>
          </div>
          <pre className="p-4 bg-slate-900 text-slate-300 rounded-2xl text-[10px] font-mono leading-normal overflow-x-auto text-left max-h-[300px] chat-scrollbar select-all">
            {codeSnippetHTML}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default ManageContactsEngine;
