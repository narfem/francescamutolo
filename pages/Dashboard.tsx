import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, Routes, Route, Link, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { 
  LayoutDashboard, Image as ImageIcon, MessageSquare, Briefcase, LogOut, 
  Plus, Trash2, Pencil, Star, Download, FileJson, 
  X, Mail, RefreshCw, Menu as MenuIcon, Flag, FileText, Copy, Check, Sparkles,
  ClipboardList, Building, Users, Target, Palette, Shield, Monitor, Globe, Instagram,
  Archive, GripVertical, ExternalLink
} from 'lucide-react';
import { PortfolioItem, SimpleContact, BriefContact, Questionnaire } from '../types';
import JSZip from 'jszip';
import ManageFeedbacks from './ManageFeedbacks';
import ManageContactsEngine from './ManageContactsEngine';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { logoBase64String } from './logoBase64';

const CopyButton = ({ text, colorClass = "text-primary" }: { text: string, colorClass?: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button 
      onClick={handleCopy}
      className={`p-1.5 rounded-lg transition-all hover:bg-gray-100 ${colorClass} flex items-center gap-1`}
      title="Copia email"
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
      {copied && <span className="text-[10px] font-bold uppercase">Copiato!</span>}
    </button>
  );
};

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const checkUser = async () => {
    try {
      console.log("Checking user session...");
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        console.error("Supabase auth error:", error);
        // Se c'è un errore ma abbiamo una sessione locale, proviamo a usarla
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          console.log("Using session user as fallback");
          setUser(session.user);
        } else {
          navigate('/login');
        }
      } else if (!user) {
        console.log("No user found, redirecting to login");
        navigate('/login');
      } else {
        console.log("User authenticated:", user.email);
        setUser(user);
      }
    } catch (err) {
      console.error("Critical error in checkUser:", err);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const logoId = "14Ps4nKRx1wOah9gZHFo4O3Ynq4qpWpKU";
  const logoUrl = `https://drive.google.com/thumbnail?id=${logoId}&sz=w500`;

  if (loading) return <div className="p-20 text-center font-bold text-xl">Verifica accesso in corso...</div>;

  const NavContent = () => (
    <div className="flex flex-col h-full overflow-hidden bg-brandDark">
      <div className="p-6 flex-shrink-0">
        <div className="flex items-center gap-3">
          <img src={logoUrl} alt="Logo" referrerPolicy="no-referrer" className="h-10 w-10 object-cover rounded-full border border-white/20" />
          <span className="font-bold text-sm tracking-tight text-white">Dashboard</span>
        </div>
      </div>
      
      <nav className="flex-grow p-4 space-y-2 overflow-y-auto chat-scrollbar text-white">
        <Link to="/dashboard" className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${location.pathname === '/dashboard' ? 'bg-primary text-white' : 'hover:bg-white/10'}`}>
          <LayoutDashboard size={18} /> Dashboard
        </Link>
        <Link to="/dashboard/portfolio" className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${location.pathname.includes('/portfolio') ? 'bg-primary text-white' : 'hover:bg-white/10'}`}>
          <ImageIcon size={18} /> Gestisci Lavori
        </Link>
        <Link to="/dashboard/leads" className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${location.pathname.includes('/leads') ? 'bg-primary text-white' : 'hover:bg-white/10'}`}>
          <MessageSquare size={18} /> Messaggi & Brief
        </Link>
        <Link to="/dashboard/questionari" className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${location.pathname.includes('/questionari') ? 'bg-primary text-white' : 'hover:bg-white/10'}`}>
          <ClipboardList size={18} /> Questionari
        </Link>
        <Link to="/dashboard/feedback" className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${location.pathname.includes('/feedback') ? 'bg-primary text-white' : 'hover:bg-white/10'}`}>
          <Star size={18} /> Gestisci Feedback
        </Link>
        <Link to="/dashboard/cv" className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${location.pathname.includes('/cv') ? 'bg-primary text-white' : 'hover:bg-white/10'}`}>
          <FileText size={18} /> Gestione CV
        </Link>
        <Link to="/dashboard/mutey" className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${location.pathname.includes('/mutey') ? 'bg-primary text-white' : 'hover:bg-white/10'}`}>
          <Sparkles size={18} /> Gestione Mutey
        </Link>
        <Link to="/dashboard/sistema-contatti" className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${location.pathname.includes('/sistema-contatti') ? 'bg-primary text-white' : 'hover:bg-white/10'}`}>
          <Globe size={18} /> Sistema Contatti
        </Link>
        <a href="https://freelancesuite.vercel.app/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl transition-colors hover:bg-white/10 text-white/95">
          <ExternalLink size={18} /> Freelance Suite
        </a>

        <div className="pt-4 mt-4 border-t border-white/10">
          <button 
            onClick={handleSignOut} 
            className="flex items-center gap-3 p-3 w-full text-left rounded-xl hover:bg-red-500/20 text-red-400 transition-colors font-bold"
          >
            <LogOut size={18} /> Esci
          </button>
        </div>
      </nav>
    </div>
  );

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-brandDark text-white flex flex-col transition-transform duration-300 h-[100dvh]
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <NavContent />
      </aside>

      <div className="flex-grow flex flex-col lg:ml-64 w-full h-full overflow-hidden">
        <header className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-gray-100 sticky top-0 z-30 flex-shrink-0">
          <div className="flex items-center gap-3">
            <img src={logoUrl} alt="Logo" referrerPolicy="no-referrer" className="h-8 w-8 object-cover rounded-full border border-gray-100" />
            <span className="font-bold text-sm">Dashboard Admin</span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <MenuIcon size={24} />
          </button>
        </header>

        <main className="flex-grow overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route index element={<DashboardHome />} />
              <Route path="portfolio" element={<ManagePortfolio />} />
              <Route path="leads" element={<ManageLeads />} />
              <Route path="questionari" element={<ManageQuestionnaires />} />
              <Route path="feedback" element={<ManageFeedbacks />} />
              <Route path="cv" element={<ManageCV />} />
              <Route path="mutey" element={<ManageMutey />} />
              <Route path="sistema-contatti" element={<ManageContactsEngine />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

const DashboardHome = () => (
  <div className="animate-in fade-in duration-500">
    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Bentornata, Francesca</h1>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <Link to="/dashboard/portfolio" className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-all group">
        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform text-primary">
          <ImageIcon size={24} />
        </div>
        <p className="text-gray-500 text-sm font-medium">Portfolio</p>
        <p className="text-xl md:text-2xl font-bold text-gray-900 mt-1">Aggiorna i tuoi lavori</p>
      </Link>
      <Link to="/dashboard/leads" className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-all group">
        <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform text-secondary">
          <MessageSquare size={24} />
        </div>
        <p className="text-gray-500 text-sm font-medium">Lead</p>
        <p className="text-xl md:text-2xl font-bold text-gray-900 mt-1">Contatti ricevuti</p>
      </Link>
      <Link to="/dashboard/questionari" className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-all group">
        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform text-primary text-gradient-brand">
          <ClipboardList size={24} />
        </div>
        <p className="text-gray-500 text-sm font-medium">Questionari</p>
        <p className="text-xl md:text-2xl font-bold text-gray-900 mt-1">Brand Identity</p>
      </Link>
      <Link to="/dashboard/feedback" className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-all group">
        <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform text-secondary">
          <Star size={24} className="text-[#F39637] fill-[#F39637]" />
        </div>
        <p className="text-gray-500 text-sm font-medium">Feedback</p>
        <p className="text-xl md:text-2xl font-bold text-gray-900 mt-1">Gestisci le recensioni</p>
      </Link>
      <Link to="/dashboard/cv" className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-all group">
        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform text-primary">
          <FileText size={24} />
        </div>
        <p className="text-gray-500 text-sm font-medium">CV</p>
        <p className="text-xl md:text-2xl font-bold text-gray-900 mt-1">Gestione link CV</p>
      </Link>
      <Link to="/dashboard/mutey" className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-all group">
        <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform text-secondary">
          <Sparkles size={24} />
        </div>
        <p className="text-gray-500 text-sm font-medium">Mutey AI</p>
        <p className="text-xl md:text-2xl font-bold text-gray-900 mt-1">Istruzioni assistente</p>
      </Link>
      <Link to="/dashboard/sistema-contatti" className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-all group">
        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform text-primary">
          <Globe size={24} />
        </div>
        <p className="text-gray-500 text-sm font-medium">Contatti Universali</p>
        <p className="text-xl md:text-2xl font-bold text-gray-900 mt-1">Configura Gateway</p>
      </Link>
      <a href="https://freelancesuite.vercel.app/" target="_blank" rel="noopener noreferrer" className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-all group">
        <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform text-secondary">
          <ExternalLink size={24} />
        </div>
        <p className="text-gray-500 text-sm font-medium">Freelance Suite</p>
        <p className="text-xl md:text-2xl font-bold text-gray-900 mt-1">Gestisci la tua attività →</p>
      </a>
    </div>
  </div>
);

const ManageCV = () => {
  const [cvUrl, setCvUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [showCVButton, setShowCVButton] = useState(true);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch CV URL
      const { data, error } = await supabase.from('settings').select('cv_url').eq('id', 'global').maybeSingle();
      if (!error && data) {
        setCvUrl(data.cv_url || '');
      }

      // Fetch CV Button visibility
      const { data: buttonData, error: buttonError } = await supabase.from('settings').select('cv_url').eq('id', 'cv_button_visibility').maybeSingle();
      if (!buttonError && buttonData) {
        setShowCVButton(buttonData.cv_url !== 'false');
      }
    } catch (e) {
      console.error("Fetch settings error:", e);
    }
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatus(null);

    try {
      // Usiamo upsert per creare o aggiornare la riga 'global'
      const { error } = await supabase
        .from('settings')
        .upsert({ 
          id: 'global', 
          cv_url: cvUrl, 
          updated_at: new Date().toISOString() 
        }, { onConflict: 'id' });

      if (error) {
        if (error.message.includes("not found")) {
          setStatus({ 
            type: 'error', 
            message: 'Errore: La tabella "settings" non esiste ancora nel database. Assicurati di aver eseguito lo script SQL fornito.' 
          });
        } else {
          setStatus({ type: 'error', message: 'Errore durante il salvataggio: ' + error.message });
        }
      } else {
        setStatus({ type: 'success', message: 'Link del CV aggiornato con successo!' });
      }
    } catch (err: any) {
      setStatus({ type: 'error', message: 'Errore critico: ' + err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleToggleCVButton = async () => {
    setToggling(true);
    setStatus(null);
    const newValue = !showCVButton;
    try {
      const { error } = await supabase
        .from('settings')
        .upsert({
          id: 'cv_button_visibility',
          cv_url: newValue ? 'true' : 'false',
          updated_at: new Date().toISOString()
        }, { onConflict: 'id' });

      if (error) {
        setStatus({ type: 'error', message: 'Errore durante la modifica della visibilità del pulsante: ' + error.message });
      } else {
        setShowCVButton(newValue);
        setStatus({ type: 'success', message: `Visibilità del pulsante "Il mio CV" aggiornata! Ora è ${newValue ? 'visibile' : 'nascosto'}.` });
      }
    } catch (err: any) {
      setStatus({ type: 'error', message: 'Errore critico durante il toggle: ' + err.message });
    } finally {
      setToggling(false);
    }
  };

  if (loading) return <div className="p-10 text-center font-medium">Caricamento impostazioni...</div>;

  return (
    <div className="animate-in fade-in duration-500 max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Gestione CV</h1>
      
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <div className="mb-8 flex items-center gap-4">
          <div className="p-4 bg-primary/10 text-primary rounded-2xl">
            <FileText size={32} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Aggiorna il tuo CV</h2>
            <p className="text-gray-500 text-sm">Inserisci il link di condivisione di Google Drive del tuo PDF.</p>
          </div>
        </div>

        {status && (
          <div className={`mb-6 p-6 rounded-2xl text-sm font-bold border ${status.type === 'success' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase mb-2 tracking-widest">Link Google Drive</label>
            <input 
              required
              type="url"
              placeholder="https://drive.google.com/file/d/.../view"
              className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary outline-none transition-all text-sm font-medium"
              value={cvUrl}
              onChange={(e) => setCvUrl(e.target.value)}
            />
          </div>
          
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">Suggerimento</p>
            <p className="text-xs text-slate-600 leading-relaxed">
              Assicurati che il file sia impostato su <strong>"Chiunque abbia il link"</strong> in Google Drive affinché possa essere visualizzato dai visitatori del sito.
            </p>
          </div>

          <button 
            type="submit"
            disabled={saving}
            className="w-full py-4 bg-primary text-white rounded-2xl font-black shadow-lg hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
          >
            {saving ? 'Salvataggio in corso...' : 'Salva Link CV'}
          </button>
        </form>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mt-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-primary/10 text-primary rounded-2xl">
              <FileText size={32} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Pulsante CV nella Home</h2>
              <p className="text-gray-500 text-sm">Seleziona se mostrare o nascondere il pulsante "Il mio CV" nella sezione principale.</p>
            </div>
          </div>
          <div className="flex items-center">
            <button
              onClick={handleToggleCVButton}
              disabled={toggling}
              type="button"
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                showCVButton ? 'bg-[#F39637]' : 'bg-gray-200'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  showCVButton ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between text-xs">
          <span className="text-gray-400 font-bold uppercase tracking-wider">Stato attuale:</span>
          <span className={`font-black p-2 rounded-lg ${showCVButton ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`}>
            {showCVButton ? "VISIBILE" : "NASCOSTO"}
          </span>
        </div>
      </div>
    </div>
  );
};

const ManageMutey = () => {
  const [rules, setRules] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [showAIButton, setShowAIButton] = useState(true);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch Rules
      const { data: rulesData, error: rulesError } = await supabase.from('settings').select('mutey_rules').eq('id', 'global').maybeSingle();
      if (!rulesError && rulesData) {
        setRules(rulesData.mutey_rules || '');
      }

      // Fetch Button visibility
      const { data: buttonData, error: buttonError } = await supabase.from('settings').select('cv_url').eq('id', 'ai_button_visibility').maybeSingle();
      if (!buttonError && buttonData) {
        setShowAIButton(buttonData.cv_url !== 'false');
      }
    } catch (e) {
      console.error("Fetch data error:", e);
    }
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatus(null);

    try {
      const { error } = await supabase
        .from('settings')
        .upsert({ 
          id: 'global', 
          mutey_rules: rules, 
          updated_at: new Date().toISOString() 
        }, { onConflict: 'id' });

      if (error) {
        setStatus({ type: 'error', message: 'Errore durante il salvataggio: ' + error.message });
      } else {
        setStatus({ type: 'success', message: 'Regole di Mutey aggiornate con successo!' });
      }
    } catch (err: any) {
      setStatus({ type: 'error', message: 'Errore critico: ' + err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleToggleAIButton = async () => {
    setToggling(true);
    setStatus(null);
    const newValue = !showAIButton;
    try {
      const { error } = await supabase
        .from('settings')
        .upsert({
          id: 'ai_button_visibility',
          cv_url: newValue ? 'true' : 'false',
          updated_at: new Date().toISOString()
        }, { onConflict: 'id' });

      if (error) {
        setStatus({ type: 'error', message: 'Errore durante la modifica della visibilità del pulsante: ' + error.message });
      } else {
        setShowAIButton(newValue);
        setStatus({ type: 'success', message: `Visibilità del pulsante AI aggiornata! Ora è ${newValue ? 'visibile' : 'nascosto'}.` });
      }
    } catch (err: any) {
      setStatus({ type: 'error', message: 'Errore critico durante il toggle: ' + err.message });
    } finally {
      setToggling(false);
    }
  };

  if (loading) return <div className="p-10 text-center font-medium">Caricamento istruzioni...</div>;

  return (
    <div className="animate-in fade-in duration-500 max-w-3xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Gestione Mutey AI</h1>
      
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <div className="mb-8 flex items-center gap-4">
          <div className="p-4 bg-secondary/10 text-secondary rounded-2xl">
            <Sparkles size={32} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Istruzioni di Sistema</h2>
            <p className="text-gray-500 text-sm">Definisci come Mutey deve rispondere ai visitatori.</p>
          </div>
        </div>

        {status && (
          <div className={`mb-6 p-6 rounded-2xl text-sm font-bold border ${status.type === 'success' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase mb-2 tracking-widest">Regole e Personalità</label>
            <textarea 
              required
              rows={12}
              placeholder="Esempio: Rispondi sempre in modo gentile, usa molte emoji, non parlare di politica..."
              className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-secondary outline-none transition-all text-sm font-medium resize-none chat-scrollbar"
              value={rules}
              onChange={(e) => setRules(e.target.value)}
            />
          </div>
          
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">Guida rapida</p>
            <ul className="text-xs text-slate-600 space-y-2 list-disc pl-4">
              <li>Sii specifico sul tono di voce (es. "professionale", "ironico").</li>
              <li>Indica cosa Mutey <strong>deve</strong> o <strong>non deve</strong> dire.</li>
              <li>Puoi inserire informazioni extra che Mutey deve conoscere.</li>
            </ul>
          </div>

          <button 
            type="submit"
            disabled={saving}
            className="w-full py-4 bg-secondary text-white rounded-2xl font-black shadow-lg hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
          >
            {saving ? 'Salvataggio in corso...' : 'Aggiorna Regole Mutey'}
          </button>
        </form>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mt-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-primary/10 text-primary rounded-2xl">
              <Sparkles size={32} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Pulsante AI nella Home</h2>
              <p className="text-gray-500 text-sm">Seleziona se mostrare o nascondere il pulsante "Chiedi alla mia AI personale" nella sezione principale.</p>
            </div>
          </div>
          <div className="flex items-center">
            <button
              onClick={handleToggleAIButton}
              disabled={toggling}
              type="button"
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                showAIButton ? 'bg-[#F39637]' : 'bg-gray-200'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  showAIButton ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between text-xs">
          <span className="text-gray-400 font-bold uppercase tracking-wider">Stato attuale:</span>
          <span className={`font-black p-2 rounded-lg ${showAIButton ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`}>
            {showAIButton ? "VISIBILE" : "NASCOSTO"}
          </span>
        </div>
      </div>
    </div>
  );
};

const ManagePortfolio = () => {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [newItem, setNewItem] = useState({ title: '', description: '', category: 'Branding', image_url: '', is_featured: false, site_url: '' });
  const [loading, setLoading] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => { fetchItems(); }, []);

  useEffect(() => {
    if (isAdding && formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [isAdding]);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newItems = [...items];
    const draggedItem = newItems[draggedIndex];
    newItems.splice(draggedIndex, 1);
    newItems.splice(index, 0, draggedItem);
    
    setDraggedIndex(index);
    setItems(newItems);
  };

  const handleDragEnd = async () => {
    if (draggedIndex === null) return;
    setDraggedIndex(null);

    const now = new Date();
    const updatedItems = items.map((item, index) => {
      const itemDate = new Date(now.getTime() - index * 1000);
      return {
        ...item,
        created_at: itemDate.toISOString()
      };
    });

    setLoading(true);
    try {
      const promises = updatedItems.map((item) => {
        return supabase
          .from('portfolio')
          .update({ created_at: item.created_at })
          .eq('id', item.id);
      });
      await Promise.all(promises);
      setItems(updatedItems);
    } catch (err) {
      console.error("Errore salvataggio ordinamento drag-and-drop:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchItems = async () => {
    try {
      console.log("Dashboard: Fetching portfolio items...");
      const { data, error } = await supabase
        .from('portfolio')
        .select('*')
        .not('category', 'ilike', '%CV%')
        .not('category', 'ilike', '%Curriculum%')
        .order('created_at', { ascending: false });
      if (error) {
        console.error("Errore fetch dashboard:", error);
      } else if (data) {
        console.log("Dashboard: Items fetched:", data.length);
        setItems(data);
      }
    } catch (err) {
      console.error("Critical error in fetchItems dashboard:", err);
    }
  };

  const convertDriveUrl = (url: string) => {
    if (!url) return '';
    const driveRegex = [
      /\/d\/([a-zA-Z0-9_-]+)/,
      /[?&]id=([a-zA-Z0-9_-]+)/,
      /file\/d\/([a-zA-Z0-9_-]+)/
    ];
    for (let regex of driveRegex) {
      const match = url.match(regex);
      if (match && match[1]) return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w800`;
    }
    return url;
  }

  const getSiteUrlFromDescription = (desc: string) => {
    if (!desc) return '';
    const match = desc.match(/\[SITE_URL:(.*?)\]/);
    return match ? match[1] : '';
  };

  const getCleanDescription = (desc: string) => {
    if (!desc) return '';
    return desc.replace(/\[SITE_URL:.*?\]/, '').trim();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const finalUrl = convertDriveUrl(newItem.image_url);
    
    let finalDescription = newItem.description;
    if (newItem.category === 'Web' && newItem.site_url) {
      finalDescription = `${newItem.description} [SITE_URL:${newItem.site_url}]`;
    }
    
    const itemData = { 
      title: newItem.title,
      description: finalDescription,
      category: newItem.category,
      image_url: finalUrl,
      is_featured: newItem.is_featured 
    };

    let result;
    if (editingItem) {
      result = await supabase.from('portfolio').update(itemData).eq('id', editingItem.id);
    } else {
      result = await supabase.from('portfolio').insert([itemData]);
    }
    
    if (result.error) {
      console.error("Submit Error:", result.error);
      alert("Errore nel database: " + result.error.message);
    } else {
      setIsAdding(false);
      setEditingItem(null);
      setNewItem({ title: '', description: '', category: 'Branding', image_url: '', is_featured: false, site_url: '' });
      fetchItems();
    }
    setLoading(false);
  };

  const handleEdit = (item: PortfolioItem) => {
    setEditingItem(item);
    const siteUrl = item.site_url || getSiteUrlFromDescription(item.description || '');
    const cleanDesc = getCleanDescription(item.description || '');
    
    setNewItem({
      title: item.title,
      description: cleanDesc,
      category: item.category,
      image_url: item.image_url,
      is_featured: item.is_featured || false,
      site_url: siteUrl
    });
    setIsAdding(true);
  };

  const toggleFeatured = async (item: PortfolioItem) => {
    const newFeaturedStatus = !item.is_featured;
    setItems(prev => prev.map(i => i.id === item.id ? { ...i, is_featured: newFeaturedStatus } : i));

    const { error } = await supabase
      .from('portfolio')
      .update({ is_featured: newFeaturedStatus })
      .eq('id', item.id);
    
    if (error) {
      console.error("Toggle Error:", error);
      fetchItems();
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Eliminare questo lavoro?')) {
      const { error } = await supabase.from('portfolio').delete().eq('id', id);
      if (error) {
        alert("Errore nell'eliminazione: " + error.message);
      } else {
        fetchItems();
      }
    }
  };

  const closeForm = () => {
    setIsAdding(false);
    setEditingItem(null);
    setNewItem({ title: '', description: '', category: 'Branding', image_url: '', is_featured: false, site_url: '' });
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold text-gray-900">I tuoi Progetti</h1>
        <button 
          onClick={() => isAdding ? closeForm() : setIsAdding(true)} 
          className="w-full sm:w-auto bg-gradient-brand text-white px-6 py-3 rounded-2xl flex items-center justify-center gap-2 font-bold shadow-md hover:scale-105 transition-transform"
        >
          {isAdding ? 'Annulla' : <><Plus size={20} /> Nuovo Progetto</>}
        </button>
      </div>

      {isAdding && (
        <div ref={formRef} className="bg-white p-6 md:p-8 rounded-3xl shadow-xl border border-gray-100 mb-8 animate-in fade-in slide-in-from-top-4 scroll-mt-24">
          <h2 className="text-xl font-bold mb-6 text-gray-900">
            {editingItem ? 'Modifica Progetto' : 'Aggiungi Nuovo Progetto'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Titolo</label>
                  <input required className="w-full p-3 md:p-4 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary outline-none transition-all text-gray-900" 
                    value={newItem.title} onChange={e => setNewItem({...newItem, title: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Categoria</label>
                  <select className="w-full p-3 md:p-4 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary outline-none text-gray-900"
                    value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})}>
                    <option>Branding</option>
                    <option>Flyer & Poster</option>
                    <option>Social Media</option>
                    <option>Print</option>
                    <option>Web</option>
                  </select>
                </div>
                {newItem.category === 'Web' && (
                  <div className="animate-in fade-in duration-200">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Link del sito Web</label>
                    <input 
                      type="url" 
                      placeholder="https://esempio.com" 
                      className="w-full p-3 md:p-4 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary outline-none text-sm text-gray-900 font-semibold"
                      value={newItem.site_url || ''} 
                      onChange={e => setNewItem({...newItem, site_url: e.target.value})} 
                    />
                  </div>
                )}
                <div>
                  <label className="flex items-center gap-3 p-3 md:p-4 bg-gray-50 rounded-xl border border-gray-100 cursor-pointer hover:bg-white transition-colors">
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 accent-primary"
                      checked={newItem.is_featured}
                      onChange={e => setNewItem({...newItem, is_featured: e.target.checked})}
                    />
                    <div className="flex items-center gap-2">
                      <Star size={16} className={newItem.is_featured ? "fill-primary text-primary" : "text-gray-400"} />
                      <span className="text-sm font-bold text-gray-700">In primo piano (Visibile nel sito)</span>
                    </div>
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Link Google Drive {newItem.category === 'Web' && <span className="text-gray-400 font-normal"> (facoltativo)</span>}
                  </label>
                  <input required={newItem.category !== 'Web'} placeholder="Incolla il link 'Condividi' di Drive" className="w-full p-3 md:p-4 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary outline-none text-sm text-gray-900"
                    value={newItem.image_url} onChange={e => setNewItem({...newItem, image_url: e.target.value})} />
                </div>
              </div>
              <div className="space-y-4">
                <label className="block text-sm font-bold text-gray-700 mb-2">Anteprima Visiva</label>
                <div className="aspect-video bg-gray-100 rounded-2xl overflow-hidden border-2 border-dashed border-gray-200 flex items-center justify-center relative group">
                  {newItem.image_url ? (
                    <img src={convertDriveUrl(newItem.image_url)} alt="Preview" referrerPolicy="no-referrer" className={`w-full h-full object-cover ${newItem.category === 'Web' ? 'object-top' : 'object-center'}`} />
                  ) : (
                    <div className="text-center p-6 text-gray-300">
                      <ImageIcon size={32} className="mx-auto mb-2" />
                      <p className="text-[10px] font-bold uppercase">Anteprima Immagine</p>
                    </div>
                  )}
                </div>
                <textarea rows={3} placeholder="Descrizione..." className="w-full p-3 md:p-4 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary outline-none resize-none text-sm text-gray-900"
                  value={newItem.description} onChange={e => setNewItem({...newItem, description: e.target.value})} />
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50">
              {loading ? 'Salvataggio...' : editingItem ? 'Salva Modifiche' : 'Pubblica Progetto'}
            </button>
          </form>
        </div>
      )}

      <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4 mb-6 flex items-center gap-3">
        <GripVertical className="text-primary animate-pulse shrink-0" size={20} />
        <p className="text-sm font-semibold text-primary">
          Trascina e rilascia le schede per riordinare i progetti nel portfolio. L'ordinamento viene salvato automaticamente.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, index) => {
          const isDraggingThis = draggedIndex === index;
          return (
            <div 
              key={item.id} 
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`bg-white rounded-3xl shadow-sm overflow-hidden group hover:shadow-xl transition-all relative cursor-grab active:cursor-grabbing select-none border ${
                isDraggingThis 
                  ? 'opacity-40 border-2 border-dashed border-primary/50 scale-95 shadow-lg' 
                  : 'border-gray-100 hover:border-gray-200'
              }`}
            >
              <button 
                onClick={(e) => { e.stopPropagation(); toggleFeatured(item); }}
                className="absolute top-4 left-4 z-10 p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:scale-125 active:scale-95 transition-all border border-gray-100 group/star"
                title={item.is_featured ? "Rimuovi dai lavori visibili" : "Mostra tra i miei lavori"}
              >
                <Star 
                  size={22} 
                  className={`${item.is_featured ? "fill-primary text-primary" : "text-gray-300 group-hover/star:text-primary"} transition-colors`} 
                />
              </button>
              
              <div 
                className="absolute top-4 right-4 z-10 p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-gray-100 text-gray-400 group-hover:text-primary transition-colors cursor-grab"
                title="Trascina per riordinare"
              >
                <GripVertical size={18} />
              </div>

              <div className="aspect-video relative overflow-hidden bg-gray-100 pointer-events-none">
                <img src={item.image_url} alt="" referrerPolicy="no-referrer" className={`w-full h-full object-cover ${item.category === 'Web' ? 'object-top' : 'object-center'}`} onError={(e) => { (e.target as any).src = 'https://placehold.co/600x400?text=Link+Non+Valido' }} />
                <div className="absolute inset-0 bg-black/60 lg:opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 pointer-events-auto">
                  <button onClick={(e) => { e.stopPropagation(); handleEdit(item); }} className="bg-white text-primary p-3 md:p-4 rounded-full hover:scale-110 transition-transform shadow-lg"><Pencil size={20} className="pointer-events-none" /></button>
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }} className="bg-white text-red-500 p-3 md:p-4 rounded-full hover:scale-110 transition-transform shadow-lg"><Trash2 size={20} className="pointer-events-none" /></button>
                </div>
              </div>
              <div className="p-5">
                <span className="text-[10px] font-black text-primary uppercase tracking-widest">
                  {item.category?.replace(/flayer/i, 'Flyer')}
                </span>
                <h3 className="font-bold text-gray-900 mt-1 truncate">{item.title}</h3>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ManageLeads = () => {
  const [simpleLeads, setSimpleLeads] = useState<SimpleContact[]>([]);
  const [briefLeads, setBriefLeads] = useState<BriefContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<{ type: 'simple' | 'brief', data: any } | null>(null);
  const [leadToDelete, setLeadToDelete] = useState<{ type: 'simple' | 'brief', data: any } | null>(null);

  const [archivedLeadIds, setArchivedLeadIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('archived_lead_ids') || '[]');
    } catch {
      return [];
    }
  });

  const [activeTab, setActiveTab] = useState<'active' | 'archived'>('active');

  useEffect(() => {
    localStorage.setItem('archived_lead_ids', JSON.stringify(archivedLeadIds));
  }, [archivedLeadIds]);

  const handleToggleArchiveLead = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (archivedLeadIds.includes(id)) {
      setArchivedLeadIds(prev => prev.filter(item => item !== id));
    } else {
      setArchivedLeadIds(prev => [...prev, id]);
    }
    if (selectedLead?.data?.id === id) {
      setSelectedLead(null);
    }
  };

  useEffect(() => { fetchLeads(); }, []);

  const fetchLeads = async () => {
    const { data: simple } = await supabase.from('contacts_simple').select('*').order('created_at', { ascending: false });
    const { data: brief } = await supabase.from('contacts_brief').select('*').order('created_at', { ascending: false });
    
    const allSimple = simple || [];
    const allBrief = brief || [];

    setSimpleLeads(allSimple.filter(l => !l.is_deleted));
    setBriefLeads(allBrief.filter(l => !l.is_deleted));
    
    setLoading(false);
  };

  const handleDeleteLead = async (id: string, type: 'simple' | 'brief') => {
    if (type === 'simple') {
      setSimpleLeads(prev => prev.filter(l => l.id !== id));
    } else {
      setBriefLeads(prev => prev.filter(l => l.id !== id));
    }
    setArchivedLeadIds(prev => prev.filter(item => item !== id));

    if (selectedLead?.data?.id === id && selectedLead?.type === type) {
      setSelectedLead(null);
    }
    setLeadToDelete(null);

    const table = type === 'simple' ? 'contacts_simple' : 'contacts_brief';
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Errore eliminazione lead:", error);
      fetchLeads();
    }
  };

  const toggleReadStatus = async (e: React.MouseEvent, id: string, currentStatus: boolean, type: 'simple' | 'brief') => {
    e.stopPropagation();
    const table = type === 'simple' ? 'contacts_simple' : 'contacts_brief';
    const newStatus = !currentStatus;

    if (type === 'simple') {
      setSimpleLeads(prev => prev.map(l => l.id === id ? { ...l, is_read: newStatus } : l));
    } else {
      setBriefLeads(prev => prev.map(l => l.id === id ? { ...l, is_read: newStatus } : l));
    }

    const { error } = await supabase
      .from(table)
      .update({ is_read: newStatus })
      .eq('id', id);

    if (error) {
      console.error("Errore aggiornamento stato lettura:", error);
      fetchLeads();
    }
  };

  const downloadLeadTxt = (lead: any, type: 'simple' | 'brief') => {
    const content = type === 'simple' 
      ? `NOME: ${lead.name}\nEMAIL: ${lead.email}\n\nMESSAGGIO:\n${lead.message}`
      : `NOME: ${lead.name}\nEMAIL: ${lead.email}\nTELEFONO: ${lead.phone || 'N/A'}\nSERVIZI: ${lead.services?.join(', ') || 'Nessuno'}\n\nNOTE:\n${lead.notes}`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `lead_${lead.name.toLowerCase().replace(/\s+/g, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const downloadAllAsZip = async () => {
    const zip = new JSZip();
    const folder = zip.folder("leads_francesca_mutolo");
    simpleLeads.forEach((lead, index) => {
      const content = `RAPIDO\nDATA: ${new Date(lead.created_at).toLocaleString()}\nNOME: ${lead.name}\nEMAIL: ${lead.email}\n\nMESSAGGIO:\n${lead.message}`;
      folder?.file(`contatti_rapidi/contatto_${lead.name.replace(/\s+/g, '_').toLowerCase()}_${index}.txt`, content);
    });
    briefLeads.forEach((lead, index) => {
      const content = `BRIEF\nDATA: ${new Date(lead.created_at).toLocaleString()}\nNOME: ${lead.name}\nEMAIL: ${lead.email}\nTELEFONO: ${lead.phone || 'N/A'}\n\nSERVIZI:\n${lead.services?.join(', ') || 'Nessuno'}\n\nNOTE:\n${lead.notes}`;
      folder?.file(`brief_progetto/brief_${lead.name.replace(/\s+/g, '_').toLowerCase()}_${index}.txt`, content);
    });
    const content = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(content);
    const link = document.createElement('a');
    link.href = url;
    link.download = `leads_export.zip`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <div className="p-10 text-center font-medium">Caricamento messaggi...</div>;

  const totalActiveLeadsCount = simpleLeads.filter(l => !archivedLeadIds.includes(l.id)).length + briefLeads.filter(l => !archivedLeadIds.includes(l.id)).length;
  const totalArchivedLeadsCount = simpleLeads.filter(l => archivedLeadIds.includes(l.id)).length + briefLeads.filter(l => archivedLeadIds.includes(l.id)).length;

  const filteredSimpleLeads = activeTab === 'active' 
    ? simpleLeads.filter(l => !archivedLeadIds.includes(l.id))
    : simpleLeads.filter(l => archivedLeadIds.includes(l.id));

  const filteredBriefLeads = activeTab === 'active' 
    ? briefLeads.filter(l => !archivedLeadIds.includes(l.id))
    : briefLeads.filter(l => archivedLeadIds.includes(l.id));

  return (
    <div className="space-y-12 pb-24 relative animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Messaggi Ricevuti</h1>
        <div className="flex gap-3 w-full sm:w-auto">
          <button onClick={downloadAllAsZip} className="flex-grow sm:flex-grow-0 bg-white border border-gray-200 text-gray-700 px-6 py-3 rounded-2xl flex items-center justify-center gap-2 font-bold shadow-sm hover:bg-gray-50 transition-all">
            <FileJson size={20} /> Scarica Tutto
          </button>
        </div>
      </div>

      <div className="rounded-[2rem] md:rounded-[3rem] p-4 md:p-8 bg-white border border-gray-100 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-gray-100 pb-6">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-2xl bg-primary/10 text-primary">
               <RefreshCw size={28} />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-black text-gray-900">
                {activeTab === 'active' ? 'Messaggi Attivi' : 'Messaggi Archiviati'}
              </h2>
              <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest">Clicca sull'icona flag per selezionare se il messaggio è letto</p>
            </div>
          </div>

          <div className="flex gap-2 bg-gray-50 p-1.5 rounded-2xl border border-gray-100 w-full md:w-auto">
            <button 
              onClick={() => setActiveTab('active')}
              className={`flex-1 md:flex-initial px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${
                activeTab === 'active' 
                  ? 'bg-primary text-white shadow-md shadow-primary/20' 
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              Attivi ({totalActiveLeadsCount})
            </button>
            <button 
              onClick={() => setActiveTab('archived')}
              className={`flex-1 md:flex-initial px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${
                activeTab === 'archived' 
                  ? 'bg-primary text-white shadow-md shadow-primary/20' 
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              Archiviati ({totalArchivedLeadsCount})
            </button>
          </div>
        </div>

        <section className="mb-12">
          <h3 className="text-sm font-black text-primary/60 uppercase tracking-widest mb-6 flex items-center gap-2">
            <Mail size={16} /> Contatti Rapidi
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSimpleLeads.map(lead => (
              <div 
                key={lead.id} 
                className={`bg-white p-6 rounded-[2rem] border border-gray-100 hover:border-primary/30 transition-all cursor-pointer relative group`}
                onClick={() => setSelectedLead({ type: 'simple', data: lead })}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all bg-primary/5 text-primary group-hover:scale-110`}>
                      <Mail size={18} />
                    </div>
                    
                    <button 
                      onClick={(e) => toggleReadStatus(e, lead.id, lead.is_read, 'simple')}
                      className={`flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider border transition-all ${
                        lead.is_read 
                          ? 'bg-gray-50 text-gray-400 border-gray-100 hover:text-primary hover:border-primary/20' 
                          : 'bg-green-50 text-green-600 border-green-100/50'
                      }`}
                      title={lead.is_read ? "Segna come non letto" : "Segna come letto"}
                    >
                      <Flag size={10} fill={lead.is_read ? "none" : "currentColor"} />
                      {lead.is_read ? 'Letto' : 'Da Leggere'}
                    </button>
                  </div>
                  <div className="flex gap-1.5">
                    <button 
                      onClick={(e) => { e.stopPropagation(); downloadLeadTxt(lead, 'simple'); }} 
                      className="p-1.5 text-gray-400 hover:text-primary hover:bg-gray-100 transition-colors bg-gray-50 rounded-full"
                      title="Scarica come TXT"
                    >
                      <Download size={14} />
                    </button>
                    <button 
                      onClick={(e) => handleToggleArchiveLead(e, lead.id)} 
                      className={`p-1.5 transition-colors bg-gray-50 rounded-full hover:bg-gray-100 ${
                        archivedLeadIds.includes(lead.id) 
                          ? 'text-green-600 hover:text-green-700 hover:bg-green-50' 
                          : 'text-gray-400 hover:text-primary'
                      }`}
                      title={archivedLeadIds.includes(lead.id) ? "Ripristina nei Messaggi Attivi" : "Archivia Messaggio"}
                    >
                      <Archive size={14} />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setLeadToDelete({ type: 'simple', data: lead }); }} 
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors bg-gray-50 rounded-full"
                      title="Elimina Messaggio"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <h4 className="font-bold text-gray-900 mb-1 truncate">{lead.name}</h4>
                <p className="text-xs text-primary font-bold mb-4 truncate">{lead.email}</p>
                <div className="text-xs text-gray-400 line-clamp-2 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                  "{lead.message}"
                </div>
              </div>
            ))}
            {filteredSimpleLeads.length === 0 && (
              <div className="col-span-full py-8 text-center text-gray-300 font-medium border-2 border-dashed border-gray-100 rounded-[2rem]">
                {activeTab === 'active' ? 'Nessun contatto rapido attivo' : 'Nessun contatto rapido archiviato'}
              </div>
            )}
          </div>
        </section>

        <section>
          <h3 className="text-sm font-black text-secondary/60 uppercase tracking-widest mb-6 flex items-center gap-2">
            <Briefcase size={16} /> Brief Dettagliati
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredBriefLeads.map(lead => (
              <div 
                key={lead.id} 
                className={`bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] border border-gray-100 hover:border-secondary/30 transition-all cursor-pointer relative group`}
                onClick={() => setSelectedLead({ type: 'brief', data: lead })}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all bg-secondary/10 text-secondary group-hover:scale-110`}>
                      <Briefcase size={22} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h4 className="font-bold text-gray-900 leading-tight">{lead.name}</h4>
                        
                        <button 
                          onClick={(e) => toggleReadStatus(e, lead.id, lead.is_read, 'brief')}
                          className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider border transition-all ${
                            lead.is_read 
                              ? 'bg-gray-50 text-gray-400 border-gray-100 hover:text-secondary hover:border-secondary/20' 
                              : 'bg-green-50 text-green-600 border-green-100/50'
                          }`}
                          title={lead.is_read ? "Segna come non letto" : "Segna come letto"}
                        >
                          <Flag size={8} fill={lead.is_read ? "none" : "currentColor"} />
                          {lead.is_read ? 'Letto' : 'Da Leggere'}
                        </button>
                      </div>
                      <p className="text-[10px] text-secondary font-black tracking-widest uppercase mt-0.5">Lead Dettagliato</p>
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    <button 
                      onClick={(e) => { e.stopPropagation(); downloadLeadTxt(lead, 'brief'); }} 
                      className="p-2 text-gray-400 hover:text-secondary hover:bg-gray-100 transition-colors bg-gray-50 rounded-full"
                      title="Scarica come TXT"
                    >
                      <Download size={16} />
                    </button>
                    <button 
                      onClick={(e) => handleToggleArchiveLead(e, lead.id)} 
                      className={`p-2 transition-colors bg-gray-50 rounded-full hover:bg-gray-100 ${
                        archivedLeadIds.includes(lead.id) 
                          ? 'text-green-600 hover:text-green-700 hover:bg-green-50' 
                          : 'text-gray-400 hover:text-secondary'
                      }`}
                      title={archivedLeadIds.includes(lead.id) ? "Ripristina nei Messaggi Attivi" : "Archivia Brief"}
                    >
                      <Archive size={16} />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setLeadToDelete({ type: 'brief', data: lead }); }} 
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors bg-gray-50 rounded-full"
                      title="Elimina Brief"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="text-xs text-gray-500 bg-gray-50/50 p-4 rounded-2xl border border-gray-100 line-clamp-2">
                  <strong>Note:</strong> {lead.notes}
                </div>
              </div>
            ))}
            {filteredBriefLeads.length === 0 && (
              <div className="col-span-full py-8 text-center text-gray-300 font-medium border-2 border-dashed border-gray-100 rounded-[2rem]">
                {activeTab === 'active' ? 'Nessun brief dettagliato attivo' : 'Nessun brief dettagliato archiviato'}
              </div>
            )}
          </div>
        </section>
      </div>

      {selectedLead && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brandDark/80 backdrop-blur-md animate-in fade-in" onClick={() => setSelectedLead(null)}>
          <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-[2rem] md:rounded-[3.5rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 md:p-10 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-4 md:gap-5">
                <div className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center shadow-inner ${selectedLead.type === 'simple' ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'}`}>
                  {selectedLead.type === 'simple' ? <Mail size={24} /> : <Briefcase size={24} />}
                </div>
                <div>
                  <h3 className="text-xl md:text-3xl font-black text-gray-900 leading-tight truncate max-w-[200px] md:max-w-none">{selectedLead.data.name}</h3>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Dettagli Richiesta</p>
                </div>
              </div>
              <button onClick={() => setSelectedLead(null)} className="p-2 md:p-4 bg-gray-100 text-gray-400 hover:text-gray-900 rounded-full transition-all">
                <X size={24} />
              </button>
            </div>
            <div className="flex-grow overflow-y-auto p-6 md:p-10 space-y-6 md:space-y-10 chat-scrollbar">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8">
                <div className="bg-slate-50 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-slate-100">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</div>
                    <CopyButton text={selectedLead.data.email} colorClass={selectedLead.type === 'simple' ? "text-primary" : "text-secondary"} />
                  </div>
                  <div className="font-bold text-gray-900 break-all text-sm md:text-base">{selectedLead.data.email}</div>
                </div>
                <div className="bg-slate-50 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-slate-100">
                  <div className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Ricevuto il</div>
                  <div className="font-bold text-gray-900 text-sm md:text-base">{new Date(selectedLead.data.created_at).toLocaleString('it-IT')}</div>
                </div>
              </div>
              {selectedLead.type === 'brief' && selectedLead.data.services?.length > 0 && (
                <div className="space-y-4">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Servizi Richiesti</div>
                  <div className="flex flex-wrap gap-2 md:gap-3">
                    {selectedLead.data.services.map((s: string) => (
                      <span key={s} className="px-3 py-1.5 md:px-5 md:py-2.5 bg-secondary/10 text-secondary text-[10px] md:text-xs font-black rounded-xl uppercase border border-secondary/5">{s}</span>
                    ))}
                  </div>
                </div>
              )}
              <div className="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border-2 border-dashed border-slate-100">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Messaggio</div>
                <p className="text-gray-700 leading-relaxed text-base md:text-lg whitespace-pre-wrap">
                  "{selectedLead.type === 'simple' ? selectedLead.data.message : selectedLead.data.notes}"
                </p>
              </div>
            </div>
            <div className="p-6 md:p-10 bg-gray-50/50 border-t border-gray-100 flex-shrink-0 flex gap-4">
               <button onClick={() => downloadLeadTxt(selectedLead.data, selectedLead.type)} className="flex-grow py-4 md:py-5 bg-brandDark text-white rounded-2xl font-black flex items-center justify-center gap-3 md:gap-4 hover:scale-[1.02] transition-all shadow-xl active:scale-95 group text-sm md:text-base">
                 <Download size={20} className="md:w-6 md:h-6" /> 
                 <span>Scarica Archivio (.TXT)</span>
               </button>
               <button 
                 onClick={(e) => { handleToggleArchiveLead(e, selectedLead.data.id); }}
                 className={`px-6 py-4 md:py-5 border rounded-2xl font-black flex items-center justify-center gap-2 hover:scale-[1.02] transition-all shadow-xl active:scale-95 text-sm md:text-base ${
                   archivedLeadIds.includes(selectedLead.data.id)
                     ? 'bg-green-600 hover:bg-green-700 text-white border-green-750'
                     : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-200 hover:text-primary'
                 }`}
                 title={archivedLeadIds.includes(selectedLead.data.id) ? "Ripristina" : "Archivia"}
               >
                 <Archive size={20} />
                 <span className="hidden sm:inline">{archivedLeadIds.includes(selectedLead.data.id) ? 'Ripristina' : 'Archivia'}</span>
               </button>
               <button 
                 onClick={() => setLeadToDelete({ type: selectedLead.type, data: selectedLead.data })}
                 className="px-6 py-4 md:py-5 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black flex items-center justify-center gap-2 hover:scale-[1.02] transition-all shadow-xl active:scale-95 text-sm md:text-base"
                 title="Elimina definitivo"
               >
                 <Trash2 size={20} />
                 <span className="hidden sm:inline">Elimina</span>
               </button>
            </div>
          </div>
        </div>
      )}

      {leadToDelete && (
        <div 
          className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in"
          onClick={() => setLeadToDelete(null)}
        >
          <div 
            className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl p-6 md:p-8 flex flex-col overflow-hidden animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex gap-4 items-start mb-6">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                <Trash2 size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 font-sans mt-1">Sei sicuro?</h3>
                <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                  Stai per eliminare questo {leadToDelete.type === 'simple' ? 'messaggio' : 'brief'}. Questa operazione non può essere annullata.
                </p>
              </div>
            </div>
            
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setLeadToDelete(null)}
                className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-xs transition-all"
              >
                Annulla
              </button>
              <button 
                onClick={() => handleDeleteLead(leadToDelete.data.id, leadToDelete.type)}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs transition-all flex items-center gap-1.5"
              >
                Conferma ed Elimina
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const DEFAULT_QUESTIONS = {
  step1: {
    title: "1. Il tuo Brand / Attività",
    company_name_label: "Come si chiama l'azienda o il brand?",
    company_name_placeholder: "Nome ufficiale del brand",
    name_meaning_label: "Qual è il significato del nome?",
    name_meaning_placeholder: "Raccontami l'origine, l'ispirazione o la storia del nome...",
    business_description_label: "Di cosa si occupa esattamente?",
    business_description_placeholder: "Descrivi la missione del brand e il suo posizionamento generale...",
    products_services_label: "Quali prodotti o servizi offre?",
    products_services_placeholder: "Elenchi o descrizioni dei principali prodotti/servizi offerti...",
    strength_point_label: "Qual è il suo principale punto di forza rispetto ai concorrenti?",
    strength_point_placeholder: "Cosa vi rende unici o speciali?",
    slogan_label: "Esiste uno slogan o payoff?",
    slogan_placeholder: "Es: Just do it, Think different..."
  },
  step2: {
    title: "2. Target Clienti",
    target_customers_label: "Chi sono i clienti ideali?",
    target_customers_placeholder: "Descrivi i tuoi clienti ideali (interessi, stile di vita, desideri)...",
    age_range_label: "Fascia d'età prevalente?",
    age_range_placeholder: "Es: 18-35 anni, adulti, famiglie, ragazzi...",
    customer_type_label: "La clientela è principalmente composta da:",
    customer_type_options: ["Privati", "Aziende", "Entrambi"],
    market_scope_label: "Ambito del mercato di riferimento:",
    market_scope_options: ["Locale", "Nazionale", "Internazionale"],
    brand_perception_target_label: "Che percezione vuoi trasmettere ai tuoi clienti?",
    brand_perception_target_placeholder: "Es: Fiducia, lusso, freschezza, innovazione, sicurezza..."
  },
  step3: {
    title: "3. Posizionamento & Personalità",
    keywords_label: "Seleziona le parole chiave che definiscono il tuo Brand (Seleziona max 4):",
    keywords_options: ["Professionale", "Elegante", "Moderno", "Premium", "Minimal", "Innovativo", "Tecnologico", "Affidabile", "Creativo", "Artigianale", "Giovane", "Esclusivo"],
    brand_perception_label: "Come vuoi che il cliente percepisca il tuo brand?",
    brand_perception_placeholder: "In che modo vuoi posizionarti nella mente della clientela?",
    brand_personified_label: "Se il brand fosse una persona, come sarebbe? (Facoltativo)",
    brand_personified_placeholder: "Età, carattere, come si veste, come parla (es. raffinata e sicura, oppure sportiva ed estroversa)..."
  },
  step4: {
    title: "4. Preferenze Estetiche",
    palette_favorite_label: "Hai colori preferiti?",
    palette_favorite_placeholder: "Es: Rosso ciliegia, nero grafite, oro satinato...",
    palette_avoid_label: "Ci sono colori che vorresti evitare? (Perché?)",
    palette_avoid_placeholder: "Es: Evitare il verde perché associato a un competitor specifico...",
    logo_style_label: "Stile del logo preferito:",
    logo_style_options: ["Minimal", "Elaborato", "Indifferente"],
    logo_composition_label: "Composizione del logo:",
    logo_composition_options: ["Simbolo + Testo", "Solo Testo", "Entrambi / Dipende"],
    logos_liked_label: "Hai esempi di loghi che ti piacciono?",
    logos_liked_placeholder: "Descrivili o cita marchi noti che ammiri...",
    logos_disliked_label: "Hai esempi di loghi che NON ti piacciono?",
    logos_disliked_placeholder: "Marchi o soluzioni stilistiche che preferiresti evitare..."
  },
  step5: {
    title: "5. Analisi della Concorrenza",
    competitors_label: "Chi sono i tuoi principali concorrenti?",
    competitors_placeholder: "Nomi, siti web o riferimenti dei competitor diretti o indiretti...",
    admired_companies_label: "Ci sono aziende del tuo settore che apprezzi particolarmente?",
    admired_companies_placeholder: "Anche marchi non concorrenti, ma che hanno una comunicazione che trovi vincente...",
    differentiation_strategy_label: "Strategia di differenziazione desiderata:",
    differentiation_strategy_options: ["Distinguerci nettamente dai concorrenti", "Rimanere allineati nel linguaggio visivo del settore"]
  },
  step6: {
    title: "6. Applicazioni e Utilizzo",
    logo_applications_label: "Dove verrà utilizzato principalmente il logo? (Seleziona uno o più):",
    logo_applications_options: ["Online", "Social", "Sito web", "Biglietti da visita", "Insegne", "Veicoli", "Abbigliamento", "Packaging"]
  },
  step7: {
    title: "7. Consegna & Brand Manual",
    deadline_label: "Entro quando serve il progetto?",
    deadline_placeholder: "Es: Entro 2 settimane, entro un mese, nessuna fretta...",
    extra_deliverables_label: "Insieme al logo, hai bisogno di (Seleziona uno o più):",
    extra_deliverables_options: ["palette colori", "versioni monocromatiche", "logo orizzontale", "logo verticale", "favicon", "biglietto da visita", "carta intestata", "landing page", "grafica insegna", "flyer, locandina, menu o simili"]
  },
  step8: {
    title: "Ultima Domanda Importante",
    five_years_vision_label: "Se tra 5 anni il tuo brand avrà successo, quale immagine vorresti che le persone avessero in mente quando vedono il logo?",
    five_years_vision_placeholder: "Scrivi qui la tua visione a lungo termine...",
    notes_label: "Note aggiuntive (facoltativo)",
    notes_placeholder: "Aggiungi eventualmente qualche pensiero, direttiva, idea..."
  }
};

const ManageQuestionnaires = () => {
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuest, setSelectedQuest] = useState<Questionnaire | null>(null);
  const [errorInfo, setErrorInfo] = useState<string | null>(null);
  const [questToDelete, setQuestToDelete] = useState<Questionnaire | null>(null);

  const [archivedQuestIds, setArchivedQuestIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('archived_quest_ids') || '[]');
    } catch {
      return [];
    }
  });

  const [activeTab, setActiveTab] = useState<'active' | 'archived' | 'edit_questions'>('active');
  const [questionsSchema, setQuestionsSchema] = useState<any>(null);
  const [editorStep, setEditorStep] = useState(1);
  const [savingQuestions, setSavingQuestions] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const fetchQuestionsSchema = async () => {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('mutey_rules')
        .eq('id', 'questionnaire_questions')
        .maybeSingle();
      if (!error && data && data.mutey_rules) {
        setQuestionsSchema(JSON.parse(data.mutey_rules));
      } else {
        setQuestionsSchema(DEFAULT_QUESTIONS);
      }
    } catch (e) {
      console.error("Errore fetch domande custom:", e);
      setQuestionsSchema(DEFAULT_QUESTIONS);
    }
  };

  const handleSaveQuestions = async () => {
    setSavingQuestions(true);
    setSaveStatus(null);
    try {
      const { error } = await supabase
        .from('settings')
        .upsert({
          id: 'questionnaire_questions',
          mutey_rules: JSON.stringify(questionsSchema),
          updated_at: new Date().toISOString()
        }, { onConflict: 'id' });
      if (error) {
        setSaveStatus({ type: 'error', message: 'Errore durante il salvataggio: ' + error.message });
      } else {
        setSaveStatus({ type: 'success', message: 'Domande del questionario salvate con successo!' });
        setTimeout(() => setSaveStatus(null), 4000);
      }
    } catch (err: any) {
      setSaveStatus({ type: 'error', message: 'Errore nel salvataggio: ' + err.message });
    } finally {
      setSavingQuestions(false);
    }
  };

  const handleFieldChange = (stepNum: number, field: string, value: string) => {
    setQuestionsSchema((prev: any) => {
      const stepKey = `step${stepNum}`;
      return {
        ...prev,
        [stepKey]: {
          ...prev[stepKey],
          [field]: value
        }
      };
    });
  };

  const handleArrayFieldChange = (stepNum: number, field: string, commaString: string) => {
    const arr = commaString.split(',').map(s => s.trim()).filter(Boolean);
    setQuestionsSchema((prev: any) => {
      const stepKey = `step${stepNum}`;
      return {
        ...prev,
        [stepKey]: {
          ...prev[stepKey],
          [field]: arr
        }
      };
    });
  };

  const isFieldDeleted = (stepNum: number, field: string) => {
    const stepKey = `step${stepNum}`;
    const stepObj = questionsSchema?.[stepKey];
    return stepObj?.deleted_fields?.includes(field) || false;
  };

  const toggleFieldDeletion = (stepNum: number, field: string) => {
    setQuestionsSchema((prev: any) => {
      const stepKey = `step${stepNum}`;
      const stepObj = prev[stepKey] || {};
      const deletedList = stepObj.deleted_fields || [];
      let nextDeleted;
      if (deletedList.includes(field)) {
        nextDeleted = deletedList.filter((f: string) => f !== field);
      } else {
        nextDeleted = [...deletedList, field];
      }
      return {
        ...prev,
        [stepKey]: {
          ...stepObj,
          deleted_fields: nextDeleted
        }
      };
    });
  };

  const handleAddCustomQuestion = () => {
    setQuestionsSchema((prev: any) => {
      const stepKey = `step${editorStep}`;
      const stepObj = prev[stepKey] || {};
      const customQs = stepObj.custom_questions || [];
      const newId = `custom_${Date.now()}`;
      const newQ = {
        id: newId,
        label: 'Nuova Domanda',
        placeholder: 'Esempio di segnaposto...',
        type: 'textarea'
      };
      return {
        ...prev,
        [stepKey]: {
          ...stepObj,
          custom_questions: [...customQs, newQ]
        }
      };
    });
  };

  const handleCustomQuestionChange = (id: string, prop: 'label' | 'placeholder' | 'type', value: string) => {
    setQuestionsSchema((prev: any) => {
      const stepKey = `step${editorStep}`;
      const stepObj = prev[stepKey] || {};
      const customQs = stepObj.custom_questions || [];
      const updatedQs = customQs.map((cq: any) => {
        if (cq.id === id) {
          return { ...cq, [prop]: value };
        }
        return cq;
      });
      return {
        ...prev,
        [stepKey]: {
          ...stepObj,
          custom_questions: updatedQs
        }
      };
    });
  };

  const handleDeleteCustomQuestion = (id: string) => {
    setQuestionsSchema((prev: any) => {
      const stepKey = `step${editorStep}`;
      const stepObj = prev[stepKey] || {};
      const customQs = stepObj.custom_questions || [];
      const updatedQs = customQs.filter((cq: any) => cq.id !== id);
      return {
        ...prev,
        [stepKey]: {
          ...stepObj,
          custom_questions: updatedQs
        }
      };
    });
  };

  useEffect(() => {
    localStorage.setItem('archived_quest_ids', JSON.stringify(archivedQuestIds));
  }, [archivedQuestIds]);

  const handleToggleArchiveQuest = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (archivedQuestIds.includes(id)) {
      setArchivedQuestIds(prev => prev.filter(item => item !== id));
    } else {
      setArchivedQuestIds(prev => [...prev, id]);
    }
    if (selectedQuest?.id === id) {
      setSelectedQuest(null);
    }
  };

  const logoBase64 = logoBase64String;

  const handleDeleteQuest = async (id: string) => {
    setQuestionnaires(prev => prev.filter(q => q.id !== id));
    setArchivedQuestIds(prev => prev.filter(item => item !== id));
    if (selectedQuest?.id === id) {
      setSelectedQuest(null);
    }
    setQuestToDelete(null);

    const { error } = await supabase
      .from('questionnaires')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Errore eliminazione questionario:", error);
      fetchQuestionnaires();
    }
  };

  // States for dynamic quote formulator
  const [pricingQuote, setPricingQuote] = useState<{
    questId: string;
    company_name: string;
    includeBaseService: boolean;
    baseServiceName: string;
    baseServiceItems: { description: string; price: number; discount?: number }[];
    projectReference: string;
    applications: { name: string; price: number; included: boolean; discount?: number }[];
    deliverables: { name: string; price: number; included: boolean; discount?: number }[];
    customItems: { name: string; price: number; included: boolean; discount?: number }[];
    notes: string;
    taxType: 'forfettario' | 'iva22' | 'esente';
    discount: number;
    created_at: string;
  } | null>(null);

  const [newCustomItemName, setNewCustomItemName] = useState("");
  const [newCustomItemPrice, setNewCustomItemPrice] = useState<number | "">("");
  const [exportingPdf, setExportingPdf] = useState(false);
  const [showFullPdfPreview, setShowFullPdfPreview] = useState(false);
  const [previewZoom, setPreviewZoom] = useState<number>(0.75);
  const pdfRef = useRef<HTMLDivElement>(null);

  const handleFormulaQuote = (quest: Questionnaire) => {
    setPricingQuote({
      questId: quest.id,
      company_name: quest.company_name,
      includeBaseService: true,
      baseServiceName: "Studio Brand Identity, Logo Design & Linee Guida",
      baseServiceItems: [
        { description: "Studio strategico del brand", price: 150, discount: 0 },
        { description: "Logo design vettoriale (3-4 proposte iniziali)", price: 250, discount: 0 },
        { description: "Revisioni incluse", price: 100, discount: 0 },
        { description: "Fornitura del Brand Manual finale completo", price: 150, discount: 0 }
      ],
      projectReference: `Studio d'identità visiva elaborato sulla base del questionario ricevuto il ${new Date(quest.created_at).toLocaleDateString('it-IT')}.`,
      applications: quest.logo_applications?.map(app => ({ name: app, price: 0, included: true, discount: 0 })) || [],
      deliverables: quest.extra_deliverables?.map(del => ({ name: del, price: 0, included: true, discount: 0 })) || [],
      customItems: [],
      notes: "Condizioni generali:\n- Acconto del 50% all'approvazione del presente preventivo.\n- Saldo del 50% alla consegna finale di tutti i formati concordati.\n- Tempi di produzione stimati in circa 15-20 giorni lavorativi.",
      taxType: 'forfettario',
      discount: 0,
      created_at: quest.created_at
    });
  };

  const addCustomItem = () => {
    if (!newCustomItemName || !pricingQuote) return;
    const price = typeof newCustomItemPrice === 'number' ? newCustomItemPrice : 0;
    setPricingQuote(prev => {
      if (!prev) return null;
      return {
        ...prev,
        customItems: [...prev.customItems, { name: newCustomItemName, price, included: true }]
      };
    });
    setNewCustomItemName("");
    setNewCustomItemPrice("");
  };

  const removeCustomItem = (index: number) => {
    if (!pricingQuote) return;
    setPricingQuote(prev => {
      if (!prev) return null;
      return {
        ...prev,
        customItems: prev.customItems.filter((_, i) => i !== index)
      };
    });
  };

  const [pdfActiveQuote, setPdfActiveQuote] = useState<any | null>(null);

  const renderQuoteTemplate = (quote: NonNullable<typeof pricingQuote>, isPristine: boolean = false) => {
    const baseServiceFull = quote.includeBaseService 
      ? quote.baseServiceItems.reduce((acc, item) => acc + (item.price || 0), 0) 
      : 0;
    const baseServiceDiscount = quote.includeBaseService 
      ? quote.baseServiceItems.reduce((acc, item) => acc + (item.discount || 0), 0) 
      : 0;

    const appsFull = quote.applications?.reduce((acc, app) => acc + (app.included && app.price ? app.price : 0), 0) || 0;
    const appsDiscount = quote.applications?.reduce((acc, app) => acc + (app.included && app.discount ? app.discount : 0), 0) || 0;

    const delsFull = quote.deliverables?.reduce((acc, del) => acc + (del.included && del.price ? del.price : 0), 0) || 0;
    const delsDiscount = quote.deliverables?.reduce((acc, del) => acc + (del.included && del.discount ? del.discount : 0), 0) || 0;

    const customFull = quote.customItems?.reduce((acc, item) => acc + (item.included && item.price ? item.price : 0), 0) || 0;
    const customDiscount = quote.customItems?.reduce((acc, item) => acc + (item.included && item.discount ? item.discount : 0), 0) || 0;

    const totalFullPrice = baseServiceFull + appsFull + delsFull + customFull;
    const totalItemDiscounts = baseServiceDiscount + appsDiscount + delsDiscount + customDiscount;
    const itemsSum = Math.max(0, totalFullPrice - totalItemDiscounts);
    
    const afterDiscount = Math.max(0, itemsSum - (quote.discount || 0));
    const taxRate = quote.taxType === 'iva22' ? 0.22 : 0;
    const taxAmount = afterDiscount * taxRate;
    const totalNet = afterDiscount + taxAmount;

    return (
      <div 
        className="bg-white p-12 md:p-14 flex flex-col justify-between font-sans text-gray-900 select-none relative"
        style={{ minHeight: '842px', width: '595px', boxSizing: 'border-box' }}
      >
        {/* Top Accent Gradient Line */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-brand animate-none"></div>

        {/* Header: Francesca Identity */}
        <div>
          <div className="flex justify-between items-start gap-4 border-b border-gray-100 pb-5 mt-4 text-left">
            <div className="flex items-center space-x-3 text-left">
              <div className="relative shrink-0">
                <img 
                  src={logoBase64 || "https://drive.google.com/thumbnail?id=14Ps4nKRx1wOah9gZHFo4O3Ynq4qpWpKU&sz=w500"} 
                  alt="Francesca Mutolo Logo" 
                  referrerPolicy="no-referrer"
                  className="h-10 w-10 object-cover rounded-full border-2 border-primary shadow-sm"
                />
                <div className="absolute -inset-1 bg-gradient-brand rounded-full -z-10 opacity-20 blur-sm"></div>
              </div>
              <div className="flex flex-col text-left">
                {isPristine ? (
                  <span className="text-lg font-bold leading-none tracking-tight text-[#C13C8D] font-sans">
                    Francesca Mutolo
                  </span>
                ) : (
                  <span className="text-lg font-bold leading-none tracking-tight text-transparent bg-clip-text bg-gradient-brand font-sans">
                    Francesca Mutolo
                  </span>
                )}
                <span className="text-[10px] font-black text-[#F39637] uppercase tracking-[0.14em] leading-none mt-1 whitespace-nowrap font-sans">
                  Graphic & AI Product Designer
                </span>
              </div>
            </div>

            <div className="text-right flex flex-col justify-start shrink-0">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#C13C8D] font-sans">Proposta di Preventivo</span>
              <span className="text-[9px] text-gray-500 font-semibold mt-1.5 block font-sans">
                Data: {new Date(quote.created_at).toLocaleDateString('it-IT')}
              </span>
            </div>
          </div>

          {/* Recipient / Client context */}
          <div className="flex justify-between gap-4 py-5 border-b border-gray-100/60 text-left">
            <div className="w-[48%]">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-1 font-sans">Destinatario / Brand</span>
              <p className="text-xs font-black text-gray-900 leading-tight font-sans">{quote.company_name}</p>
              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-0.5 font-sans">Cliente Brand Identity</p>
            </div>
            <div className="w-[48%]">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-1 font-sans">Riferimento Progetto</span>
              <p className="text-[10px] font-semibold text-gray-600 leading-relaxed font-sans">{quote.projectReference}</p>
            </div>
          </div>

          {/* Pricing Table */}
          <div className="py-5 border-none">
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-2.5 text-left font-sans">Dettaglio Voci e Tariffe</span>
            
            <div className="border border-gray-150 rounded-xl overflow-hidden bg-white shadow-sm font-sans text-left text-[11px]">
              {/* Table Header */}
              <div className="flex justify-between bg-gray-50/70 border-b border-gray-150 text-gray-400 p-2.5 text-[8.5px] font-black uppercase tracking-wider">
                <div className="w-[70%]">Descrizione Servizio</div>
                <div className="w-[30%] text-right font-sans">Prezzo</div>
              </div>

              {/* 1. Base Service Row */}
              {quote.includeBaseService && (
                <div className="p-3 text-[11px] font-medium border-b border-gray-50 text-gray-750 hover:bg-gray-50/20">
                  <div className="w-full">
                    <p className="font-bold text-gray-950 text-[11px] mb-2 text-left">{quote.baseServiceName}</p>
                    <div className="space-y-1.5 pl-2">
                      {quote.baseServiceItems.map((item, idx) => {
                        const hasDisc = item.discount && item.discount > 0;
                        const netItem = Math.max(0, (item.price || 0) - (item.discount || 0));
                        return (
                          <div key={idx} className="flex justify-between items-center text-[10px] text-gray-600 font-medium font-sans">
                            <span>• {item.description}</span>
                            <span className="font-mono text-gray-500 text-right shrink-0 gap-1.5 flex items-center">
                              {hasDisc ? (
                                <>
                                  <span className="relative inline-block text-gray-400 px-0.5">
                                    <span className="absolute left-0 right-0 top-[55%] h-[1px] bg-gray-400" />
                                    € {item.price.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                                  </span>
                                  <span className="text-[#C13C8D] font-bold">€ {netItem.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</span>
                                </>
                              ) : (
                                <span>€ {item.price.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</span>
                              )}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* 2. Applications */}
              {quote.applications && quote.applications.filter(app => app.included && app.price > 0).map((app, appIdx) => {
                const hasDisc = app.discount && app.discount > 0;
                const netItem = Math.max(0, (app.price || 0) - (app.discount || 0));
                return (
                  <div key={`app-${appIdx}`} className="flex justify-between items-center p-3 text-[11px] font-medium border-b border-gray-50 text-gray-750 hover:bg-gray-50/20">
                    <div className="w-[70%] flex items-center text-left">
                      <div>
                        <p className="font-bold text-gray-950">{app.name}</p>
                        <p className="text-[8px] text-gray-400">Canale di applicazione ed ottimizzazione layout</p>
                      </div>
                    </div>
                    <div className="w-[30%] text-right font-bold text-gray-900 flex items-center justify-end font-mono font-sans gap-1.5">
                      {hasDisc ? (
                        <>
                          <span className="relative inline-block text-gray-400 text-[10px] font-normal px-0.5">
                            <span className="absolute left-0 right-0 top-[55%] h-[1px] bg-gray-400" />
                            € {app.price.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                          </span>
                          <span className="text-[#C13C8D]">€ {netItem.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</span>
                        </>
                      ) : (
                        <span>€ {app.price.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</span>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* 3. Deliverables */}
              {quote.deliverables && quote.deliverables.filter(del => del.included && del.price > 0).map((del, delIdx) => {
                const hasDisc = del.discount && del.discount > 0;
                const netItem = Math.max(0, (del.price || 0) - (del.discount || 0));
                return (
                  <div key={`del-${delIdx}`} className="flex justify-between items-center p-3 text-[11px] font-medium border-b border-gray-50 text-gray-750 hover:bg-gray-50/20">
                    <div className="w-[70%] text-left">
                      <p className="font-bold text-gray-950">{del.name}</p>
                      <p className="text-[8px] text-gray-400">Fornitura di modello stampabile o risorsa brand</p>
                    </div>
                    <div className="w-[30%] text-right font-bold text-gray-900 flex items-center justify-end font-mono font-sans gap-1.5">
                      {hasDisc ? (
                        <>
                          <span className="relative inline-block text-gray-400 text-[10px] font-normal px-0.5">
                            <span className="absolute left-0 right-0 top-[55%] h-[1px] bg-gray-400" />
                            € {del.price.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                          </span>
                          <span className="text-[#C13C8D]">€ {netItem.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</span>
                        </>
                      ) : (
                        <span>€ {del.price.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</span>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* 4. Custom Items */}
              {quote.customItems && quote.customItems.filter(item => item.included && item.price > 0).map((item, itemIdx) => {
                const hasDisc = item.discount && item.discount > 0;
                const netItem = Math.max(0, (item.price || 0) - (item.discount || 0));
                return (
                  <div key={`custom-${itemIdx}`} className="flex justify-between items-center p-3 text-[11px] font-medium border-b border-gray-50 text-gray-750 hover:bg-gray-50/20">
                    <div className="w-[70%] text-left">
                      <p className="font-bold text-gray-950">{item.name}</p>
                      <p className="text-[8px] text-gray-400">Servizio di design personalizzato su misura</p>
                    </div>
                    <div className="w-[30%] text-right font-bold text-gray-900 flex items-center justify-end font-mono font-sans gap-1.5">
                      {hasDisc ? (
                        <>
                          <span className="relative inline-block text-gray-400 text-[10px] font-normal px-0.5">
                            <span className="absolute left-0 right-0 top-[55%] h-[1px] bg-gray-400" />
                            € {item.price.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                          </span>
                          <span className="text-[#C13C8D]">€ {netItem.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</span>
                        </>
                      ) : (
                        <span>€ {item.price.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Area: Totals, Signatures and Notes */}
        <div className="mt-auto">
          <div className="flex justify-between gap-6 items-start py-4 border-t border-gray-100 text-left">
            <div className="w-[58%]">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Condizioni Generali</span>
              <p className="text-[9px] text-gray-500 leading-relaxed whitespace-pre-wrap font-sans">
                {quote.notes}
              </p>
            </div>

            {/* Totals Summary */}
            <div className="w-[38%] bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-1.5 shrink-0 select-none">
              <div className="flex justify-between items-center text-[10px] font-semibold text-gray-500">
                <span>Subtotale pieno:</span>
                <span className="font-mono">€ {totalFullPrice.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</span>
              </div>
              {totalItemDiscounts > 0 && (
                <div className="flex justify-between items-center text-[10px] font-bold text-green-600">
                  <span>Sconto Voci:</span>
                  <span className="font-mono">- € {totalItemDiscounts.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</span>
                </div>
              )}
              {totalItemDiscounts > 0 && (
                <div className="flex justify-between items-center text-[10.5px] font-bold text-gray-900 pt-1 border-t border-dashed border-gray-200">
                  <span>Subtotale netto:</span>
                  <span className="font-mono">€ {itemsSum.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</span>
                </div>
              )}
              {quote.discount > 0 && (
                <div className="flex justify-between items-center text-[10px] font-bold text-green-600">
                  <span>Sconto Extra:</span>
                  <span className="font-mono">- € {quote.discount.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</span>
                </div>
              )}
              {quote.taxType === 'iva22' && (
                <div className="flex justify-between items-center text-[10px] font-semibold text-gray-500">
                  <span>IVA (22%):</span>
                  <span className="font-mono">€ {taxAmount.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</span>
                </div>
              )}

              <div className="pt-2 mt-1 border-t border-gray-200 flex justify-between items-center">
                <span className="text-[10px] font-black text-gray-900 uppercase tracking-wider">Totale:</span>
                <span className="text-sm font-black text-[#C13C8D] font-mono">
                  € {totalNet.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          {/* Footer signatures and information */}
          <div className="flex justify-between items-end gap-6 pt-6 mt-6 border-t border-gray-100 text-[8px] text-gray-400 text-left">
            <div className="space-y-0.5">
              <p className="font-black text-gray-850 uppercase tracking-wider font-sans">Francesca Mutolo</p>
              <p className="font-sans">Graphic & AI Product Designer</p>
            </div>

            <div className="text-right space-y-1 text-[8px] font-sans text-gray-400 shrink-0">
              <span className="font-black uppercase tracking-wider block text-gray-650">Contatti</span>
              <div className="flex flex-col items-end space-y-1">
                <a href="https://francescamutolo.vercel.app" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-primary transition-colors">
                  <Globe size={9} className="text-[#C13C8D] shrink-0" />
                  <span>francescamutolo.vercel.app</span>
                </a>
                <a href="https://instagram.com/francescamutolographicdesigner" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-primary transition-colors">
                  <Instagram size={9} className="text-[#C13C8D] shrink-0" />
                  <span>@francescamutolographicdesigner</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderQuestionnaireTemplate = (quest: Questionnaire) => {
    return (
      <div 
        className="bg-white p-10 md:p-12 flex flex-col justify-between font-sans text-gray-900 select-none relative"
        style={{ width: '595px', minHeight: '842px', boxSizing: 'border-box' }}
      >
        {/* Top Accent Gradient Line */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-brand animate-none"></div>

        <div>
          {/* Header Profile */}
          <div className="flex justify-between items-start gap-4 border-b border-gray-150 pb-5 mt-4 text-left">
            <div className="flex items-center space-x-3 text-left">
              <div className="relative shrink-0">
                <img 
                  src={logoBase64 || "https://drive.google.com/thumbnail?id=14Ps4nKRx1wOah9gZHFo4O3Ynq4qpWpKU&sz=w500"} 
                  alt="Francesca Mutolo Logo" 
                  referrerPolicy="no-referrer"
                  className="h-9 w-9 object-cover rounded-full border-2 border-[#C13C8D] shadow-sm"
                />
                <div className="absolute -inset-1 bg-gradient-brand rounded-full -z-10 opacity-20 blur-sm"></div>
              </div>
              <div className="flex flex-col text-left">
                <span className="text-base font-bold leading-none tracking-tight text-[#C13C8D] font-sans">
                  Francesca Mutolo
                </span>
                <span className="text-[9px] font-black text-[#F39637] uppercase tracking-[0.14em] leading-none mt-1 whitespace-nowrap font-sans">
                  Graphic & AI Product Designer
                </span>
              </div>
            </div>

            <div className="text-right flex flex-col justify-start shrink-0">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#C13C8D] font-sans">Brand Identity Brief</span>
              <span className="text-[9px] text-gray-500 font-semibold mt-1 block font-sans">
                Inviato il: {new Date(quest.created_at).toLocaleDateString('it-IT')}
              </span>
            </div>
          </div>

          {/* Recipient info & Brand */}
          <div className="py-4 border-b border-gray-150 text-left">
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-1 font-sans">Brand / Azienda</span>
            <p className="text-sm font-black text-gray-900 leading-tight font-sans">{quest.company_name}</p>
            {quest.slogan && (
              <p className="text-[10px] italic text-gray-600 mt-1 font-sans">"{quest.slogan}"</p>
            )}
          </div>

          {/* Questionnaire Details */}
          <div className="py-5 space-y-5 text-left text-[11px] leading-relaxed">
            
            {/* 1. Attività & Brand */}
            <div className="border border-gray-150 rounded-xl p-4 bg-white space-y-2">
              <h4 className="text-[10px] font-black text-[#C13C8D] uppercase tracking-widest border-b border-gray-100 pb-1.5 flex items-center gap-1.5">
                <Building size={12} /> 1. Attività & Brand
              </h4>
              <div className="grid grid-cols-1 gap-2">
                {quest.name_meaning && (
                  <div>
                    <span className="text-[8.5px] font-bold text-gray-400 uppercase block">Significato del nome</span>
                    <p className="font-semibold text-gray-700">{quest.name_meaning}</p>
                  </div>
                )}
                {quest.business_description && (
                  <div>
                    <span className="text-[8.5px] font-bold text-gray-400 uppercase block">Di cosa si occupa</span>
                    <p className="font-semibold text-gray-700">{quest.business_description}</p>
                  </div>
                )}
                {quest.products_services && (
                  <div>
                    <span className="text-[8.5px] font-bold text-gray-400 uppercase block">Prodotti o servizi</span>
                    <p className="font-semibold text-gray-700">{quest.products_services}</p>
                  </div>
                )}
                {quest.strength_point && (
                  <div>
                    <span className="text-[8.5px] font-bold text-gray-400 uppercase block">Punto di forza principale</span>
                    <p className="font-semibold text-gray-700 bg-yellow-50/20 border border-yellow-150 p-2 rounded-lg">{quest.strength_point}</p>
                  </div>
                )}
              </div>
            </div>

            {/* 2. Target & Mercato */}
            {(quest.target_customers || quest.customer_type || quest.market_scope || quest.brand_perception_target) && (
              <div className="border border-gray-150 rounded-xl p-4 bg-white space-y-2">
                <h4 className="text-[10px] font-black text-[#C13C8D] uppercase tracking-widest border-b border-gray-100 pb-1.5 flex items-center gap-1.5">
                  <Target size={12} /> 2. Target & Mercato
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  {quest.target_customers && (
                    <div>
                      <span className="text-[8.5px] font-bold text-gray-400 uppercase block">Clienti ideali</span>
                      <p className="font-semibold text-gray-700">{quest.target_customers}</p>
                    </div>
                  )}
                  <div className="grid grid-cols-3 gap-2">
                    {quest.customer_type && (
                      <div>
                        <span className="text-[8.5px] font-bold text-gray-400 uppercase block">Tipo cliente</span>
                        <p className="font-semibold text-gray-700">{quest.customer_type}</p>
                      </div>
                    )}
                    {quest.market_scope && (
                      <div>
                        <span className="text-[8.5px] font-bold text-gray-400 uppercase block">Ambito</span>
                        <p className="font-semibold text-gray-700">{quest.market_scope}</p>
                      </div>
                    )}
                    {quest.age_range && (
                      <div>
                        <span className="text-[8.5px] font-bold text-gray-400 uppercase block">Età target</span>
                        <p className="font-semibold text-gray-700">{quest.age_range}</p>
                      </div>
                    )}
                  </div>
                  {quest.brand_perception_target && (
                    <div>
                      <span className="text-[8.5px] font-bold text-gray-400 uppercase block">Percezione desiderata</span>
                      <p className="font-semibold text-gray-700">{quest.brand_perception_target}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 3. Personalità del Brand */}
            {(quest.brand_perception || quest.brand_personified || (quest.keywords && quest.keywords.length > 0)) && (
              <div className="border border-gray-150 rounded-xl p-4 bg-white space-y-2">
                <h4 className="text-[10px] font-black text-[#C13C8D] uppercase tracking-widest border-b border-gray-100 pb-1.5 flex items-center gap-1.5">
                  <Users size={12} /> 3. Personalità del Brand
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  {quest.keywords && quest.keywords.length > 0 && (
                    <div>
                      <span className="text-[8.5px] font-bold text-gray-400 uppercase block">Parole chiave</span>
                      <p className="font-semibold text-gray-700">{quest.keywords.join(', ')}</p>
                    </div>
                  )}
                  {quest.brand_perception && (
                    <div>
                      <span className="text-[8.5px] font-bold text-gray-400 uppercase block">Percezione brand</span>
                      <p className="font-semibold text-gray-700">{quest.brand_perception}</p>
                    </div>
                  )}
                  {quest.brand_personified && (
                    <div>
                      <span className="text-[8.5px] font-bold text-gray-400 uppercase block">Se fosse una persona</span>
                      <p className="font-semibold text-gray-700">{quest.brand_personified}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 4. Preferenze Estetiche */}
            {(quest.palette_favorite || quest.palette_avoid || quest.logo_style || quest.logo_composition || quest.logos_liked) && (
              <div className="border border-gray-150 rounded-xl p-4 bg-white space-y-2">
                <h4 className="text-[10px] font-black text-[#C13C8D] uppercase tracking-widest border-b border-gray-100 pb-1.5 flex items-center gap-1.5">
                  <Palette size={12} /> 4. Preferenze Estetiche
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  <div className="grid grid-cols-2 gap-2">
                    {quest.palette_favorite && (
                      <div>
                        <span className="text-[8.5px] font-bold text-gray-400 uppercase block">Colori preferiti</span>
                        <p className="font-bold text-green-600">{quest.palette_favorite}</p>
                      </div>
                    )}
                    {quest.palette_avoid && (
                      <div>
                        <span className="text-[8.5px] font-bold text-gray-400 uppercase block">Colori da evitare</span>
                        <p className="font-bold text-red-500">{quest.palette_avoid}</p>
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {quest.logo_style && (
                      <div>
                        <span className="text-[8.5px] font-bold text-gray-400 uppercase block">Stile logo preferito</span>
                        <p className="font-semibold text-gray-700">{quest.logo_style}</p>
                      </div>
                    )}
                    {quest.logo_composition && (
                      <div>
                        <span className="text-[8.5px] font-bold text-gray-400 uppercase block">Composizione logo</span>
                        <p className="font-semibold text-gray-700">{quest.logo_composition}</p>
                      </div>
                    )}
                  </div>
                  {quest.logos_liked && (
                    <div>
                      <span className="text-[8.5px] font-bold text-gray-400 uppercase block">Loghi graditi ed esempi</span>
                      <p className="font-semibold text-gray-700">{quest.logos_liked}</p>
                    </div>
                  )}
                  {quest.logos_disliked && (
                    <div>
                      <span className="text-[8.5px] font-bold text-gray-400 uppercase block">Loghi sgraditi ed esempi</span>
                      <p className="font-semibold text-gray-700">{quest.logos_disliked}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 5. Competitor, Applicazioni & Focus strategico */}
            <div className="border border-gray-150 rounded-xl p-4 bg-white space-y-2">
              <h4 className="text-[10px] font-black text-[#C13C8D] uppercase tracking-widest border-b border-gray-100 pb-1.5 flex items-center gap-1.5">
                <Sparkles size={12} /> 5. Canali, Visione e Note
              </h4>
              <div className="grid grid-cols-1 gap-2">
                {quest.competitors && (
                  <div>
                    <span className="text-[8.5px] font-bold text-gray-400 uppercase block">Concorrenti principali</span>
                    <p className="font-semibold text-gray-700">{quest.competitors}</p>
                  </div>
                )}
                {quest.differentiation_strategy && (
                  <div>
                    <span className="text-[8.5px] font-bold text-gray-400 uppercase block">Differenziazione</span>
                    <p className="font-semibold text-gray-700">{quest.differentiation_strategy}</p>
                  </div>
                )}
                {quest.logo_applications && quest.logo_applications.length > 0 && (
                  <div>
                    <span className="text-[8.5px] font-bold text-gray-400 uppercase block">Applicazioni logo richieste</span>
                    <p className="font-semibold text-gray-700">{quest.logo_applications.join(', ')}</p>
                  </div>
                )}
                {quest.extra_deliverables && quest.extra_deliverables.length > 0 && (
                  <div>
                    <span className="text-[8.5px] font-bold text-gray-400 uppercase block">Elementi aggiuntivi richiesti</span>
                    <p className="font-semibold text-gray-700">{quest.extra_deliverables.join(', ')}</p>
                  </div>
                )}
                {quest.five_years_vision && (
                  <div>
                    <span className="text-[8.5px] font-bold text-gray-400 uppercase block">Visione a 5 anni</span>
                    <p className="font-bold text-gray-800 italic">"{quest.five_years_vision}"</p>
                  </div>
                )}
                {quest.notes && (
                  <div>
                    <span className="text-[8.5px] font-bold text-gray-400 uppercase block">Note aggiuntive</span>
                    <p className="font-semibold text-gray-700 whitespace-pre-wrap">{quest.notes}</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Footer info & contacts */}
        <div className="flex justify-between items-end gap-6 pt-5 mt-5 border-t border-gray-150 text-[8px] text-gray-400 text-left">
          <div className="space-y-0.5">
            <p className="font-black text-gray-850 uppercase tracking-wider font-sans">Francesca Mutolo</p>
            <p className="font-sans">Graphic & AI Product Designer</p>
          </div>

          <div className="text-right space-y-1 text-[8px] font-sans text-gray-400 shrink-0">
            <span className="font-black uppercase tracking-wider block text-gray-650">Contatti</span>
            <div className="flex flex-col items-end space-y-1">
              <a href="https://francescamutolo.vercel.app" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-primary transition-colors">
                <Globe size={9} className="text-[#C13C8D] shrink-0" />
                <span>francescamutolo.vercel.app</span>
              </a>
              <a href="https://instagram.com/francescamutolographicdesigner" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-primary transition-colors">
                <Instagram size={9} className="text-[#C13C8D] shrink-0" />
                <span>@francescamutolographicdesigner</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handleDownloadQuestPdf = (quest: Questionnaire) => {
    setPdfActiveQuote({
      isQuestionnaire: true,
      company_name: quest.company_name,
      questData: quest
    });
  };

  useEffect(() => {
    if (pdfActiveQuote) {
      setExportingPdf(true);
      const timer = setTimeout(() => {
        const element = document.getElementById('pristine-pdf-template');
        if (!element) {
          setExportingPdf(false);
          setPdfActiveQuote(null);
          return;
        }

        html2canvas(element, {
          scale: 2.5,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
          windowWidth: 595,
          windowHeight: 842
        }).then((canvas) => {
          const imgData = canvas.toDataURL('image/jpeg', 0.98);
          const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
          });

          const imgWidth = 210;
          const pageHeight = 297;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          let heightLeft = imgHeight;
          let position = 0;

          pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
          heightLeft -= pageHeight;

          while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
            heightLeft -= pageHeight;
          }

          const fileName = pdfActiveQuote.isQuestionnaire
            ? `Questionario ${pdfActiveQuote.company_name} - Francesca Mutolo.pdf`
            : `Preventivo ${pdfActiveQuote.company_name} - Francesca Mutolo.pdf`;
          pdf.save(fileName);
          setExportingPdf(false);
          setPdfActiveQuote(null);
        }).catch((err) => {
          console.error("PDF generation failed:", err);
          alert("Si è verificato un errore durante la generazione del PDF. Riprova.");
          setExportingPdf(false);
          setPdfActiveQuote(null);
        });
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [pdfActiveQuote]);

  const exportQuoteToPdf = () => {
    if (!pricingQuote) return;
    setPdfActiveQuote(pricingQuote);
  };

  useEffect(() => { 
    fetchQuestionnaires(); 
    fetchQuestionsSchema();
  }, []);

  const fetchQuestionnaires = async () => {
    try {
      const { data, error } = await supabase
        .from('questionnaires')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setQuestionnaires(data || []);
      setErrorInfo(null);
    } catch (err: any) {
      console.error("Fetch questionnaires error:", err);
      if (err.message && err.message.includes("relation") && err.message.includes("does not exist")) {
        setErrorInfo("La tabella 'questionnaires' non esiste nel tuo database Supabase. Assicurati di aver eseguito lo script SQL per creare la tabella e le politiche di sicurezza.");
      } else {
        setErrorInfo(err.message || "Impossibile recuperare i questionari.");
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleReadStatus = async (e: React.MouseEvent, id: string, currentStatus: boolean) => {
    e.stopPropagation();
    const newStatus = !currentStatus;

    setQuestionnaires(prev => prev.map(q => q.id === id ? { ...q, is_read: newStatus } : q));

    const { error } = await supabase
      .from('questionnaires')
      .update({ is_read: newStatus })
      .eq('id', id);

    if (error) {
      console.error("Errore aggiornamento lettura questionario:", error);
      fetchQuestionnaires();
    }
  };

  const downloadQuestTxt = (quest: Questionnaire) => {
    const formattedDate = new Date(quest.created_at).toLocaleString('it-IT');
    const content = `==================================================
QUESTIONARIO BRAND IDENTITY - ${quest.company_name}
Inviato il: ${formattedDate}
==================================================

1. ATTIVITÀ
--------------------------------------------------
- Nome Azienda/Brand: ${quest.company_name}
- Significato del nome: ${quest.name_meaning || 'N/D'}
- Settore/Attività: ${quest.business_description || 'N/D'}
- Prodotti/Servizi: ${quest.products_services || 'N/D'}
- Punto di forza: ${quest.strength_point || 'N/D'}
- Slogan/Payoff: ${quest.slogan || 'N/D'}

2. TARGET
--------------------------------------------------
- Clienti ideali: ${quest.target_customers || 'N/D'}
- Fascia d'età: ${quest.age_range || 'N/D'}
- Tipo cliente: ${quest.customer_type || 'N/D'}
- Ambito mercato: ${quest.market_scope || 'N/D'}
- Percezione desiderata: ${quest.brand_perception_target || 'N/D'}

3. POSIZIONAMENTO E PERSONALITÀ
--------------------------------------------------
- Parole chiave: ${quest.keywords?.join(', ') || 'Nessuna'}
- Percezione brand: ${quest.brand_perception || 'N/D'}
- Se fosse una persona: ${quest.brand_personified || 'N/D'}

4. PREFERENZE ESTETICHE
--------------------------------------------------
- Colori preferiti: ${quest.palette_favorite || 'N/D'}
- Colori da evitare: ${quest.palette_avoid || 'N/D'}
- Stile logo: ${quest.logo_style || 'N/D'}
- Composizione logo: ${quest.logo_composition || 'N/D'}
- Esempi graditi: ${quest.logos_liked || 'N/D'}
- Esempi sgraditi: ${quest.logos_disliked || 'N/D'}

5. CONCORRENZA
--------------------------------------------------
- Concorrenti principali: ${quest.competitors || 'N/D'}
- Aziende apprezzate: ${quest.admired_companies || 'N/D'}
- Differenziazione: ${quest.differentiation_strategy || 'N/D'}

6. UTILIZZO DEL LOGO
--------------------------------------------------
- Canali di applicazione: ${quest.logo_applications?.join(', ') || 'Nessuno'}

7. CONSEGNA E BRAND MANUAL
--------------------------------------------------
- Scadenza richiesta: ${quest.deadline || 'N/D'}
- Elementi aggiuntivi richiesti: ${quest.extra_deliverables?.join(', ') || 'Nessuno'}

8. ULTIMA DOMANDA IMPORTANTE
--------------------------------------------------
- Visione a 5 anni: ${quest.five_years_vision || 'N/D'}

9. NOTE AGGIUNTIVE
--------------------------------------------------
- Note: ${quest.notes || 'N/D'}

==================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `questionario_${quest.company_name.toLowerCase().replace(/\s+/g, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleUpdate = async (quest: Questionnaire, updates: Partial<Questionnaire>) => {
    setQuestionnaires(prev => prev.map(q => q.id === quest.id ? { ...q, ...updates } as Questionnaire : q));
    if (selectedQuest && selectedQuest.id === quest.id) {
       setSelectedQuest(prev => prev ? ({ ...prev, ...updates } as Questionnaire) : null);
    }
    const { error } = await supabase.from('questionnaires').update(updates).eq('id', quest.id);
    if (error) {
       console.error("Errore aggiornamento:", error);
       fetchQuestionnaires();
    }
  };

  if (loading) return <div className="p-10 text-center font-medium">Caricamento questionari...</div>;

  return (
    <div className="space-y-12 pb-24 relative animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Questionari Ricevuti</h1>
          <p className="text-sm text-gray-500 mt-1">Indagini approfondite per la progettazione del brand</p>
        </div>
      </div>

      {errorInfo && (
        <div className="bg-red-50 text-red-600 border border-red-100 p-6 rounded-2xl text-sm font-semibold max-w-4xl">
          <p className="font-extrabold mb-2 uppercase tracking-wider text-xs">Attenzione:</p>
          <p className="mb-4">{errorInfo}</p>
          <div className="bg-gray-900 p-4 rounded-xl text-gray-100 font-mono text-xs overflow-x-auto whitespace-pre">
{`CREATE TABLE IF NOT EXISTS questionnaires (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT NOT NULL,
  name_meaning TEXT,
  business_description TEXT,
  products_services TEXT,
  strength_point TEXT,
  slogan TEXT,
  target_customers TEXT,
  age_range TEXT,
  customer_type TEXT,
  market_scope TEXT,
  brand_perception_target TEXT,
  keywords TEXT[] DEFAULT '{}',
  brand_perception TEXT,
  brand_personified TEXT,
  palette_favorite TEXT,
  palette_avoid TEXT,
  logo_style TEXT,
  logo_composition TEXT,
  logos_liked TEXT,
  logos_disliked TEXT,
  competitors TEXT,
  admired_companies TEXT,
  differentiation_strategy TEXT,
  logo_applications TEXT[] DEFAULT '{}',
  deadline TEXT,
  extra_deliverables TEXT[] DEFAULT '{}',
  five_years_vision TEXT,
  notes TEXT,
  is_deleted BOOLEAN DEFAULT FALSE,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE questionnaires ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Inserimento pubblico questionari" ON questionnaires FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin Select Questionnaires" ON questionnaires FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin Update Questionnaires" ON questionnaires FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admin Delete Questionnaires" ON questionnaires FOR ALL TO authenticated USING (true);`}
          </div>
          <p className="mt-4 text-xs">Esegui questa query nel SQL Editor di Supabase per sincronizzare.</p>
        </div>
      )}

      <div className="rounded-[2rem] md:rounded-[3rem] p-4 md:p-8 bg-white border border-gray-100 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-gray-100 pb-6 whitespace-nowrap">
          <div className="flex items-center gap-3">
            <ClipboardList size={28} className="text-primary animate-pulse" />
            <h2 className="text-xl md:text-2xl font-black text-gray-900">
              {activeTab === 'active' 
                ? 'Questionari Attivi' 
                : activeTab === 'archived' 
                  ? 'Questionari Archiviati' 
                  : 'Personalizza Domande'}
            </h2>
          </div>
          
          <div className="flex flex-wrap gap-2 bg-gray-50 p-1.5 rounded-2xl border border-gray-100 w-full md:w-auto">
            <button 
              onClick={() => setActiveTab('active')}
              className={`flex-grow md:flex-initial px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${
                activeTab === 'active' 
                  ? 'bg-primary text-white shadow-md shadow-primary/20' 
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              Attivi ({questionnaires.filter(q => !archivedQuestIds.includes(q.id)).length})
            </button>
            <button 
              onClick={() => setActiveTab('archived')}
              className={`flex-grow md:flex-initial px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${
                activeTab === 'archived' 
                  ? 'bg-primary text-white shadow-md shadow-primary/20' 
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              Archiviati ({questionnaires.filter(q => archivedQuestIds.includes(q.id)).length})
            </button>
            <button 
              onClick={() => setActiveTab('edit_questions')}
              className={`flex-grow md:flex-initial px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-1.5 ${
                activeTab === 'edit_questions' 
                  ? 'bg-[#C13C8D] text-white shadow-md shadow-[#C13C8D]/20' 
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <Sparkles size={13} fill="currentColor" />
              Personalizza Domande
            </button>
          </div>
        </div>

        {activeTab !== 'edit_questions' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(activeTab === 'active' ? questionnaires.filter(q => !archivedQuestIds.includes(q.id)) : questionnaires.filter(q => archivedQuestIds.includes(q.id))).map(quest => (
              <div 
                key={quest.id}
                onClick={() => setSelectedQuest(quest)}
                className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 hover:border-primary/40 transition-all cursor-pointer relative group flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                        <ClipboardList size={22} />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-gray-900 text-lg leading-tight group-hover:text-primary transition-colors">{quest.company_name}</h3>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                          {new Date(quest.created_at).toLocaleDateString('it-IT')}
                        </p>
                      </div>
                    </div>

                    <button 
                      onClick={(e) => toggleReadStatus(e, quest.id, quest.is_read)}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border transition-all ${
                        quest.is_read 
                          ? 'bg-gray-50 text-gray-400 border-gray-100 hover:text-primary hover:border-primary/20' 
                          : 'bg-green-50 text-green-600 border-green-100/50'
                      }`}
                      title={quest.is_read ? "Segna come non letto" : "Segna come letto"}
                    >
                      <Flag size={10} fill={quest.is_read ? "none" : "currentColor"} />
                      {quest.is_read ? 'Letto' : 'Nuovo'}
                    </button>
                  </div>

                  <div className="space-y-2 my-4">
                    {quest.slogan && (
                      <p className="text-xs italic text-gray-500 font-medium">"{quest.slogan}"</p>
                    )}
                    {quest.business_description && (
                      <p className="text-xs text-gray-600 line-clamp-3 bg-gray-50/50 p-4 rounded-xl border border-gray-100 leading-relaxed font-medium">
                        {quest.business_description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-50 mt-4">
                  <div className="flex flex-wrap gap-1 max-w-[50%]">
                    {quest.keywords?.slice(0, 3).map(k => (
                      <span key={k} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[9px] font-bold rounded-md">{k}</span>
                    ))}
                    {quest.keywords?.length > 3 && (
                      <span className="text-[9px] text-gray-400 font-bold">+{quest.keywords.length - 3}</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleFormulaQuote(quest); }}
                      className="px-3.5 py-1.5 bg-gradient-brand text-white text-[10px] font-black uppercase tracking-wider rounded-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 shadow-sm shadow-primary/10"
                      title="Formula Preventivo"
                    >
                      <Sparkles size={11} />
                      <span className="hidden xl:inline">preventivo</span>
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); downloadQuestTxt(quest); }}
                      className="p-2 text-gray-400 hover:text-primary transition-colors bg-gray-50 rounded-full hover:bg-gray-100"
                      title="Scarica come TXT"
                    >
                      <Download size={16} />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDownloadQuestPdf(quest); }}
                      className="p-2 text-gray-400 hover:text-primary transition-colors bg-gray-50 rounded-full hover:bg-gray-100 flex items-center justify-center"
                      title="Scarica come PDF"
                      disabled={exportingPdf}
                    >
                      {exportingPdf && pdfActiveQuote?.questId === quest.id ? (
                        <RefreshCw size={16} className="animate-spin text-primary" />
                      ) : (
                        <FileText size={16} />
                      )}
                    </button>
                    <button 
                      onClick={(e) => handleToggleArchiveQuest(e, quest.id)}
                      className={`p-2 transition-colors bg-gray-50 rounded-full hover:bg-gray-100 ${
                        archivedQuestIds.includes(quest.id)
                          ? 'text-green-600 hover:text-green-700 hover:bg-green-50'
                          : 'text-gray-400 hover:text-primary'
                      }`}
                      title={archivedQuestIds.includes(quest.id) ? "Ripristina nei Questionari Attivi" : "Archivia Questionario"}
                    >
                      <Archive size={16} />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setQuestToDelete(quest); }}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors bg-gray-50 rounded-full hover:bg-red-50"
                      title="Elimina Questionario"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {(activeTab === 'active' ? questionnaires.filter(q => !archivedQuestIds.includes(q.id)) : questionnaires.filter(q => archivedQuestIds.includes(q.id))).length === 0 && !loading && (
              <div className="col-span-full py-16 text-center text-gray-300 font-medium border-2 border-dashed border-gray-100 rounded-[2rem]">
                {activeTab === 'active' ? 'Nessun questionario di brand identity attivo' : 'Nessun questionario di brand identity archiviato'}
              </div>
            )}
          </div>
        ) : (
          /* QUESTION BUILDER EDITOR FORM (uguale al questionario stesso) */
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Explanatory Banner */}
            <div className="bg-gradient-to-r from-primary/5 to-[#F39637]/5 border border-primary/10 p-6 rounded-[2rem] mb-6">
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className="p-3 bg-gradient-brand text-white rounded-2xl shrink-0">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 className="font-extrabold text-gray-900 text-base">Modifica Domande del Questionario</h3>
                  <p className="text-xs text-slate-500 leading-relaxed mt-1">
                    Gestisci le domande, segnaposto e opzioni del modulo di valutazione. Le modifiche appariranno immediatamente quando un cliente apre la pagina del questionario pubblico di Francesca Mutolo.
                  </p>
                </div>
              </div>
            </div>

            {/* Custom Step indicator */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-3 mb-8">
              {[
                { num: 1, name: 'Attività', icon: Building },
                { num: 2, name: 'Target', icon: Users },
                { num: 3, name: 'Personalità', icon: Target },
                { num: 4, name: 'Estetica', icon: Palette },
                { num: 5, name: 'Concorrenza', icon: Shield },
                { num: 6, name: 'Utilizzo', icon: Monitor },
                { num: 7, name: 'Consegna', icon: FileText },
                { num: 8, name: 'Visione', icon: Sparkles },
              ].map((st) => {
                const isActive = editorStep === st.num;
                const StepIcon = st.icon;
                return (
                  <button
                    key={st.num}
                    type="button"
                    onClick={() => setEditorStep(st.num)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                      isActive
                        ? 'bg-gradient-brand text-white border-transparent shadow-[0_4px_12px_rgba(193,60,141,0.15)]'
                        : 'bg-white text-gray-500 border-gray-100 hover:text-gray-800 hover:border-gray-200'
                    }`}
                  >
                    <StepIcon size={13} />
                    <span className="hidden md:inline">{st.num}. {st.name}</span>
                    <span className="md:hidden">{st.num}</span>
                  </button>
                );
              })}
            </div>

            {saveStatus && (
              <div className={`p-4 rounded-xl text-xs font-bold border mb-6 animate-in fade-in duration-200 ${
                saveStatus.type === 'success' 
                  ? 'bg-green-50 text-green-600 border-green-100' 
                  : 'bg-red-50 text-red-650 border-red-100'
              }`}>
                {saveStatus.message}
              </div>
            )}

            {/* Editor card matching the look and feel of Questionnaire */}
            <div className="bg-gray-50/50 rounded-2xl border border-gray-150 p-6 md:p-8 space-y-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-brand"></div>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-150 pb-4 gap-3">
                <div>
                  <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Configurazione Campi dello Step {editorStep}</span>
                  <h3 className="text-lg font-bold text-gray-900 mt-0.5">
                    {questionsSchema ? questionsSchema[`step${editorStep}`]?.title : 'Caricamento...'}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm("Sei sicuro di voler ripristinare le domande al loro valore originale?")) {
                        setQuestionsSchema(DEFAULT_QUESTIONS);
                        setSaveStatus({ type: 'success', message: 'Ripristinate domande predefinite! Premi "Salva" per confermare.' });
                        setTimeout(() => setSaveStatus(null), 4000);
                      }
                    }}
                    className="px-3 py-1.5 border border-gray-200 hover:bg-white text-[10px] font-black uppercase tracking-wider rounded-lg transition-all text-gray-500"
                  >
                    Default
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveQuestions}
                    disabled={savingQuestions}
                    className="px-4 py-1.5 bg-gradient-brand text-white text-[10px] font-black uppercase tracking-wider rounded-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                  >
                    {savingQuestions ? (
                      <>
                        <RefreshCw size={11} className="animate-spin" />
                        Salva...
                      </>
                    ) : (
                      <>
                        Salva Modifiche
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Dynamic Edit inputs */}
              <div className="space-y-5">
                {questionsSchema && [
                  { step: 1, fields: [
                    { field: 'title', label: 'Titolo dello step', type: 'text' },
                    { field: 'company_name_label', label: 'Domanda: Nome Azienda/Brand', type: 'text' },
                    { field: 'company_name_placeholder', label: 'Segnaposto: Nome Azienda/Brand', type: 'text' },
                    { field: 'name_meaning_label', label: 'Domanda: Significato del nome', type: 'text' },
                    { field: 'name_meaning_placeholder', label: 'Segnaposto: Significato del nome', type: 'textarea' },
                    { field: 'business_description_label', label: 'Domanda: Di cosa si occupa', type: 'text' },
                    { field: 'business_description_placeholder', label: 'Segnaposto: Di cosa si occupa', type: 'textarea' },
                    { field: 'products_services_label', label: 'Domanda: Prodotti o Servizi', type: 'text' },
                    { field: 'products_services_placeholder', label: 'Segnaposto: Prodotti o Servizi', type: 'textarea' },
                    { field: 'strength_point_label', label: 'Domanda: Punto di Forza principale', type: 'text' },
                    { field: 'strength_point_placeholder', label: 'Segnaposto: Punto di Forza principale', type: 'textarea' },
                    { field: 'slogan_label', label: 'Domanda: Slogan o payoff', type: 'text' },
                    { field: 'slogan_placeholder', label: 'Segnaposto: Slogan o payoff', type: 'text' },
                  ]},
                  { step: 2, fields: [
                    { field: 'title', label: 'Titolo dello step', type: 'text' },
                    { field: 'target_customers_label', label: 'Domanda: Clienti ideali', type: 'text' },
                    { field: 'target_customers_placeholder', label: 'Segnaposto: Clienti ideali', type: 'textarea' },
                    { field: 'age_range_label', label: 'Domanda: Fascia d\'età prevalente', type: 'text' },
                    { field: 'age_range_placeholder', label: 'Segnaposto: Fascia d\'età prevalente', type: 'text' },
                    { field: 'customer_type_label', label: 'Domanda: Composizione clientela', type: 'text' },
                    { field: 'customer_type_options', label: 'Opzioni: Composizione clientela (separate da virgola)', type: 'array' },
                    { field: 'market_scope_label', label: 'Domanda: Ambito del mercato di riferimento', type: 'text' },
                    { field: 'market_scope_options', label: 'Opzioni: Ambito del mercato di riferimento (separate da virgola)', type: 'array' },
                    { field: 'brand_perception_target_label', label: 'Domanda: Percezione desiderata', type: 'text' },
                    { field: 'brand_perception_target_placeholder', label: 'Segnaposto: Percezione desiderata', type: 'textarea' },
                  ]},
                  { step: 3, fields: [
                    { field: 'title', label: 'Titolo dello step', type: 'text' },
                    { field: 'keywords_label', label: 'Domanda: Selezione parole chiave', type: 'text' },
                    { field: 'keywords_options', label: 'Opzioni: Selezione parole chiave (separate da virgola)', type: 'array' },
                    { field: 'brand_perception_label', label: 'Domanda: Percezione brand desiderata', type: 'text' },
                    { field: 'brand_perception_placeholder', label: 'Segnaposto: Percezione brand desiderata', type: 'textarea' },
                    { field: 'brand_personified_label', label: 'Domanda: Se il brand fosse una persona', type: 'text' },
                    { field: 'brand_personified_placeholder', label: 'Segnaposto: Se il brand fosse una persona', type: 'textarea' },
                  ]},
                  { step: 4, fields: [
                    { field: 'title', label: 'Titolo dello step', type: 'text' },
                    { field: 'palette_favorite_label', label: 'Domanda: Colori preferiti', type: 'text' },
                    { field: 'palette_favorite_placeholder', label: 'Segnaposto: Colori preferiti', type: 'text' },
                    { field: 'palette_avoid_label', label: 'Domanda: Colori da evitare', type: 'text' },
                    { field: 'palette_avoid_placeholder', label: 'Segnaposto: Colori da evitare', type: 'textarea' },
                    { field: 'logo_style_label', label: 'Domanda: Stile del logo preferito', type: 'text' },
                    { field: 'logo_style_options', label: 'Opzioni: Stile del logo preferito (separate da virgola)', type: 'array' },
                    { field: 'logo_composition_label', label: 'Domanda: Composizione del logo', type: 'text' },
                    { field: 'logo_composition_options', label: 'Opzioni: Composizione del logo (separate da virgola)', type: 'array' },
                    { field: 'logos_liked_label', label: 'Domanda: Esempi di loghi graditi', type: 'text' },
                    { field: 'logos_liked_placeholder', label: 'Segnaposto: Esempi di loghi graditi', type: 'textarea' },
                    { field: 'logos_disliked_label', label: 'Domanda: Esempi di loghi sgraditi', type: 'text' },
                    { field: 'logos_disliked_placeholder', label: 'Segnaposto: Esempi di loghi sgraditi', type: 'textarea' },
                  ]},
                  { step: 5, fields: [
                    { field: 'title', label: 'Titolo dello step', type: 'text' },
                    { field: 'competitors_label', label: 'Domanda: Principali concorrenti', type: 'text' },
                    { field: 'competitors_placeholder', label: 'Segnaposto: Principali concorrenti', type: 'textarea' },
                    { field: 'admired_companies_label', label: 'Domanda: Aziende apprezzate', type: 'text' },
                    { field: 'admired_companies_placeholder', label: 'Segnaposto: Aziende apprezzate', type: 'textarea' },
                    { field: 'differentiation_strategy_label', label: 'Domanda: Strategia di differenziazione desiderata', type: 'text' },
                    { field: 'differentiation_strategy_options', label: 'Opzioni: Strategia di differenziazione desiderata (separate da virgola)', type: 'array' },
                  ]},
                  { step: 6, fields: [
                    { field: 'title', label: 'Titolo dello step', type: 'text' },
                    { field: 'logo_applications_label', label: 'Domanda: Utilizzo principale del logo', type: 'text' },
                    { field: 'logo_applications_options', label: 'Opzioni: Utilizzo principale del logo (separate da virgola)', type: 'array' },
                  ]},
                  { step: 7, fields: [
                    { field: 'title', label: 'Titolo dello step', type: 'text' },
                    { field: 'deadline_label', label: 'Domanda: Entro quando serve il progetto', type: 'text' },
                    { field: 'deadline_placeholder', label: 'Segnaposto: Entro quando serve il progetto', type: 'text' },
                    { field: 'extra_deliverables_label', label: 'Domanda: Elementi aggiuntivi richiesti', type: 'text' },
                    { field: 'extra_deliverables_options', label: 'Opzioni: Elementi aggiuntivi richiesti (separate da virgola)', type: 'array' },
                  ]},
                  { step: 8, fields: [
                    { field: 'title', label: 'Titolo dello step', type: 'text' },
                    { field: 'five_years_vision_label', label: 'Domanda: Visione a 5 anni', type: 'text' },
                    { field: 'five_years_vision_placeholder', label: 'Segnaposto: Visione a 5 anni', type: 'textarea' },
                    { field: 'notes_label', label: 'Domanda: Note aggiuntive', type: 'text' },
                    { field: 'notes_placeholder', label: 'Segnaposto: Note aggiuntive', type: 'textarea' },
                  ]}
                ].find(item => item.step === editorStep)?.fields.map((f) => {
                  const stepKey = `step${editorStep}`;
                  const val = questionsSchema[stepKey]?.[f.field];

                  const fieldBaseName = f.field.replace('_label', '').replace('_placeholder', '').replace('_options', '');
                  const deleted = isFieldDeleted(editorStep, fieldBaseName);
                  const canDelete = f.field !== 'title' && !f.field.startsWith('company_name');

                  return (
                    <div 
                      key={f.field} 
                      className={`p-4 rounded-xl border transition-all ${
                        deleted 
                          ? 'bg-red-50/20 border-red-200 opacity-80' 
                          : 'bg-white border-gray-150'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-2 gap-3">
                        <div className="flex items-center gap-2">
                          <label className={`block text-xs font-black uppercase tracking-wider ${
                            f.type === 'array' ? 'text-[#C13C8D]' : 'text-gray-400'
                          }`}>
                            {f.label}
                          </label>
                          {deleted && (
                            <span className="px-1.5 py-0.5 bg-red-100 text-red-750 text-[8px] font-black uppercase rounded">
                              Nascosta nel Form
                            </span>
                          )}
                        </div>
                        {canDelete && (
                          <button
                            type="button"
                            onClick={() => toggleFieldDeletion(editorStep, fieldBaseName)}
                            className={`text-[10px] font-bold px-2 py-1 rounded transition-all shrink-0 ${
                              deleted 
                                ? 'bg-green-50 hover:bg-green-100 text-green-755 border border-green-200' 
                                : 'bg-red-50 hover:bg-red-100 text-red-600 border border-red-100'
                            }`}
                          >
                            {deleted ? 'Mostra / Ripristina' : 'Nascondi / Elimina'}
                          </button>
                        )}
                      </div>

                      {f.type === 'array' ? (
                        <>
                          <input
                            type="text"
                            value={Array.isArray(val) ? val.join(', ') : ''}
                            onChange={(e) => handleArrayFieldChange(editorStep, f.field, e.target.value)}
                            disabled={deleted}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-white transition-all text-xs font-semibold text-gray-800 disabled:bg-gray-50/50 disabled:text-gray-400"
                          />
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {Array.isArray(val) && val.map((itemValue, i) => (
                              <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-650 text-[9px] font-bold rounded-md">
                                {itemValue}
                              </span>
                            ))}
                          </div>
                        </>
                      ) : f.type === 'textarea' ? (
                        <textarea
                          rows={2}
                          value={val || ''}
                          onChange={(e) => handleFieldChange(editorStep, f.field, e.target.value)}
                          disabled={deleted}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-white resize-none transition-all text-xs font-semibold text-gray-800 disabled:bg-gray-50/50 disabled:text-gray-400"
                        />
                      ) : (
                        <input
                          type="text"
                          value={val || ''}
                          onChange={(e) => handleFieldChange(editorStep, f.field, e.target.value)}
                          disabled={deleted}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-white transition-all text-xs font-semibold text-gray-700 disabled:bg-gray-50/50 disabled:text-gray-400"
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* DOMANDE PERSONALIZZATE AGGIUNTIVE */}
              {questionsSchema && (
                <div className="mt-8 pt-6 border-t border-gray-250 space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-black text-gray-800 uppercase tracking-tight flex items-center gap-1.5">
                        <Sparkles size={14} className="text-primary" /> Domande Personalizzate Aggiuntive
                      </h4>
                      <p className="text-[11px] text-gray-400 font-medium">Aggiungi nuove domande dinamiche per questo specifico step.</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddCustomQuestion}
                      className="px-3.5 py-1.5 bg-white hover:bg-gray-50 text-[#C13C8D] hover:text-[#a03075] text-[10px] font-black uppercase tracking-wider rounded-lg transition-all flex items-center gap-1.5 border border-gray-250 shadow-sm"
                    >
                      <Plus size={12} /> Aggiungi Domanda
                    </button>
                  </div>

                  <div className="space-y-4">
                    {(questionsSchema[`step${editorStep}`]?.custom_questions || []).length === 0 ? (
                      <div className="text-center py-6 border border-dashed border-gray-250 rounded-xl bg-gray-50/30">
                        <p className="text-[11px] text-gray-400 font-bold">Nessuna domanda personalizzata aggiuntiva per questo step.</p>
                      </div>
                    ) : (
                      (questionsSchema[`step${editorStep}`]?.custom_questions || []).map((cq: any, idx: number) => (
                        <div key={cq.id} className="p-4 rounded-xl border border-gray-200 bg-white shadow-sm space-y-3">
                          <div className="flex justify-between items-center pb-2 border-b border-gray-150">
                            <span className="text-[10px] font-semibold text-primary/70 uppercase tracking-widest bg-primary/5 px-2 py-0.5 rounded-md">Domanda Dinamica #{idx+1}</span>
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm("Sei sicuro di voler eliminare questa domanda personalizzata?")) {
                                  handleDeleteCustomQuestion(cq.id);
                                }
                              }}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-lg transition-all border border-transparent hover:border-red-100"
                              title="Elimina questa domanda"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5 text-left">
                              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider">Testo della Domanda / Etichetta</label>
                              <input
                                type="text"
                                value={cq.label || ''}
                                onChange={(e) => handleCustomQuestionChange(cq.id, 'label', e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-white text-xs font-semibold text-gray-800"
                              />
                            </div>
                            <div className="space-y-1.5 text-left">
                              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider">Segnaposto (Placeholder)</label>
                              <input
                                type="text"
                                value={cq.placeholder || ''}
                                onChange={(e) => handleCustomQuestionChange(cq.id, 'placeholder', e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-white text-xs font-semibold text-gray-800"
                              />
                            </div>
                          </div>

                          <div className="space-y-1 text-left w-full max-w-xs">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider">Tipo Risposta</label>
                            <div className="flex gap-2">
                              {[
                                { label: 'Testo Breve', value: 'text' },
                                { label: 'Testo Esteso (Multiriga)', value: 'textarea' }
                              ].map((opt) => {
                                const isSel = cq.type === opt.value;
                                return (
                                  <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => handleCustomQuestionChange(cq.id, 'type', opt.value)}
                                    className={`px-3 py-1.5 border text-xs font-bold rounded-lg transition-all ${
                                      isSel 
                                        ? 'border-primary bg-primary/5 text-primary' 
                                        : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                                    }`}
                                  >
                                    {opt.label}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Navigation Controls inside editor */}
              <div className="flex items-center justify-between gap-4 pt-4 border-t border-gray-150">
                {editorStep > 1 ? (
                  <button
                    type="button"
                    onClick={() => setEditorStep(prev => prev - 1)}
                    className="flex items-center justify-center bg-white h-10 px-5 text-xs font-black uppercase tracking-wider text-slate-600 hover:text-slate-900 border border-slate-200 rounded-xl transition-all"
                  >
                    Indietro
                  </button>
                ) : (
                  <div />
                )}

                {editorStep < 8 ? (
                  <button
                    type="button"
                    onClick={() => setEditorStep(prev => prev + 1)}
                    className="flex items-center justify-center bg-gray-900 hover:bg-gray-850 text-white h-10 px-5 text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-sm"
                  >
                    Continua
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSaveQuestions}
                    disabled={savingQuestions}
                    className="flex items-center justify-center bg-gradient-brand text-white h-10 px-5 text-xs font-black uppercase tracking-wider rounded-xl hover:opacity-95 transition-all shadow-sm disabled:opacity-50"
                  >
                    {savingQuestions ? 'Salvataggio...' : 'Salva Domande'}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {selectedQuest && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brandDark/80 backdrop-blur-md animate-in fade-in"
          onClick={() => setSelectedQuest(null)}
        >
          <div 
            className="bg-white w-full max-w-4xl max-h-[92vh] rounded-[2rem] md:rounded-[3.5rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 md:p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 flex-shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-brand text-white flex items-center justify-center shadow-lg shadow-primary/10">
                  <ClipboardList size={26} />
                </div>
                <div>
                  <h3 className="text-xl md:text-3xl font-black text-gray-900 leading-tight">{selectedQuest.company_name}</h3>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">
                    Questionario Brand Identity • Ricevuto il {new Date(selectedQuest.created_at).toLocaleString('it-IT')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleUpdate(selectedQuest, { is_read: !selectedQuest.is_read })}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider border transition-all ${
                    selectedQuest.is_read 
                      ? 'bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200' 
                      : 'bg-green-50 text-green-600 border-green-100 hover:bg-green-100'
                  }`}
                >
                  <Flag size={12} fill={selectedQuest.is_read ? "none" : "currentColor"} />
                  {selectedQuest.is_read ? 'Segna come non letto' : 'Segna come letto'}
                </button>
                <button 
                  onClick={(e) => handleToggleArchiveQuest(e, selectedQuest.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider border transition-all ${
                    archivedQuestIds.includes(selectedQuest.id)
                      ? 'bg-green-50 text-green-700 border-green-100 hover:bg-green-100'
                      : 'bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200 hover:text-primary'
                  }`}
                  title={archivedQuestIds.includes(selectedQuest.id) ? "Ripristina" : "Archivia"}
                >
                  <Archive size={12} />
                  <span>{archivedQuestIds.includes(selectedQuest.id) ? 'Ripristina' : 'Archivia'}</span>
                </button>
                <button 
                  onClick={() => { setQuestToDelete(selectedQuest); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-black uppercase tracking-wider border border-red-100 transition-all"
                  title="Elimina Questionario"
                >
                  <Trash2 size={12} />
                  <span>Elimina</span>
                </button>
                <button 
                  onClick={() => setSelectedQuest(null)}
                  className="p-3 bg-gray-100 text-gray-400 hover:text-gray-950 rounded-full transition-all hover:bg-gray-200"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="flex-grow overflow-y-auto p-6 md:p-10 space-y-8 chat-scrollbar bg-slate-50/30 font-sans">
              
              <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-4">
                <h4 className="text-sm font-black text-primary uppercase tracking-widest pb-2 border-b border-gray-50 flex items-center gap-2">
                  <Building size={16} /> 1. Attività & Brand
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Nome Brand</span>
                    <p className="font-bold text-gray-900 text-base">{selectedQuest.company_name}</p>
                  </div>
                  {selectedQuest.slogan && (
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Slogan o Payoff</span>
                      <p className="font-bold text-gradient-brand italic text-base">"{selectedQuest.slogan}"</p>
                    </div>
                  )}
                  {selectedQuest.name_meaning && (
                    <div className="col-span-full">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Significato del nome</span>
                      <p className="text-gray-700 font-semibold whitespace-pre-wrap text-sm leading-relaxed mt-1">{selectedQuest.name_meaning}</p>
                    </div>
                  )}
                  {selectedQuest.business_description && (
                    <div className="col-span-full">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Di cosa si occupa esattamente</span>
                      <p className="text-gray-700 font-semibold whitespace-pre-wrap text-sm leading-relaxed mt-1">{selectedQuest.business_description}</p>
                    </div>
                  )}
                  {selectedQuest.products_services && (
                    <div className="col-span-full">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Prodotti o servizi offerti</span>
                      <p className="text-gray-700 font-semibold whitespace-pre-wrap text-sm leading-relaxed mt-1">{selectedQuest.products_services}</p>
                    </div>
                  )}
                  {selectedQuest.strength_point && (
                    <div className="col-span-full">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Principale punto di forza rispetto alla concorrenza</span>
                      <p className="text-gray-750 font-bold whitespace-pre-wrap text-sm leading-relaxed mt-1 bg-yellow-50/40 border border-yellow-100 p-4 rounded-xl">{selectedQuest.strength_point}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-4">
                <h4 className="text-sm font-black text-primary uppercase tracking-widest pb-2 border-b border-gray-50 flex items-center gap-2">
                  <Users size={16} /> 2. Target Clienti
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedQuest.customer_type && (
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Tipologia Clienti</span>
                      <p className="font-bold text-gray-900 text-sm">{selectedQuest.customer_type}</p>
                    </div>
                  )}
                  {selectedQuest.market_scope && (
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Mercato di Riferimento</span>
                      <p className="font-bold text-gray-900 text-sm">{selectedQuest.market_scope}</p>
                    </div>
                  )}
                  {selectedQuest.age_range && (
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Fascia d'età prevalente</span>
                      <p className="font-bold text-gray-900 text-sm">{selectedQuest.age_range}</p>
                    </div>
                  )}
                  {selectedQuest.target_customers && (
                    <div className="col-span-full">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Chi sono i clienti ideali</span>
                      <p className="text-gray-700 font-semibold whitespace-pre-wrap text-sm leading-relaxed mt-1">{selectedQuest.target_customers}</p>
                    </div>
                  )}
                  {selectedQuest.brand_perception_target && (
                    <div className="col-span-full">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Percezione che si vuole trasmettere</span>
                      <p className="text-gray-700 font-semibold whitespace-pre-wrap text-sm leading-relaxed mt-1">{selectedQuest.brand_perception_target}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-4">
                <h4 className="text-sm font-black text-primary uppercase tracking-widest pb-2 border-b border-gray-50 flex items-center gap-2">
                  <Target size={16} /> 3. Posizionamento e Personalità
                </h4>
                <div className="space-y-4">
                  {selectedQuest.keywords?.length > 0 && (
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">Parole chiave selezionate</span>
                      <div className="flex flex-wrap gap-2">
                        {selectedQuest.keywords.map(k => (
                          <span key={k} className="px-3.5 py-1.5 bg-gradient-brand text-white text-xs font-bold rounded-xl shadow-sm">{k}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {selectedQuest.brand_perception && (
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Come vuoi che il cliente ti percepisca</span>
                      <p className="text-gray-700 font-semibold whitespace-pre-wrap text-sm leading-relaxed mt-1">{selectedQuest.brand_perception}</p>
                    </div>
                  )}
                  {selectedQuest.brand_personified && (
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Se il brand fosse una persona</span>
                      <p className="text-gray-700 font-semibold whitespace-pre-wrap text-sm leading-relaxed mt-1">{selectedQuest.brand_personified}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-4">
                <h4 className="text-sm font-black text-primary uppercase tracking-widest pb-2 border-b border-gray-50 flex items-center gap-2">
                  <Palette size={16} /> 4. Preferenze Estetiche
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedQuest.palette_favorite && (
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Colori Preferiti</span>
                      <p className="font-bold text-green-600 text-sm">{selectedQuest.palette_favorite}</p>
                    </div>
                  )}
                  {selectedQuest.palette_avoid && (
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider text-red-500">Colori da Evitare</span>
                      <p className="font-bold text-red-600 text-sm">{selectedQuest.palette_avoid}</p>
                    </div>
                  )}
                  {selectedQuest.logo_style && (
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Stile preferito</span>
                      <p className="font-bold text-gray-900 text-sm">{selectedQuest.logo_style}</p>
                    </div>
                  )}
                  {selectedQuest.logo_composition && (
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Composizione desiderata</span>
                      <p className="font-bold text-gray-900 text-sm">{selectedQuest.logo_composition}</p>
                    </div>
                  )}
                  {selectedQuest.logos_liked && (
                    <div className="col-span-full">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Loghi preferiti o modelli graditi</span>
                      <p className="text-gray-700 font-semibold whitespace-pre-wrap text-sm leading-relaxed mt-1">{selectedQuest.logos_liked}</p>
                    </div>
                  )}
                  {selectedQuest.logos_disliked && (
                    <div className="col-span-full">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Loghi da evitare o stili sgraditi</span>
                      <p className="text-gray-700 font-semibold whitespace-pre-wrap text-sm leading-relaxed mt-1">{selectedQuest.logos_disliked}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-4">
                <h4 className="text-sm font-black text-primary uppercase tracking-widest pb-2 border-b border-gray-50 flex items-center gap-2">
                  <Shield size={16} /> 5. Concorrenza
                </h4>
                <div className="space-y-4">
                  {selectedQuest.competitors && (
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Principali concorrenti</span>
                      <p className="text-gray-700 font-semibold whitespace-pre-wrap text-sm leading-relaxed mt-1">{selectedQuest.competitors}</p>
                    </div>
                  )}
                  {selectedQuest.admired_companies && (
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Aziende del settore che apprezza particolarmente</span>
                      <p className="text-gray-700 font-semibold whitespace-pre-wrap text-sm leading-relaxed mt-1">{selectedQuest.admired_companies}</p>
                    </div>
                  )}
                  {selectedQuest.differentiation_strategy && (
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Strategia di differenziazione</span>
                      <p className="font-bold text-gray-900 text-sm mt-1">{selectedQuest.differentiation_strategy}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-4">
                  <h4 className="text-sm font-black text-primary uppercase tracking-widest pb-2 border-b border-gray-50 flex items-center gap-2">
                    <Monitor size={16} /> 6. Utilizzo Logo (Voci Selezionate e Scartate)
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {(() => {
                      const standardApps = ['Online', 'Social', 'Sito web', 'Biglietti da visita', 'Insegne', 'Veicoli', 'Abbigliamento', 'Packaging'];
                      const selectedApps = selectedQuest.logo_applications || [];
                      const isSelected = (standard: string) => 
                        selectedApps.some(sel => sel.toLowerCase().trim() === standard.toLowerCase().trim());
                      const customApps = selectedApps.filter(sel => 
                        !standardApps.some(std => std.toLowerCase().trim() === sel.toLowerCase().trim())
                      );

                      return (
                        <>
                          {standardApps.map(app => {
                            const active = isSelected(app);
                            return (
                              <span 
                                key={app} 
                                className={`px-2.5 py-1.5 text-xs font-bold rounded-lg border flex items-center gap-1.5 transition-all ${
                                  active 
                                    ? 'bg-green-50 text-green-700 border-green-250 shadow-sm' 
                                    : 'bg-gray-50/70 text-gray-300 border-gray-100 line-through opacity-50'
                                }`}
                              >
                                {active ? '✓' : '✗'} {app}
                              </span>
                            );
                          })}
                          {customApps.map(app => (
                            <span 
                              key={app} 
                              className="px-2.5 py-1.5 text-xs font-bold rounded-lg border bg-primary/15 text-primary border-primary/20 flex items-center gap-1.5"
                            >
                              ✓ {app}
                            </span>
                          ))}
                        </>
                      );
                    })()}
                  </div>
                </div>

                <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-4">
                  <h4 className="text-sm font-black text-primary uppercase tracking-widest pb-2 border-b border-gray-50 flex items-center gap-2">
                    <FileText size={16} /> 7. Consegna e Brand Manual
                  </h4>
                  <div className="mb-4">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Scadenza Richiesta</span>
                    <p className="font-bold text-gray-900 text-sm">{selectedQuest.deadline || 'Nessuna indicata'}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">Elementi aggiuntivi (Selezionati e Scartati)</span>
                    <div className="flex flex-wrap gap-1.5">
                      {(() => {
                        const standardDeliverables = [
                          'palette colori', 
                          'versioni monocromatiche', 
                          'logo orizzontale', 
                          'logo verticale', 
                          'favicon',
                          'biglietto da visita', 
                          'carta intestata', 
                          'landing page', 
                          'grafica insegna', 
                          'flyer, locandina, menu o simili'
                        ];
                        const selectedDels = selectedQuest.extra_deliverables || [];
                        const isSelected = (standard: string) => 
                          selectedDels.some(sel => sel.toLowerCase().trim() === standard.toLowerCase().trim());
                        const customDels = selectedDels.filter(sel => 
                          !standardDeliverables.some(std => std.toLowerCase().trim() === sel.toLowerCase().trim())
                        );

                        return (
                          <>
                            {standardDeliverables.map(item => {
                              const active = isSelected(item);
                              return (
                                <span 
                                  key={item} 
                                  className={`px-2.5 py-1.5 text-[10px] font-bold rounded-lg border uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                                    active 
                                      ? 'bg-green-50 text-green-700 border-green-250 shadow-sm' 
                                      : 'bg-gray-50/70 text-gray-300 border-gray-100 line-through opacity-50'
                                  }`}
                                >
                                  {active ? '✓' : '✗'} {item}
                                </span>
                              );
                            })}
                            {customDels.map(item => (
                              <span 
                                key={item} 
                                className="px-2.5 py-1.5 text-[10px] font-bold rounded-lg border bg-primary/15 text-primary border-primary/20 uppercase tracking-wider flex items-center gap-1.5"
                              >
                                ✓ {item}
                              </span>
                            ))}
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-4 col-span-full">
                  <h4 className="text-sm font-black text-primary uppercase tracking-widest pb-2 border-b border-gray-50 flex items-center gap-2">
                    <Sparkles size={16} className="text-secondary" /> Visione a 5 Anni (Focus Strategico)
                  </h4>
                  <div className="p-6 bg-secondary/5 border-2 border-dashed border-secondary/15 rounded-2xl italic font-serif text-slate-700 leading-relaxed text-base">
                    "{selectedQuest.five_years_vision}"
                  </div>
                </div>

                {selectedQuest.notes && (
                  <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-4 col-span-full">
                    <h4 className="text-sm font-black text-primary uppercase tracking-widest pb-2 border-b border-gray-50 flex items-center gap-2">
                      <FileText size={16} className="text-primary" /> Note Aggiuntive
                    </h4>
                    <div className="p-6 bg-gray-50 border border-gray-100 rounded-2xl text-slate-700 leading-relaxed text-sm whitespace-pre-wrap">
                      {selectedQuest.notes}
                    </div>
                  </div>
                )}

              </div>

            </div>

            <div className="p-6 md:p-8 bg-gray-50/50 border-t border-gray-100 flex-shrink-0 grid grid-cols-1 sm:grid-cols-3 gap-4">
               <button 
                 type="button"
                 onClick={() => downloadQuestTxt(selectedQuest)} 
                 className="w-full py-4 bg-white text-gray-755 hover:bg-gray-50 border border-gray-200 rounded-2xl font-bold flex items-center justify-center gap-2.5 transition-all active:scale-95 text-sm"
               >
                 <Download size={18} /> 
                 <span>Scarica .TXT</span>
               </button>
               <button 
                 type="button"
                 disabled={exportingPdf}
                 onClick={() => handleDownloadQuestPdf(selectedQuest)} 
                 className="w-full py-4 bg-white text-gray-755 hover:bg-gray-50 border border-gray-200 rounded-2xl font-bold flex items-center justify-center gap-2.5 transition-all active:scale-95 text-sm cursor-pointer disabled:opacity-50"
               >
                 {exportingPdf && pdfActiveQuote?.questId === selectedQuest.id ? (
                   <>
                     <RefreshCw size={18} className="animate-spin text-primary" />
                     <span>Generando...</span>
                   </>
                 ) : (
                   <>
                     <FileText size={18} /> 
                     <span>Scarica PDF A4</span>
                   </>
                 )}
               </button>
               <button 
                 type="button"
                 onClick={() => { setSelectedQuest(null); handleFormulaQuote(selectedQuest); }} 
                 className="w-full py-4 bg-gradient-brand text-white rounded-2xl font-black flex items-center justify-center gap-2.5 hover:scale-[1.02] transition-all shadow-xl active:scale-95 text-sm md:text-base"
               >
                 <Sparkles size={18} /> 
                 <span>Formula preventivo</span>
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Quote formula creator modal overlay */}
      {pricingQuote && (
        <div 
          className="fixed inset-0 z-[100] overflow-y-auto bg-brandDark p-0 md:p-6 lg:p-8 flex justify-center items-start"
          onClick={() => setPricingQuote(null)}
        >
          <div 
            className="bg-gray-100 w-full max-w-7xl rounded-none md:rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 min-h-[100dvh] md:min-h-0 md:my-4 lg:my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 md:p-8 bg-white border-b border-gray-200 flex justify-between items-center flex-shrink-0">
              <div className="flex items-center gap-4 text-left">
                <div className="w-12 h-12 rounded-2xl bg-gradient-brand text-white flex items-center justify-center shadow-lg">
                  <FileText size={24} />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-black text-gray-900 leading-tight">Formula Preventivo</h3>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">
                    Cliente: {pricingQuote.company_name}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setPricingQuote(null)}
                className="p-3 bg-gray-100 text-gray-400 hover:text-gray-950 rounded-full transition-all hover:bg-gray-200"
              >
                <X size={20} />
              </button>
            </div>

            {/* Main Interactive Grid */}
            <div className="flex-grow p-4 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 overflow-y-auto max-h-[72vh] bg-gray-50">
              {/* Left Column: Form Controls */}
              <div className="space-y-6 overflow-y-auto pr-2 chat-scrollbar">
                
                {/* 1. Base Service Price */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4 text-left">
                  <h4 className="text-xs font-black text-primary uppercase tracking-widest flex items-center gap-2 border-b border-gray-50 pb-2">
                    <Building size={14} /> 1. Servizio principale
                  </h4>
                  
                  {/* Inclusion Toggle */}
                  <div className="flex items-center gap-2.5 bg-gray-50 border border-gray-150 p-3 rounded-xl mb-4">
                    <input 
                      type="checkbox" 
                      id="includeBaseService"
                      checked={pricingQuote.includeBaseService}
                      onChange={(e) => setPricingQuote(prev => prev ? { ...prev, includeBaseService: e.target.checked } : null)}
                      className="w-4 h-4 rounded text-primary focus:ring-primary border-gray-300 transition-all cursor-pointer"
                    />
                    <label htmlFor="includeBaseService" className="text-xs font-bold text-gray-700 cursor-pointer select-none">
                      Includi servizio principale nel preventivo
                    </label>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Nome Servizio Principale</label>
                      <input 
                        type="text" 
                        value={pricingQuote.baseServiceName}
                        onChange={(e) => setPricingQuote(prev => prev ? { ...prev, baseServiceName: e.target.value } : null)}
                        className="w-full text-xs font-bold p-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary transition-all text-gray-800"
                        placeholder="Nome Servizio Principale"
                      />
                    </div>
                    
                    <div className="space-y-3 pt-2">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Voci della Descrizione Servizio & Prezzi singoli</label>
                      {pricingQuote.baseServiceItems.map((item, idx) => (
                        <div key={idx} className="flex gap-2 items-center flex-wrap sm:flex-nowrap bg-gray-50/50 p-2 rounded-xl border border-gray-150">
                          <input 
                            type="text" 
                            value={item.description}
                            onChange={(e) => {
                              const newDesc = e.target.value;
                              setPricingQuote(prev => {
                                if (!prev) return null;
                                const updated = [...prev.baseServiceItems];
                                updated[idx] = { ...updated[idx], description: newDesc };
                                return { ...prev, baseServiceItems: updated };
                              });
                            }}
                            className="flex-grow text-xs font-medium p-2.5 rounded-lg border border-gray-205 bg-white focus:outline-none focus:ring-1 focus:ring-primary transition-all text-gray-800"
                            placeholder={`Voce ${idx + 1}`}
                          />
                          
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="text-[10px] font-bold text-gray-400">Prezzo €</span>
                            <input 
                              type="number" 
                              value={item.price || ''}
                              onChange={(e) => {
                                const newPrice = e.target.value !== "" ? Number(e.target.value) : 0;
                                setPricingQuote(prev => {
                                  if (!prev) return null;
                                  const updated = [...prev.baseServiceItems];
                                  updated[idx] = { ...updated[idx], price: newPrice };
                                  return { ...prev, baseServiceItems: updated };
                                });
                              }}
                              className="w-16 text-right text-xs font-bold p-2 rounded-lg border border-gray-205 bg-white focus:outline-none focus:ring-1 focus:ring-primary transition-all text-gray-800 font-mono"
                              placeholder="0"
                            />
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0 bg-pink-50/40 px-2 py-1 rounded-lg border border-pink-100">
                            <span className="text-[9px] font-black text-pink-500 uppercase tracking-wider">Sconto €</span>
                            <input 
                              type="number" 
                              value={item.discount || ''}
                              onChange={(e) => {
                                const newDiscount = e.target.value !== "" ? Number(e.target.value) : 0;
                                setPricingQuote(prev => {
                                  if (!prev) return null;
                                  const updated = [...prev.baseServiceItems];
                                  updated[idx] = { ...updated[idx], discount: newDiscount };
                                  return { ...prev, baseServiceItems: updated };
                                });
                              }}
                              className="w-14 text-right text-xs font-bold p-1 rounded border border-pink-200 bg-white focus:outline-none focus:ring-1 focus:ring-primary text-gray-800 font-mono"
                              placeholder="0"
                            />
                          </div>

                          <button 
                            type="button" 
                            onClick={() => {
                              setPricingQuote(prev => {
                                if (!prev) return null;
                                return {
                                  ...prev,
                                  baseServiceItems: prev.baseServiceItems.filter((_, i) => i !== idx)
                                };
                              });
                            }}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-red-100 shrink-0"
                            title="Elimina voce"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}

                      <button 
                        type="button" 
                        onClick={() => {
                          setPricingQuote(prev => {
                            if (!prev) return null;
                            return {
                              ...prev,
                              baseServiceItems: [...prev.baseServiceItems, { description: "", price: 0, discount: 0 }]
                            };
                          });
                        }}
                        className="w-full mt-2 py-2.5 bg-gray-50 hover:bg-gray-100 text-slate-700 rounded-xl font-bold text-xs border border-gray-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Plus size={14} />
                        <span>Aggiungi Voce Descrizione</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Project Reference Field */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3 text-left">
                  <h4 className="text-xs font-black text-primary uppercase tracking-widest flex items-center gap-2 border-b border-gray-50 pb-2">
                    <Briefcase size={14} /> Riferimento Progetto
                  </h4>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Testo della proposta o riferimento</label>
                    <textarea 
                      rows={3}
                      value={pricingQuote.projectReference}
                      onChange={(e) => setPricingQuote(prev => prev ? { ...prev, projectReference: e.target.value } : null)}
                      className="w-full text-xs font-medium p-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary transition-all text-gray-850 resize-none leading-relaxed"
                      placeholder="E.g., Studio d'identità visiva..."
                    />
                  </div>
                </div>

                {/* 2. Logo Applications selected by client */}
                {pricingQuote.applications.length > 0 && (
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4 text-left">
                    <h4 className="text-xs font-black text-primary uppercase tracking-widest flex items-center gap-2 border-b border-gray-50 pb-2">
                      <Monitor size={14} /> 2. Utilizzo Logo (Scelte cliente)
                    </h4>
                    <p className="text-[11px] text-gray-400 font-medium">Flagga le applicazioni da includere, assegna un prezzo e imposta sconti facoltativi:</p>
                    <div className="space-y-3">
                      {pricingQuote.applications.map((app, idx) => (
                        <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3 bg-gray-50 border border-gray-150 rounded-xl">
                          <div className="flex items-center gap-2.5">
                            <input 
                              type="checkbox" 
                              checked={app.included}
                              onChange={(e) => {
                                const val = e.target.checked;
                                setPricingQuote(prev => {
                                  if (!prev) return null;
                                  const updated = [...prev.applications];
                                  updated[idx] = { ...updated[idx], included: val };
                                  return { ...prev, applications: updated };
                                });
                              }}
                              className="w-4 h-4 rounded text-primary focus:ring-primary border-gray-300 transition-all cursor-pointer"
                            />
                            <span className={`text-xs font-bold transition-colors ${app.included ? 'text-gray-800' : 'text-gray-400 line-through'}`}>{app.name}</span>
                          </div>
                          
                          <div className="flex items-center gap-3 shrink-0 flex-wrap sm:flex-nowrap">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-gray-400">Prezzo €</span>
                              <input 
                                type="number" 
                                value={app.price || ''}
                                placeholder="0"
                                disabled={!app.included}
                                onChange={(e) => {
                                  const newval = Number(e.target.value);
                                  setPricingQuote(prev => {
                                    if (!prev) return null;
                                    const updated = [...prev.applications];
                                    updated[idx] = { ...updated[idx], price: newval };
                                    return { ...prev, applications: updated };
                                  });
                                }}
                                className="w-20 text-right text-xs font-bold p-2 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-primary transition-all text-gray-800 disabled:opacity-40"
                              />
                            </div>

                            <div className="flex items-center gap-1.5 bg-pink-50/40 px-2.5 py-1 rounded-lg border border-pink-100">
                              <span className="text-[9px] font-black text-pink-500 uppercase tracking-wider">Sconto €</span>
                              <input 
                                type="number" 
                                value={app.discount || ''}
                                placeholder="0"
                                disabled={!app.included}
                                onChange={(e) => {
                                  const newval = Number(e.target.value);
                                  setPricingQuote(prev => {
                                    if (!prev) return null;
                                    const updated = [...prev.applications];
                                    updated[idx] = { ...updated[idx], discount: newval };
                                    return { ...prev, applications: updated };
                                  });
                                }}
                                className="w-14 text-right text-xs font-bold p-1 rounded border border-pink-200 bg-white focus:outline-none focus:ring-1 focus:ring-primary transition-all text-gray-800 disabled:opacity-40 font-mono"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Extra Deliverables selected by client */}
                {pricingQuote.deliverables.length > 0 && (
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4 text-left">
                    <h4 className="text-xs font-black text-primary uppercase tracking-widest flex items-center gap-2 border-b border-gray-50 pb-2">
                      <FileText size={14} /> 3. Elementi aggiuntivi richiesti
                    </h4>
                    <p className="text-[11px] text-gray-400 font-medium">Flagga gli elementi da includere, assegna un prezzo e imposta sconti facoltativi:</p>
                    <div className="space-y-3">
                      {pricingQuote.deliverables.map((del, idx) => (
                        <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3 bg-gray-50 border border-gray-150 rounded-xl">
                          <div className="flex items-center gap-2.5">
                            <input 
                              type="checkbox" 
                              checked={del.included}
                              onChange={(e) => {
                                const val = e.target.checked;
                                setPricingQuote(prev => {
                                  if (!prev) return null;
                                  const updated = [...prev.deliverables];
                                  updated[idx] = { ...updated[idx], included: val };
                                  return { ...prev, deliverables: updated };
                                });
                              }}
                              className="w-4 h-4 rounded text-primary focus:ring-primary border-gray-300 transition-all cursor-pointer"
                            />
                            <span className={`text-xs font-bold transition-colors ${del.included ? 'text-gray-800' : 'text-gray-400 line-through'}`}>{del.name}</span>
                          </div>
                          
                          <div className="flex items-center gap-3 shrink-0 flex-wrap sm:flex-nowrap">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-gray-400">Prezzo €</span>
                              <input 
                                type="number" 
                                value={del.price || ''}
                                placeholder="0"
                                disabled={!del.included}
                                onChange={(e) => {
                                  const newval = Number(e.target.value);
                                  setPricingQuote(prev => {
                                    if (!prev) return null;
                                    const updated = [...prev.deliverables];
                                    updated[idx] = { ...updated[idx], price: newval };
                                    return { ...prev, deliverables: updated };
                                  });
                                }}
                                className="w-20 text-right text-xs font-bold p-2 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-primary transition-all text-gray-800 disabled:opacity-40"
                              />
                            </div>

                            <div className="flex items-center gap-1.5 bg-pink-50/40 px-2.5 py-1 rounded-lg border border-pink-100">
                              <span className="text-[9px] font-black text-pink-500 uppercase tracking-wider">Sconto €</span>
                              <input 
                                type="number" 
                                value={del.discount || ''}
                                placeholder="0"
                                disabled={!del.included}
                                onChange={(e) => {
                                  const newval = Number(e.target.value);
                                  setPricingQuote(prev => {
                                    if (!prev) return null;
                                    const updated = [...prev.deliverables];
                                    updated[idx] = { ...updated[idx], discount: newval };
                                    return { ...prev, deliverables: updated };
                                  });
                                }}
                                className="w-14 text-right text-xs font-bold p-1 rounded border border-pink-200 bg-white focus:outline-none focus:ring-1 focus:ring-primary transition-all text-gray-800 disabled:opacity-40 font-mono"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. Manual Custom Voci */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4 text-left">
                  <h4 className="text-xs font-black text-primary uppercase tracking-widest flex items-center gap-2 border-b border-gray-50 pb-2">
                    <Plus size={14} /> 4. Altre voci di spesa personalizzate
                  </h4>
                  {pricingQuote.customItems.length > 0 && (
                    <div className="space-y-2">
                      {pricingQuote.customItems.map((item, idx) => (
                        <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-2.5 bg-pink-50/30 border border-pink-100 rounded-xl">
                          <div className="flex items-center gap-2.5">
                            <input 
                              type="checkbox" 
                              checked={item.included}
                              onChange={(e) => {
                                const val = e.target.checked;
                                setPricingQuote(prev => {
                                  if (!prev) return null;
                                  const updated = [...prev.customItems];
                                  updated[idx] = { ...updated[idx], included: val };
                                  return { ...prev, customItems: updated };
                                });
                              }}
                              className="w-3.5 h-3.5 rounded text-primary focus:ring-primary border-gray-200 transition-all cursor-pointer"
                            />
                            <span className={`text-xs font-bold transition-colors ${item.included ? 'text-gray-750' : 'text-gray-400 line-through'}`}>{item.name}</span>
                          </div>
                          
                          <div className="flex items-center gap-3 shrink-0 flex-wrap sm:flex-nowrap">
                            <div className="flex items-center gap-1 shrink-0">
                              <span className="text-[10px] font-bold text-gray-400">€ {item.price}</span>
                            </div>

                            <div className="flex items-center gap-1.5 bg-pink-50/40 px-2 py-0.5 rounded-lg border border-pink-100">
                              <span className="text-[9px] font-black text-pink-500 uppercase tracking-wider">Sconto €</span>
                              <input 
                                type="number" 
                                value={item.discount || ''}
                                placeholder="0"
                                disabled={!item.included}
                                onChange={(e) => {
                                  const newval = Number(e.target.value);
                                  setPricingQuote(prev => {
                                    if (!prev) return null;
                                    const updated = [...prev.customItems];
                                    updated[idx] = { ...updated[idx], discount: newval };
                                    return { ...prev, customItems: updated };
                                  });
                                }}
                                className="w-14 text-right text-xs font-bold p-1 rounded border border-pink-200 bg-white focus:outline-none focus:ring-1 focus:ring-primary text-gray-800 disabled:opacity-40 font-mono"
                              />
                            </div>

                            <button 
                              type="button" 
                              onClick={() => removeCustomItem(idx)}
                              className="p-1 text-gray-400 hover:text-red-500 hover:bg-white rounded-md transition-all border border-transparent hover:border-red-100"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <input 
                      type="text" 
                      placeholder="E.g., Sviluppo Sito Web o Stampa"
                      value={newCustomItemName}
                      onChange={(e) => setNewCustomItemName(e.target.value)}
                      className="w-full text-xs font-medium p-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none text-gray-800 animate-none"
                    />
                    <div className="flex gap-2">
                      <input 
                        type="number" 
                        placeholder="Prezzo (€)"
                        value={newCustomItemPrice}
                        onChange={(e) => setNewCustomItemPrice(e.target.value === "" ? "" : Number(e.target.value))}
                        className="w-full text-xs font-medium p-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none text-gray-800"
                      />
                      <button 
                        type="button" 
                        onClick={addCustomItem}
                        className="px-4 bg-primary text-white text-xs font-bold rounded-xl hover:scale-102 transition-transform shadow-md shrink-0"
                      >
                        Aggiungi
                      </button>
                    </div>
                  </div>
                </div>

                {/* 5. Imposte, Sconti e Note */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4 text-left">
                  <h4 className="text-xs font-black text-primary uppercase tracking-widest flex items-center gap-2 border-b border-gray-50 pb-2">
                    <Target size={14} /> 5. Impostazioni fiscali, Sconto & Condizioni generali
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Regime o Imposta</label>
                      <select 
                        value={pricingQuote.taxType}
                        onChange={(e) => setPricingQuote(prev => prev ? { ...prev, taxType: e.target.value as any } : null)}
                        className="w-full text-xs font-bold p-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none text-gray-800 focus:bg-white"
                      >
                        <option value="forfettario">Regime Forfettario (Senza IVA)</option>
                        <option value="iva22">IVA ordinaria al 22%</option>
                        <option value="esente">Esente IVA</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Sconto applicato (€)</label>
                      <input 
                        type="number" 
                        value={pricingQuote.discount || ''}
                        placeholder="0"
                        onChange={(e) => setPricingQuote(prev => prev ? { ...prev, discount: Number(e.target.value) } : null)}
                        className="w-full text-xs font-bold p-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none text-gray-800"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Data Preventivo</label>
                      <input 
                        type="date" 
                        value={pricingQuote.created_at ? pricingQuote.created_at.substring(0, 10) : new Date().toISOString().substring(0, 10)}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val) {
                            setPricingQuote(prev => prev ? { ...prev, created_at: new Date(val).toISOString() } : null);
                          }
                        }}
                        className="w-full text-xs font-bold p-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none text-gray-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Condizioni Generali di pagamento</label>
                    <textarea 
                      rows={5}
                      value={pricingQuote.notes}
                      onChange={(e) => setPricingQuote(prev => prev ? { ...prev, notes: e.target.value } : null)}
                      className="w-full text-xs font-medium p-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none text-gray-850 resize-none leading-relaxed font-sans"
                    />
                  </div>
                </div>

              </div>
              <div className="flex flex-col items-center justify-start bg-gray-150 p-4 md:p-6 rounded-[2rem] border-2 border-dashed border-gray-350 min-h-[500px] overflow-hidden">
                
                {/* Visual Preview Slider & Context */}
                <div className="w-full flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-4 bg-white px-5 py-3 rounded-2xl border border-gray-150 shadow-sm shrink-0 text-left">
                  <div className="text-left col-span-12">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block font-sans">Stile e Integrazione A4</span>
                    <p className="text-xs font-bold text-gray-900 mt-0.5 font-sans">Fai clic sul foglio per visualizzare a dimensione intera</p>
                  </div>
                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider font-mono">Zoom: {(previewZoom * 100).toFixed(0)}%</span>
                    <input 
                      type="range" 
                      min="0.35" 
                      max="1.1" 
                      step="0.05"
                      value={previewZoom} 
                      onChange={(e) => setPreviewZoom(Number(e.target.value))}
                      className="w-24 accent-primary cursor-pointer h-1.5 bg-gray-100 rounded-lg appearance-none"
                    />
                  </div>
                </div>

                {/* Styled Container with dynamic CSS zoom */}
                <div className="w-full overflow-auto flex-grow flex justify-center items-start py-4 chat-scrollbar max-h-[55vh]">
                  <div 
                    onClick={() => setShowFullPdfPreview(true)}
                    className="shadow-2xl rounded-2xl overflow-hidden cursor-zoom-in hover:shadow-primary/20 transition-all active:scale-[0.98] outline outline-0 hover:outline-4 outline-primary/10 bg-white"
                    style={{ 
                      zoom: previewZoom, 
                      transform: `scale(1)`, 
                      transformOrigin: 'top center' 
                    }}
                    title="Clicca per aprire l'anteprima completa 1:1"
                  >
                    {/* The exact region captured for PDF */}
                    <div ref={pdfRef} className="hidden" />
                    {renderQuoteTemplate(pricingQuote)}
                  </div>
                </div>

              </div>
            </div>

            {/* Footer buttons */}
            <div className="p-6 md:p-8 bg-white border-t border-gray-200 flex justify-between items-center flex-shrink-0">
              <button 
                type="button"
                onClick={() => setPricingQuote(null)}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-slate-700 rounded-xl font-bold text-sm transition-all shadow-sm"
              >
                Annulla
              </button>
              
              <button 
                type="button"
                disabled={exportingPdf}
                onClick={exportQuoteToPdf}
                className="px-8 py-3 bg-gradient-brand text-white rounded-xl font-black text-sm hover:scale-[1.02] flex items-center gap-2 shadow-lg hover:shadow-primary/10 transition-all cursor-pointer"
              >
                {exportingPdf ? (
                  <>
                    <RefreshCw size={18} className="animate-spin" />
                    <span>Generazione PDF...</span>
                  </>
                ) : (
                  <>
                    <Download size={18} />
                    <span>Esporta PDF A4</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {showFullPdfPreview && pricingQuote && (
        <div className="fixed inset-0 bg-slate-950/80 z-[300] backdrop-blur-md flex flex-col items-center justify-center p-4">
          <div className="absolute inset-0 cursor-pointer" onClick={() => setShowFullPdfPreview(false)} />
          
          <div className="relative bg-gray-100 rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-white border-b border-gray-200 flex justify-between items-center shrink-0">
              <div className="text-left">
                <span className="text-[10px] font-black text-[#5C27D3] uppercase tracking-widest block font-sans">Anteprima Completa 1:1</span>
                <h3 className="text-sm font-black text-gray-900 font-sans">Proposta di Preventivo — {pricingQuote.company_name}</h3>
              </div>
              <button 
                type="button"
                onClick={() => setShowFullPdfPreview(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-xs transition-all cursor-pointer"
              >
                Chiudi
              </button>
            </div>

            {/* Modal Scroll area */}
            <div className="flex-grow overflow-y-auto p-6 md:p-8 flex justify-center bg-gray-100/50 chat-scrollbar">
              {renderQuoteTemplate(pricingQuote)}

              </div>
            </div>
          </div>
        )}

      {/* Hidden offscreen container for pristine, unzoomed A4 PDF generation */}
      {pdfActiveQuote && (
        <div style={{ position: 'fixed', top: 0, left: '-10000px', width: '595px', height: 'auto', zIndex: -10000 }}>
          <div id="pristine-pdf-template" style={{ width: '595px', minHeight: '842px', boxSizing: 'border-box' }}>
            {pdfActiveQuote.isQuestionnaire ? (
              renderQuestionnaireTemplate(pdfActiveQuote.questData)
            ) : (
              renderQuoteTemplate(pdfActiveQuote, true)
            )}
          </div>
        </div>
      )}

      {questToDelete && (
        <div 
          className="fixed inset-0 z-[310] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in"
          onClick={() => setQuestToDelete(null)}
        >
          <div 
            className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl p-6 md:p-8 flex flex-col overflow-hidden animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex gap-4 items-start mb-6">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                <Trash2 size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 font-sans mt-1">Sei sicuro?</h3>
                <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                  Stai per eliminare questo questionario. Questa operazione non può essere annullata.
                </p>
              </div>
            </div>
            
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setQuestToDelete(null)}
                className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-xs transition-all"
              >
                Annulla
              </button>
              <button 
                onClick={() => handleDeleteQuest(questToDelete.id)}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs transition-all flex items-center gap-1.5"
              >
                Conferma ed Elimina
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


export default Dashboard;