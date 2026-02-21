import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, Routes, Route, Link, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { 
  LayoutDashboard, Image as ImageIcon, MessageSquare, Briefcase, LogOut, 
  Plus, Trash2, Pencil, Star, Download, FileJson, 
  X, Mail, RefreshCw, Menu as MenuIcon, Flag, FileText, Copy, Check, Sparkles
} from 'lucide-react';
import { PortfolioItem, SimpleContact, BriefContact } from '../types';
import JSZip from 'jszip';

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

export default Dashboard;