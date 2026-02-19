
import React, { useState, useRef, useEffect } from 'react';
import { X, Send, User, Loader2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface Message {
  role: 'user' | 'model';
  text: string;
}

const AIChatModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const logoUrl = "https://lh3.googleusercontent.com/d/1-1MNPNU_LjsOB1ETjNMKk0R8OgUANR3b";
  
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Ciao! Sono **Mutey**, la mascotte creativa di Francesca.\n\nPosso raccontarti il suo percorso, come integra l'IA nel design o rispondere a domande sulle sue esperienze lavorative. Cosa vorresti sapere?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const systemInstruction = `
        Sei Mutey, la mascotte ufficiale e assistente virtuale di Francesca Mutolo. 
        Profilo di Francesca: 
        - Senior Graphic & AI Product Designer.
        - Nata nel 1986, sarda (Sardegna).
        - Oltre 15 anni di esperienza nella comunicazione visiva.
        - Specializzazioni: Creazione loghi, immagine coordinata, grafica per social, volantini e poster.
        - Innovazione: Utilizza l'Intelligenza Artificiale per rendere il lavoro più veloce e creativo.
        
        Tua Identità (Mutey):
        - Sei una mascotte amichevole, arguta e creativa.
        - Il tuo tono è professionale ma brioso, riflettendo lo spirito innovativo di Francesca.
        
        Istruzioni per le risposte:
        - Sii ESTREMAMENTE SINTETICO e CONCISO.
        - LINGUAGGIO SEMPLICE: Evita assolutamente tecnicismi (niente termini come "LLM", "workflow", "branding strategico" se non spiegati o semplificati). Usa parole che chiunque possa capire immediatamente.
        - Rispondi basandoti sul suo CV e sulla sua filosofia: "Il design deve funzionare".
        - Se ti chiedono dettagli molto tecnici o date specifiche che non hai, invita l'utente a scaricare il PDF originale dal pulsante nella Hero o a scriverle via form.
        - Parla di Francesca in terza persona con ammirazione, presentandoti come il suo compagno digitale.

        REGOLE DI IMPAGINAZIONE (MOLTO IMPORTANTI):
        - NON scrivere mai blocchi di testo lunghi o densi.
        - Dividi le informazioni in paragrafi brevi (2-3 righe massimo) separati da una riga vuota.
        - Usa ELENCHI PUNTATI (utilizzando il carattere "•") ogni volta che devi elencare più di due elementi.
        - Utilizza il GRASSETTO (racchiudendo le parole tra doppie asterischi, es: **concetto**) per dare risalto a concetti chiave.
        - Assicurati che la risposta sia leggibile a colpo d'occhio.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          { role: 'user', parts: [{ text: systemInstruction }] },
          ...messages.map(m => ({
            role: m.role,
            parts: [{ text: m.text }]
          })),
          { role: 'user', parts: [{ text: userMessage }] }
        ]
      });

      const responseText = response.text;
      setMessages(prev => [...prev, { role: 'model', text: responseText || "Scusa, ho avuto un piccolo vuoto di memoria digitale. Puoi ripetere?" }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Ops! Sembra che il mio collegamento con Francesca sia momentaneamente disturbato. Riprova tra poco!" }]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderFormattedText = (text: string) => {
    // Split per gestire il grassetto **testo**
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return (
      <span className="whitespace-pre-wrap">
        {parts.map((part, i) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={i} className="font-extrabold text-slate-900">{part.slice(2, -2)}</strong>;
          }
          return part;
        })}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <div 
        className="bg-white w-full max-w-2xl h-[80vh] rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300 border border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-brand p-6 flex justify-between items-center text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden border-2 border-white/20 shadow-inner">
              <img src={logoUrl} alt="Mutey" className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">Mutey</h3>
              <p className="text-xs text-white/80">Francesca's Creative Mascot</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Chat Area */}
        <div 
          ref={scrollRef}
          className="flex-grow overflow-y-auto p-6 space-y-6 chat-scrollbar bg-slate-50/50"
        >
          {messages.map((msg, i) => (
            <div 
              key={i} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}
            >
              <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm overflow-hidden ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-white border border-slate-100'}`}>
                  {msg.role === 'user' ? (
                    <User size={16} />
                  ) : (
                    <img src={logoUrl} alt="Mutey" className="w-full h-full object-cover" />
                  )}
                </div>
                <div className={`p-4 rounded-2xl shadow-sm text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-primary text-white rounded-tr-none' 
                    : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none font-medium'
                }`}>
                  {renderFormattedText(msg.text)}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start animate-pulse">
              <div className="flex gap-3 items-center">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm overflow-hidden border border-slate-100">
                  <img src={logoUrl} alt="Mutey" className="w-full h-full object-cover opacity-50" />
                </div>
                <div className="bg-white p-3 rounded-2xl border border-slate-100 text-xs text-slate-400">
                  Mutey sta scrivendo...
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <form onSubmit={handleSendMessage} className="p-6 bg-white border-t border-slate-100">
          <div className="relative flex items-center">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Chiedi a Mutey della sua esperienza..."
              className="w-full pl-6 pr-14 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm font-medium dark:text-white dark:bg-gray-800 dark:border-gray-700"
            />
            <button 
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-2 p-3 bg-gradient-brand text-white rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
            >
              <Send size={18} />
            </button>
          </div>
          <p className="text-[10px] text-center text-slate-400 mt-4 uppercase tracking-widest font-bold">
            Powered by Gemini AI • Mutey Digital Mascot
          </p>
        </form>
      </div>
    </div>
  );
};

export default AIChatModal;
