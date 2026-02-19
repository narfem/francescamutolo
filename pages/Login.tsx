
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Lock, Mail, AlertCircle } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
    } else {
      navigate('/dashboard');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center md:items-start justify-center px-4 md:pt-20 lg:pt-32">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="text-primary" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Area Riservata</h2>
          <p className="text-gray-600">Inserisci le tue credenziali per gestire il sito.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3 text-sm">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                required
                type="email" 
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white dark:bg-gray-800 dark:border-gray-700"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                required
                type="password" 
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white dark:bg-gray-800 dark:border-gray-700"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gradient-brand text-white py-4 rounded-xl font-bold transition-all hover:opacity-90 hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? 'Accesso in corso...' : 'Accedi'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
