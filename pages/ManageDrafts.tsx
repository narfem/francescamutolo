import React, { useEffect, useState } from 'react';
import { 
  getAllDrafts, 
  deleteDraft, 
  getResumeUrl, 
  QuestionnaireDraft 
} from '../lib/draftService';
import { 
  BookmarkCheck, Copy, ExternalLink, Trash2, Eye, RefreshCw, 
  Search, Filter, Clock, CheckCircle2, AlertCircle, FileText, 
  User, Building, Sparkles, Check, X, ShieldAlert 
} from 'lucide-react';

export const ManageDrafts: React.FC = () => {
  const [drafts, setDrafts] = useState<QuestionnaireDraft[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [selectedDraftForView, setSelectedDraftForView] = useState<QuestionnaireDraft | null>(null);
  const [draftToDelete, setDraftToDelete] = useState<QuestionnaireDraft | null>(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  const fetchDrafts = async () => {
    setLoading(true);
    try {
      const data = await getAllDrafts();
      setDrafts(data);
    } catch (e) {
      console.error("Errore recupero bozze:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrafts();
  }, []);

  const handleCopyLink = async (token: string) => {
    const url = getResumeUrl(token);
    try {
      await navigator.clipboard.writeText(url);
    } catch (err) {
      const textArea = document.createElement("textarea");
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
    }
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2500);
  };

  const handleDeleteConfirm = async () => {
    if (!draftToDelete) return;
    try {
      await deleteDraft(draftToDelete.token);
      setDrafts(prev => prev.filter(d => d.token !== draftToDelete.token));
      setActionSuccessMsg(`Bozza (${draftToDelete.token}) eliminata con successo.`);
      setTimeout(() => setActionSuccessMsg(null), 3000);
    } catch (e) {
      console.error("Errore eliminazione bozza:", e);
    } finally {
      setDraftToDelete(null);
    }
  };

  const filteredDrafts = drafts.filter(d => {
    // Search query match
    const nameMatch = (d.company_or_artist_name || '').toLowerCase().includes(searchQuery.toLowerCase());
    const emailMatch = (d.contact_email || '').toLowerCase().includes(searchQuery.toLowerCase());
    const tokenMatch = (d.token || '').toLowerCase().includes(searchQuery.toLowerCase());
    const typeMatchSearch = (d.questionnaire_type || '').toLowerCase().includes(searchQuery.toLowerCase());
    const queryMatches = !searchQuery || nameMatch || emailMatch || tokenMatch || typeMatchSearch;

    // Status match
    const matchesStatus = statusFilter === 'all' || d.status === statusFilter;

    // Type match
    const matchesType = typeFilter === 'all' || d.questionnaire_type === typeFilter;

    return queryMatches && matchesStatus && matchesType;
  });

  const totalCount = drafts.length;
  const inProgressCount = drafts.filter(d => d.status === 'in_progress').length;
  const completedCount = drafts.filter(d => d.status === 'completed').length;
  const expiredCount = drafts.filter(d => d.status === 'expired').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-300 text-left">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500/10 text-amber-700 dark:text-amber-400 mb-2">
            <BookmarkCheck size={14} /> Sistema Salva in Bozza
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white">
            Questionari in Bozza
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Visualizza tutte le bozze create dai clienti, copia e invia i link di ripresa ed elimina quelle obsolete.
          </p>
        </div>

        <button
          onClick={fetchDrafts}
          disabled={loading}
          className="self-start md:self-auto px-4 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-gray-700 dark:text-gray-200 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all shrink-0"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Aggiorna Elenco</span>
        </button>
      </div>

      {actionSuccessMsg && (
        <div className="p-4 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 rounded-2xl text-xs font-bold flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>{actionSuccessMsg}</span>
          </div>
          <button onClick={() => setActionSuccessMsg(null)}>
            <X size={14} />
          </button>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-900 p-5 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-1">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Totale Bozze</p>
          <p className="text-2xl font-black text-gray-900 dark:text-white">{totalCount}</p>
        </div>
        <div className="bg-white dark:bg-gray-900 p-5 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-1">
          <p className="text-xs font-bold text-amber-500 uppercase tracking-wider">In Compilazione</p>
          <p className="text-2xl font-black text-amber-600 dark:text-amber-400">{inProgressCount}</p>
        </div>
        <div className="bg-white dark:bg-gray-900 p-5 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-1">
          <p className="text-xs font-bold text-emerald-500 uppercase tracking-wider">Completate</p>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{completedCount}</p>
        </div>
        <div className="bg-white dark:bg-gray-900 p-5 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-1">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Scadute</p>
          <p className="text-2xl font-black text-gray-500">{expiredCount}</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-gray-900 p-4 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Cerca per nome, email o token..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs font-semibold outline-none focus:ring-2 focus:ring-primary dark:text-white"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs font-bold text-gray-700 dark:text-gray-200 outline-none"
          >
            <option value="all">Tutti gli stati</option>
            <option value="in_progress">In compilazione</option>
            <option value="completed">Completata</option>
            <option value="expired">Scaduta</option>
          </select>

          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs font-bold text-gray-700 dark:text-gray-200 outline-none"
          >
            <option value="all">Tutti i tipi</option>
            <option value="brand">Brand Identity</option>
            <option value="artist">Identità Artistica</option>
          </select>
        </div>
      </div>

      {/* List of Drafts */}
      {loading ? (
        <div className="p-12 text-center bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 space-y-3">
          <RefreshCw size={28} className="animate-spin text-primary mx-auto" />
          <p className="text-xs font-bold text-gray-400">Caricamento bozze in corso...</p>
        </div>
      ) : filteredDrafts.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 space-y-3">
          <BookmarkCheck size={36} className="text-gray-300 dark:text-gray-600 mx-auto" />
          <h3 className="text-base font-bold text-gray-800 dark:text-gray-200">Nessuna bozza trovata</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            {searchQuery || statusFilter !== 'all' || typeFilter !== 'all'
              ? "Nessuna bozza corrisponde ai filtri selezionati."
              : "I clienti vedranno il pulsante 'Salva in bozza' in tutti i questionari. Quando salveranno le bozze appariranno qui."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredDrafts.map((d) => {
            const resumeUrl = getResumeUrl(d.token);
            const isArtist = d.questionnaire_type === 'artist';

            return (
              <div 
                key={d.token}
                className="bg-white dark:bg-gray-900 p-5 md:p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                {/* Left Info */}
                <div className="space-y-3 flex-grow">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                      isArtist 
                        ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400' 
                        : 'bg-primary/10 text-primary'
                    }`}>
                      {isArtist ? 'Identità Artistica' : 'Brand Identity'}
                    </span>

                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                      d.status === 'completed'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : d.status === 'expired'
                          ? 'bg-gray-200 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                          : 'bg-amber-500/10 text-amber-700 dark:text-amber-400'
                    }`}>
                      {d.status === 'completed' 
                        ? 'Completata' 
                        : d.status === 'expired' 
                          ? 'Scaduta' 
                          : 'In compilazione'}
                    </span>

                    <span className="text-[11px] font-mono font-bold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-lg border border-gray-200/50 dark:border-gray-700">
                      ID: {d.token}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      {isArtist ? <User size={18} className="text-purple-500" /> : <Building size={18} className="text-primary" />}
                      {d.company_or_artist_name || 'Bozza Senza Nome'}
                    </h3>
                    {d.contact_email && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        Email: <strong className="text-gray-700 dark:text-gray-300">{d.contact_email}</strong>
                      </p>
                    )}
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1.5 max-w-md">
                    <div className="flex justify-between text-[11px] font-bold text-gray-500 dark:text-gray-400">
                      <span>Avanzamento: Step {d.current_step}</span>
                      <span>{d.completion_percentage}% completato</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ${
                          d.completion_percentage >= 80 
                            ? 'bg-emerald-500' 
                            : d.completion_percentage >= 40 
                              ? 'bg-primary' 
                              : 'bg-amber-500'
                        }`}
                        style={{ width: `${d.completion_percentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="flex flex-wrap items-center gap-4 text-[11px] text-gray-400 font-medium">
                    <span>Creata il: {new Date(d.created_at).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>Ultima modifica: {new Date(d.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({new Date(d.updated_at).toLocaleDateString()})</span>
                  </div>
                </div>

                {/* Right Actions */}
                <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-stretch sm:items-center gap-2 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-gray-100 dark:border-gray-800">
                  <button
                    onClick={() => setSelectedDraftForView(d)}
                    className="px-3.5 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                    title="Visualizza Dettagli Bozza"
                  >
                    <Eye size={15} />
                    <span>Visualizza</span>
                  </button>

                  <button
                    onClick={() => handleCopyLink(d.token)}
                    className={`px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm ${
                      copiedToken === d.token
                        ? 'bg-emerald-600 text-white'
                        : 'bg-primary hover:bg-primary/90 text-white'
                    }`}
                  >
                    {copiedToken === d.token ? (
                      <>
                        <Check size={15} /> Copiato!
                      </>
                    ) : (
                      <>
                        <Copy size={15} /> Copia Link
                      </>
                    )}
                  </button>

                  <a
                    href={resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2.5 bg-brandDark hover:bg-gray-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                    title="Apri Link in nuova scheda"
                  >
                    <ExternalLink size={15} />
                    <span>Apri</span>
                  </a>

                  <button
                    onClick={() => setDraftToDelete(d)}
                    className="px-3 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all"
                    title="Elimina Bozza"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* View Modal */}
      {selectedDraftForView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-gray-900 rounded-3xl max-w-2xl w-full p-6 md:p-8 max-h-[85vh] overflow-y-auto space-y-6 border border-gray-100 dark:border-gray-800 relative shadow-2xl">
            <button
              onClick={() => setSelectedDraftForView(null)}
              className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="space-y-1">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-primary/10 text-primary inline-block">
                Dettagli Bozza ({selectedDraftForView.questionnaire_type === 'artist' ? 'Identità Artistica' : 'Brand Identity'})
              </span>
              <h2 className="text-xl font-black text-gray-900 dark:text-white">
                {selectedDraftForView.company_or_artist_name || 'Bozza Senza Nome'}
              </h2>
              <p className="text-xs text-gray-400 font-mono">Token: {selectedDraftForView.token}</p>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 space-y-2 text-xs text-gray-600 dark:text-gray-300">
              <p><strong>Stato:</strong> {selectedDraftForView.status}</p>
              <p><strong>Step Corrente:</strong> {selectedDraftForView.current_step}</p>
              <p><strong>Completamento:</strong> {selectedDraftForView.completion_percentage}%</p>
              <p><strong>Ultimo aggiornamento:</strong> {new Date(selectedDraftForView.updated_at).toLocaleString()}</p>
              <p><strong>Scadenza:</strong> {selectedDraftForView.expires_at ? new Date(selectedDraftForView.expires_at).toLocaleDateString() : 'Non impostata'}</p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Contenuto Form (JSON Payload):</h4>
              <pre className="p-4 bg-slate-950 text-slate-100 rounded-2xl text-[11px] font-mono overflow-x-auto max-h-60 leading-relaxed">
                {JSON.stringify(selectedDraftForView.payload, null, 2)}
              </pre>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => handleCopyLink(selectedDraftForView.token)}
                className="px-5 py-2.5 bg-primary text-white text-xs font-bold rounded-xl flex items-center gap-2"
              >
                <Copy size={14} /> Copia Link Bozza
              </button>
              <button
                onClick={() => setSelectedDraftForView(null)}
                className="px-5 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-bold rounded-xl"
              >
                Chiudi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {draftToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-gray-900 rounded-3xl max-w-md w-full p-6 space-y-6 text-center border border-gray-100 dark:border-gray-800 shadow-2xl">
            <div className="w-14 h-14 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mx-auto">
              <ShieldAlert size={28} />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Confermi l'eliminazione?</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Stai per eliminare definitivamente la bozza per <strong>{draftToDelete.company_or_artist_name || draftToDelete.token}</strong>. Questa azione non può essere annullata.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDraftToDelete(null)}
                className="px-5 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-bold"
              >
                Annulla
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold"
              >
                Elimina Bozza
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageDrafts;
