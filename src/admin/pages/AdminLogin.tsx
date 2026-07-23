import React, { useState } from 'react';
import { Lock, Mail, ShieldAlert } from 'lucide-react';

interface AdminLoginProps {
  onLogin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [email, setEmail] = useState('admin@abc.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await onLogin(email, password);
      if (!res.success) {
        setError(res.error || 'Invalid credentials or unauthorized role.');
      }
    } catch (err) {
      setError('An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 font-sans text-white">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="h-12 w-12 bg-orange-600/10 border border-orange-500/30 text-orange-500 rounded-full flex items-center justify-center mx-auto">
            <Lock size={22} />
          </div>
          <h1 className="text-2xl font-black tracking-wider uppercase">BLACKFAWN ADMIN</h1>
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Enterprise System Access Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Administrative Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 text-slate-500" size={16} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@blackfawn.in"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-xs text-white focus:border-orange-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Password Credentials</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 text-slate-500" size={16} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-xs text-white focus:border-orange-500 outline-none"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-950/40 border border-red-900 text-red-400 p-3 rounded-lg text-[11px] font-semibold flex items-center gap-2">
              <ShieldAlert size={14} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold uppercase rounded-lg tracking-wider cursor-pointer shadow-lg transition-colors ${
              loading ? 'opacity-50' : ''
            }`}
          >
            {loading ? 'AUTHENTICATING CONTROL LOG...' : 'REQUEST SYSTEM ENTRY'}
          </button>
        </form>
      </div>
    </div>
  );
}
