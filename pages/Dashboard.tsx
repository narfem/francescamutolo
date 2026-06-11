import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, Routes, Route, Link, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { 
  LayoutDashboard, Image as ImageIcon, MessageSquare, Briefcase, LogOut, 
  Plus, Trash2, Pencil, Star, Download, FileJson, 
  X, Mail, RefreshCw, Menu as MenuIcon, Flag, FileText, Copy, Check, Sparkles,
  ClipboardList, Building, Users, Target, Palette, Shield, Monitor, Globe, Instagram
} from 'lucide-react';
import { PortfolioItem, SimpleContact, BriefContact, Questionnaire } from '../types';
import JSZip from 'jszip';
import ManageFeedbacks from './ManageFeedbacks';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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
    </div>
  </div>
);

const ManageCV = () => {
  const [cvUrl, setCvUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  useEffect(() => {
    fetchCV();
  }, []);

  const fetchCV = async () => {
    try {
      const { data, error } = await supabase.from('settings').select('cv_url').eq('id', 'global').maybeSingle();
      if (!error && data) {
        setCvUrl(data.cv_url || '');
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
    </div>
  );
};

const ManageMutey = () => {
  const [rules, setRules] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      const { data, error } = await supabase.from('settings').select('mutey_rules').eq('id', 'global').maybeSingle();
      if (!error && data) {
        setRules(data.mutey_rules || '');
      }
    } catch (e) {
      console.error("Fetch rules error:", e);
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
    </div>
  );
};

const ManagePortfolio = () => {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [newItem, setNewItem] = useState({ title: '', description: '', category: 'Branding', image_url: '', is_featured: false });
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => { fetchItems(); }, []);

  useEffect(() => {
    if (isAdding && formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [isAdding]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const finalUrl = convertDriveUrl(newItem.image_url);
    
    const itemData = { 
      title: newItem.title,
      description: newItem.description,
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
      setNewItem({ title: '', description: '', category: 'Branding', image_url: '', is_featured: false });
      fetchItems();
    }
    setLoading(false);
  };

  const handleEdit = (item: PortfolioItem) => {
    setEditingItem(item);
    setNewItem({
      title: item.title,
      description: item.description,
      category: item.category,
      image_url: item.image_url,
      is_featured: item.is_featured || false
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
    setNewItem({ title: '', description: '', category: 'Branding', image_url: '', is_featured: false });
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
                  <input required className="w-full p-3 md:p-4 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white dark:bg-gray-800 dark:border-gray-700" 
                    value={newItem.title} onChange={e => setNewItem({...newItem, title: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Categoria</label>
                  <select className="w-full p-3 md:p-4 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary outline-none dark:text-white dark:bg-gray-800 dark:border-gray-700"
                    value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})}>
                    <option>Branding</option>
                    <option>Flyer & Poster</option>
                    <option>Social Media</option>
                    <option>Print</option>
                  </select>
                </div>
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
                  <label className="block text-sm font-bold text-gray-700 mb-2">Link Google Drive</label>
                  <input required placeholder="Incolla il link 'Condividi' di Drive" className="w-full p-3 md:p-4 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary outline-none text-sm dark:text-white dark:bg-gray-800 dark:border-gray-700"
                    value={newItem.image_url} onChange={e => setNewItem({...newItem, image_url: e.target.value})} />
                </div>
              </div>
              <div className="space-y-4">
                <label className="block text-sm font-bold text-gray-700 mb-2">Anteprima Visiva</label>
                <div className="aspect-video bg-gray-100 rounded-2xl overflow-hidden border-2 border-dashed border-gray-200 flex items-center justify-center relative group">
                  {newItem.image_url ? (
                    <img src={convertDriveUrl(newItem.image_url)} alt="Preview" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center p-6 text-gray-300">
                      <ImageIcon size={32} className="mx-auto mb-2" />
                      <p className="text-[10px] font-bold uppercase">Anteprima Immagine</p>
                    </div>
                  )}
                </div>
                <textarea rows={3} placeholder="Descrizione..." className="w-full p-3 md:p-4 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary outline-none resize-none text-sm dark:text-white dark:bg-gray-800 dark:border-gray-700"
                  value={newItem.description} onChange={e => setNewItem({...newItem, description: e.target.value})} />
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50">
              {loading ? 'Salvataggio...' : editingItem ? 'Salva Modifiche' : 'Pubblica Progetto'}
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(item => (
          <div key={item.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-xl transition-all relative">
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
            <div className="aspect-video relative overflow-hidden bg-gray-100">
              <img src={item.image_url} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" onError={(e) => { (e.target as any).src = 'https://placehold.co/600x400?text=Link+Non+Valido' }} />
              <div className="absolute inset-0 bg-black/60 lg:opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
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
        ))}
      </div>
    </div>
  );
};

const ManageLeads = () => {
  const [simpleLeads, setSimpleLeads] = useState<SimpleContact[]>([]);
  const [briefLeads, setBriefLeads] = useState<BriefContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<{ type: 'simple' | 'brief', data: any } | null>(null);

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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-3xl bg-primary/10 text-primary">
               <RefreshCw size={28} />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-black text-gray-900">Messaggi Attivi</h2>
              <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest">Clicca sull'icona flag per selezionare se il messaggio è letto</p>
            </div>
          </div>
        </div>

        <section className="mb-12">
          <h3 className="text-sm font-black text-primary/60 uppercase tracking-widest mb-6 flex items-center gap-2">
            <Mail size={16} /> Contatti Rapidi
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {simpleLeads.map(lead => (
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
                      className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider border transition-all ${
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
                  <div className="flex gap-1">
                    <button onClick={(e) => { e.stopPropagation(); downloadLeadTxt(lead, 'simple'); }} className="p-2 text-gray-400 hover:text-primary transition-colors bg-gray-50 rounded-full">
                      <Download size={16} />
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
            {simpleLeads.length === 0 && (
              <div className="col-span-full py-8 text-center text-gray-300 font-medium border-2 border-dashed border-gray-100 rounded-[2rem]">Nessun contatto rapido attivo</div>
            )}
          </div>
        </section>

        <section>
          <h3 className="text-sm font-black text-secondary/60 uppercase tracking-widest mb-6 flex items-center gap-2">
            <Briefcase size={16} /> Brief Dettagliati
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {briefLeads.map(lead => (
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
                  <div className="flex gap-1">
                    <button onClick={(e) => { e.stopPropagation(); downloadLeadTxt(lead, 'brief'); }} className="p-2 text-gray-400 hover:text-secondary transition-colors bg-gray-50 rounded-full">
                      <Download size={18} />
                    </button>
                  </div>
                </div>
                <div className="text-xs text-gray-500 bg-gray-50/50 p-4 rounded-2xl border border-gray-100 line-clamp-2">
                  <strong>Note:</strong> {lead.notes}
                </div>
              </div>
            ))}
            {briefLeads.length === 0 && (
              <div className="col-span-full py-8 text-center text-gray-300 font-medium border-2 border-dashed border-gray-100 rounded-[2rem]">Nessun brief dettagliato attivo</div>
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
            <div className="p-6 md:p-10 bg-gray-50/50 border-t border-gray-100 flex-shrink-0">
               <button onClick={() => downloadLeadTxt(selectedLead.data, selectedLead.type)} className="w-full py-4 md:py-5 bg-brandDark text-white rounded-2xl font-black flex items-center justify-center gap-3 md:gap-4 hover:scale-[1.02] transition-all shadow-xl active:scale-95 group text-sm md:text-base">
                 <Download size={20} className="md:w-6 md:h-6" /> 
                 <span>Scarica Archivio (.TXT)</span>
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ManageQuestionnaires = () => {
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuest, setSelectedQuest] = useState<Questionnaire | null>(null);
  const [errorInfo, setErrorInfo] = useState<string | null>(null);

  const [logoBase64, setLogoBase64] = useState<string>('');

  useEffect(() => {
    let active = true;
    const fetchLogoAsBase64 = async () => {
      const uId = "14Ps4nKRx1wOah9gZHFo4O3Ynq4qpWpKU";
      const uUrl = `https://drive.google.com/thumbnail?id=${uId}&sz=w500`;
      const proxiedUrls = [
        `https://corsproxy.io/?${encodeURIComponent(uUrl)}`,
        `https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?container=focus&refresh=2592000&url=${encodeURIComponent(uUrl)}`,
        uUrl
      ];

      for (const url of proxiedUrls) {
        try {
          const response = await fetch(url);
          if (!response.ok) continue;
          const blob = await response.blob();
          const reader = new FileReader();
          const p = new Promise<string>((resolve, reject) => {
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
          });
          reader.readAsDataURL(blob);
          const base64 = await p;
          if (active && base64 && base64.startsWith('data:image')) {
            setLogoBase64(base64);
            break;
          }
        } catch (e) {
          console.warn("Failed to load logo from", url, e);
        }
      }
    };

    fetchLogoAsBase64();
    return () => {
      active = false;
    };
  }, []);

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
                                  <span className="line-through text-gray-400">€ {item.price.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</span>
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
                          <span className="line-through text-gray-400 text-[10px] font-normal">€ {app.price.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</span>
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
                          <span className="line-through text-gray-400 text-[10px] font-normal">€ {del.price.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</span>
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
                          <span className="line-through text-gray-400 text-[10px] font-normal">€ {item.price.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</span>
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

  useEffect(() => { fetchQuestionnaires(); }, []);

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
        <h2 className="text-xl md:text-2xl font-black text-gray-950 mb-8 flex items-center gap-3">
          <ClipboardList size={28} className="text-primary" />
          <span>Questionari Attivi ({questionnaires.filter(q => !q.is_deleted).length})</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {questionnaires.filter(q => !q.is_deleted).map(quest => (
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
                <div className="flex flex-wrap gap-1 max-w-[70%]">
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
                    <span>Formula preventivo</span>
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
                </div>
              </div>
            </div>
          ))}

          {questionnaires.filter(q => !q.is_deleted).length === 0 && !loading && (
            <div className="col-span-full py-16 text-center text-gray-300 font-medium border-2 border-dashed border-gray-100 rounded-[2rem]">
              Nessun questionario di brand identity ricevuto
            </div>
          )}
        </div>
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
                      ? 'bg-gray-100 text-gray-500 border-gray-200' 
                      : 'bg-green-50 text-green-600 border-green-100'
                  }`}
                >
                  <Flag size={12} fill={selectedQuest.is_read ? "none" : "currentColor"} />
                  {selectedQuest.is_read ? 'Segna come non letto' : 'Segna come letto'}
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
    </div>
  );
};


export default Dashboard;