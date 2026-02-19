
import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Send, CheckCircle } from 'lucide-react';

const ContactSection: React.FC = () => {
  const [activeForm, setActiveForm] = useState<'simple' | 'brief'>('simple');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Simple Form State
  const [simpleData, setSimpleData] = useState({ name: '', email: '', message: '' });

  // Brief Form State
  const [briefData, setBriefData] = useState({
    name: '', email: '', phone: '', colors: '', notes: '',
    services: [] as string[]
  });

  const servicesList = [
    'Nuovo logo', 'Rinnovo logo esistente', 'Biglietto da visita', 
    'Sito web', 'Locandina', 'Gestione social'
  ];

  const handleSimpleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('contacts_simple').insert([simpleData]);
    setLoading(false);
    if (!error) {
      setSubmitted(true);
      setSimpleData({ name: '', email: '', message: '' });
    }
  };

  const handleBriefSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('contacts_brief').insert([briefData]);
    setLoading(false);
    if (!error) {
      setSubmitted(true);
      setBriefData({ name: '', email: '', phone: '', colors: '', notes: '', services: [] });
    }
  };

  const toggleService = (service: string) => {
    setBriefData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto text-center py-20 px-4">
        <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Grazie Mille!</h2>
        <p className="text-gray-600 mb-8">Il tuo messaggio è stato ricevuto. Ti risponderò il prima possibile.</p>
        <button 
          onClick={() => setSubmitted(false)}
          className="text-primary font-bold underline"
        >
          Invia un altro messaggio
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">Parliamo del tuo Brand</h2>
        <p className="text-gray-600">Scegli la modalità che preferisci per contattarmi.</p>
        
        <div className="flex justify-center mt-8 p-1 bg-gray-200 rounded-lg w-fit mx-auto">
          <button 
            onClick={() => setActiveForm('simple')}
            className={`px-6 py-2 rounded-md font-medium transition-all ${activeForm === 'simple' ? 'bg-white shadow-sm text-primary' : 'text-gray-600'}`}
          >
            Contatto Rapido
          </button>
          <button 
            onClick={() => setActiveForm('brief')}
            className={`px-6 py-2 rounded-md font-medium transition-all ${activeForm === 'brief' ? 'bg-white shadow-sm text-primary' : 'text-gray-600'}`}
          >
            Brief di Progetto
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        <div className="p-8 md:p-12">
          {activeForm === 'simple' ? (
            <form onSubmit={handleSimpleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Nome</label>
                  <input 
                    required 
                    type="text" 
                    placeholder="Il tuo nome"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none dark:text-white dark:bg-gray-800 dark:border-gray-700"
                    value={simpleData.name}
                    onChange={e => setSimpleData({...simpleData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                  <input 
                    required 
                    type="email" 
                    placeholder="email@esempio.com"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none dark:text-white dark:bg-gray-800 dark:border-gray-700"
                    value={simpleData.email}
                    onChange={e => setSimpleData({...simpleData, email: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Messaggio</label>
                <textarea 
                  required 
                  rows={5} 
                  placeholder="Di cosa hai bisogno?"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none resize-none dark:text-white dark:bg-gray-800 dark:border-gray-700"
                  value={simpleData.message}
                  onChange={e => setSimpleData({...simpleData, message: e.target.value})}
                ></textarea>
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-gradient-brand text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-95 transition-opacity disabled:opacity-50"
              >
                {loading ? 'Invio in corso...' : 'Invia Messaggio'} <Send size={20} />
              </button>
            </form>
          ) : (
            <form onSubmit={handleBriefSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Nome *</label>
                  <input required type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary outline-none dark:text-white dark:bg-gray-800 dark:border-gray-700"
                    value={briefData.name} onChange={e => setBriefData({...briefData, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email *</label>
                  <input required type="email" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary outline-none dark:text-white dark:bg-gray-800 dark:border-gray-700"
                    value={briefData.email} onChange={e => setBriefData({...briefData, email: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Telefono</label>
                  <input type="tel" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary outline-none dark:text-white dark:bg-gray-800 dark:border-gray-700"
                    value={briefData.phone} onChange={e => setBriefData({...briefData, phone: e.target.value})} />
                </div>
              </div>

              <div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {servicesList.map(service => (
                    <label key={service} className="flex items-center gap-3 p-4 border border-gray-100 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                      <input 
                        type="checkbox" 
                        className="w-5 h-5 accent-primary"
                        checked={briefData.services.includes(service)}
                        onChange={() => toggleService(service)}
                      />
                      <span className="text-sm text-gray-600">{service}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Colori Preferiti</label>
                <input 
                  type="text" 
                  maxLength={200}
                  placeholder="Es: Blu navy e Oro, oppure toni pastello..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary outline-none dark:text-white dark:bg-gray-800 dark:border-gray-700"
                  value={briefData.colors}
                  onChange={e => setBriefData({...briefData, colors: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Note Aggiuntive</label>
                <textarea 
                  rows={4}
                  placeholder="Raccontami la tua idea o visione..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary outline-none resize-none dark:text-white dark:bg-gray-800 dark:border-gray-700"
                  value={briefData.notes}
                  onChange={e => setBriefData({...briefData, notes: e.target.value})}
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-gradient-brand text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-95 transition-opacity disabled:opacity-50"
              >
                {loading ? 'Creazione Brief...' : 'Invia Brief di Progetto'} <Send size={20} />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactSection;
